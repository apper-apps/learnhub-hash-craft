import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const PerformanceChart = ({ data, title = "Performance Overview" }) => {
  const [chartType, setChartType] = useState("line");
  const [timeRange, setTimeRange] = useState("30d");

  const processData = () => {
    if (!data || data.length === 0) return { series: [], categories: [] };

    const filteredData = data.filter(item => {
      const itemDate = new Date(item.date);
      const now = new Date();
      const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
      const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      return itemDate >= cutoff;
    });

    const categories = filteredData.map(item => 
      new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    );

    const gradeData = filteredData.map(item => item.grade);
    const studyHoursData = filteredData.map(item => item.studyHours);

    return {
      series: [
        {
          name: "Grade",
          type: "line",
          data: gradeData
        },
        {
          name: "Study Hours",
          type: "column",
          data: studyHoursData
        }
      ],
      categories
    };
  };

  const chartData = processData();

  const options = {
    chart: {
      type: "line",
      height: 350,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    colors: ["#5B21B6", "#F59E0B"],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: "smooth",
      width: [3, 0]
    },
    title: {
      text: title,
      align: "left",
      style: {
        fontSize: "16px",
        fontWeight: 600,
        color: "#111827"
      }
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 5
    },
    markers: {
      size: 4,
      colors: ["#5B21B6"],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 7
      }
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px"
        }
      }
    },
    yaxis: [
      {
        title: {
          text: "Grade (%)",
          style: {
            color: "#5B21B6",
            fontSize: "12px",
            fontWeight: 500
          }
        },
        labels: {
          style: {
            colors: "#5B21B6",
            fontSize: "12px"
          }
        },
        min: 0,
        max: 100
      },
      {
        opposite: true,
        title: {
          text: "Study Hours",
          style: {
            color: "#F59E0B",
            fontSize: "12px",
            fontWeight: 500
          }
        },
        labels: {
          style: {
            colors: "#F59E0B",
            fontSize: "12px"
          }
        }
      }
    ],
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: -25,
      offsetX: -5
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: [
        {
          formatter: function (y) {
            return y + "%";
          }
        },
        {
          formatter: function (y) {
            return y + " hours";
          }
        }
      ]
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <Button
              size="sm"
              variant={timeRange === "7d" ? "primary" : "ghost"}
              onClick={() => setTimeRange("7d")}
              className="text-xs"
            >
              7D
            </Button>
            <Button
              size="sm"
              variant={timeRange === "30d" ? "primary" : "ghost"}
              onClick={() => setTimeRange("30d")}
              className="text-xs"
            >
              30D
            </Button>
            <Button
              size="sm"
              variant={timeRange === "90d" ? "primary" : "ghost"}
              onClick={() => setTimeRange("90d")}
              className="text-xs"
            >
              90D
            </Button>
          </div>
        </div>
      </div>

      {chartData.series.length > 0 ? (
        <Chart
          options={options}
          series={chartData.series}
          type="line"
          height={350}
        />
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <ApperIcon name="BarChart3" className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>No performance data available</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PerformanceChart;