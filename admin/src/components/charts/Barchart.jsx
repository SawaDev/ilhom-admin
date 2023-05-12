import { publicRequest } from '../../utils/requestMethods';
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';

export default function Barchart({ id, startDate, endDate }) {

  const { isLoading, data } = useQuery({
    queryKey: ["sales", id, startDate, endDate],
    queryFn: () =>
      publicRequest.get(`/sales/${id}/daily?start=${startDate}&end=${endDate}`).then((res) => {
        return res.data;
      }),
    onError: (err) => {
      console.log("Error: ", err)
    }
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 5,
          right: 5,
          left: 5,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="_id" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="totalKeldi" fill="#8884d8" />
        <Bar dataKey="totalKetdi" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}