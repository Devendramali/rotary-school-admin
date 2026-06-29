import { useState, useEffect } from "react";
import API from "../../api/api";

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    academicYear: "",
    category: "",
    file: null,
  });

  const fetchActivities = async () => {
    try {
      const res = await API.get("/activities");
      setActivities(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/activity-categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchActivities();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("academicYear", formData.academicYear);
      data.append("category", formData.category);

      if (formData.file) data.append("file", formData.file);

      if (editId) {
        await API.put(`/activities/${editId}`, data);
      } else {
        await API.post("/activities", data);
      }

      setShowModal(false);
      setEditId(null);

      setFormData({
        title: "",
        academicYear: "",
        category: "",
        file: null,
      });

      fetchActivities();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }

    setLoading(false);
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      academicYear: item.academicYear,
      category: item.category,
      file: null,
    });

    setEditId(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this activity?")) return;
    await API.delete(`/activities/${id}`);
    fetchActivities();
  };

  const toggleStatus = async (id) => {
    try {
      await API.put(`/activities/toggle/${id}`);
      fetchActivities();
    } catch (err) {
      console.error(err);
    }
  };

  const addCategory = async () => {
    if (!categoryName) return;

    try {
      await API.post("/activity-categories", {
        name: categoryName,
      });

      setCategoryName("");
      setShowCategoryModal(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm("Delete category?")) return;

    await API.delete(`/activity-categories/${id}`);
    fetchCategories();
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="rounded-2xl border bg-white">

            <div className="flex justify-between px-6 py-4">
              <h3 className="text-lg font-semibold">Activities</h3>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCategoryModal(true)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Manage Category
                </button>

                <button
                  onClick={() => {
                    setShowModal(true);
                    setEditId(null);
                    setFormData({
                      title: "",
                      academicYear: "",
                      category: "",
                      file: null,
                    });
                  }}
                  className="px-4 py-2 bg-brand-500 text-white rounded-lg"
                >
                  + Add Activity
                </button>
              </div>
            </div>

            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[900px]">

                <div className="grid grid-cols-12 border-t px-6 py-3">
                  <div className="col-span-2 font-medium text-gray-500">Preview</div>
                  <div className="col-span-2 font-medium text-gray-500">Title</div>
                  <div className="col-span-2 font-medium text-gray-500">Category</div>
                  <div className="col-span-2 font-medium text-gray-500">Academic Year</div>
                  <div className="col-span-1 font-medium text-gray-500">Status</div>
                  <div className="col-span-2 text-center font-medium text-gray-500">Action</div>
                </div>

                {activities.map((item) => (
                  <div key={item._id} className="grid grid-cols-12 border-t px-6 py-4 items-center">

                    <div className="col-span-2">
                      {item.file && (
                        <img
                          src={item.file}
                          className="w-16 h-16 rounded object-cover border"
                        />
                      )}
                    </div>

                    <div className="col-span-2">{item.title}</div>
                    <div className="col-span-2">{item.category}</div>
                    <div className="col-span-2">{item.academicYear}</div>

                    <div className="col-span-1">
                      <button
                        onClick={() => toggleStatus(item._id)}
                        className={`px-3 py-1 rounded text-white ${
                          item.isActive ? "bg-green-600" : "bg-gray-400"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </button>
                    </div>

                    <div className="col-span-2 flex justify-center gap-4">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-500"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {activities.length === 0 && (
                  <p className="text-center py-6 text-gray-400">
                    No activities added
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[420px] p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              {editId ? "Edit Activity" : "Add Activity"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Activity Title"
                required
                className="w-full border px-3 py-2 rounded-lg"
              />

              <input
                type="file"
                name="file"
                accept="image/*"
                onChange={handleChange}
                className="w-full"
              />

              <input
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                placeholder="Academic Year"
                className="w-full border px-3 py-2 rounded-lg"
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditId(null);
                  }}
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

      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[420px] p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Manage Categories</h3>

            <div className="flex gap-2 mb-4">
              <input
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Category Name"
                className="w-full border px-3 py-2 rounded-lg"
              />
              <button
                onClick={addCategory}
                className="px-4 py-2 bg-brand-500 text-white rounded-lg"
              >
                Add
              </button>
            </div>

            <div className="space-y-2 max-h-[250px] overflow-auto">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="flex justify-between border rounded-lg px-3 py-2"
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
    </>
  );
}