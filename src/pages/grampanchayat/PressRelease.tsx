import { useEffect, useState } from "react";
import API from "../../api/api";

export default function PressRelease() {
  const [pressReleases, setPressReleases] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    category: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    fetchPressReleases();
  }, []);

  const fetchPressReleases = async () => {
    try {
      const res = await API.get("/press-release");
      setPressReleases(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      date: "",
      category: "",
      description: "",
      image: null,
    });
    setEditId(null);
    setShowModal(false);
  };

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData({
        ...formData,
        image: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("date", formData.date);
      data.append("category", formData.category);
      data.append("description", formData.description);

      if (formData.image) {
        data.append("image", formData.image);
      }

      if (editId) {
        await API.put(`/press-release/${editId}`, data);
      } else {
        await API.post("/press-release", data);
      }

      fetchPressReleases();
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
      title: item.title,
      date: item.date?.slice(0, 10),
      category: item.category,
      description: item.description,
      image: null,
    });

    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete press release?")) return;

    try {
      await API.delete(`/press-release/${id}`);
      fetchPressReleases();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      await API.put(`/press-release/toggle/${id}`);
      fetchPressReleases();
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
              <h3 className="text-lg font-semibold">Press Release</h3>

              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="px-4 py-2 bg-brand-500 text-white rounded-lg"
              >
                + Add Press Release
              </button>
            </div>

            <div className="overflow-x-auto">
              <div className="w-full">
                <div className="grid grid-cols-12 border-t px-6 py-3 font-semibold">
                  <div className="col-span-2">Image</div>
                  <div className="col-span-2">Title</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2 text-center">Action</div>
                </div>

                {pressReleases.map((item: any) => (
                  <div
                    key={item._id}
                    className="grid grid-cols-12 border-t px-6 py-4 items-center"
                  >
                    <div className="col-span-2">
                      {item.image && (
                        <img
                          src={item.image}
                          alt=""
                          className="w-20 h-14 object-cover rounded"
                        />
                      )}
                    </div>

                    <div className="col-span-2">{item.title}</div>
                    <div className="col-span-2">
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                    <div className="col-span-2">{item.category}</div>

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

                    <div className="col-span-2 flex justify-center gap-4">
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

                {pressReleases.length === 0 && (
                  <div className="text-center py-6 text-gray-400">
                    No press releases found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-[650px] rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editId ? "Edit Press Release" : "Add Press Release"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
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

              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Category"
                required
                className="w-full border rounded-lg px-3 py-2"
              />

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                rows={5}
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
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
    </>
  );
}