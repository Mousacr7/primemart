import React, { useState } from "react";
import { doc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useGlobal } from "../../context/GolbalProvider";

const ramOptions = ["4GB", "8GB", "16GB", "32GB"];
const sizeOptions = ["S", "M", "L", "XL"];


export const Storage = () => {
  const { products } = useGlobal();

  const [editingId, setEditingId] = useState(null);
  const [addMode, setAddMode] = useState(false);

  const [formData, setFormData] = useState({});
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    description: "",
    category: "",
    subcategory: "",
    color: "",
    ram: "",
    size: "",
    image: [],
  });

  // Add product
  const addProduct = async () => {
    const newId = (products.length + 1).toString(); // simple incremental ID

    // Preview images only (skip real upload for demo)
    const imageUrls = Array.from(newProduct.image).map((file) =>
      URL.createObjectURL(file)
    );

    const ref = doc(db, "products", newId);
    await setDoc(ref, { ...newProduct, image: imageUrls, id: newId });

    setAddMode(false);
    setNewProduct({
      name: "",
      price: 0,
      description: "",
      category: "",
      subcategory: "",
      color: "",
      ram: "",
      size: "",
      image: [],
    });
  };

  // Update product
  const updateProduct = async (id) => {
    const imageUrls = formData.newImages
      ? [
          ...(formData.image || []),
          ...Array.from(formData.newImages).map((file) =>
            URL.createObjectURL(file)
          ),
        ]
      : formData.image || [];

    const ref = doc(db, "products", id);
    await updateDoc(ref, { ...formData, image: imageUrls });

    setEditingId(null);
  };

  // Delete product
  const deleteProduct = async (id) => {
    const ref = doc(db, "products", id);
    await deleteDoc(ref);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">📦 Product Storage</h1>
        <button
          onClick={() => setAddMode(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
        >
          + Add Product
        </button>
      </div>

      {/* Add Product Form */}
      {addMode && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Add New Product</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              className="border p-2 rounded-lg"
            />
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
              className="border p-2 rounded-lg"
            />
            <textarea
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
              className="border p-2 rounded-lg col-span-2"
            />

            {/* Category */}
            <select
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
              className="border p-2 rounded-lg"
            >
              <option value="">Select Category</option>
              <option value="Tech">Tech</option>
              <option value="Fashion">Fashion</option>
            </select>

            {/* Subcategory */}
            <input
              type="text"
              placeholder="Subcategory"
              value={newProduct.subcategory}
              onChange={(e) =>
                setNewProduct({ ...newProduct, subcategory: e.target.value })
              }
              className="border p-2 rounded-lg"
            />

            {/* Conditional Fields */}
            {newProduct.category === "Tech" && (
              <select
                value={newProduct.ram}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, ram: e.target.value })
                }
                className="border p-2 rounded-lg"
              >
                <option value="">Select RAM</option>
                {ramOptions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            )}

            {newProduct.category === "Fashion" && (
              <select
                value={newProduct.size}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, size: e.target.value })
                }
                className="border p-2 rounded-lg"
              >
                <option value="">Select Size</option>
                {sizeOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            )}

            {/* Color */}
            <input
              type="text"
              placeholder="Color (e.g. red, blue)"
              value={newProduct.color}
              onChange={(e) =>
                setNewProduct({ ...newProduct, color: e.target.value })
              }
              className="border p-2 rounded-lg"
            />

            {/* Image */}
            <input
              type="file"
              multiple
              onChange={(e) =>
                setNewProduct({ ...newProduct, image: [...e.target.files] })
              }
              className="col-span-2"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setAddMode(false)}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={addProduct}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              Save Product
            </button>
          </div>
        </div>
      )}

      {/* Product List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Category</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <React.Fragment key={p.id}>
                <tr className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    {p.image?.[0] ? (
                      <img
                        src={p.image[0]}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                        📷
                      </div>
                    )}
                  </td>
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">${p.price}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3 flex justify-end gap-2">
                    <button
                      className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
                      onClick={() => {
                        setEditingId(editingId === p.id ? null : p.id);
                        setFormData(p);
                      }}
                    >
                      {editingId === p.id ? "Close" : "Edit"}
                    </button>
                    <button
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                      onClick={() => deleteProduct(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>

                {/* Inline Edit */}
                {editingId === p.id && (
                  <tr className="bg-gray-50">
                    <td colSpan={5} className="p-4">
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={formData.name || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="border p-2 rounded-lg w-full"
                        />
                        <input
                          type="number"
                          value={formData.price || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                          }
                          className="border p-2 rounded-lg w-full"
                        />
                        <textarea
                          value={formData.description || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          className="border p-2 rounded-lg w-full"
                        />

                        {/* Category-specific fields */}
                        {formData.category === "Tech" && (
                          <select
                            value={formData.ram || ""}
                            onChange={(e) =>
                              setFormData({ ...formData, ram: e.target.value })
                            }
                            className="border p-2 rounded-lg"
                          >
                            <option value="">Select RAM</option>
                            {ramOptions.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        )}

                        {formData.category === "Fashion" && (
                          <select
                            value={formData.size || ""}
                            onChange={(e) =>
                              setFormData({ ...formData, size: e.target.value })
                            }
                            className="border p-2 rounded-lg"
                          >
                            <option value="">Select Size</option>
                            {sizeOptions.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        )}

                        {/* Color */}
                        <input
                          type="text"
                          value={formData.color || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, color: e.target.value })
                          }
                          className="border p-2 rounded-lg w-full"
                          placeholder="Color"
                        />

                        {/* Image */}
                        <input
                          type="file"
                          multiple
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              newImages: [...e.target.files],
                            })
                          }
                        />

                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => updateProduct(formData.id)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
