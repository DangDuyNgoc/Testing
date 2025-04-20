/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal, Button, Input, Popconfirm } from "antd";

const Category = ({ url }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${url}/api/category/get-all-category`);
      setCategories(response.data.category);
    } catch (error) {
      toast.error("Error fetching categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategoryHandler = async () => {
    const formData = new FormData();
    formData.append("name", newCategory);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post(
        `${url}/api/category/add-category`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Category added successfully");
        setNewCategory("");
        setImage(null);
        setImagePreview(null);
        fetchCategories();
        setIsModalVisible(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error adding category");
    }
  };

  const deleteCategoryHandler = async (id) => {
    try {
      const response = await axios.delete(
        `${url}/api/category/delete-category/${id}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Category deleted successfully");
        fetchCategories();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error deleting category");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const editCategoryHandler = (category) => {
    setNewCategory(category.name);
    setIsEditing(true);
    setEditingId(category._id);
    setIsModalVisible(true);
    setImage(category.image);
    setImagePreview(`${url}/images/${category.image}`);
  };

  const updateCategoryHandler = async () => {
    const formData = new FormData();
    formData.append("name", newCategory);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post(
        `${url}/api/category/update-category/${editingId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Category updated successfully");
        setNewCategory("");
        setImage(null);
        setImagePreview(null);
        setIsEditing(false);
        setEditingId(null);
        fetchCategories();
        setIsModalVisible(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error updating category");
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setNewCategory("");
    setIsEditing(false);
    setImage(null);
    setImagePreview(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>

      <Button type="primary" onClick={showModal} className="mb-4">
        Add Category
      </Button>

      <Modal
        title={isEditing ? "Update Category" : "Add Category"}
        open={isModalVisible}
        onOk={isEditing ? updateCategoryHandler : addCategoryHandler}
        onCancel={handleCancel}
        okText={isEditing ? "Update" : "Add"}
      >
        <Input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Enter category name"
        />

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Category Preview"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              marginBottom: "10px",
            }}
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />
      </Modal>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Category Name</th>
            <th className="py-2 px-4 border-b">Image</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id}>
              <td className="py-2 px-4 border-b">{category.name}</td>
              <td className="py-2 px-4 border-b">
                {category.image && (
                  <img
                    src={`${url}/images/${category.image}`}
                    alt={category.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                )}
              </td>
              <td className="py-2 px-4 border-b flex space-x-4">
                <Button
                  type="default"
                  onClick={() => editCategoryHandler(category)}
                >
                  Update
                </Button>

                <Popconfirm
                  title="Are you sure to delete this category?"
                  onConfirm={() => deleteCategoryHandler(category._id)}
                  onCancel={() => toast.info("Cancel delete")}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="primary" danger>
                    Delete
                  </Button>
                </Popconfirm>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Category;
