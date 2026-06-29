import { useEffect, useState } from "react";
import API from "../../api/api";

const classList = [
  "Class I",
  "Class II",
  "Class III",
  "Class IV",
  "Class V",
  "Class VI",
  "Class VII",
  "Class VIII",
  "Class IX",
  "Class X",
];

export default function StudentStrength() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    totalStudents: "",
    girlsStudents: "",
    qualifiedTeachers: "",
    classStrength: classList.map((cls) => ({
      className: cls,
      students: "",
    })),
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await API.get("/student-strength");

      if (res.data.data) {
        const data = res.data.data;

        const updatedClassList = classList.map((cls) => {
          const found = data.classStrength.find(
            (item: any) => item.className === cls
          );

          return {
            className: cls,
            students: found ? found.students : "",
          };
        });

        setFormData({
          totalStudents: data.totalStudents || "",
          girlsStudents: data.girlsStudents || "",
          qualifiedTeachers: data.qualifiedTeachers || "",
          classStrength: updatedClassList,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClassChange = (index: number, value: string) => {
    const updated = [...formData.classStrength];
    updated[index].students = value;

    setFormData({
      ...formData,
      classStrength: updated,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/student-strength", formData);
      alert("Saved successfully");
    } catch (error) {
      console.log(error);
      alert("Save failed");
    }

    setLoading(false);
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <div className="rounded-2xl border bg-white p-6">
          <div className="flex justify-between mb-6">
            <h3 className="text-xl font-semibold">Student Strength</h3>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Top Cards Inputs */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div>
                <label>Total Students</label>
                <input
                  type="number"
                  name="totalStudents"
                  value={formData.totalStudents}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 mt-2"
                />
              </div>

              <div>
                <label>Girls Students</label>
                <input
                  type="number"
                  name="girlsStudents"
                  value={formData.girlsStudents}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 mt-2"
                />
              </div>

              <div>
                <label>Qualified Teachers</label>
                <input
                  type="number"
                  name="qualifiedTeachers"
                  value={formData.qualifiedTeachers}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 mt-2"
                />
              </div>
            </div>

            {/* Class Strength */}
            <div className="rounded-xl border p-6">
              <h4 className="text-lg font-semibold mb-5">
                Class Wise Student Strength
              </h4>

              <div className="grid grid-cols-2 gap-4">
                {formData.classStrength.map((item, index) => (
                  <div key={item.className}>
                    <label>{item.className}</label>
                    <input
                      type="number"
                      value={item.students}
                      onChange={(e) =>
                        handleClassChange(index, e.target.value)
                      }
                      className="w-full border rounded-lg px-3 py-2 mt-2"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-brand-500 text-white rounded-lg"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}