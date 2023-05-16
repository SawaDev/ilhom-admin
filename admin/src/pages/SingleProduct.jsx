import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from "react-router-dom"
import { useQuery } from '@tanstack/react-query'

import { publicRequest, userRequest } from '../utils/requestMethods'
import Navbar from '../components/Navbar'
import Barchart from '../components/charts/Barchart'

const SingleProduct = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [totalKetdi, setTotalKetdi] = useState(0)

  const { isLoading, data: product } = useQuery({
    queryKey: ["products", id],
    queryFn: () =>
      publicRequest.get(`/products/find/${id}`).then((res) => {
        return res.data;
      }),
    onError: (err) => {
      console.log("Error: ", err)
    }
  });

  useEffect(() => {
    const date = new Date()
    //keyingi kun uchun
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);
    const nextYear = nextDate.getFullYear();
    const nextEndMonth = (nextDate.getMonth() + 1).toString().padStart(2, '0');
    const nextDay = nextDate.getDate().toString().padStart(2, '0');
    //start day uchun
    const year = date.getFullYear()
    const day = date.getDate().toString().padStart(2, '0');
    const endFullDate = `${nextYear}-${nextEndMonth}-${nextDay}`
    setEndDate(endFullDate)

    const startMonth = date.getMonth().toString().padStart(2, '0');
    const startFullDate = `${startMonth === '00' ? year - 1 : year}-${startMonth === '00' ? '12' : startMonth}-${day}`

    setStartDate(startFullDate)
  }, [])

  return (
    <>
      <div className='flex relative'>
        <div className='w-full'>
          <div className="fixed bg-main-bg navbar w-full">
            <Navbar />
          </div>
          {isLoading ? "Loading..." : (
            <>
              <div className='flex gap-10 mt-[100px] mb-10 max-w-7xl mx-auto'>
                <p className='text-xl font-medium'>Nomi: {product?.name}</p>
                <p className='text-xl font-medium'>Soni: {product?.currentSoni}</p>
                <p className='text-xl font-medium'>Jami sotilgan: {totalKetdi}</p>
              </div>

              <div className="max-w-7xl mx-auto mb-10">
                <div className="shadow-lg p-2 flex items-center">
                  <ul className="flex flex-wrap flex-row w-full justify-around gap-5">
                    <li className="flex items-center px-1 mb-1">
                      <label htmlFor="start-date" className="w-25 mr-3">Initial Date</label>
                      <input type="date" name="start-date" className="bg-gray-100 p-2 rounded" value={startDate} onChange={event => setStartDate(event.target.value)} />
                    </li>
                    <li className="flex items-center px-1 mb-1">
                      <label htmlFor="end-date" className="w-25 mr-3">Final date</label>
                      <input type="date" name="end-date" className="bg-gray-100 p-2 rounded" value={endDate} onChange={event => setEndDate(event.target.value)} />
                    </li>
                  </ul>
                </div>
              </div>

              <div className="shadow-lg h-[400px] max-w-7xl mx-auto">
                <Barchart id={id} startDate={startDate} endDate={endDate} setTotalKetdi={setTotalKetdi} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default SingleProduct