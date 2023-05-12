import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Rates({ data, symbol }) {

  const [labels, setLabels] = useState([])
  const [values, setValues] = useState([])
  const [backgroundColor, setBackgroundColor] = useState([])

  useEffect(() => {
    if (data) {
      const labels = Object.keys(data).map(key => (key))
      setLabels(labels)

      const values = Object.keys(data).map(key => (data[key][symbol]))
      setValues(values)

      const backgroundColor = Object.keys(data).map(() => ('#f67f90'))
      setBackgroundColor(backgroundColor)
    }
  }, [data])

  const dataSet = values.map((v, i) => ({ value: v, date: labels[i], symbol: symbol }))

  return (
    <ResponsiveContainer  maxWidth="120%" className="max-w-none sm:max-w-full">
      <LineChart
        data={dataSet}
        margin={{
          top: 5,
          right: 5,
          left: 30,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis
          domain={['auto', 'auto']}
        />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>

  );
  // }
}