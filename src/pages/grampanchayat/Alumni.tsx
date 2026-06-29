import { useEffect, useState } from "react";
import API from "../../api/api";

export default function Alumni() {
  const [alumni, setAlumni] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    batch: "",
    profession: "",
    company: "",
    color: "#2563eb",
    avatar: null,
  });

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const res = await API.get("/alumni");
      setAlumni(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      batch: "",
      profession: "",
      company: "",
      color: "#2563eb",
      avatar: null,
    });
    setEditId(null);
    setShowModal(false);
  };

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;

    if (name === "avatar") {
      setFormData({
        ...formData,
        avatar: files[0],
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
      data.append("name", formData.name);
      data.append("batch", formData.batch);
      data.append("profession", formData.profession);
      data.append("company", formData.company);
      data.append("color", formData.color);

      if (formData.avatar) {
        data.append("avatar", formData.avatar);
      }

      if (editId) {
        await API.put(`/alumni/${editId}`, data);
      } else {
        await API.post("/alumni", data);
      }

      fetchAlumni();
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
      name: item.name,
      batch: item.batch,
      profession: item.profession,
      company: item.company,
      color: item.color,
      avatar: null,
    });

    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete alumni?")) return;

    try {
      await API.delete(`/alumni/${id}`);
      fetchAlumni();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      await API.put(`/alumni/toggle/${id}`);
      fetchAlumni();
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
              <h3 className="text-lg font-semibold">Alumni</h3>

              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="px-4 py-2 bg-brand-500 text-white rounded-lg"
              >
                + Add Alumni
              </button>
            </div>

            <div className="max-w-full overflow-x-auto">
              <div className="w-full">
                <div className="grid grid-cols-12 border-t px-6 py-3">
                  <div className="col-span-2">Avatar</div>
                  <div className="col-span-2">Name</div>
                  <div className="col-span-2">Batch</div>
                  <div className="col-span-2">Profession</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2 text-center">Action</div>
                </div>

                {alumni.map((item: any) => (
                  <div
                    key={item._id}
                    className="grid grid-cols-12 border-t px-6 py-4 items-center"
                  >
                    <div className="col-span-2">
                      {item.avatar ? (
                        <img
                          src={item.avatar}
                          alt=""
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: item.color }}
                        >
                          {item.name?.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="col-span-2">{item.name}</div>
                    <div className="col-span-2">{item.batch}</div>
                    <div className="col-span-2">{item.profession}</div>

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

                {alumni.length === 0 && (
                  <div className="py-6 text-center text-gray-400">
                    No alumni found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[500px] p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              {editId ? "Edit Alumni" : "Add Alumni"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
                className="w-full border px-3 py-2 rounded-lg"
              />

              <input
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                placeholder="Batch Year"
                required
                className="w-full border px-3 py-2 rounded-lg"
              />

              <input
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                placeholder="Profession"
                required
                className="w-full border px-3 py-2 rounded-lg"
              />

              <input
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company"
                className="w-full border px-3 py-2 rounded-lg"
              />

              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full h-12"
              />

              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleChange}
                className="w-full"
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