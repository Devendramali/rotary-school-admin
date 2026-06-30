import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import API from "../../api/api";

export default function MonthlyTarget() {
  const [formData, setFormData] = useState({
    totalStudents: 0,
    girlsStudents: 0,
    qualifiedTeachers: 0,
  });

  const [series, setSeries] = useState([0]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await API.get("/student-strength");

      if (res.data.data) {
        const data = res.data.data;

        const total = Number(data.totalStudents || 0);
        const girls = Number(data.girlsStudents || 0);
        const teachers = Number(data.qualifiedTeachers || 0);
        const boys = total - girls;

        // Percentage of girls in total students
        const percentage = total > 0 ? ((girls / total) * 100).toFixed(2) : 0;

        setFormData({
          totalStudents: total,
          girlsStudents: girls,
          qualifiedTeachers: teachers,
        });

        setSeries([Number(percentage)]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const boysStudents =
    formData.totalStudents - formData.girlsStudents;

  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: function (val) {
              return val + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#465FFF"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Rotary English School
            </h3>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              Girls Student Ratio
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="max-h-[330px]" id="chartDarkStyle">
            <Chart
              options={options}
              series={series}
              type="radialBar"
              height={330}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs sm:text-sm">
            Girls Students
          </p>
          <p className="text-center text-base font-semibold text-gray-800 sm:text-lg">
            {formData.girlsStudents}
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs sm:text-sm">
            Boys Students
          </p>
          <p className="text-center text-base font-semibold text-gray-800 sm:text-lg">
           {
  Number(formData.totalStudents) - Number(formData.girlsStudents)
}
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs sm:text-sm">
            Total Teachers
          </p>
          <p className="text-center text-base font-semibold text-gray-800 sm:text-lg">
            {formData.qualifiedTeachers}
          </p>
        </div>
      </div>
    </div>
  );
}