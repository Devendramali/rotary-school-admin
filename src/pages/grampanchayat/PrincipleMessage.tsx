import { useState, useEffect } from "react";
import API from "../../api/api";

export default function PrincipleMessage() {
  const [item, setItem] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    principleName: "",
    designation: "",
    image: null as File | null,
  });

  const fetchItems = async () => {
    try {
      const res = await API.get("/principle");
      setItem(Array.isArray(res.data) ? res.data[0] : res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openModal = (data: any = null) => {
    if (data) {
      setEditId(data._id);
      setFormData({
        title: data.title,
        message: data.message,
        principleName: data.principleName,
        designation: data.designation,
        image: null,
      });
    } else {
      setEditId(null);
      setFormData({
        title: "",
        message: "",
        principleName: "",
        designation: "",
        image: null,
      });
    }
    setShowModal(true);
  };

  const handleChange = (e: any) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("message", formData.message);
      data.append("principleName", formData.principleName);
      data.append("designation", formData.designation);

      if (formData.image) data.append("image", formData.image);

      if (editId) {
        await API.put(`/principle/${editId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await API.post("/principle", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setShowModal(false);
      fetchItems();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await API.delete(`/principle/${id}`);
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      await API.put(`/principle/toggle/${id}`);
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="rounded-2xl border bg-white">
            <div className="flex justify-between px-6 py-4">
              <h3 className="text-lg font-semibold">Principle Message</h3>
              <button
                onClick={() => openModal(item)}
                className="px-4 py-2 bg-brand-500 text-white rounded-lg"
              >
                {item ? "Edit" : "+ Add"}
              </button>
            </div>

            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[900px]">
                <div className="grid grid-cols-7 border-t px-6 py-3 font-medium text-gray-500">
                  <div>Image</div>
                  <div>Name</div>
                  <div>Designation</div>
                  <div>Title</div>
                  <div>Message</div>
                  <div>Status</div>
                  <div className="text-center">Action</div>
                </div>

                {item ? (
                  <div className="grid grid-cols-7 border-t px-6 py-4 items-center">
                    <div>
                      {item.image ? (
                        <img
                          src={item.image}
                          className="h-16 w-16 object-cover rounded-lg border"
                        />
                      ) : (
                        "N/A"
                      )}
                    </div>

                    <div>{item.principleName}</div>
                    <div>{item.designation}</div>
                    <div>{item.title}</div>
                    <div>{item.message}</div>

                    <div>
                      <button
                        onClick={() => toggleStatus(item._id)}
                        className={`px-3 py-1 rounded text-white ${
                          item.isActive ? "bg-green-600" : "bg-gray-400"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </button>
                    </div>

                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openModal(item)}
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
                ) : (
                  <p className="text-center py-6 text-gray-400">
                    No data added
                  </p>
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
              {editId ? "Edit Message" : "Add Message"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="principleName"
                value={formData.principleName}
                onChange={handleChange}
                placeholder="Principle Name"
                className="w-full border px-3 py-2 rounded-lg"
              />

              <input
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="Designation"
                className="w-full border px-3 py-2 rounded-lg"
              />

              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
                className="w-full border px-3 py-2 rounded-lg"
              />

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                rows={5}
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
                  className="px-4 py-2 bg-brand-500 text-white rounded-lg"
                  disabled={loading}
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