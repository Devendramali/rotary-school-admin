import { useState, useEffect } from "react";
import API from "../../api/api";

export default function NoticeManager() {
  const [notices, setNotices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    date: "",
    image: null
  });

  const fetchNotices = async () => {
    const res = await API.get("/notices");
    setNotices(res.data);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") setFormData({ ...formData, image: files[0] });
    else setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("subtitle", formData.subtitle);
    data.append("date", formData.date);
    if (formData.image) data.append("image", formData.image);

    if (editId) {
      await API.put(`/notices/${editId}`, data);
    } else {
      await API.post("/notices", data);
    }

    fetchNotices();
    setShowModal(false);
    setEditId(null);
    setFormData({ title: "", subtitle: "", date: "", image: null });
  };

  const handleEdit = (notice) => {
    setEditId(notice._id);
    setFormData({
      title: notice.title,
      subtitle: notice.subtitle,
      date: notice.date?.slice(0, 10),
      image: null
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this notice?")) return;
    await API.delete(`/notices/${id}`);
    fetchNotices();
  };

    // TOGGLE ACTIVE
    const toggleStatus = async (id) => {
      try {
        await API.put(`/notices/toggle/${id}`);
        fetchNotices();
      } catch (err) {
        console.error(err);
      }
    };

  return (
    <>
     <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
  {/* Header */}
  <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b">
    <h3 className="text-lg font-semibold text-gray-800">
      Gram Panchayat Notices
    </h3>

    <button
      onClick={() => {
        setShowModal(true);
        setEditId(null);
        setFormData({
          title: "",
          subtitle: "",
          date: "",
          image: null,
        });
      }}
      className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition"
    >
      + Add Notice
    </button>
  </div>

  {/* Table */}
  <div className="overflow-x-auto">
    <table className="min-w-full text-sm">
      <thead className="bg-gray-50 border-b">
        <tr className="text-gray-600 text-left">
          <th className="px-6 py-3">Notice</th>
          <th className="px-6 py-3">Date</th>
          <th className="px-6 py-3">Status</th>
          <th className="px-6 py-3 text-center">Action</th>
        </tr>
      </thead>

      <tbody className="divide-y">
        {notices.map((notice) => (
          <tr key={notice._id} className="hover:bg-gray-50 transition">
            
            {/* Image + Title */}
            <td className="px-6 py-4 flex items-center gap-4">
              {notice.image ? (
                <img
                  src={`${notice.image}`}
                  alt={notice.title}
                  className="w-12 h-12 rounded-lg object-cover border"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                  N
                </div>
              )}

              <div>
                <p className="font-semibold text-[16px] text-gray-800">
                  {notice.title}
                </p>
                {/* <p className="text-xs text-gray-500 line-clamp-1">
                  {notice.subtitle}
                </p> */}
              </div>
            </td>

            {/* Date */}
            <td className="px-6 py-4 text-gray-700">
              {new Date(notice.date).toLocaleDateString()}
            </td>
             <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(notice._id)}
                        className={`px-3 py-1 rounded text-white ${
                          notice.isActive ? "bg-green-600" : "bg-gray-400"
                        }`}
                      >
                        {notice.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>

            {/* Actions */}
            <td className="px-6 py-4">
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleEdit(notice)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(notice._id)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              </div>
            </td>

          </tr>
        ))}

        {notices.length === 0 && (
          <tr>
            <td colSpan={3} className="text-center py-8 text-gray-400">
              No notices added yet
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>


      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl w-[400px] space-y-3">
            <h3 className="font-bold">{editId ? "Edit Notice" : "Add Notice"}</h3>

            <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="w-full border p-2 rounded" required />
            <input name="subtitle" placeholder="Subtitle" value={formData.subtitle} onChange={handleChange} className="w-full border p-2 rounded" />
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full border p-2 rounded" required />
            <input type="file" name="image" onChange={handleChange} />

            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="bg-brand-500 text-white px-4 py-2 rounded">Save</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
