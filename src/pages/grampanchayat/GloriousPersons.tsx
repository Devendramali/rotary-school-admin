import { useState, useEffect } from "react";
import axios from "axios";
import API from "../../api/api";

export default function GloriousPersons() {
  const [items, setItems] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", image: null as File | null });
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await API.get("/gloriousPersons");
      setItems(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchItems(); }, []);

  const openModal = (item: any = null) => {
    if (item) {
      setEditId(item._id);
      setFormData({ name: item.name, description: item.description || "", image: null });
    } else {
      setEditId(null);
      setFormData({ name: "", description: "", image: null });
    }
    setShowModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.name === "image") setFormData({ ...formData, image: e.target.files![0] });
    else setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      if (formData.image) data.append("image", formData.image);

      if (editId) await API.put(`/gloriousPersons/${editId}`, data, { headers: { "Content-Type": "multipart/form-data" } });
      else await API.post("/gloriousPersons", data, { headers: { "Content-Type": "multipart/form-data" } });

      setShowModal(false);
      fetchItems();
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try { await API.delete(`/gloriousPersons/${id}`); fetchItems(); }
    catch (err) { console.error(err); }
  };

    // TOGGLE ACTIVE
      const toggleStatus = async (id) => {
        try {
          await API.put(`/gloriousPersons/toggle/${id}`);
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
              <h3 className="text-lg font-semibold">गौरवशाली व्यक्ति</h3>
              <button onClick={() => openModal()} className="px-4 py-2 bg-brand-500 text-white rounded-lg">+ Add</button>
            </div>

            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[700px]">
                <div className="grid grid-cols-5 border-t px-6 py-3 font-medium text-gray-500">
                  <div className="col-span-1">Name</div>
                  <div className="col-span-1">Description</div>
                  <div className="col-span-1">Image</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-1 text-center">Action</div>
                </div>

                {items.map(item => (
                  <div key={item._id} className="grid grid-cols-5 border-t px-6 py-4 items-center">
                    <div className="col-span-1">{item.name}</div>
                    <div className="col-span-1">{item.description}</div>
                    <div className="col-span-1">{item.image ? <img src={`${item.image}`} alt={item.name} className="h-16 w-16 object-cover rounded-lg border"/> : "N/A"}</div>
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
                    <div className="col-span-1 flex justify-center gap-2">
                      <button onClick={() => openModal(item)} className="text-blue-500 hover:text-blue-700">Edit</button>
                      <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-700">Delete</button>
                    </div>
                  </div>
                ))}

                {items.length === 0 && <p className="text-center py-6 text-gray-400">No items added</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[450px] p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">{editId ? "Edit Person" : "Add Person"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required className="w-full border px-3 py-2 rounded-lg"/>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full border px-3 py-2 rounded-lg"/>
              <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full"/>
              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-500 text-white rounded-lg" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
