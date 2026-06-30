import { useEffect, useState } from "react";
import API from "../../api/api";

import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [videoData, setVideoData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    video: null as File | null,
  });

  useEffect(() => {
    fetchVideo();
  }, []);

  const fetchVideo = async () => {
    try {
      const res = await API.get("/video");
      if (res.data.data) {
        setVideoData(res.data.data);
        setFormData((prev) => ({
          ...prev,
          title: res.data.data.title || "",
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;

    if (name === "video") {
      setFormData({
        ...formData,
        video: files[0],
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!formData.video) {
      alert("Please select video");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("video", formData.video);

      await API.post("/video", data);

      fetchVideo();
      setShowModal(false);

      setFormData({
        title: "",
        video: null,
      });
    } catch (error) {
      console.log(error);
      alert("Upload failed");
    }

    setLoading(false);
  };

  return (
    <>
      <PageMeta
        title="Rotary English School"
        description="Rotary English School"
      />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />
          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5 space-y-6">
          <MonthlyTarget />

          {/* Video Card */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">School Video</h3>

              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-brand-500 text-white rounded-lg"
              >
                {videoData ? "Update Video" : "Upload Video"}
              </button>
            </div>

            {videoData?.video ? (
              <div>
                <p className="mb-3 font-medium">{videoData.title}</p>

                <video
                  controls
                  className="w-full rounded-lg"
                  src={videoData.video}
                />
              </div>
            ) : (
              <div className="text-gray-400 text-center py-8">
                No video uploaded
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-[600px] p-6">
            <h3 className="text-lg font-semibold mb-4">
              {videoData ? "Update Video" : "Upload Video"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Video Title"
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                type="file"
                name="video"
                accept="video/*"
                onChange={handleChange}
                required
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-brand-500 text-white rounded-lg"
                >
                  {loading ? "Uploading..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}