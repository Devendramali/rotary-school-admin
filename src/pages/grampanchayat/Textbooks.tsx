import { useState, useEffect } from "react";
import API from "../../api/api";

export default function Textbooks() {
  const [textbooks, setTextbooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    className: "",
    subjectName: "",
    description: "",
    publisherName: "",
    pdf: null,
  });

  const classOptions = [
    "Class I",
    "Class II",
    "Class III",
    "Class IV",
    "Class V",
    "Class VI",
    "Class VII",
    "Class VIII",
    "Class IX",
    "Class X",
  ];

  const fetchTextbooks = async () => {
    try {
      const res = await API.get("/textbooks");
      setTextbooks(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTextbooks();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "pdf") {
      setFormData({ ...formData, pdf: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("className", formData.className);
      data.append("subjectName", formData.subjectName);
      data.append("description", formData.description);
      data.append("publisherName", formData.publisherName);

      if (formData.pdf) {
        data.append("pdf", formData.pdf);
      }

      if (editId) {
        await API.put(`/textbooks/${editId}`, data);
      } else {
        await API.post("/textbooks", data);
      }

      setShowModal(false);
      setEditId(null);

      setFormData({
        className: "",
        subjectName: "",
        description: "",
        publisherName: "",
        pdf: null,
      });

      fetchTextbooks();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }

    setLoading(false);
  };

  const handleEdit = (item) => {
    setFormData({
      className: item.className,
      subjectName: item.subjectName,
      description: item.description,
      publisherName: item.publisherName,
      pdf: null,
    });

    setEditId(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this textbook?")) return;

    await API.delete(`/textbooks/${id}`);
    fetchTextbooks();
  };

  const toggleStatus = async (id) => {
    try {
      await API.put(`/textbooks/toggle/${id}`);
      fetchTextbooks();
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
              <h3 className="text-lg font-semibold">Textbooks</h3>

              <button
                onClick={() => {
                  setShowModal(true);
                  setEditId(null);
                  setFormData({
                    className: "",
                    subjectName: "",
                    description: "",
                    publisherName: "",
                    pdf: null,
                  });
                }}
                className="px-4 py-2 bg-brand-500 text-white rounded-lg"
              >
                + Add Textbook
              </button>
            </div>

            <div className="max-w-full overflow-x-auto">
              <div className="w-full">
                <div className="grid grid-cols-12 border-t px-6 py-3">
                  <div className="col-span-2 font-medium text-gray-500">Class</div>
                  <div className="col-span-2 font-medium text-gray-500">Subject</div>
                  <div className="col-span-2 font-medium text-gray-500">Publisher</div>
                  <div className="col-span-2 font-medium text-gray-500">PDF</div>
                  <div className="col-span-2 font-medium text-gray-500">Status</div>
                  <div className="col-span-2 text-center font-medium text-gray-500">Action</div>
                </div>

                {textbooks.map((item) => (
                  <div
                    key={item._id}
                    className="grid grid-cols-12 border-t px-6 py-4 items-center"
                  >
                    <div className="col-span-2">{item.className}</div>
                    <div className="col-span-2">{item.subjectName}</div>
                    <div className="col-span-2">{item.publisherName}</div>

                    <div className="col-span-2">
                      {item.pdf && (
                        <a
                          href={item.pdf}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-500"
                        >
                          View PDF
                        </a>
                      )}
                    </div>

                    <div className="col-span-2">
                      <button
                        onClick={() => toggleStatus(item._id)}
                        className={`px-3 py-1 rounded text-white ${
                          item.isActive ? "bg-green-600" : "bg-gray-400"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </button>
                    </div>

                    <div className="col-span-2 flex justify-center gap-4">
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

                {textbooks.length === 0 && (
                  <p className="text-center py-6 text-gray-400">
                    No textbooks added
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
              {editId ? "Edit Textbook" : "Add Textbook"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                name="className"
                value={formData.className}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-lg"
              >
                <option value="">Select Class</option>
                {classOptions.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>

              <input
                name="subjectName"
                value={formData.subjectName}
                onChange={handleChange}
                placeholder="Subject Name"
                required
                className="w-full border px-3 py-2 rounded-lg"
              />

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full border px-3 py-2 rounded-lg"
              />

              <input
                name="publisherName"
                value={formData.publisherName}
                onChange={handleChange}
                placeholder="Publisher Name"
                required
                className="w-full border px-3 py-2 rounded-lg"
              />

              <input
                type="file"
                name="pdf"
                accept=".pdf"
                onChange={handleChange}
                className="w-full"
              />

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditId(null);
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