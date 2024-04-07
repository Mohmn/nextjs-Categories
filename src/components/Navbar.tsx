

export default function Navbar() {
	return (
		<nav>
			<div className="flex justify-end gap-2 h-9">
				<button className="px-3 py-2 rounded-md text-xs font-sm">
					Help
				</button>
				<button className="px-3 py-2 rounded-md text-xs font-sm">
					Orders & Returns
				</button>
				<span className="px-3 py-2 rounded-md text-xs font-sm">Hi, John</span>
			</div>
			<div className="flex justify-between items-baseline mx-6">
				<div >
					<span className="text-xl font-bold">ECOMMERCE</span>
				</div>
				<div className="flex space-x-4 justify-center center">
					<a href="#" className=" px-3 py-2 rounded-md text-sm font-bold">Categories</a>
					<a href="#" className=" px-3 py-2 rounded-md text-sm font-bold">Sale</a>
					<a href="#" className=" px-3 py-2 rounded-md text-sm font-bold">Clearance</a>
					<a href="#" className=" px-3 py-2 rounded-md text-sm font-bold">New stock</a>
					<a href="#" className=" px-3 py-2 rounded-md text-sm font-bold">Trending</a>
				</div>
				<div className="flex gap-5">
					<div> srch </div>
					<div> crt </div>
				</div>
			</div>
			<div className="flex justify-center h-9 bg-gray-100 ">
				<p className="m-auto text-black text-sm font-semibold">Get 10% off on business sign up</p>
			</div>
		</nav>
	);
};