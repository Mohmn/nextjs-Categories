
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { api } from '~/utils/api';

interface CheckboxItemProps {
  id: number
  label: string;
  checked: boolean;
  onChange?: (id: number) => void;
}

const CheckboxItem: React.FC<CheckboxItemProps> = (props: CheckboxItemProps) => {
  const { mutate } = api.category.markCategoryChecked.useMutation();
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [checked, setChecked] = useState(props.checked)
  return (
    <label className="flex items-center space-x-3">
      <input
        ref={inputRef}
        type="checkbox"
        checked={checked}
        onChange={() => {
          if (!inputRef.current) return
          mutate({ categoryId: props.id, checked })
          setChecked(!checked)
          if (props.onChange) props.onChange(props.id);
        }}
        className="form-checkbox h-5 w-5 text-gray-600 accent-black"
      />
      <span className="text-gray-700 font-semibold">{props.label}</span>
    </label>
  );
};


interface CheckboxListProps {
  categories: Category[];
  onItemChange?: (id: number) => void;
}

const CheckboxList: React.FC<CheckboxListProps> = ({ categories, onItemChange }) => {
  return (
    <div className="space-y-4">
      {categories.map((item) => (
        <CheckboxItem
          key={item.id.toString() + item.checked.toString()}
          id={item.id}
          label={item.name}
          checked={item.checked}
          onChange={onItemChange}
        />
      ))}
    </div>
  );
};


interface PaginationProps {
  pages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pages, currentPage, onPageChange }) => {

  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);
  const currentNumber = useRef(currentPage);

  function seekPage(pageNumber: number) {
    onPageChange(pageNumber)
    currentNumber.current = pageNumber;
  }
  return (
    <div className="flex justify-center space-x-1 text-center items-center">
      <p 
        className='text-gray-600  text-xs font-semibold cursor-pointer'
        onClick={() => {
          // print('ci')
          if(currentNumber.current > 1)
            seekPage(currentNumber.current-1)
          else
            seekPage(1)
        }}
        > previous </p>
      {pageNumbers.map(number => (
        <button
          key={number}
          className={`px-4 py-2 ${number === currentPage ? 'text-blue-600' : 'text-gray-600'}`}
          onClick={() => seekPage(number)}
        >
          {number}
        </button>
      ))}
      <p 
        className={`${currentNumber.current > pages ? 'text-blue-600' : 'text-gray-600'}  text-xs font-semibold cursor-pointer`}
        onClick={() => seekPage(currentNumber.current+1)}
      > 
        next 
      </p>
    </div>
  );
};

interface Category {
  id: number;
  name: string;
  checked: boolean;
}



const InterestSelection: React.FC<{ categories: Category[] }> = (props) => {
  const [selectedInterests, setSelectedInterests] = useState<Category[]>(() => props.categories);
  const [currentPage, setCurrentPage] = useState(1);

  const categoriesQuery = api.category.getCategories.useQuery({ page: currentPage });
  const isInitialMount = useRef<boolean>(true);

  useEffect(() => {
    if(categoriesQuery.isLoading) return
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setSelectedInterests(categoriesQuery.data ?? [])
  }, [currentPage, categoriesQuery.data, categoriesQuery.isLoading])

  // const handleCheckboxChange = (index: number) => {
  //   // setSelectedInterests(prevInterests => {
  //   //   const newInterests = [...prevInterests];
  //   //   newInterests[index].checked = !newInterests[index].checked; // Assuming you have a 'checked' property in your category objects
  //   //   return newInterests;
  //   // });
  // };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto my-10">
      <div className='text-center mb-2 p-4'>
        <h2 className="text-2xl font-bold mb-2">Please mark your interests!</h2>
        <p className="text-sm text-gray-600">We will keep you notified.</p>
      </div>
      <h3 className="text-xl font-semibold mb-3">My saved interests!</h3>
      <CheckboxList categories={selectedInterests} />
      <Pagination pages={7} currentPage={currentPage} onPageChange={handlePageChange} />
    </div>
  );
};

// Assuming CheckboxList and Pagination components are defined elsewhere

export default InterestSelection;
