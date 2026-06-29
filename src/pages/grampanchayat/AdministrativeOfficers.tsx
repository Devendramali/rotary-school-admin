import { useState, useEffect } from "react";
import API from "../../api/api";
import axios from "axios";

export default function AdministrativeOfficers() {
  const [officers, setOfficers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    post: "",
    contact: "",
    image: null,
  });

  // =========================
  // FETCH OFFICERS
  // =========================
  const fetchOfficers = async () => {
    try {
      const res = await API.get("/officers");
      setOfficers(res.data);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  useEffect(() => {
    fetchOfficers();
  }, []);

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // =========================
  // 🔥 AWS IMAGE UPLOAD
  // =========================

  // =========================
  // ADD / UPDATE OFFICER
  // =========================
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("post", formData.post);
    data.append("contact", formData.contact);

    if (formData.image) {
      data.append("image", formData.image);
    }

    if (editId) {
      await API.put(`/officers/${editId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      await API.post("/officers", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    fetchOfficers();
    setFormData({ name: "", post: "", contact: "", image: null });
    setEditId(null);
    setShowModal(false);

    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  } catch (err) {
    alert(err.response?.data?.message || "Error saving officer");
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  // =========================
  // EDIT OFFICER
  // =========================
  const handleEdit = (officer) => {
    setFormData({
      name: officer.name,
      post: officer.post,
      contact: officer.contact,
      image: null,
    });
    setEditId(officer._id);
    setShowModal(true);
  };

  // =========================
  // DELETE OFFICER
  // =========================
  const handleDelete = async (id) => {
    if (!confirm("Delete this officer?")) return;
    try {
      await API.delete(`/officers/${id}`);
      fetchOfficers();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // =========================
  // TOGGLE STATUS
  // =========================
  const toggleStatus = async (id) => {
    try {
      await API.put(`/officers/toggle/${id}`);
      fetchOfficers();
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="rounded-2xl border bg-white">
            <div className="flex justify-between px-6 py-4">
              <h3 className="text-lg font-semibold">Administrative Officers</h3>
              <button
                onClick={() => {
                  setShowModal(true);
                  setEditId(null);
                  setFormData({
                    name: "",
                    post: "",
                    contact: "",
                    image: null,
                  });
                }}
                className="px-4 py-2 bg-brand-500 text-white rounded-lg"
              >
                + Add Officer
              </button>
            </div>

            <div className="min-w-[900px]">
              {officers.map((item) => (
                <div
                  key={item._id}
                  className="grid grid-cols-11 border-t px-6 py-4 items-center"
                >
                  <div className="col-span-3 flex items-center gap-2">
                    {item.image && (
                      <img
                        src={item.image}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <span>{item.name}</span>
                  </div>
                  <div className="col-span-2">{item.post}</div>
                  <div className="col-span-2">{item.contact}</div>
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
                  <div className="col-span-3 flex justify-center gap-3">
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
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[420px]">
            <h3 className="text-lg font-semibold mb-4">
              {editId ? "Edit Officer" : "Add Officer"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required className="w-full border px-3 py-2 rounded" />
              <input name="post" value={formData.post} onChange={handleChange} placeholder="Post" required className="w-full border px-3 py-2 rounded" />
              <input name="contact" value={formData.contact} onChange={handleChange} placeholder="Contact" className="w-full border px-3 py-2 rounded" />
              <input type="file" name="image" onChange={handleChange} />

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" disabled={loading} className="bg-brand-500 text-white px-4 py-2 rounded">
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
