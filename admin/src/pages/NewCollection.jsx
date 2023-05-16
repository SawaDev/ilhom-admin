import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'
import { publicRequest, userRequest } from '../utils/requestMethods';
import { Table, InputNumber } from 'antd';

const NewCollection = () => {
  const [newQuantities, setNewQuantities] = useState({});

  const queryClient = useQueryClient()
  const createSaleMutation = useMutation({
    mutationFn: (data) => {
      return userRequest.post("/sales/newCollection", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["sales"])
    },
    onError: (error) => {
      alert(error?.response?.data.message)
    }
  })

  const navigate = useNavigate();

  const [productsQuery] = useQueries({
    queries: [
      {
        queryKey: ['products'],
        queryFn: () =>
          publicRequest.get(`/products`).then((res) => res.data),
      },
    ],
  });

  if (productsQuery.isLoading) return 'Loading Products...';

  if (productsQuery.error)
    return 'An error has occurred: ' + productsQuery.error.message;

  const handleQuantityChange = (productId, value) => {
    setNewQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: value
    }));
  };

  const handleSave = async () => {
    try {
      const productsToAdd = Object.entries(newQuantities).map(
        ([productId, ketdi]) => ({
          productId,
          ketdi,
        })
      );

      const filteredProducts = productsToAdd.filter((p) => p.ketdi !== null);

      const sale = {
        products: filteredProducts,
        isSale: false
      };

      if (sale?.products.length == 0) {
        alert("Mahsulot sonini kiriting!");
      } else {
        const productWithNullKetdi = sale?.products.find(
          (product) => product.ketdi === null
        );
        if (productWithNullKetdi) {
          alert("Enter the number of products");
        }
      }

      await createSaleMutation.mutateAsync(sale)

      navigate("/clients");
    } catch (err) {
      alert(err);
    }
  };

  const columns = [
    {
      title: 'Nomi',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Mahsulot Soni',
      dataIndex: 'currentSoni',
      key: 'currentSoni'
    },
    {
      title: 'Soni',
      dataIndex: 'ketdi',
      key: 'ketdi',
      render: (text, record) => (
        <InputNumber
          className='w-1/2'
          min={0}
          type="number"
          defaultValue={text}
          onChange={value => handleQuantityChange(record._id, value)}
        />
      )
    },
  ];

  return (
    <div className='relative w-full'>
      <div className="fixed bg-main-bg navbar w-full">
        <Navbar />
      </div>
      <div className='max-w-7xl mx-auto pt-[100px] flex flex-col'>
        <div className='mt-8 px-5 bg-white'>
          <span className='text-xl font-medium p-2'>Yangi Mahsulotlarni kiriting</span>
          <Table
            columns={columns}
            dataSource={productsQuery.data}
            bordered
            pagination={false}
          />
        </div>
        <div className='w-full flex justify-end pr-5 pt-5'>
          <button className='bg-purple-100 text-purple-600 py-4 px-6 mb-10 rounded-xl duration-100 ease-in hover:scale-110' onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  )
}

export default NewCollection