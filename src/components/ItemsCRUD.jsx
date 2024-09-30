import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

function ItemsCRUD() {
  const { data: session } = useSession(); // Get session info
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [isEditing, setIsEditing] = useState(false); // Track edit mode
  const [editItemId, setEditItemId] = useState(null); // Track the item being edited
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/items");
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch items:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      alert("You must be logged in to add an item");
      return;
    }
    if (isEditing) {
      await handleUpdateItem();
    } else {
      await handleAddItem();
    }
    setFormData({ title: "", description: "" });
    setIsEditing(false);
    fetchItems();
  };

  const handleAddItem = async () => {
    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, createdById: session.user.id }), // Use session user ID
      });
      if (response.ok) {
        setFormData({ title: "", description: "" });
        fetchItems();
      } else {
        console.error("Failed to add item");
      }
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const deleteItem = async (id) => {
    try {
      const response = await fetch("/api/items", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        fetchItems();
      } else {
        console.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  const handleUpdateItem = async () => {
    await fetch("/api/items", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: editItemId,
        title: formData.title,
        description: formData.description,
      }),
    });
  };
  const handleEditItem = (item) => {
    setFormData({ title: item.title, description: item.description });
    setIsEditing(true);
    setEditItemId(item.id);
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Items List</h1>

      {session ? (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <div>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="border p-2 rounded w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {isEditing ? "Update Item" : "Add Item"}
          </button>
        </form>
      ) : (
        <p className="text-red-500">
          You must be logged in to Add, Edit or Delete items.
        </p>
      )}

      <table className="w-full table-auto bg-white shadow-md rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">{item.id}</td>
                <td className="px-4 py-2">{item.title}</td>
                <td className="px-4 py-2">{item.description}</td>
                <td className="px-4 py-2">
                  {session && (
                    <>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleEditItem(item)}
                        className="bg-blue-500 text-white ml-2 px-2 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4">
                No items found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ItemsCRUD;
