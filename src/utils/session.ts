// session-manager.ts
import { Prisma, type PrismaClient } from '@prisma/client';
import crypto from 'crypto'

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds

const algorithm = 'aes-256-ccm';
const secretKey = process.env.ENCRYPTION_SECRET!; // Must be 256 bits (32 characters)

export function encryptSession(text: string) {
  const iv = crypto.randomBytes(16).toString('hex'); // Generate a random IV
  console.log('iv',iv)
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  console.log('encrypted',encrypted)
  return iv + '=>' + encrypted.toString('hex');
}

export function decryptSession(token: string) {
  const [iv, encryptedText] = token.split('=>').map(part => Buffer.from(part, 'hex'));
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv!);
  const decrypted = Buffer.concat([decipher.update(encryptedText!), decipher.final()]);

  return decrypted.toString();
}

export async function createSession(ctx: PrismaClient, userId: string) {

  const userSession = await ctx.session.findFirst({
    where: {
      userId
    },
    orderBy: {
      expires: 'desc' // Sorting by expires date field in descending order
    },
    take: 1
  })

  const currentDate = new Date();
  let token = currentDate.toString();
  if (userSession && userSession.expires > currentDate) {
    token = userSession.expires.toString()
  }

  while (true) {
    try {
      const sessionToken = crypto.randomBytes(16).toString('hex') + token;
      // Attempt to create a new session with the generated token
      const session = await ctx.session.create({
        data: {
          userId,
          sessionToken,
          expires: new Date(Date.now() + SESSION_DURATION),
        },
      });

      return session;
    } catch (error) {
      console.log('error',error)
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code !== 'P2002' || error?.meta?.target !== 'sessionToken') {
          throw error;
        }
      } else {
        throw error
      }

    }
  }

}

export default async function validateSession(ctx: PrismaClient, sessionToken: string) {
  const [userId, sessionTokenStr] = sessionToken.split(':')
  

  // Check the session token against the database
  const session = await ctx.session.findUnique({
    where: {
      sessionToken: sessionTokenStr,
      userId
    },
  });

  return !session || session?.expires < new Date() 
}


