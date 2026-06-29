import { useState, useEffect } from "react";
import API from "../../api/api";

export default function Implink() {
    const [implink, setimplink] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    const fetchimplink = async () => {
        const res = await API.get("/implinks");
        setimplink(res.data);
    };

    useEffect(() => {
        fetchimplink();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editId) {
                // UPDATE existing implink
                await API.put(`/implinks/${editId}`, { title, link });
            } else {
                // CREATE new implink
                await API.post("/implinks", { title, link });
            }

            setTitle("");
            setLink("");
            setEditId(null);
            setShowModal(false);
            fetchimplink();
        } catch (err) {
            console.error("Error saving implink:", err);
            alert("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    const deleteimplink = async (id) => {
        if (!window.confirm("Delete this implink?")) return;
        await API.delete(`/implinks/${id}`);
        fetchimplink();
    };

      // TOGGLE ACTIVE
      const toggleStatus = async (id) => {
        try {
          await API.put(`/implinks/toggle/${id}`);
             fetchimplink();
        } catch (err) {
          console.error(err);
        }
      };

    return (
        <>
            {/* Header */}
            <div className="flex justify-between mb-5">
                <h3 className="text-lg font-semibold text-gray-800">
                    links
                </h3>

                <button
                    onClick={() => setShowModal(true)}
                    className="bg-brand-500 text-white px-4 py-2 rounded-lg"
                >
                    + Add implink
                </button>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow">





                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[700px]">
                        <div className="grid grid-cols-4 border-t px-6 py-3 font-medium text-gray-500">
                            <div className="col-span-1">Title</div>
                            {/* <div className="col-span-1">Subtitle</div> */}
                            <div className="col-span-1">Link</div>
                            <div className="col-span-1">Status</div>
                            <div className="col-span-1 text-center">Action</div>
                        </div>

                        {implink.map(item => (
                            <div key={item._id} className="grid grid-cols-4 border-t px-6 py-4 items-center">
                                <div className="col-span-1">{item.title}</div>
                                {/* <div className="col-span-1">{item.subtitle}</div> */}
                              
                                <div className="col-span-1">{item.link ? <a    href={item.link.startsWith("http") ? item.link : `https://${item.link}`}
  target="_blank"
  rel="noopener noreferrer" className="text-blue-500 underline">Visit</a> : "N/A"}</div>
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
                                {/* <div className="col-span-1">{item.pdf ? <a href={`https://palsun-backend-1.onrender.com/${item.pdf}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View PDF</a> : "N/A"}</div> */}
                                <div className="col-span-1 flex justify-center gap-2">
                                    <button onClick={() => {
                                        setText(item.title);
                                        setAuthor(item.link);
                                        setEditId(item._id);
                                        setShowModal(true);
                                    }} className="text-blue-500 hover:text-blue-700">Edit</button>
                                    <button onClick={() => deleteimplink(item._id)} className="text-red-500 hover:text-red-700">Delete</button>
                                </div>
                            </div>
                        ))}

                        {implink.length === 0 && <p className="text-center py-6 text-gray-400">No programs added</p>}
                    </div>
                </div>









                {implink.length === 0 && (
                    <p className="text-gray-400 p-6 text-center">No implink added</p>
                )}
            </div>

            {/* MODAL POPUP */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-[420px] p-6 shadow-xl">

                        <h3 className="text-lg font-bold mb-4">Add implink</h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                placeholder="Enter Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="w-full border px-3 py-2 rounded-lg "
                            />

                            <input
                                placeholder="Links"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                className="w-full border px-3 py-2 rounded-lg"
                            />

                            <div className="flex justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditId(null);
                                        setTitle("");
                                        setLink("");
                                    }}
                                    className="border px-4 py-2 rounded-lg"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-brand-500 text-white px-4 py-2 rounded-lg"
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
