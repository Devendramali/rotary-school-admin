import { useState, useEffect } from "react";
import API from "../../api/api";

export default function Banner() {
  const [banners, setBanners] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: null,
  });

  // GET ALL BANNERS
  const fetchBanners = async () => {
    try {
      const res = await API.get("/banner");
      setBanners(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // OPEN ADD MODAL
  const openAddModal = () => {
    setEditId(null);
    setFormData({ title: "", subtitle: "", image: null });
    setShowModal(true);
  };

  // OPEN EDIT MODAL
  const openEditModal = (banner) => {
    setEditId(banner._id);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      image: null,
    });
    setShowModal(true);
  };

  // SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("subtitle", formData.subtitle);
    if (formData.image) data.append("image", formData.image);

    try {
      if (editId) {
        await API.put(`/banner/update/${editId}`, data);
      } else {
        await API.post("/banner/add", data);
      }

      setShowModal(false);
      fetchBanners();
    } catch (err) {
      console.error(err);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this banner?")) return;

    try {
      await API.delete(`/banner/delete/${id}`);
      fetchBanners();
    } catch (err) {
      console.error(err);
    }
  };

  // TOGGLE ACTIVE
  const toggleStatus = async (id) => {
    try {
      await API.put(`/banner/toggle/${id}`);
      fetchBanners();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <div className="rounded-2xl border border-gray-200 bg-white">
          {/* HEADER */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Banner Manager</h2>
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              + Add Banner
            </button>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Image</th>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Subtitle</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((item) => (
                  <tr key={item._id} className="border-b">
                    <td className="p-3">
                      <img
                        src={`${item.image}`}
                        className="w-20 h-14 object-cover rounded"
                      />
                    </td>
                    <td className="p-3">{item.title}</td>
                    <td className="p-3">{item.subtitle}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => toggleStatus(item._id)}
                        className={`px-3 py-1 rounded text-white ${
                          item.isActive ? "bg-green-600" : "bg-gray-400"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="p-3 text-center space-x-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editId ? "Edit Banner" : "Add Banner"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />

              <input
                type="text"
                name="subtitle"
                placeholder="Subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />

              <input
                type="file"
                name="image"
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}