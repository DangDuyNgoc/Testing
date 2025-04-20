import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import api from "../../utils/axiosInstance";

const Update = ({ url }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await api.get(`${url}/api/product/get-product/${id}`);
        setName(res.data.data.name);
        setDescription(res.data.data.description);
        setPrice(res.data.data.price);
        setQuantity(res.data.data.quantity);
        setSelectedCategory(res.data.data.category);
        setImagePreview(res.data.data.imageUrl);
      } catch (error) {
        console.error("Failed to fetch food:", error);
        toast.error("Failed to fetch food details.");
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await api.get(`${url}/api/category/get-all-category`);
        setCategories(response.data.category);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchFood();
    fetchCategories();
  }, [id, url]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("quantity", quantity);
      formData.append("category", selectedCategory);
      if (image) {
        formData.append("imageUrl", image);
      }

      const { data } = await api.put(
        `${url}/api/product/update-product/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data?.success) {
        navigate("/product");
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong in update product!!");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Update Food</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Name:</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Description:</label>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Price:</label>
          <input
            type="number"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border border-gray-300 p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="border border-gray-300 p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Category:</label>
          <select
            name="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 p-2 w-full"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="image">
            Image:
            <div className="w-full h-40 border flex items-center justify-center bg-gray-100">
              {imagePreview ? (
                <img
                  alt="preview"
                  src={imagePreview}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500">No Image Selected</span>
              )}
            </div>
          </label>
          <input
            type="file"
            id="image"
            className="border border-gray-300 p-2 w-full"
            hidden
            onChange={handleImageChange}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Update Food
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Update;
