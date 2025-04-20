/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Table, Select, Image } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";

const { Option } = Select;

const Order = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  const fetchOrder = async () => {
    try {
      const response = await axios.get(url + "/api/order/list", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching orders");
    }
  };

  const statusHandler = async (value, orderId) => {
    try {
      const response = await axios.post(
        url + "/api/order/status",
        {
          orderId,
          status: value,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchOrder();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Error updating order status");
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text, record) => (
        <Image width={50} src={`${url}/images/${record.image}`} alt="Product" />
      ),
    },
    {
      title: "Items",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <span>
          {record.name} x {record.quantity}
        </span>
      ),
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (text, record) => <span>{record.customer}</span>,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Amount",
      dataIndex: "price",
      key: "price",
      render: (text, record) => `${record.price}.000đ`,
    },
  ];

  const groupedOrders = orders.reduce((acc, order) => {
    const orderDate = moment(order.date).format("YYYY-MM-DD");
    if (!acc[orderDate]) {
      acc[orderDate] = [];
    }
    acc[orderDate].push(order);
    return acc;
  }, {});

  return (
    <div className="order add">
      <h3 className="text-2xl font-bold mb-4">Order Page</h3>

      {orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        Object.keys(groupedOrders).map((date) => (
          <div key={date} className="mb-8">
            <h3 className="text-lg font-bold mb-2">{`Orders for ${date}`}</h3>
            {groupedOrders[date].map((order, orderIndex) => (
              <div key={orderIndex} className="mb-4 rounded-lg shadow-md p-4">
                <Table
                  dataSource={order.items.map((item, itemIndex) => ({
                    key: `${orderIndex}-${itemIndex}`,
                    ...item, 
                    customer: `${order.address.firstName} ${order.address.lastName}`,
                    status: order.status,
                    phone: order.address.phone,
                    email: order.address.email,
                  }))}
                  columns={columns}
                  pagination={false}
                />
                <div className="text-right font-bold">
                  Total Amount: {order.amount}.000đ
                </div>
                <div className="text-right mt-2">
                  <Select
                    defaultValue={order.status}
                    onChange={(value) => statusHandler(value, order._id)} 
                    style={{ width: 200 }}
                  >
                    <Option value="Food Processing">Food Processing</Option>
                    <Option value="Out for delivery">Out for delivery</Option>
                    <Option value="Delivered">Delivered</Option>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default Order;
