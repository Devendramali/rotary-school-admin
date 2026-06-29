import { useEffect, useState } from "react";
import API from "../../api/api";

export default function Faculty() {
  const [facultyList, setFacultyList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    department: "",
    qualification: "",
    bio: "",
    image: null as File | null,
  });

  const fetchFaculty = async () => {
    try {
      const res = await API.get("/faculty");
      setFacultyList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === "image" && files) {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const openModal = () => {
    setEditId(null);
    setFormData({
      name: "",
      designation: "",
      department: "",
      qualification: "",
      bio: "",
      image: null,
    });
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    setEditId(item._id);
    setFormData({
      name: item.name,
      designation: item.designation,
      department: item.department,
      qualification: item.qualification,
      bio: item.bio,
      image: null,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("designation", formData.designation);
      data.append("department", formData.department);
      data.append("qualification", formData.qualification);
      data.append("bio", formData.bio);

      if (formData.image) {
        data.append("image", formData.image);
      }

      if (editId) {
        await API.put(`/faculty/${editId}`, data);
      } else {
        await API.post("/faculty", data);
      }

      fetchFaculty();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete faculty?")) return;

    try {
      await API.delete(`/faculty/${id}`);
      fetchFaculty();
    } catch {
      alert("Delete failed");
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      await API.put(`/faculty/toggle/${id}`);
      fetchFaculty();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="rounded-2xl border bg-white">

            {/* Header */}
            <div className="flex justify-between px-6 py-4">
              <h3 className="text-lg font-semibold">Faculty Management</h3>

              <button
                onClick={openModal}
                className="px-4 py-2 bg-brand-500 text-white rounded-lg"
              >
                + Add Faculty
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-t bg-gray-50 text-left">
                    <th className="p-4">Image</th>
                    <th>Name</th>
                    <th>Designation</th>
                    <th>Department</th>
                    <th>Qualification</th>
                    <th>Status</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {facultyList.map((item: any) => (
                    <tr key={item._id} className="border-t">
                      <td className="p-4">
                        {item.image && (
                          <img
                            src={item.image}
                            alt=""
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                      </td>

                      <td>{item.name}</td>
                      <td>{item.designation}</td>
                      <td>{item.department}</td>
                      <td>{item.qualification}</td>

                      <td>
                        <button
                          onClick={() => toggleStatus(item._id)}
                          className={`px-3 py-1 rounded text-white ${
                            item.isActive ? "bg-green-600" : "bg-gray-400"
                          }`}
                        >
                          {item.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>

                      <td>
                        <div className="flex justify-center gap-4">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {facultyList.length === 0 && (
                <p className="text-center py-6 text-gray-400">
                  No faculty added
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[600px] p-6 shadow-xl max-h-[90vh] overflow-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editId ? "Edit Faculty" : "Add Faculty"}
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
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="Designation"
                required
                className="w-full border px-3 py-2 rounded-lg"
              />

              <input
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Department"
                required
                className="w-full border px-3 py-2 rounded-lg"
              />

              <input
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="Qualification"
                required
                className="w-full border px-3 py-2 rounded-lg"
              />

              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Bio"
                rows={4}
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