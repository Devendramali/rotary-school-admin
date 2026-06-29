import { useState, useEffect } from "react";
import API from "../../api/api";

interface ItemType {
  _id: string;
  title: string;
  pdf?: string;
  isActive?: boolean;
}

export default function SwayamGhoshnaPatre() {
  const [items, setItems] = useState<ItemType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ title: string; pdf: File | null }>({
    title: "",
    pdf: null,
  });
  const [loading, setLoading] = useState(false);

  // Fetch Items
  const fetchItems = async () => {
    try {
      const res = await API.get("/swayamGhoshna");
      setItems(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Open Modal
  const openModal = (item: ItemType | null = null) => {
    if (item) {
      setEditId(item._id);
      setFormData({ title: item.title, pdf: null });
    } else {
      setEditId(null);
      setFormData({ title: "", pdf: null });
    }
    setShowModal(true);
  };

  // Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "pdf") {
      setFormData({ ...formData, pdf: e.target.files?.[0] || null });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      if (formData.pdf) data.append("pdf", formData.pdf);

      if (editId) {
        await API.put(`/swayamGhoshna/${editId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await API.post("/swayamGhoshna", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setShowModal(false);
      setEditId(null);
      setFormData({ title: "", pdf: null });
      fetchItems();
    } catch (err) {
      console.error("Save Error:", err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      await API.delete(`/swayamGhoshna/${id}`);
      fetchItems();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  // Toggle Status
  const toggleStatus = async (id: string) => {
    try {
      await API.put(`/swayamGhoshna/toggle/${id}`);
      fetchItems();
    } catch (err) {
      console.error("Status Error:", err);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="rounded-2xl border bg-white">

            <div className="flex justify-between px-6 py-4">
              <h3 className="text-lg font-semibold">Swayam Ghoshna Patre</h3>
              <button
                onClick={() => openModal()}
                className="px-4 py-2 bg-brand-500 text-white rounded-lg"
              >
                + Add Item
              </button>
            </div>

            {/* Table */}
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[600px]">

                <div className="grid grid-cols-5 border-t px-6 py-3 font-medium text-gray-500">
                  <div className="col-span-2">Title</div>
                  <div className="col-span-1">PDF</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-1 text-center">Action</div>
                </div>

                {items.map((item) => (
                  <div
                    key={item._id}
                    className="grid grid-cols-5 border-t px-6 py-4 items-center"
                  >
                    <div className="col-span-2">{item.title}</div>

                    <div className="col-span-1">
                      {item.pdf ? (
                        <a
                          href={item.pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          View PDF
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </div>

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

                    <div className="col-span-1 flex justify-center gap-4">
                      <button
                        onClick={() => openModal(item)}
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

                {items.length === 0 && (
                  <p className="text-center py-6 text-gray-400">
                    No items added
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[400px] p-6 shadow-xl">

            <h3 className="text-lg font-semibold mb-4">
              {editId ? "Edit Item" : "Add Item"}
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
                type="file"
                name="pdf"
                accept="application/pdf"
                onChange={handleChange}
                className="w-full"
              />

              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditId(null);
                    setFormData({ title: "", pdf: null });
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
                  {loading ? "Saving..." : editId ? "Update" : "Save"}
                </button>

              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}
