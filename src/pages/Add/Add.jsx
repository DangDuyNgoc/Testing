/* eslint-disable react/prop-types */
import "./Add.css";
import { assets } from "./../../assets/assets";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Add = ({ url }) => {
  const [image, setImage] = useState(false);
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    quantity: "",
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${url}/api/category/get-all-category`
        );
        setCategories(response.data.category);
        setData((prevData) => ({
          ...prevData,
          category: response.data.category[0]?._id || "",
        }));
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to load categories. Please try again.");
      }
    };

    fetchCategories();
  }, [url]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    console.log("onSubmitHandler triggered");

    if (
      !data.name ||
      !data.price ||
      !data.description ||
      !data.category ||
      !image ||
      !data.quantity
    ) {
      return toast.error("Please fill out all fields!");
    }

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", Number(data.price));
      formData.append("category", data.category);
      formData.append("imageUrl", image);
      formData.append("quantity", data.quantity);

      const response = await axios.post(`${url}/api/product/add-product`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setData({
          name: "",
          price: "",
          description: "",
          category: categories[0]?._id || "",
          quantity: "",
        });
        setImage(false);
        toast.success(response.data.message);
        navigate("/product");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to add product:", error);
      toast.error("An error occurred while adding the product.");
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="flex-col add-img">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            name="image"
            hidden
          />
        </div>
        <div className="add-product flex-col">
          <p>Product Name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Type here"
          />
        </div>

        <div className="add-desc flex-col">
          <p>Product Description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Write here"
          ></textarea>
        </div>

        <div className="add-cate-price">
          <div className="add-cate flex-col">
            <p>Product Category</p>
            <select
              onChange={onChangeHandler}
              name="category"
              value={data.category}
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product Price</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name="price"
              placeholder="price"
            />
          </div>
          <div className="add-price flex-col">
            <p>Product quantity</p>
            <input
              onChange={onChangeHandler}
              value={data.quantity}
              type="number"
              name="quantity"
              placeholder="quantity"
            />
          </div>
        </div>
        <button type="submit" className="add-btn">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default Add;
