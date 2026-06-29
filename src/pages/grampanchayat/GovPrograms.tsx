import { useState, useEffect } from "react";
import axios from "axios";
import API from "../../api/api";

export default function GovPrograms() {
  const [items, setItems] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", subtitle: "", link: "", pdf: null as File | null });
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await API.get("/govPrograms");
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const openModal = (item: any = null) => {
    if (item) {
      setEditId(item._id);
      setFormData({ title: item.title, subtitle: item.subtitle || "", link: item.link || "", pdf: null });
    } else {
      setEditId(null);
      setFormData({ title: "", subtitle: "", link: "", pdf: null });
    }
    setShowModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "pdf") setFormData({ ...formData, pdf: e.target.files![0] });
    else setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("subtitle", formData.subtitle);
      data.append("link", formData.link);
      if (formData.pdf) data.append("pdf", formData.pdf);

      if (editId) {
        await API.put(`/govPrograms/${editId}`, data, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await API.post("/govPrograms", data, { headers: { "Content-Type": "multipart/form-data" } });
      }

      setShowModal(false);
      fetchItems();
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await API.delete(`/govPrograms/${id}`);
      fetchItems();
    } catch (err) { console.error(err); }
  };
     const toggleStatus = async (id: string) => {
          try {
            await API.put(`/govPrograms/toggle/${id}`);
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
              <h3 className="text-lg font-semibold">Gov Programs</h3>
              <button onClick={() => openModal()} className="px-4 py-2 bg-brand-500 text-white rounded-lg">+ Add</button>
            </div>

            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[700px]">
                <div className="grid grid-cols-6 border-t px-6 py-3 font-medium text-gray-500">
                  <div className="col-span-1">Title</div>
                  <div className="col-span-1">Subtitle</div>
                  <div className="col-span-1">Link</div>
                  <div className="col-span-1">PDF</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-1 text-center">Action</div>
                </div>

                {items.map(item => (
                  <div key={item._id} className="grid grid-cols-6 border-t px-6 py-4 items-center">
                    <div className="col-span-1">{item.title}</div>
                    <div className="col-span-1">{item.subtitle}</div>
                    <div className="col-span-1">{item.link ? <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Visit</a> : "N/A"}</div>
                    <div className="col-span-1">{item.pdf ? <a href={`${item.pdf}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View PDF</a> : "N/A"}</div>
                    <div className="col-span-1"> <button
                        onClick={() => toggleStatus(item._id)}
                        className={`px-3 py-1 rounded text-white ${
                          item.isActive ? "bg-green-600" : "bg-gray-400"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </button></div>
                    <div className="col-span-1 flex justify-center gap-2">
                      <button onClick={() => openModal(item)} className="text-blue-500 hover:text-blue-700">Edit</button>
                      <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-700">Delete</button>
                    </div>
                  </div>
                ))}

                {items.length === 0 && <p className="text-center py-6 text-gray-400">No programs added</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[450px] p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">{editId ? "Edit Program" : "Add Program"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required className="w-full border px-3 py-2 rounded-lg"/>
              <input name="subtitle" value={formData.subtitle} onChange={handleChange} placeholder="Subtitle" className="w-full border px-3 py-2 rounded-lg"/>
              <input name="link" value={formData.link} onChange={handleChange} placeholder="Link" className="w-full border px-3 py-2 rounded-lg"/>
              <input type="file" name="pdf" accept="application/pdf" onChange={handleChange} className="w-full"/>
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
