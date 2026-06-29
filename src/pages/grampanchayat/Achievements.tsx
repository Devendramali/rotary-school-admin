import { useEffect, useState } from "react";
import API from "../../api/api";

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const initialForm = {
    title: "",
    discription: "",
    position: "",
    name: "",
    category: "",
    level: "",
    rank: "",
    year: "",
    classGroup: "",
    eventName: "",
    image: null as File | null,
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchAchievements = async () => {
    try {
      const res = await API.get("/achievements");
      setAchievements(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      discription: item.discription,
      position: item.position,
      name: item.name,
      category: item.category,
      level: item.level,
      rank: item.rank,
      year: item.year,
      classGroup: item.classGroup,
      eventName: item.eventName,
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
      data.append("discription", formData.discription);
      data.append("position", formData.position);
      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("level", formData.level);
      data.append("rank", formData.rank);
      data.append("year", formData.year);
      data.append("classGroup", formData.classGroup);
      data.append("eventName", formData.eventName);

      if (formData.image) {
        data.append("image", formData.image);
      }

      if (editId) {
        await API.put(`/achievements/${editId}`, data);
      } else {
        await API.post("/achievements", data);
      }

      fetchAchievements();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete achievement?")) return;

    try {
      await API.delete(`/achievements/${id}`);
      fetchAchievements();
    } catch {
      alert("Delete failed");
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      await API.put(`/achievements/toggle/${id}`);
      fetchAchievements();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="rounded-2xl border bg-white">
        <div className="flex justify-between px-6 py-4">
          <h3 className="text-lg font-semibold">Achievements</h3>

          <button
            onClick={openModal}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg"
          >
            + Add Achievement
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t bg-gray-50">
                <th className="p-4">Image</th>
                <th>Title</th>
                <th>Discription</th>
                <th>Position</th>
                <th>Name</th>
                <th>Category</th>
                <th>Level</th>
                <th>Rank</th>
                <th>Year</th>
                <th>Class</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {achievements.map((item: any) => (
                <tr key={item._id} className="border-t text-center">
                  <td className="p-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt=""
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                  </td>
                  <td>{item.title}</td>
                  <td>{item.discription}</td>
                  <td>{item.position}</td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.level}</td>
                  <td>{item.rank}</td>
                  <td>{item.year}</td>
                  <td>{item.classGroup}</td>

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
                    <div className="flex justify-center gap-3">
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

              {achievements.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-6 text-gray-400 text-center">
                    No achievements added
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[700px] rounded-xl p-6 max-h-[90vh] overflow-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editId ? "Edit Achievement" : "Add Achievement"}
            </h3>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required className="border px-3 py-2 rounded" />
              <input name="position" value={formData.position} onChange={handleChange} placeholder="Position" required className="border px-3 py-2 rounded" />
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Student Name" required className="border px-3 py-2 rounded" />
              <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" required className="border px-3 py-2 rounded" />
              <input name="level" value={formData.level} onChange={handleChange} placeholder="Level" required className="border px-3 py-2 rounded" />
              <input name="rank" value={formData.rank} onChange={handleChange} placeholder="Rank" required className="border px-3 py-2 rounded" />
              <input name="year" value={formData.year} onChange={handleChange} placeholder="Year" required className="border px-3 py-2 rounded" />
              <input name="classGroup" value={formData.classGroup} onChange={handleChange} placeholder="Class / Group" required className="border px-3 py-2 rounded" />
              <textarea name="discription" value={formData.discription} onChange={handleChange} placeholder="discription" required className="border px-3 py-2 rounded col-span-2" />
              <input name="eventName" value={formData.eventName} onChange={handleChange} placeholder="Event Name" className="border px-3 py-2 rounded col-span-2" />
              <input type="file" name="image" accept="image/*" onChange={handleChange} className="col-span-2" />

              <div className="col-span-2 flex justify-end gap-3 mt-4">
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