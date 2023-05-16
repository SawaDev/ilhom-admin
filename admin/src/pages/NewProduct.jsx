import React, { useState } from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'

import Navbar from '../components/Navbar'
import { userRequest } from '../utils/requestMethods';
import { useNavigate } from 'react-router-dom';

const NewProduct = () => {
  const [info, setInfo] = useState({})
  const [type, setType] = useState("")

  const navigate = useNavigate()

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: (product) => {
      return userRequest.post("/products", product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products"])
    },
    onError: (error) => {
      alert(error?.response?.data.message)
    }
  })

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const newProduct = {
        ...info,
        type
      };
      console.log(newProduct);

      createPostMutation.mutate(newProduct);
      navigate("/products");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className='m-4 p-5 shadow-lg rounded-xl mb-10'>
        <h1 className='text-xl font-semibold'>Yangi mahsulot kiritish</h1>
      </div>
      <div className='flex flex-col sm:flex-row justify-around items-center shadow-xl m-4 py-4  rounded-xl'>
        <div className='flex flex-col'>
          <label className='text-lg font-medium'>Name</label>
          <input onChange={handleChange} id="name" className='border-b-4 p-2 border-gray-300 rounded-md text-lg mt-1 outline-none' placeholder='Name' type="text" />
        </div>
        <div className="flex flex-col">
          <label className='text-lg font-medium'>Soni</label>
          <input onChange={handleChange} id="soni" className='border-b-4 p-2 border-gray-300 rounded-md text-lg mt-1 outline-none' placeholder='Price' type="number" />
        </div>
        <div className='flex flex-col items-center'>
          <label htmlFor="category" className='text-lg font-medium'>Kategoriyani tanlang:</label>
          <select id="category" name="category" className='border-b-4 p-2 border-gray-300 rounded-md text-lg mt-1 outline-none' onChange={(e) => setType(e.target.value)}>
            <option value="none">none</option>
            <option value="qop">qop</option>
            <option value="litr">litr</option>
            <option value="ta">ta</option>
          </select>
        </div>
        {type === 'qop' &&
          <div className="flex flex-col">
            <label className='text-lg font-medium'>Hajmi</label>
            <input onChange={handleChange} id="size" className='border-b-4 p-2 border-gray-300 rounded-md text-lg mt-1 outline-none' placeholder='Hajmi' type="number" />
          </div>
        }
        <div className='px-4 py-2 bg-purple-100 h-fit font-semibold text-purple-600 rounded-xl' onClick={handleClick}>
          <button>Qo'shish</button>
        </div>
      </div>
    </div>
  )
}

export default NewProduct