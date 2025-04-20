import { useState } from "react";

const SearchProduct = ({ onSearch }) => {
    const [query, setQuery] = useState({
      name: "",
      category: "",
      minPrice: "",
      maxPrice: "",
    });
  
    const handleChange = (e) => {
      setQuery({ ...query, [e.target.name]: e.target.value });
    };
  
    const handleSearch = () => {
      if (!query.name && !query.category && !query.minPrice && !query.maxPrice) {
        onSearch({});
      } else {
        onSearch(query);
      }
    };
  
    return (
      <div className="p-6">
        <div className="mb-6 flex gap-4">
          <input
            type="text"
            name="name"
            placeholder="Search by name"
            value={query.name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={query.minPrice}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={query.maxPrice}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Search
          </button>
        </div>
      </div>
    );
  };
  
  export default SearchProduct;
  