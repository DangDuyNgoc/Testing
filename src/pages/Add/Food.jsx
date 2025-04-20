import { useEffect, useState } from "react";
import { Table, Button, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SearchProduct from "../../components/Search/Search";

const { confirm } = Modal;

const Product = ({ url }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      console.log("API URL:", `${url}/api/product/all-products`);
      const response = await axios.get(`${url}/api/product/all-products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        toast.error("Failed to fetch product data");
      }
    } catch (error) {
      toast.error("Error while fetching product data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    confirm({
      title: "Are you sure delete this product?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      onOk: async () => {
        try {
          const response = await axios.delete(
            `${url}/api/product/delete-product/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.success) {
            toast.success("Product deleted successfully");
            fetchProducts();
          } else {
            toast.error("Failed to delete product");
          }
        } catch (error) {
          toast.error("Error while deleting product");
        }
      },
      onCancel() {
        console.log("Cancel delete action");
      },
    });
  };

  const handleSearch = async (query) => {
    setLoading(true);
    try {
      const response = await axios.post(`${url}/api/product/search-products`, {
        query,
      });

      if (response.data.success) {
        setProducts(response.data.data);
        console.log(response.data.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      toast.error("Search error");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl) => (
        <img src={imageUrl} alt="product" className="w-16 h-16 object-cover" />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex space-x-4">
          <Button
            type="primary"
            onClick={() => navigate(`/update/${record._id}`)}
            className="bg-blue-500"
          >
            Update
          </Button>

          <Button
            type="danger"
            onClick={() => handleDelete(record._id)}
            className="bg-red-500"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <SearchProduct onSearch={handleSearch} />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product List</h1>
        <Button
          type="primary"
          className="bg-green-500"
          onClick={() => navigate("/add-product")}
        >
          Add Product
        </Button>
      </div>

      <Table
        dataSource={products}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        className="bg-white shadow rounded-lg"
      />
    </div>
  );
};

export default Product;
