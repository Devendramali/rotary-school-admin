import { useState, useEffect } from "react";
import API from "../../api/api";

export default function Gallery() {

  const [gallery, setGallery] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    file: null,
  });

  // Fetch Gallery
  const fetchGallery = async () => {
    try {
      const res = await API.get("/gallery");
      setGallery(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      if (formData.file) data.append("file", formData.file);

      if (editId) {
        await API.put(`/gallery/${editId}`, data);
      } else {
        await API.post("/gallery", data);
      }

      setShowModal(false);
      setEditId(null);
      setFormData({ title: "", file: null });
      fetchGallery();

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }

    setLoading(false);
  };

  // Edit
  const handleEdit = (item) => {
    setFormData({ title: item.title, file: null });
    setEditId(item._id);
    setShowModal(true);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!confirm("Delete this item?")) return;
    await API.delete(`/gallery/${id}`);
    fetchGallery();
  };
      // TOGGLE ACTIVE
      const toggleStatus = async (id) => {
        try {
          await API.put(`/gallery/toggle/${id}`);
          fetchGallery();
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
              <h3 className="text-lg font-semibold">Gallery</h3>

              <button
                onClick={() => {
                  setShowModal(true);
                  setEditId(null);
                  setFormData({ title: "", file: null });
                }}
                className="px-4 py-2 bg-brand-500 text-white rounded-lg"
              >
                + Add Gallery
              </button>
            </div>

            {/* Table */}
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[900px]">

                {/* Header Row */}
                <div className="grid grid-cols-11 border-t px-6 py-3">
                  <div className="col-span-4 font-medium text-gray-500">Preview</div>
                  <div className="col-span-4 font-medium text-gray-500">Title</div>
                  <div className="col-span-1 font-medium text-gray-500">Status</div>
                  <div className="col-span-2 text-center font-medium text-gray-500">Action</div>
                </div>

                {/* Rows */}
                {gallery.map((item) => (
                  <div key={item._id} className="grid grid-cols-11 border-t px-6 py-4 items-center">

                    {/* Preview */}
                    <div className="col-span-4 flex items-center gap-3">
  {item.file && (
    item.type === "video" ? (
      <video
        src={item.file}
        className="w-16 h-12 rounded object-cover"
      />
    ) : (
      <img
        src={item.file}
        className="w-16 h-16 rounded object-cover border"
      />
    )
  )}
</div>

                    {/* Title */}
                    <div className="col-span-4">
                      {item.title}
                    </div>
                       <td className="col-span-1">
                      <button
                        onClick={() => toggleStatus(item._id)}
                        className={`px-3 py-1 rounded text-white ${
                          item.isActive ? "bg-green-600" : "bg-gray-400"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>

                    {/* Action */}
                    <div className="col-span-2 flex justify-center gap-4">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>

                  </div>
                ))}

                {gallery.length === 0 && (
                  <p className="text-center py-6 text-gray-400">No gallery items added</p>
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
              {editId ? "Edit Gallery" : "Add Gallery"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Gallery Title"
                required
                className="w-full border px-3 py-2 rounded-lg"
              />

              <input
                type="file"
                name="file"
                accept="image/*,video/mp4,video/webm,video/quicktime"
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
