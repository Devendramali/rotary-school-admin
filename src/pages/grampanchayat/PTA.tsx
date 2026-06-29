import { useEffect, useState } from "react";
import API from "../../api/api";

export default function PTA() {
  const [ptaList, setPtaList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const initialForm = {
    title: "",
    subtitle: "",
    description: "",
    image: null as File | null,
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchPTA = async () => {
    try {
      const res = await API.get("/pta");
      setPtaList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPTA();
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
    setFormData(initialForm);
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    setEditId(item._id);
    setFormData({
      title: item.title,
      subtitle: item.subtitle,
      description: item.description,
      image: null,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("subtitle", formData.subtitle);
      data.append("description", formData.description);

      if (formData.image) {
        data.append("image", formData.image);
      }

      if (editId) {
        await API.put(`/pta/${editId}`, data);
      } else {
        await API.post("/pta", data);
      }

      fetchPTA();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete PTA record?")) return;

    try {
      await API.delete(`/pta/${id}`);
      fetchPTA();
    } catch {
      alert("Delete failed");
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      await API.put(`/pta/toggle/${id}`);
      fetchPTA();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="rounded-2xl border bg-white">
        <div className="flex justify-between px-6 py-4">
          <h3 className="text-lg font-semibold">Parent Teacher Association</h3>

          <button
            onClick={openModal}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg"
          >
            + Add PTA
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t bg-gray-50 text-left">
                <th className="p-4">Image</th>
                <th>Title</th>
                <th>Subtitle</th>
                <th>Description</th>
                <th>Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {ptaList.map((item: any) => (
                <tr key={item._id} className="border-t">
                  <td className="p-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt=""
                        className="w-20 h-16 object-cover rounded"
                      />
                    )}
                  </td>

                  <td>{item.title}</td>
                  <td>{item.subtitle}</td>

                  <td className="max-w-[300px] truncate">
                    {item.description}
                  </td>

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

              {ptaList.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-400">
                    No PTA records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[700px] rounded-xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              {editId ? "Edit PTA" : "Add PTA"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
                required
                className="w-full border px-3 py-2 rounded-lg"
              />

              <input
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="Subtitle"
                className="w-full border px-3 py-2 rounded-lg"
              />

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                rows={5}
                required
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