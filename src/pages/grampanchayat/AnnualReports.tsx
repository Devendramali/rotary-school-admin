import { useEffect, useState } from "react";
import API from "../../api/api";

export default function AnnualReports() {
  const [reports, setReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    year: "",
    title: "Annual Report",
    classes: "Primary",
    classRange: "",
    desc: "",
    isLatest: false,
    pdf: null,
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await API.get("/annual-reports");
      setReports(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setFormData({
      year: "",
      title: "Annual Report",
      classes: "Primary",
      classRange: "",
      desc: "",
      isLatest: false,
      pdf: null,
    });

    setEditId(null);
    setShowModal(false);
  };

  const handleChange = (e: any) => {
    const { name, value, files, type, checked } = e.target;

    if (name === "pdf") {
      setFormData({
        ...formData,
        pdf: files[0],
      });
    } else if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      data.append("year", formData.year);
      data.append("title", formData.title);
      data.append("classes", formData.classes);
      data.append("classRange", formData.classRange);
      data.append("desc", formData.desc);
      data.append("isLatest", String(formData.isLatest));

      if (formData.pdf) {
        data.append("pdf", formData.pdf);
      }

      if (editId) {
        await API.put(`/annual-reports/${editId}`, data);
      } else {
        await API.post("/annual-reports", data);
      }

      fetchReports();
      resetForm();
    } catch (error) {
      console.log(error);
      alert("Save failed");
    }

    setLoading(false);
  };

  const handleEdit = (item: any) => {
    setEditId(item._id);

    setFormData({
      year: item.year,
      title: item.title,
      classes: item.classes,
      classRange: item.classRange,
      desc: item.desc,
      isLatest: item.isLatest,
      pdf: null,
    });

    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete report?")) return;

    try {
      await API.delete(`/annual-reports/${id}`);
      fetchReports();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      await API.put(`/annual-reports/toggle/${id}`);
      fetchReports();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="rounded-2xl border bg-white">
            <div className="flex justify-between px-6 py-4">
              <h3 className="text-lg font-semibold">Annual Reports</h3>

              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="px-4 py-2 bg-brand-500 text-white rounded-lg"
              >
                + Add Report
              </button>
            </div>

            <div className="overflow-x-auto">
              <div className="w-full">
                <div className="grid grid-cols-12 border-t px-6 py-3 font-semibold">
                  <div className="col-span-2">Year</div>
                  <div className="col-span-2">Classes</div>
                  <div className="col-span-2">Range</div>
                  <div className="col-span-2">Latest</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2 text-center">Action</div>
                </div>

                {reports.map((item: any) => (
                  <div
                    key={item._id}
                    className="grid grid-cols-12 border-t px-6 py-4 items-center"
                  >
                    <div className="col-span-2">{item.year}</div>
                    <div className="col-span-2">{item.classes}</div>
                    <div className="col-span-2">{item.classRange}</div>
                    <div className="col-span-2">
                      {item.isLatest ? "Yes" : "No"}
                    </div>

                    <div className="col-span-2">
                      <button
                        onClick={() => toggleStatus(item._id)}
                        className={`px-3 py-1 rounded text-white ${
                          item.isActive ? "bg-green-600" : "bg-gray-500"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </button>
                    </div>

                    <div className="col-span-2 flex justify-center gap-4">
                      <button
                        className="text-blue-500"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>

                      <button
                        className="text-red-500"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {reports.length === 0 && (
                  <div className="text-center py-6 text-gray-400">
                    No reports found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-[600px] rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editId ? "Edit Report" : "Add Report"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="Year (2024-25)"
                required
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />

              <select
                name="classes"
                value={formData.classes}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option>Primary</option>
                <option>Upper Primary</option>
                <option>Secondary</option>
              </select>

              <input
                name="classRange"
                value={formData.classRange}
                onChange={handleChange}
                placeholder="Class I - V"
                required
                className="w-full border rounded-lg px-3 py-2"
              />

              <textarea
                name="desc"
                value={formData.desc}
                onChange={handleChange}
                placeholder="Description"
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                type="file"
                name="pdf"
                accept=".pdf"
                onChange={handleChange}
              />

              <label className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  name="isLatest"
                  checked={formData.isLatest}
                  onChange={handleChange}
                />
                Mark as Latest
              </label>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
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