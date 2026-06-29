import { useState, useEffect } from "react";
import API from "../../api/api";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    date: "",
    image: null,
  });

  // Fetch Events
  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Input Change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit Add / Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("subtitle", formData.subtitle);
      data.append("date", formData.date);

      if (formData.image) {
        data.append("image", formData.image);
      }

      if (editId) {
        await API.put(`/events/${editId}`, data);
      } else {
        await API.post("/events", data);
      }

      fetchEvents();
      setShowModal(false);
      setEditId(null);
      setFormData({ title: "", subtitle: "", date: "", image: null });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Edit Event
  const handleEdit = (event) => {
    setFormData({
      title: event.title,
      subtitle: event.subtitle,
      date: event.date.slice(0, 10),
      image: null,
    });

    setEditId(event._id);
    setShowModal(true);
  };

  // Delete Event
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    await API.delete(`/events/${id}`);
    fetchEvents();
  };
    // TOGGLE ACTIVE
    const toggleStatus = async (id) => {
      try {
        await API.put(`/events/toggle/${id}`);
       fetchEvents();
      } catch (err) {
        console.error(err);
      }
    };

  return (
    <>
      <div className="flex justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-800"> Events</h2>
        <button
          onClick={() => {
            setShowModal(true);
            setEditId(null);
            setFormData({ title: "", subtitle: "", date: "", image: null });
          }}
          className="px-4 py-2 bg-brand-500 text-white rounded-lg"
        >
          + Add Event
        </button>
      </div>

      {/* Event List */}
  <div className="max-w-full overflow-x-auto">
  <div className="min-w-[900px]">

    {/* Header */}
    <div className="grid grid-cols-11 border-t px-6 py-3">
      <div className="col-span-1 font-medium text-gray-500">No</div>
      <div className="col-span-3 font-medium text-gray-500">Event</div>
      <div className="col-span-2 font-medium text-gray-500">Subtitle</div>
      <div className="col-span-2 font-medium text-gray-500">Date</div>
      <div className="col-span-1 font-medium text-gray-500">Status</div>
      <div className="col-span-1 font-medium text-gray-500 text-center">Action</div>
    </div>

    {/* Rows */}
    {events.map((item, index) => (
      <div key={item._id} className="grid grid-cols-11 border-t px-6 py-4 items-center">
          <div className="col-span-1 text-gray-500 text-sm">
          {index +1}
        </div>

        {/* Image + Title */}
        <div className="col-span-3 flex items-center gap-3">
          {item.image && (
            <img
              src={`${item.image}`}
              alt="Event"
              className="w-12 h-12 rounded-lg object-cover border"
            />
          )}
          <span className="font-medium">{item.title}</span>
        </div>

        {/* Subtitle */}
        <div className="col-span-2 text-gray-600">
          {item.subtitle}
        </div>

        {/* Date */}
        <div className="col-span-2 text-gray-500 text-sm">
          {new Date(item.date).toLocaleDateString()}
        </div>

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

        {/* Actions */}
        <div className="col-span-1 flex justify-center gap-3">
          <button
            onClick={() => handleEdit(item)}
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

    {/* Empty State */}
    {events.length === 0 && (
      <p className="text-center py-6 text-gray-400">
        No events added yet
      </p>
    )}

  </div>
</div>


      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[420px] p-6 shadow-xl">

            <h3 className="text-lg font-semibold mb-4">
              {editId ? "Edit Event" : "Add Event"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                name="title"
                placeholder="Event Title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-lg"
              />

              <input
                name="subtitle"
                placeholder="Event Subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-lg"
              />

              <input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-lg"
              />

              <input
                type="file"
                name="image"
                onChange={handleChange}
              />

              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-500 text-white rounded-lg"
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
