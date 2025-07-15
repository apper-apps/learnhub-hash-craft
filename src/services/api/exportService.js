import jsPDF from 'jspdf';
import 'jspdf-autotable';

const exportService = {
  // Helper function to format date
  formatDate: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  // Helper function to download file
  downloadFile: (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Export progress report as CSV
  exportProgressReportCSV: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
    
    const { assignments, courses, performance, metrics } = data;
    const timestamp = new Date().toISOString().split('T')[0];
    
    let csvContent = `Progress Report - Generated on ${exportService.formatDate(new Date())}\n\n`;
    
    // Summary metrics
    csvContent += `SUMMARY METRICS\n`;
    csvContent += `Current GPA,${metrics.gpa}\n`;
    csvContent += `Completion Rate,${metrics.completionRate}%\n`;
    csvContent += `Upcoming Deadlines,${metrics.upcomingDeadlines}\n`;
    csvContent += `Overdue Assignments,${metrics.overdue}\n\n`;
    
    // Course progress
    csvContent += `COURSE PROGRESS\n`;
    csvContent += `Course,Instructor,Credits,Status,Grade\n`;
    courses.forEach(course => {
      const courseAssignments = assignments.filter(a => a.courseId === course.Id);
      const completedCount = courseAssignments.filter(a => a.status === 'completed').length;
      const courseProgress = courseAssignments.length > 0 
        ? Math.round((completedCount / courseAssignments.length) * 100)
        : 0;
      
      csvContent += `"${course.title}","${course.instructor}",${course.credits},${courseProgress}%,${course.grade || 'N/A'}\n`;
    });
    
    csvContent += `\nASSIGNMENT DETAILS\n`;
    csvContent += `Assignment,Course,Due Date,Status,Grade,Type\n`;
    assignments.forEach(assignment => {
      const course = courses.find(c => c.Id === assignment.courseId);
      csvContent += `"${assignment.title}","${course ? course.title : 'Unknown'}","${exportService.formatDate(assignment.dueDate)}","${assignment.status}","${assignment.grade || 'N/A'}","${assignment.type}"\n`;
    });
    
    exportService.downloadFile(csvContent, `progress-report-${timestamp}.csv`, 'text/csv');
  },

  // Export progress report as PDF
  exportProgressReportPDF: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
    
    const { assignments, courses, performance, metrics } = data;
    const doc = new jsPDF();
    const timestamp = new Date().toISOString().split('T')[0];
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(91, 33, 182); // Primary color
    doc.text('LearnHub Progress Report', 20, 25);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on ${exportService.formatDate(new Date())}`, 20, 35);
    
    // Summary metrics
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Summary Metrics', 20, 50);
    
    const summaryData = [
      ['Current GPA', metrics.gpa],
      ['Completion Rate', `${metrics.completionRate}%`],
      ['Upcoming Deadlines', metrics.upcomingDeadlines],
      ['Overdue Assignments', metrics.overdue]
    ];
    
    doc.autoTable({
      startY: 55,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [91, 33, 182] },
      margin: { left: 20 }
    });
    
    // Course progress
    doc.setFontSize(16);
    doc.text('Course Progress', 20, doc.lastAutoTable.finalY + 20);
    
    const courseData = courses.map(course => {
      const courseAssignments = assignments.filter(a => a.courseId === course.Id);
      const completedCount = courseAssignments.filter(a => a.status === 'completed').length;
      const courseProgress = courseAssignments.length > 0 
        ? Math.round((completedCount / courseAssignments.length) * 100)
        : 0;
      
      return [
        course.title,
        course.instructor,
        course.credits,
        `${courseProgress}%`,
        course.grade || 'N/A'
      ];
    });
    
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 25,
      head: [['Course', 'Instructor', 'Credits', 'Progress', 'Grade']],
      body: courseData,
      theme: 'grid',
      headStyles: { fillColor: [91, 33, 182] },
      margin: { left: 20 }
    });
    
    // Recent assignments
    doc.setFontSize(16);
    doc.text('Recent Assignments', 20, doc.lastAutoTable.finalY + 20);
    
    const recentAssignments = assignments.slice(0, 10);
    const assignmentData = recentAssignments.map(assignment => {
      const course = courses.find(c => c.Id === assignment.courseId);
      return [
        assignment.title,
        course ? course.title : 'Unknown',
        exportService.formatDate(assignment.dueDate),
        assignment.status,
        assignment.grade || 'N/A'
      ];
    });
    
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 25,
      head: [['Assignment', 'Course', 'Due Date', 'Status', 'Grade']],
      body: assignmentData,
      theme: 'grid',
      headStyles: { fillColor: [91, 33, 182] },
      margin: { left: 20 }
    });
    
    doc.save(`progress-report-${timestamp}.pdf`);
  },

  // Export grade summary as CSV
  exportGradeSummaryCSV: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
    
    const { assignments, courses, metrics } = data;
    const timestamp = new Date().toISOString().split('T')[0];
    
    let csvContent = `Grade Summary - Generated on ${exportService.formatDate(new Date())}\n\n`;
    
    // Overall GPA
    csvContent += `OVERALL PERFORMANCE\n`;
    csvContent += `Current GPA,${metrics.gpa}\n`;
    csvContent += `Completion Rate,${metrics.completionRate}%\n\n`;
    
    // Course grades
    csvContent += `COURSE GRADES\n`;
    csvContent += `Course,Instructor,Credits,Current Grade,Letter Grade\n`;
    courses.forEach(course => {
      const courseAssignments = assignments.filter(a => a.courseId === course.Id && a.grade);
      const avgGrade = courseAssignments.length > 0 
        ? Math.round(courseAssignments.reduce((sum, a) => sum + a.grade, 0) / courseAssignments.length)
        : 0;
      
      const getLetterGrade = (grade) => {
        if (grade >= 90) return 'A';
        if (grade >= 80) return 'B';
        if (grade >= 70) return 'C';
        if (grade >= 60) return 'D';
        return 'F';
      };
      
      csvContent += `"${course.title}","${course.instructor}",${course.credits},${avgGrade}%,${getLetterGrade(avgGrade)}\n`;
    });
    
    // Assignment grades
    csvContent += `\nASSIGNMENT GRADES\n`;
    csvContent += `Assignment,Course,Type,Due Date,Grade,Status\n`;
    assignments
      .filter(a => a.grade)
      .forEach(assignment => {
        const course = courses.find(c => c.Id === assignment.courseId);
        csvContent += `"${assignment.title}","${course ? course.title : 'Unknown'}","${assignment.type}","${exportService.formatDate(assignment.dueDate)}","${assignment.grade}%","${assignment.status}"\n`;
      });
    
    exportService.downloadFile(csvContent, `grade-summary-${timestamp}.csv`, 'text/csv');
  },

  // Export grade summary as PDF
  exportGradeSummaryPDF: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
    
    const { assignments, courses, metrics } = data;
    const doc = new jsPDF();
    const timestamp = new Date().toISOString().split('T')[0];
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(91, 33, 182); // Primary color
    doc.text('LearnHub Grade Summary', 20, 25);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on ${exportService.formatDate(new Date())}`, 20, 35);
    
    // Overall performance
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Overall Performance', 20, 50);
    
    const overallData = [
      ['Current GPA', metrics.gpa],
      ['Completion Rate', `${metrics.completionRate}%`]
    ];
    
    doc.autoTable({
      startY: 55,
      head: [['Metric', 'Value']],
      body: overallData,
      theme: 'grid',
      headStyles: { fillColor: [91, 33, 182] },
      margin: { left: 20 }
    });
    
    // Course grades
    doc.setFontSize(16);
    doc.text('Course Grades', 20, doc.lastAutoTable.finalY + 20);
    
    const getLetterGrade = (grade) => {
      if (grade >= 90) return 'A';
      if (grade >= 80) return 'B';
      if (grade >= 70) return 'C';
      if (grade >= 60) return 'D';
      return 'F';
    };
    
    const courseGradeData = courses.map(course => {
      const courseAssignments = assignments.filter(a => a.courseId === course.Id && a.grade);
      const avgGrade = courseAssignments.length > 0 
        ? Math.round(courseAssignments.reduce((sum, a) => sum + a.grade, 0) / courseAssignments.length)
        : 0;
      
      return [
        course.title,
        course.instructor,
        course.credits,
        `${avgGrade}%`,
        getLetterGrade(avgGrade)
      ];
    });
    
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 25,
      head: [['Course', 'Instructor', 'Credits', 'Grade', 'Letter']],
      body: courseGradeData,
      theme: 'grid',
      headStyles: { fillColor: [91, 33, 182] },
      margin: { left: 20 }
    });
    
    // Assignment grades
    doc.setFontSize(16);
    doc.text('Assignment Grades', 20, doc.lastAutoTable.finalY + 20);
    
    const gradedAssignments = assignments.filter(a => a.grade);
    const assignmentGradeData = gradedAssignments.map(assignment => {
      const course = courses.find(c => c.Id === assignment.courseId);
      return [
        assignment.title,
        course ? course.title : 'Unknown',
        assignment.type,
        `${assignment.grade}%`,
        getLetterGrade(assignment.grade)
      ];
    });
    
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 25,
      head: [['Assignment', 'Course', 'Type', 'Grade', 'Letter']],
      body: assignmentGradeData,
      theme: 'grid',
      headStyles: { fillColor: [91, 33, 182] },
      margin: { left: 20 }
    });
    
    doc.save(`grade-summary-${timestamp}.pdf`);
  }
};

export default exportService;