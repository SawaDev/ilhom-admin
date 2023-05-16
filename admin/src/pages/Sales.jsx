import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Table } from 'antd'
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { publicRequest, userRequest } from '../utils/requestMethods'

const Sales = () => {
  const location = useLocation()
  const path = location.pathname.split('/')[1]

  const [date, setDate] = useState("null")

  const { data, isLoading } = useQuery({
    queryKey: [path, date],
    queryFn: () =>
      publicRequest.get(`/${path}?date=${date}`).then((res) => {
        return res.data;
      }),
    onError: (err) => {
      alert("Sotuvlarni yuklashda xato yuz berdi!");
      console.log(err?.response);
    }
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id) => {
      return userRequest.delete(`/sales/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['sales'])
      alert("Muvaffaqiyatli o'chirildi!")
    },
    onError: (err) => {
      alert(err?.response);
      console.log(err?.response);
    }
  })

  const handleDelete = (id) => {
    mutation.mutate(id)
  }
  const productColumns = [
    {
      title: 'Nomi',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: 'Soni',
      dataIndex: 'ketdi',
      key: 'ketdi',
      width: 100,
      render: (_, record) => (
        <p>{record?.ketdi} {record?.type}</p>
      )
    }
  ]

  return (
    <div>
      <div className="fixed bg-main-bg navbar w-full">
        <Navbar />
      </div>
      <div className="pt-[100px] px-4">
        <div className='pb-3 flex justify-between'>
          <p className='font-semibold text-2xl capitalize'>
            {path}
          </p>
          <Link to="/newsale">
          <div className='py-2 px-4 border-2 border-blue-500 text-blue-500 rounded-2xl'>Yangi</div>
          </Link>
        </div>
        <div>
          <label className='mr-6'>Boshlang'ich kunni tanlang: </label>
          <input type="date" name="date" className="bg-gray-100 p-2 rounded" onChange={event => setDate(event.target.value)} />
        </div>

        {isLoading
          ? "Loading..."
          : (
            <>
              {
                data?.length === 0 ? (
                  <div className='text-3xl font-bold'>{date} dan bugunga qadar xaridlar mavjud emas</div>
                ) : data.map((sale) => (
                  <div key={sale.createdAtDate}>
                    <h1 className='mt-10'>{sale.createdAtDate}</h1>
                    <>
                      <Table
                        dataSource={sale.sales}
                        pagination={false}
                        columns={productColumns}
                      />
                    </>
                  </div>
                ))
              }
            </>
          )
        }

      </div>
    </div>
  )
}

export default Sales