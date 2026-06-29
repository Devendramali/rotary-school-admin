import { useState, useEffect } from "react";
import API from "../../api/api";

// Type
interface SuvicharItem {
  _id: string;
  text: string;
  author?: string;
}

export default function Suvichar() {
  const [suvichar, setSuvichar] = useState<SuvicharItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const fetchSuvichar = async () => {
    try {
      const res = await API.get("/suvichar");
      setSuvichar(res.data);
    } catch (err) {
      console.error("Fetch Suvichar error:", err);
    }
  };

  useEffect(() => {
    fetchSuvichar();
  }, []);

  // Submit Add / Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editId) {
        await API.put(`/suvichar/${editId}`, { text, author });
      } else {
        await API.post("/suvichar", { text, author });
      }

      setText("");
      setAuthor("");
      setEditId(null);
      setShowModal(false);
      fetchSuvichar();
    } catch (err) {
      console.error("Error saving Suvichar:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const deleteSuvichar = async (id: string) => {
    if (!window.confirm("Delete this Suvichar?")) return;

    try {
      await API.delete(`/suvichar/${id}`);
      fetchSuvichar();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between mb-5">
        <h3 className="text-lg font-semibold text-gray-800">Suvichar</h3>

        <button
          onClick={() => setShowModal(true)}
          className="bg-brand-500 text-white px-4 py-2 rounded-lg"
        >
          + Add Suvichar
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow">
        {suvichar.map((item) => (
          <div key={item._id} className="border-b p-4 flex justify-between">
            <div>
              <p className="italic text-gray-800">"{item.text}"</p>
              <p className="text-sm text-gray-500">— {item.author || "Unknown"}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setText(item.text);
                  setAuthor(item.author || "");
                  setEditId(item._id);
                  setShowModal(true);
                }}
                className="text-blue-500 text-sm"
              >
                Edit
              </button>

              <button
                onClick={() => deleteSuvichar(item._id)}
                className="text-red-500 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {suvichar.length === 0 && (
          <p className="text-gray-400 p-6 text-center">No Suvichar added</p>
        )}
      </div>

      {/* MODAL POPUP */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[420px] p-6 shadow-xl">

            <h3 className="text-lg font-bold mb-4">
              {editId ? "Edit Suvichar" : "Add Suvichar"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                placeholder="Enter Suvichar"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                className="w-full border px-3 py-2 rounded-lg h-[120px]"
              />

              <input
                placeholder="Author (optional)"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg"
              />

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditId(null);
                    setText("");
                    setAuthor("");
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
