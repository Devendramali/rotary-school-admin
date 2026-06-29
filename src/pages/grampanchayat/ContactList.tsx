import { useState, useEffect } from "react";
import API from "../../api/api"; // Axios instance

export default function ContactList() {
  const [contact, setcontact] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);



  // Fetch contact from backend
const fetchcontact = async () => {
  try {
    const res = await API.get("/contacts");
    setcontact(res.data);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  fetchcontact();
}, []);

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="rounded-2xl border border-gray-200 bg-white">
            {/* Header */}
            <div className="flex justify-between px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-800">
               Inquiry  List
              </h3>

            
            </div>

            {/* Table */}
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[900px]">
                {/* Header */}
                <div className="grid grid-cols-11 border-t px-6 py-3">
                  <div className="col-span-1 font-medium text-gray-500">No.</div>
                  <div className="col-span-3 font-medium text-gray-500">Name</div>
                  <div className="col-span-2 font-medium text-gray-500">Contact</div>
                  <div className="col-span-3 font-medium text-gray-500">Message</div>
                  <div className="col-span-2 font-medium text-gray-500 text-center">Action</div>
                </div>

                {/* Rows */}
           
                  {contact.map((item, index) => (
                <div key={item._id} className="grid grid-cols-11 border-t px-6 py-4 items-center">
                     <div className="col-span-1 font-medium">
                    {index +1}
                    </div>


                    <div className="col-span-3 font-medium">
                    {item.name}
                    </div>

                    <div className="col-span-2">
                    {item.phone}
                    </div>

                    <div className="col-span-3 text-gray-600">
                    {item.message}
                    </div>

                    <div className="col-span-2 flex justify-center">
                    <select
                        value={item.status}
                        disabled={item.status === "Completed"}
                        onChange={async (e) => {
                        await API.put(`/contacts/${item._id}/status`, {
                            status: e.target.value
                        });
                        fetchcontact();
                        }}
                        className={`border px-2 py-1 rounded ${
                        item.status === "Completed" ? "bg-gray-200 cursor-not-allowed" : ""
                        }`}
                    >
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                    </select>
                    </div>

                </div>
                ))}

              

                {contact.length === 0 && (
                  <p className="text-center py-6 text-gray-400">No contact added yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

     
    </>
  );
}
