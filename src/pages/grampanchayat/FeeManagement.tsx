import { useEffect, useState } from "react";
import API from "../../api/api";

export default function FeeManagement() {
  const [fees, setFees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    std: "",
    admFormFee: "",
    totalFees: "",
    firstInstallment: "",
    secondInstallment: "",
    concessionBoys: "",
    concessionGirls: "",
    oneTimeBoys: "",
    oneTimeGirls: "",
    year: "2025-26",
    pdf: null,
  });

  const fetchFees = async () => {
    try {
      const res = await API.get("/fees");
      setFees(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "pdf") {
      setFormData({ ...formData, pdf: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const openModal = () => {
    setEditId(null);
    setFormData({
      std: "",
      admFormFee: "",
      totalFees: "",
      firstInstallment: "",
      secondInstallment: "",
      concessionBoys: "",
      concessionGirls: "",
      oneTimeBoys: "",
      oneTimeGirls: "",
      year: "2025-26",
      pdf: null,
    });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({
      ...item,
      pdf: null,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key !== "pdf") data.append(key, formData[key]);
      });

      if (formData.pdf) {
        data.append("pdf", formData.pdf);
      }

      if (editId) {
        await API.put(`/fees/${editId}`, data);
      } else {
        await API.post("/fees", data);
      }

      fetchFees();
      setShowModal(false);
    } catch (err) {
      console.log(err);
      alert("Save failed");
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete fee row?")) return;

    try {
      await API.delete(`/fees/${id}`);
      fetchFees();
    } catch {
      alert("Delete failed");
    }
  };

  const toggleStatus = async (id) => {
    try {
      await API.put(`/fees/toggle/${id}`);
      fetchFees();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="rounded-2xl border bg-white">
        <div className="flex justify-between px-6 py-4">
          <h2 className="text-xl font-bold">Fee Management</h2>

          <button
            onClick={openModal}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg"
          >
            + Add Fee
          </button>
        </div>

        <div className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                {/* <th className="p-3">Sr</th> */}
                <th className="py-4">STD</th>
                <th className="py-4">Admission Fee</th>
                <th className="py-4">Total</th>
                <th className="py-4">1st Installment</th>
                <th className="py-4">2nd Installment</th>
                <th className="py-4">Concession Boys</th>
                <th className="py-4">Concession Girls</th>
                <th className="py-4">One Time Boys</th>
                <th className="py-4">One Time Girls</th>
                <th className="py-4">PDF</th>
                <th className="py-4">Status</th>
                <th className="py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {fees.map((item) => (
                <tr key={item._id} className="border-b text-center">
                  {/* <td className="p-3">{item.}</td> */}
                  <td className="py-4">{item.std}</td>
                  <td className="py-4">{item.admFormFee}</td>
                  <td className="py-4">{item.totalFees}</td>
                  <td className="py-4">{item.firstInstallment}</td>
                  <td className="py-4">{item.secondInstallment}</td>
                  <td className="py-4">{item.concessionBoys}</td>
                  <td className="py-4">{item.concessionGirls}</td>
                  <td className="py-4">{item.oneTimeBoys}</td>
                  <td className="py-4">{item.oneTimeGirls}</td>

                  <td className="py-4">
                    {item.pdf ? (
                      <a
                        href={item.pdf}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600"
                      >
                        View
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="py-4">
                    <button
                      onClick={() => toggleStatus(item._id)}
                      className={`px-3 py-1 rounded text-white ${
                        item.isActive ? "bg-green-500" : "bg-gray-500"
                      }`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>

                  <td className="py-4">
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
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-auto py-10">
          <div className="bg-white w-[800px] rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">
              {editId ? "Edit Fee" : "Add Fee"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                {/* <input name="srNo" value={srNo} onChange={handleChange} placeholder="Sr No" className="border p-2 rounded" required /> */}
                <input name="std" value={formData.std} onChange={handleChange} placeholder="STD" className="border p-2 rounded" required />
                <input name="admFormFee" value={formData.admFormFee} onChange={handleChange} placeholder="Admission Fee" className="border p-2 rounded" required />
                <input name="totalFees" value={formData.totalFees} onChange={handleChange} placeholder="Total Fees" className="border p-2 rounded" required />
                <input name="firstInstallment" value={formData.firstInstallment} onChange={handleChange} placeholder="1st Installment" className="border p-2 rounded" required />
                <input name="secondInstallment" value={formData.secondInstallment} onChange={handleChange} placeholder="2nd Installment" className="border p-2 rounded" required />
                <input name="concessionBoys" value={formData.concessionBoys} onChange={handleChange} placeholder="Concession Boys" className="border p-2 rounded" />
                <input name="concessionGirls" value={formData.concessionGirls} onChange={handleChange} placeholder="Concession Girls" className="border p-2 rounded" />
                <input name="oneTimeBoys" value={formData.oneTimeBoys} onChange={handleChange} placeholder="One Time Boys" className="border p-2 rounded" />
                <input name="oneTimeGirls" value={formData.oneTimeGirls} onChange={handleChange} placeholder="One Time Girls" className="border p-2 rounded" />
                <input name="year" value={formData.year} onChange={handleChange} placeholder="Year" className="border p-2 rounded" />
                <input type="file" name="pdf" accept="application/pdf" onChange={handleChange} className="border p-2 rounded" />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-brand-500 text-white rounded"
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