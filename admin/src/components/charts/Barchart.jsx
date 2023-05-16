import { publicRequest } from '../../utils/requestMethods';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';

export default function Barchart({ id, startDate, endDate, setTotalKetdi }) {

  const { isLoading, data } = useQuery({
    queryKey: ["sales", id, startDate, endDate],
    queryFn: () =>
      publicRequest.get(`/sales/${id}/daily?start=${startDate}&end=${endDate}`).then((res) => {
        setTotalKetdi(res?.data[0].totalKetdi)
        return res.data;
      }),
    onError: (err) => {
      console.log("Error: ", err)
    }
  });

  if (isLoading) return <>Loading...</>
  if(!data) return <>Sotuv mavjud emas</>

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={400}
        data={data[0].sales.sort((a, b) => (a._id > b._id) ? 1 : -1)}
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
        {/* <Bar dataKey="keldi" fill="#8884d8" /> */}
        <Bar dataKey="ketdi" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}