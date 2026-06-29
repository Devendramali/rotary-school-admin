import { useEffect, useState } from "react";
import API from "../../api/api";

export default function MananiyAdhikari() {
  const [list, setList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    post: "",
    image: null,
  });

  const fetchData = async () => {
    const res = await API.get("/mananiy-adhikari");
    setList(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("post", formData.post);

    if (formData.image) {
      data.append("image", formData.image);
    }

    if (editId) {
      await API.put(`/mananiy-adhikari/${editId}`, data);
    } else {
      await API.post("/mananiy-adhikari", data);
    }

    setShowModal(false);
    setEditId(null);
    setFormData({
      name: "",
      post: "",
      image: null,
    });

    fetchData();
  };

  const handleDelete = async (id) => {
    await API.delete(`/mananiy-adhikari/${id}`);
    fetchData();
  };

  const toggleStatus = async (id) => {
    await API.put(`/mananiy-adhikari/toggle/${id}`);
    fetchData();
  };

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white">
        {/* Header */}
        <div className="flex justify-between px-6 py-4">
          <h3 className="text-lg font-semibold">
            माननीय मंत्री व पदाधिकारी
          </h3>

          <button
            onClick={() => {
              setShowModal(true);
              setEditId(null);
            }}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg"
          >
            + Add Member
          </button>
        </div>

        {/* Table */}
        <div className="grid grid-cols-12 border-t px-6 py-3 font-medium text-gray-500">
          <div className="col-span-4">Name</div>
          <div className="col-span-3">Post</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-3 text-center">Action</div>
        </div>

        {list.map((item) => (
          <div
            key={item._id}
            className="grid grid-cols-12 border-t px-6 py-4 items-center"
          >
            <div className="col-span-4 flex items-center gap-2">
              {item.image && (
                <img
                  src={item.image}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <span>{item.name}</span>
            </div>

            <div className="col-span-3">{item.post}</div>

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

            <div className="col-span-3 flex justify-center gap-3">
              <button className="text-blue-500">Edit</button>
              <button
                onClick={() => handleDelete(item._id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {list.length === 0 && (
          <p className="text-center py-6 text-gray-400">
            No data added yet
          </p>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px]">
            <h3 className="text-lg font-semibold mb-4">
              Add Member
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full border p-2 rounded"
              />

              <input
                name="post"
                value={formData.post}
                onChange={handleChange}
                placeholder="Post"
                className="w-full border p-2 rounded"
              />

              <input
                type="file"
                name="image"
                onChange={handleChange}
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="border px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button className="bg-brand-500 text-white px-4 py-2 rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}