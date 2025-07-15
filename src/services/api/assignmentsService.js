import assignmentsData from "@/services/mockData/assignments.json";

const assignmentsService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 350));
    return [...assignmentsData];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const assignment = assignmentsData.find(a => a.Id === parseInt(id));
    if (!assignment) {
      throw new Error("Assignment not found");
    }
    return { ...assignment };
  },

  getByCourse: async (courseId) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return assignmentsData.filter(a => a.courseId === courseId).map(a => ({ ...a }));
  },

  create: async (assignmentData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newAssignment = {
      ...assignmentData,
      Id: Math.max(...assignmentsData.map(a => a.Id)) + 1
    };
    assignmentsData.push(newAssignment);
    return { ...newAssignment };
  },

  update: async (id, assignmentData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = assignmentsData.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    assignmentsData[index] = { ...assignmentsData[index], ...assignmentData };
    return { ...assignmentsData[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = assignmentsData.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    assignmentsData.splice(index, 1);
    return true;
  }
};

export default assignmentsService;