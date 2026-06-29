import { useState, useEffect } from "react";
import API from "../../api/api";

// Types
interface Staff {
  _id: string;
  name: string;
  post: string;
  contact: string;
  image?: string;
  isActive?: boolean;
}

interface Count {
  girls: number;
  boys: number;
  totalTeacher: number;
  contact: string;
}

export default function School() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [loadingStaff, setLoadingStaff] = useState(false);

  const [count, setCount] = useState<Count>({ girls: 0, boys: 0, totalTeacher:0, contact: "" });
  const [showModalCount, setShowModalCount] = useState(false);
  const [loadingCount, setLoadingCount] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    post: "",
    contact: "",
    image: null as File | null,
  });

  // Fetch staff
  const fetchStaff = async () => {
    try {
      const res = await API.get("/staff");
      setStaffList(res.data);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  // Fetch school count
const fetchCount = async () => {
  try {
    const res = await API.get("/schoolcount");
    console.log("School Count API:", res.data);
    setCount(res.data);
  } catch (err) {
    console.error(err);
  }
};

  // Toggle active status
  const toggleStatus = async (id: string) => {
    try {
      await API.put(`/staff/toggle/${id}`);
      fetchStaff();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStaff();
    fetchCount();
  }, []);

  // Staff input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "image" && files) {
      setFormData({ ...formData, image: files[0]});
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Count input change
  const handleChangeCount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCount({ ...count, [name]: value });
  };

  // Submit staff
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingStaff(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("post", formData.post);
      // data.append("t", formData.post);
      data.append("contact", formData.contact);
      if (formData.image) data.append("image", formData.image);

      if (editId) {
        await API.put(`/staff/${editId}`, data);
      } else {
        await API.post("/staff", data);
      }

      fetchStaff();
      setFormData({ name: "", post: "", contact: "", image: null });
      setEditId(null);
      setShowModal(false);
    } catch (err) {
      alert("Error saving staff");
      console.error(err);
    } finally {
      setLoadingStaff(false);
    }
  };

  // Submit count
//   const handleSubmitCount = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoadingCount(true);

//     try {
//       await API.put("/schoolcount", {
//   girls: Number(count.girls),
//   boys: Number(count.boys),
//   totalTeacher: Number(count.totalTeacher), // 👈 हे add कर
//   contact: count.contact,
// });

//       setShowModalCount(false);
//     } catch (err) {
//       alert("Update failed");
//       console.error(err);
//     } finally {
//       setLoadingCount(false);
//     }
//   };
  // Submit count
  // Submit count
const handleSubmitCount = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoadingCount(true);

  try {
    await API.put("/schoolcount", {
      girls: Number(count.girls),
      boys: Number(count.boys),
      totalTeacher: Number(count.totalTeacher), // important
      contact: count.contact,
    });

    // latest data पुन्हा fetch कर
    await fetchCount();

    setShowModalCount(false);
  } catch (err) {
    alert("Update failed");
    console.error("Count update error:", err);
  } finally {
    setLoadingCount(false);
  }
};

  // Edit staff
  const handleEdit = (staff: Staff) => {
    setFormData({
      name: staff.name,
      post: staff.post,
      contact: staff.contact,
      image: null,
    });
    setEditId(staff._id);
    setShowModal(true);
  };

  // Delete staff
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this staff?")) return;

    try {
      await API.delete(`/staff/${id}`);
      fetchStaff();
    } catch (err) {
      alert("Delete failed");
      console.error(err);
    }
  };

  return (
    <>
      {/* School Counts */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="col-span-3 text-right">
          <button
            onClick={() => setShowModalCount(true)}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg col-span-3 mt-2 mr-6"
          >
            Update
          </button>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <span>Total Boys</span>
          <h4 className="text-2xl font-bold">{count.boys}</h4>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <span>Total Girls</span>
          <h4 className="text-2xl font-bold">{count.girls}</h4>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <span>Total Teacher</span>
          <h4 className="text-2xl font-bold">{count.totalTeacher}</h4>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <span>Contact</span>
          <h4 className="text-xl font-bold">{count.contact || "-"}</h4>
        </div>
      </div>

      {/* Staff Table */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="rounded-2xl border bg-white">
            <div className="flex justify-between px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-800">School Staff</h3>
              <button
                onClick={() => {
                  setShowModal(true);
                  setEditId(null);
                  setFormData({ name: "", post: "", contact: "", image: null });
                }}
                className="px-4 py-2 bg-brand-500 text-white rounded-lg"
              >
                + Add Staff
              </button>
            </div>

            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[900px]">
                <div className="grid grid-cols-11 border-t px-6 py-3">
                  <div className="col-span-3 font-medium text-gray-500">Name</div>
                  <div className="col-span-3 font-medium text-gray-500">Post</div>
                  <div className="col-span-2 font-medium text-gray-500">Contact</div>
                  <div className="col-span-1 font-medium text-gray-500 text-center">Status</div>
                  <div className="col-span-2 font-medium text-gray-500 text-center">Action</div>
                </div>

                {staffList.map((item) => (
                  <div key={item._id} className="grid grid-cols-11 border-t px-6 py-4 items-center">
                    <div className="col-span-3 flex items-center gap-2">
                      {item.image && (
                        <img
                          src={`${item.image}`}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <span>{item.name}</span>
                    </div>

                    <div className="col-span-3">{item.post}</div>
                    <div className="col-span-2">{item.contact}</div>

                    <div className="col-span-1 text-center">
                      <button
                        onClick={() => toggleStatus(item._id)}
                        className={`px-3 py-1 rounded text-white ${
                          item.isActive ? "bg-green-600" : "bg-gray-400"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </button>
                    </div>

                    <div className="col-span-2 flex justify-center gap-3">
                      <button onClick={() => handleEdit(item)} className="text-blue-500 hover:text-blue-700">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-700">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {staffList.length === 0 && (
                  <p className="text-center py-6 text-gray-400">No Staff added yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[420px] p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">{editId ? "Edit Staff" : "Add Staff"}</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Staff Name"
                required
                className="w-full border px-3 py-2 rounded-lg"
              />

              <input
                name="post"
                value={formData.post}
                onChange={handleChange}
                placeholder="Post"
                required
                className="w-full border px-3 py-2 rounded-lg"
              />

              <input
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Contact Number"
                required
                className="w-full border px-3 py-2 rounded-lg"
              />

              <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full" />

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">
                  Cancel
                </button>

                <button type="submit" className="px-4 py-2 bg-brand-500 text-white rounded-lg" disabled={loadingStaff}>
                  {loadingStaff ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Count Modal */}
      {showModalCount && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[400px] p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Update Student Count</h3>

            <form onSubmit={handleSubmitCount} className="space-y-4">
              <input
                type="number"
                min={0}
                name="girls"
                value={count.girls}
                onChange={handleChangeCount}
                placeholder="Girls Count"
                className="w-full border px-3 py-2 rounded-lg"
              />

              <input
                type="number"
                min={0}
                name="boys"
                value={count.boys}
                onChange={handleChangeCount}
                placeholder="Boys Count"
                className="w-full border px-3 py-2 rounded-lg"
              />

              <input
                type="number"
                min={0}
                name="totalTeacher"
                value={count.totalTeacher}
                onChange={handleChangeCount}
                placeholder="Total Teacher"
                className="w-full border px-3 py-2 rounded-lg"
              />

              <input
                type="text"
                name="contact"
                value={count.contact}
                onChange={handleChangeCount}
                placeholder="Contact Number"
                className="w-full border px-3 py-2 rounded-lg"
              />

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModalCount(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button type="submit" className="px-4 py-2 bg-brand-500 text-white rounded-lg" disabled={loadingCount}>
                  {loadingCount ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
