import React, { useContext, useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import MenuContext from "../context/MenuContext";
import BookingContext from "../context/BookingContext";

function MenuPopup({ onClose }) {
  const { menuItems, loading } = useContext(MenuContext);
  const { selectedItems, toggleSelectItem } = useContext(BookingContext);

  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  // Extract unique categories from menu items
  useEffect(() => {
    if (menuItems.length > 0) {
      const uniqueCategories = [
        ...new Set(menuItems.map((item) => item.category)),
      ];
      setCategories(uniqueCategories);
    }
  }, [menuItems]);

  const filteredItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-20 z-50">
      <div className="bg-white rounded-xl shadow-xl w-11/12 max-w-3xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
          Select Items
        </h2>

        {/* Category filter buttons */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          <button
            onClick={() => setActiveCategory("All")}
            className={`px-3 py-1 rounded-lg ${
              activeCategory === "All"
                ? "bg-orange-500 text-white"
                : "bg-gray-200"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-lg ${
                activeCategory === cat
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu items */}
        {loading ? (
          <p className="text-center text-gray-500">Loading menu items...</p>
        ) : (
          <ul className="max-h-80 overflow-y-auto space-y-2 border rounded-lg p-2">
            {filteredItems.map((item) => {
              const selected = selectedItems.find((i) => i._id === item._id);
              return (
                <li
                  key={item._id}
                  onClick={() => toggleSelectItem(item)}
                  className={`flex justify-between items-center px-3 py-2 rounded cursor-pointer hover:bg-orange-50 transition ${
                    selected ? "bg-orange-100 border border-orange-400" : ""
                  }`}
                >
                  <span>{item.name}</span>
                  {selected && (
                    <span className="text-orange-500 font-bold">✓</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MenuPopup;
