import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { Form, InputNumber, Input, Popconfirm, Table, Typography } from 'antd';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useState } from "react";

import Navbar from '../components/Navbar'

import { publicRequest, userRequest } from "../utils/requestMethods"

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const Home = () => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record) => record._id === editingKey;

  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () =>
      publicRequest.get(`/products`).then((res) => {
        return res.data;
      }),
  });

  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      soni: '',
      price: '',
      ...record,
    });
    setEditingKey(record._id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const saveP = async (id) => {
    try {
      const formData = await form.validateFields();

      await userRequest.put(`/products/${id}`, formData)

      window.location.reload();
    } catch (err) {
      alert(err)
    }
  }

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id) => {
      return userRequest.delete(`/products/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries([products])
    },
    onError: (err) => {
      alert(err?.response);
      console.log(err?.response);
    }
  })

  const handleDelete = (id) => {
    mutation.mutate(id)
  }

  const productsColumns = [
    {
      title: 'nomi',
      dataIndex: 'name',
      width: '20%',
      editable: true,
    },
    {
      title: 'soni',
      dataIndex: 'currentSoni',
      width: '25%',
      editable: true,
      render: (_, record) => (
        <p>{record.currentSoni} {record.type}</p>
      )
    },
    {
      title: '',
      dataIndex: 'operations',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => saveP(record._id)} style={{ marginRight: 8 }}>
              Saqlash
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Bekor qilish</a>
            </Popconfirm>
          </span>
        ) : (
          <div className='flex flex-wrap gap-2'>
            <Typography.Link disabled={editingKey !== ''} className="p-1 px-2 rounded-lg border-blue-400 border-[1px] " onClick={() => edit(record)}>
              Tahrirlash
            </Typography.Link>

            <Typography.Link disabled={editingKey !== ''} className="p-1 px-2 rounded-lg border-green-400 border-[1px] text-green-500" onClick={() => navigate(`/products/${record._id}`)}>
              Ko'proq
            </Typography.Link>

            <Typography.Link disabled={editingKey !== '' || mutation.isLoading} className="p-1 px-2 rounded-lg border-red-400 border-[1px] text-red-500" onClick={() => handleDelete(record._id)}>
              O'chirish
            </Typography.Link>
          </div>
        );
      },
    },
  ];

  const mergedProductsColumns = productsColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      {
        isLoading ? "Loading.." : (
          <div className="flex relative">
            <div className="bg-main-bg min-h-screen w-full">
              <div className="fixed z-1 bg-main-bg navbar w-full">
                <Navbar />
              </div>
              <div className="pt-[100px] px-4">
                <div className='pb-3 flex justify-between'>
                  <p className='font-semibold text-2xl capitalize'>
                    Mahsulotlar
                  </p>
                  <Link to="/products/new">
                    <div className='py-2 px-4 border-2 border-blue-500 text-blue-500 rounded-2xl'>Yangi</div>
                  </Link>
                </div>
                <div className="">
                  <Form form={form} component={false}>
                    <Table
                      components={{
                        body: {
                          cell: EditableCell,
                        },
                      }}
                      bordered
                      dataSource={data}
                      columns={mergedProductsColumns}
                      rowClassName="editable-row"
                      pagination={false}
                      scroll={{
                        x: 400
                      }}
                    />
                  </Form>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </>
  )
}

export default Home