import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { useState } from "react";
import { Form, InputNumber, Input, Popconfirm, Table, Typography } from 'antd';
import { useNavigate, useLocation, Link } from 'react-router-dom';

import Navbar from "../components/Navbar"
import { publicRequest, userRequest } from "../utils/requestMethods"
import "./style.css"

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

const List = () => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [type, setType] = useState('qop');
  const isEditing = (record) => record._id === editingKey;

  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split("/")[1]

  const { data } = useQuery({
    queryKey: [path, type],
    queryFn: () =>
      publicRequest.get(`/${path}?type=${type}`).then((res) => {
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

      await userRequest.put(`/${path}/${id}`, formData)

      window.location.reload();
    } catch (err) {
      alert(err)
    }
  }

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id) => {
      return userRequest.delete(`/${path}/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries([path])
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
      title: 'name',
      dataIndex: 'name',
      width: '20%',
      editable: true,
    },
    {
      title: 'soni',
      dataIndex: 'soni',
      width: '25%',
      editable: true,
    },
    {
      title: 'operations',
      dataIndex: 'operations',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => saveP(record._id)} style={{ marginRight: 8 }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <div className='flex flex-wrap gap-2'>
            <Typography.Link disabled={editingKey !== ''} className="p-1 px-2 rounded-lg border-blue-400 border-[1px] " onClick={() => edit(record)}>
              Edit
            </Typography.Link>

            <Typography.Link disabled={editingKey !== ''} className="p-1 px-2 rounded-lg border-green-400 border-[1px] text-green-500" onClick={() => navigate(`/products/${record._id}`)}>
              View
            </Typography.Link>

            <Typography.Link disabled={editingKey !== '' || mutation.isLoading} className="p-1 px-2 rounded-lg border-red-400 border-[1px] text-red-500" onClick={() => handleDelete(record._id)}>
              Delete
            </Typography.Link>
          </div>
        );
      },
    },
  ];

  const qopObject = [
    {
      title: "Hajmi",
      dataIndex: "size",
      editable: true,
      render: (_, record) => (
        <p>{record?.size} kg</p>
      )
    },
    {
      title: "Kg",
      dataIndex: "kg",
      width: "20%",
      render: (_, record) => (
        <p>{record?.size * record?.soni}</p>
      )
    }
  ]


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

  const qopColumns = productsColumns.concat(qopObject)

  const mergedQopColumns = qopColumns.map((col) => {
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
    <div className="">
      <div className="fixed bg-main-bg navbar w-full">
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
        <div className='flex items-center gap-10 text-xl font-semibold'>
          <label htmlFor="category">Kategoriyani tanlang:</label>
          <select id="category" name="category" className='border-2 border-black rounded-md py-2 px-4 capitalize' onChange={(e) => setType(e.target.value)}>
            <option value="qop">qop</option>
            <option value="litr">litr</option>
            <option value="ta">ta</option>
          </select>
          <input type="submit" />
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
              columns={type === "qop" ? mergedQopColumns : mergedProductsColumns}
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
  )
}

export default List