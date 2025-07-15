import performanceData from "@/services/mockData/performance.json";

const performanceService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return [...performanceData];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const performance = performanceData.find(p => p.Id === parseInt(id));
    if (!performance) {
      throw new Error("Performance record not found");
    }
    return { ...performance };
  },

  getByCourse: async (courseId) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return performanceData.filter(p => p.courseId === courseId).map(p => ({ ...p }));
  },

  getByDateRange: async (startDate, endDate) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const start = new Date(startDate);
    const end = new Date(endDate);
    return performanceData.filter(p => {
      const date = new Date(p.date);
      return date >= start && date <= end;
    }).map(p => ({ ...p }));
  },

  create: async (performanceData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newPerformance = {
      ...performanceData,
      Id: Math.max(...performanceData.map(p => p.Id)) + 1
    };
    performanceData.push(newPerformance);
    return { ...newPerformance };
  },

  update: async (id, performanceData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = performanceData.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Performance record not found");
    }
    performanceData[index] = { ...performanceData[index], ...performanceData };
    return { ...performanceData[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = performanceData.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Performance record not found");
    }
    performanceData.splice(index, 1);
    return true;
  }
};

export default performanceService;