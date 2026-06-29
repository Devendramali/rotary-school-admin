import { useState, useEffect } from "react";
import API from "../../api/api";

export default function GramPanchayatMembers() {
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    role: "Sarpanch",
    customRole: "",
    contact: "",
    image: null,
  });

  // =========================
  // FETCH MEMBERS
  // =========================
  const fetchMembers = async () => {
    try {
      const res = await API.get("/members");
      setMembers(res.data);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  useEffect(() => {
    fetchMembers();
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
  // ADD / UPDATE MEMBER
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🔒 ROLE VALIDATION (UNCHANGED)
      if (!editId) {
        if (
          (formData.role === "Sarpanch" && members.some(m => m.role === "Sarpanch")) ||
          (formData.role === "Upasarpanch" && members.some(m => m.role === "Upasarpanch"))
        ) {
          alert(`Only one ${formData.role} is allowed.`);
          setLoading(false);
          return;
        }
      } else {
        if (
          (formData.role === "Sarpanch" && members.some(m => m.role === "Sarpanch" && m._id !== editId)) ||
          (formData.role === "Upasarpanch" && members.some(m => m.role === "Upasarpanch" && m._id !== editId))
        ) {
          alert(`Only one ${formData.role} is allowed.`);
          setLoading(false);
          return;
        }
      }

      // ✅ FORM DATA (IMPORTANT)
      const data = new FormData();
      data.append("name", formData.name);
      data.append(
        "role",
        formData.role === "Custom" ? formData.customRole : formData.role
      );
      data.append("contact", formData.contact);

      if (formData.image) {
        data.append("image", formData.image);
      }

      if (editId) {
        await API.put(`/members/${editId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await API.post("/members", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      fetchMembers();
      setFormData({
        name: "",
        role: "Sarpanch",
        customRole: "",
        contact: "",
        image: null,
      });
      setEditId(null);
      setShowModal(false);

      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    } catch (err) {
      alert(err.response?.data?.message || "Error saving member");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EDIT MEMBER
  // =========================
  const handleEdit = (member) => {
    setFormData({
      name: member.name,
      role: ["Sarpanch", "Upasarpanch", "Member"].includes(member.role)
        ? member.role
        : "Custom",
      customRole: ["Sarpanch", "Upasarpanch", "Member"].includes(member.role)
        ? ""
        : member.role,
      contact: member.contact,
      image: null,
    });
    setEditId(member._id);
    setShowModal(true);
  };

  // =========================
  // DELETE MEMBER
  // =========================
  const handleDelete = async (id) => {
    if (!confirm("Delete this member?")) return;
    try {
      await API.delete(`/members/${id}`);
      fetchMembers();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // =========================
  // TOGGLE STATUS
  // =========================
  const toggleStatus = async (id) => {
    try {
      await API.put(`/members/toggle/${id}`);
      fetchMembers();
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
          <div className="rounded-2xl border border-gray-200 bg-white">
            {/* Header */}
            <div className="flex justify-between px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Gram Panchayat Members
              </h3>

              <button
                onClick={() => {
                  setShowModal(true);
                  setEditId(null);
                  setFormData({
                    name: "",
                    role: "Sarpanch",
                    customRole: "",
                    contact: "",
                    image: null,
                  });
                }}
                className="px-4 py-2 bg-brand-500 text-white rounded-lg"
              >
                + Add Member
              </button>
            </div>

            {/* Table */}
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[900px]">
                <div className="grid grid-cols-11 border-t px-6 py-3">
                  <div className="col-span-3 font-medium text-gray-500">Name</div>
                  <div className="col-span-2 font-medium text-gray-500">Role</div>
                  <div className="col-span-2 font-medium text-gray-500">Contact</div>
                  <div className="col-span-1 font-medium text-gray-500">Status</div>
                  <div className="col-span-3 font-medium text-gray-500 text-center">Action</div>
                </div>

                {members.map((member) => (
                  <div key={member._id} className="grid grid-cols-11 border-t px-6 py-4 items-center">
                    <div className="col-span-3 flex items-center gap-2">
                      {member.image && (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover border"
                        />
                      )}
                      <span>{member.name}</span>
                    </div>
                    <div className="col-span-2">{member.role}</div>
                    <div className="col-span-2">{member.contact}</div>
                    <div className="col-span-1">
                      <button
                        onClick={() => toggleStatus(member._id)}
                        className={`px-3 py-1 rounded text-white ${
                          member.isActive ? "bg-green-600" : "bg-gray-400"
                        }`}
                      >
                        {member.isActive ? "Active" : "Inactive"}
                      </button>
                    </div>
                    <div className="col-span-3 flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(member)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(member._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {members.length === 0 && (
                  <p className="text-center py-6 text-gray-400">
                    No members added yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[420px] p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              {editId ? "Edit Member" : "Add Member"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Member Name"
                required
                className="w-full border px-3 py-2 rounded-lg"
              />

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
              >
                <option>सरपंच</option>
                <option>उपसरपंच</option>
                <option>सदस्य</option>
                <option>Custom</option>
              </select>

              {formData.role === "Custom" && (
                <input
                  name="customRole"
                  value={formData.customRole}
                  onChange={handleChange}
                  placeholder="Custom Role"
                  required
                  className="w-full border px-3 py-2 rounded-lg"
                />
              )}

              <input
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Contact Number"
                className="w-full border px-3 py-2 rounded-lg"
              />

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full"
              />

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
