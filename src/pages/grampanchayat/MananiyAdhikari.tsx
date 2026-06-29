import { useEffect, useState } from "react";
import API from "../../api/api";

export default function MananiyAdhikari() {
  const [list, setList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    discription: "",
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
    const { name,  value, files } = e.target;

    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     setLoading(true);
try {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("category", formData.category);
    data.append("discription", formData.discription);

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
      discription: "",
      category: "",
      image: null,
    });

    fetchData();
  }catch (err) {
      console.error(err);
      alert("Upload failed");
    }
      setLoading(false);
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
           Facilities
          </h3>

          <button
            onClick={() => {
              setShowModal(true);
              setEditId(null);
            }}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg"
          >
            + Add Facilities
          </button>
        </div>

        {/* Table */}
        <div className="grid grid-cols-12 border-t px-6 py-3 font-medium text-gray-500">
          <div className="col-span-4">Title</div>
          <div className="col-span-3">Category</div>
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

            <div className="col-span-3">{item.category}</div>

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
              <button
              onClick={() => {
                setEditId(item._id);
                setFormData({
                  name: item.name,
                  category: item.category,
                  discription: item.discription,
                  image: null,
                });
                setShowModal(true);
              }}
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
  {editId ? "Edit Member" : "Add Member"}
</h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full border p-2 rounded"
              />
               <select
  name="category"
  value={formData.category}
  onChange={handleChange}
  className="w-full border px-3 py-2 rounded-lg"
>
  <option value="">Select Category</option>
  <option value="Events">Events</option>
  <option value="Sports">Sports</option>
  <option value="Science">Science</option>
  <option value="Arts & Culture">Arts & Culture</option>
  <option value="Classrooms">Classrooms</option>
  <option value="Campus">Campus</option>
</select>


              <input
  name="discription"
  value={formData.discription}
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
  onClick={() => {
    setShowModal(false);
    setEditId(null);
    setFormData({
      name: "",
      category: "",
      discription: "",
      image: null,
    });
  }}
  className="border px-4 py-2 rounded"
>
  Cancel
</button>
                <button className="bg-brand-500 text-white px-4 py-2 rounded"
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