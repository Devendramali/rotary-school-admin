import { useEffect, useState } from "react";
import API from "../../api/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [previewData, setPreviewData] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [newCategory, setNewCategory] = useState("");

  const [formData, setFormData] = useState({
    category: "",
    title: "",
    date: "",
    description: "",
    fullDescription: "",
  });

  useEffect(() => {
    fetchNotifications();
    fetchCategories();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/notification-categories");
      setCategories(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setFormData({
      category: "",
      title: "",
      date: "",
      description: "",
      fullDescription: "",
    });

    setEditId(null);
    setShowModal(false);
  };

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editId) {
        await API.put(`/notifications/${editId}`, formData);
      } else {
        await API.post("/notifications", formData);
      }

      fetchNotifications();
      resetForm();
    } catch (error) {
      console.log(error);
      alert("Save failed");
    }

    setLoading(false);
  };

  const handleEdit = (item: any) => {
    setEditId(item._id);

    setFormData({
      category: item.category,
      title: item.title,
      date: item.date?.slice(0, 10),
      description: item.description,
      fullDescription: item.fullDescription,
    });

    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete notification?")) return;

    try {
      await API.delete(`/notifications/${id}`);
      fetchNotifications();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      await API.put(`/notifications/toggle/${id}`);
      fetchNotifications();
    } catch (error) {
      console.log(error);
    }
  };

  const openPreview = (item: any) => {
    setPreviewData(item);
    setShowPreview(true);
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      await API.post("/notification-categories", {
        name: newCategory,
      });

      setNewCategory("");
      fetchCategories();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await API.delete(`/notification-categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="rounded-2xl border bg-white">
            <div className="flex justify-between px-6 py-4">
              <h3 className="text-lg font-semibold">Notifications</h3>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCategoryModal(true)}
                  className="px-4 py-2 bg-brand-500 text-white rounded-lg"
                >
                  Manage Categories
                </button>

                <button
                  onClick={() => {
                    resetForm();
                    setShowModal(true);
                  }}
                  className="px-4 py-2 bg-brand-500 text-white rounded-lg"
                >
                  + Add Notification
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="w-full">
                <div className="grid grid-cols-12 border-t px-6 py-3 font-semibold">
                  <div className="col-span-2">Category</div>
                  <div className="col-span-3">Title</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-3 text-center">Action</div>
                </div>

                {notifications.map((item: any) => (
                  <div
                    key={item._id}
                    className="grid grid-cols-12 border-t px-6 py-4 items-center"
                  >
                    <div className="col-span-2">{item.category}</div>
                    <div className="col-span-3">{item.title}</div>
                    <div className="col-span-2">
                      {new Date(item.date).toLocaleDateString()}
                    </div>

                    <div className="col-span-2">
                      <button
                        onClick={() => toggleStatus(item._id)}
                        className={`px-3 py-1 rounded text-white ${
                          item.isActive ? "bg-green-600" : "bg-gray-500"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </button>
                    </div>

                    <div className="col-span-3 flex justify-center gap-4">
                      <button
                        onClick={() => openPreview(item)}
                        className="text-purple-500"
                      >
                        Preview
                      </button>

                      <button
                        className="text-blue-500"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>

                      <button
                        className="text-red-500"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-[650px] p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editId ? "Edit Notification" : "Add Notification"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select Category</option>
                {categories.map((cat: any) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
                required
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2"
              />

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Short Description"
                rows={3}
                className="w-full border rounded-lg px-3 py-2"
              />

              <textarea
                name="fullDescription"
                value={formData.fullDescription}
                onChange={handleChange}
                placeholder="Full Description"
                rows={5}
                className="w-full border rounded-lg px-3 py-2"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-brand-500 text-white rounded-lg"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[60]">
          <div className="bg-white rounded-xl w-[500px] p-6">
            <h3 className="text-lg font-semibold mb-4">Manage Categories</h3>

            <div className="flex gap-2 mb-4">
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New Category"
                className="flex-1 border rounded-lg px-3 py-2"
              />

              <button
                onClick={addCategory}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Add
              </button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-auto">
              {categories.map((cat: any) => (
                <div
                  key={cat._id}
                  className="flex justify-between items-center border rounded-lg px-3 py-2"
                >
                  <span>{cat.name}</span>

                  <button
                    onClick={() => deleteCategory(cat._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowCategoryModal(false)}
              className="mt-4 px-4 py-2 border rounded-lg w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Preview */}
      {showPreview && previewData && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[70]">
          <div className="bg-white rounded-2xl w-[700px] p-6 relative">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute right-4 top-4 text-xl"
            >
              ×
            </button>

            <div className="mb-3 text-sm text-blue-500">
              {previewData.category}
            </div>

            <h2 className="text-2xl font-bold mb-2">
              {previewData.title}
            </h2>

            <div className="text-sm text-gray-500 mb-4">
              {new Date(previewData.date).toLocaleDateString()}
            </div>

            <p className="mb-4">{previewData.description}</p>

            <div className="border-t pt-4 whitespace-pre-line">
              {previewData.fullDescription}
            </div>
          </div>
        </div>
      )}
    </>
  );
}