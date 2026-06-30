import { useEffect, useState } from "react";
import API from "../../api/api";

export default function ManagementCommittee() {
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    mobile1: "",
    mobile2: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    occupation: "",
    occupationAddress: "",
    mobile1: "",
    mobile2: "",
    image: null as File | null,
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await API.get("/management-committee");
      setMembers(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const validateMobile = (mobile: string) => {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(mobile);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      designation: "",
      occupation: "",
      occupationAddress: "",
      mobile1: "",
      mobile2: "",
      image: null,
    });

    setErrors({
      mobile1: "",
      mobile2: "",
    });

    setEditId(null);
    setShowModal(false);
  };

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData({
        ...formData,
        image: files[0],
      });
      return;
    }

    if (name === "mobile1" || name === "mobile2") {
      const onlyNumbers = value.replace(/\D/g, "");

      if (onlyNumbers.length <= 10) {
        setFormData({
          ...formData,
          [name]: onlyNumbers,
        });

        setErrors({
          ...errors,
          [name]: "",
        });
      }
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    let newErrors = {
      mobile1: "",
      mobile2: "",
    };

    if (!validateMobile(formData.mobile1)) {
      newErrors.mobile1 = "Enter valid 10-digit mobile number";
    }

    if (formData.mobile2 && !validateMobile(formData.mobile2)) {
      newErrors.mobile2 = "Enter valid 10-digit mobile number";
    }

    if (newErrors.mobile1 || newErrors.mobile2) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("designation", formData.designation);
      data.append("occupation", formData.occupation);
      data.append("occupationAddress", formData.occupationAddress);
      data.append("mobile1", formData.mobile1);
      data.append("mobile2", formData.mobile2);

      if (formData.image) {
        data.append("image", formData.image);
      }

      if (editId) {
        await API.put(`/management-committee/${editId}`, data);
      } else {
        await API.post("/management-committee", data);
      }

      fetchMembers();
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
      name: item.name,
      designation: item.designation,
      occupation: item.occupation,
      occupationAddress: item.occupationAddress,
      mobile1: item.mobile1,
      mobile2: item.mobile2,
      image: null,
    });

    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete member?")) return;

    try {
      await API.delete(`/management-committee/${id}`);
      fetchMembers();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      await API.put(`/management-committee/toggle/${id}`);
      fetchMembers();
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
              <h3 className="text-lg font-semibold">Management Committee</h3>

              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="px-4 py-2 bg-brand-500 text-white rounded-lg"
              >
                + Add Member
              </button>
            </div>

            <div className="overflow-x-auto">
              <div className="w-full">
                <div className="grid grid-cols-12 border-t px-6 py-3 font-semibold">
                  <div className="col-span-1">Image</div>
                  <div className="col-span-2">Name</div>
                  <div className="col-span-2">Designation</div>
                  <div className="col-span-2">Occupation</div>
                  <div className="col-span-2">Mobile</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-2 text-center">Action</div>
                </div>

                {members.map((item: any) => (
                  <div
                    key={item._id}
                    className="grid grid-cols-12 border-t px-6 py-4 items-center"
                  >
                    <div className="col-span-1">
                      {item.image && (
                        <img
                          src={item.image}
                          alt=""
                          className="w-14 h-14 rounded-full object-cover"
                        />
                      )}
                    </div>

                    <div className="col-span-2">{item.name}</div>
                    <div className="col-span-2">{item.designation}</div>
                    <div className="col-span-2">{item.occupation}</div>
                    <div className="col-span-2">
                      <div>{item.mobile1}</div>
                      <div>{item.mobile2}</div>
                    </div>

                    <div className="col-span-1">
                      <button
                        onClick={() => toggleStatus(item._id)}
                        className={`px-3 py-1 rounded text-white text-sm ${
                          item.isActive ? "bg-green-600" : "bg-gray-500"
                        }`}
                      >
                        {item.isActive ? "On" : "Off"}
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

                {members.length === 0 && (
                  <div className="text-center py-6 text-gray-400">
                    No members found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-[700px] p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editId ? "Edit Member" : "Add Member"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="Designation"
                required
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                placeholder="Occupation"
                className="w-full border rounded-lg px-3 py-2"
              />

              <textarea
                name="occupationAddress"
                value={formData.occupationAddress}
                onChange={handleChange}
                placeholder="Occupation Address"
                className="w-full border rounded-lg px-3 py-2"
              />

              <div>
                <input
                  name="mobile1"
                  value={formData.mobile1}
                  onChange={handleChange}
                  placeholder="Mobile Number 1"
                  required
                  className={`w-full border rounded-lg px-3 py-2 ${
                    errors.mobile1 ? "border-red-500" : ""
                  }`}
                />
                {errors.mobile1 && (
                  <p className="text-red-500 text-sm mt-1">{errors.mobile1}</p>
                )}
              </div>

              <div>
                <input
                  name="mobile2"
                  value={formData.mobile2}
                  onChange={handleChange}
                  placeholder="Mobile Number 2"
                  className={`w-full border rounded-lg px-3 py-2 ${
                    errors.mobile2 ? "border-red-500" : ""
                  }`}
                />
                {errors.mobile2 && (
                  <p className="text-red-500 text-sm mt-1">{errors.mobile2}</p>
                )}
              </div>

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />

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