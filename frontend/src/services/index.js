import api from './api';

export const authService = {
  login: async (credentials) => {
    const payload = {
      usernameOrEmail: credentials.usernameOrEmail || credentials.identifier || credentials.email || credentials.rollNumber || credentials.teacherId || credentials.phone,
      password: credentials.password
    };
    const response = await api.post('/auth/login', payload);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export const markService = {
  getExams: async () => {
    const response = await api.get('/marks/exams');
    return response.data;
  },
  createExam: async (data) => {
    const response = await api.post('/marks/exams', data);
    return response.data;
  },
  saveBatchMarks: async (data) => {
    const response = await api.post('/marks/batch', data);
    return response.data;
  },
  getStudentReportCard: async (studentId) => {
    const response = await api.get(`/marks/student/${studentId}`);
    return response.data;
  },
  getClassSubjectMarks: async (classId, subjectId, examId) => {
    const response = await api.get(`/marks/class/${classId}/subject/${subjectId}/exam/${examId}`);
    return response.data;
  }
};

export const feeService = {
  getStudentInvoices: async (studentId) => {
    const response = await api.get(`/fees/student/${studentId}`);
    return response.data;
  },
  processPayment: async (data) => {
    const response = await api.post('/fees/pay', data);
    return response.data;
  },
  getReceipt: async (paymentId) => {
    const response = await api.get(`/fees/receipt/${paymentId}`);
    return response.data;
  },
  getReceiptByNumber: async (receiptNumber) => {
    const response = await api.get(`/fees/receipt/number/${receiptNumber}`);
    return response.data;
  },
  getFeeSummary: async () => {
    const response = await api.get('/fees/summary');
    return response.data;
  },
  createInvoice: async (data) => {
    const response = await api.post('/fees/invoices', data);
    return response.data;
  }
};

export const adminAccountService = {
  createAccount: async (data) => {
    const response = await api.post('/admin/accounts', data);
    return response.data;
  },
  getAccountsByRole: async (role) => {
    const response = await api.get(`/admin/accounts/role/${role}`);
    return response.data;
  },
  updateStatus: async (userId, status) => {
    const response = await api.put(`/admin/accounts/${userId}/status`, { status });
    return response.data;
  },
  resetPassword: async (userId, newPassword) => {
    const response = await api.put(`/admin/accounts/${userId}/reset-password`, { newPassword });
    return response.data;
  },
  linkStudentParent: async (studentId, parentId) => {
    const response = await api.post('/admin/accounts/link-student-parent', null, { params: { studentId, parentId } });
    return response.data;
  },
  assignSubjectTeacher: async (teacherProfileId, classId, subjectId) => {
    const response = await api.post('/admin/accounts/assign-subject-teacher', null, { params: { teacherProfileId, classId, subjectId } });
    return response.data;
  },
  assignClassTeacher: async (classId, teacherProfileId) => {
    const response = await api.post('/admin/accounts/assign-class-teacher', null, { params: { classId, teacherProfileId } });
    return response.data;
  }
};

export const attendanceService = {
  markBulkAttendance: async (data) => {
    const response = await api.post('/attendance', data);
    return response.data;
  },
  getAttendance: async (params) => {
    const response = await api.get('/attendance', { params });
    return response.data;
  },
  getStudentAttendanceStats: async (studentId) => {
    const response = await api.get(`/attendance/student/${studentId}`);
    return response.data;
  },
  getStudentAbsences: async (studentId) => {
    const response = await api.get(`/students/${studentId}/absences`);
    return response.data;
  },
  getClassSummary: async (classId, date) => {
    const response = await api.get(`/attendance/class/${classId}/summary`, { params: { date } });
    return response.data;
  }
};

export const leaveService = {
  getLeaveTypes: async () => {
    const response = await api.get('/leaves/types');
    return response.data;
  },
  applyLeave: async (data) => {
    const response = await api.post('/leaves', data);
    return response.data;
  },
  getLeaves: async (params) => {
    const response = await api.get('/leaves', { params });
    return response.data;
  },
  getLeaveById: async (id) => {
    const response = await api.get(`/leaves/${id}`);
    return response.data;
  },
  parentVerify: async (id, data) => {
    const response = await api.put(`/leaves/${id}/parent-verify`, data);
    return response.data;
  },
  teacherVerify: async (id, data) => {
    const response = await api.put(`/leaves/${id}/teacher-verify`, data);
    return response.data;
  },
  coordinatorVerify: async (id, data) => {
    const response = await api.put(`/leaves/${id}/coordinator-verify`, data);
    return response.data;
  }
};

export const newsService = {
  getAllNews: async (category) => {
    const response = await api.get('/news', { params: { category } });
    return response.data;
  },
  getNewsById: async (id) => {
    const response = await api.get(`/news/${id}`);
    return response.data;
  },
  createNews: async (data) => {
    const response = await api.post('/news', data);
    return response.data;
  },
  updateNews: async (id, data) => {
    const response = await api.put(`/news/${id}`, data);
    return response.data;
  },
  deleteNews: async (id) => {
    const response = await api.delete(`/news/${id}`);
    return response.data;
  }
};

export const homeworkService = {
  createHomework: async (data) => {
    const response = await api.post('/homework', data);
    return response.data;
  },
  getHomeworkForClass: async (classId, studentId) => {
    const response = await api.get(`/homework/class/${classId}`, { params: { studentId } });
    return response.data;
  },
  getHomeworkForTeacher: async (teacherId) => {
    const response = await api.get(`/homework/teacher/${teacherId}`);
    return response.data;
  },
  getStudentDigitalDiary: async (studentId) => {
    const response = await api.get(`/homework/student/${studentId}`);
    return response.data;
  },
  updateCompletionStatus: async (homeworkId, studentId, data) => {
    const response = await api.put(`/homework/${homeworkId}/student/${studentId}/status`, data);
    return response.data;
  },
  deleteHomework: async (id) => {
    const response = await api.delete(`/homework/${id}`);
    return response.data;
  }
};

export const studentService = {
  getAllStudents: async (params) => {
    const response = await api.get('/students', { params });
    return response.data;
  },
  getStudentById: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },
  createStudent: async (data) => {
    const response = await api.post('/students', data);
    return response.data;
  },
  updateStudent: async (id, data) => {
    const response = await api.put(`/students/${id}`, data);
    return response.data;
  },
  deleteStudent: async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  }
};

export const teacherService = {
  getAllTeachers: async (role) => {
    const response = await api.get('/teachers', { params: { role } });
    return response.data;
  },
  createCoordinator: async (data) => {
    const response = await api.post('/teachers/coordinators', data);
    return response.data;
  },
  createClassTeacher: async (data) => {
    const response = await api.post('/teachers/class-teachers', data);
    return response.data;
  },
  createSubjectTeacher: async (data) => {
    const response = await api.post('/teachers/subject-teachers', data);
    return response.data;
  },
  assignSubjectTeacher: async (teacherId, classId, subjectId) => {
    const response = await api.post(`/teachers/${teacherId}/assign`, null, { params: { classId, subjectId } });
    return response.data;
  }
};

export const classService = {
  getAllClasses: async (params) => {
    const response = await api.get('/classes', { params });
    return response.data;
  },
  getClassById: async (id) => {
    const response = await api.get(`/classes/${id}`);
    return response.data;
  },
  getClassByClassTeacherId: async (teacherId) => {
    const response = await api.get(`/classes/teacher/${teacherId}`);
    return response.data;
  },
  createClass: async (data) => {
    const response = await api.post('/classes', data);
    return response.data;
  },
  updateClass: async (id, data) => {
    const response = await api.put(`/classes/${id}`, data);
    return response.data;
  },
  deleteClass: async (id) => {
    const response = await api.delete(`/classes/${id}`);
    return response.data;
  },
  getAllSubjects: async () => {
    const response = await api.get('/classes/subjects');
    return response.data;
  },
  getSubjectsByClassId: async (classId) => {
    const response = await api.get(`/classes/${classId}/subjects`);
    return response.data;
  },
  createSubject: async (data) => {
    const response = await api.post('/classes/subjects', data);
    return response.data;
  }
};

export const notificationService = {
  getNotifications: async (unreadOnly = false) => {
    const response = await api.get('/notifications', { params: { unreadOnly } });
    return response.data;
  },
  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  }
};

export const reportService = {
  getAttendanceReport: async (params) => {
    const response = await api.get('/reports/attendance', { params });
    return response.data;
  },
  getDashboardStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
  getAuditLogs: async () => {
    const response = await api.get('/audit-logs');
    return response.data;
  }
};

export const timetableService = {
  getTimetableForClass: async (classId) => {
    const response = await api.get(`/timetable/class/${classId}`);
    return response.data;
  },
  getWeeklyScheduleForClass: async (classId) => {
    const response = await api.get(`/timetable/class/${classId}/weekly`);
    return response.data;
  },
  getTimetableForTeacher: async (teacherId) => {
    const response = await api.get(`/timetable/teacher/${teacherId}`);
    return response.data;
  },
  getWeeklyScheduleForTeacher: async (teacherId) => {
    const response = await api.get(`/timetable/teacher/${teacherId}/weekly`);
    return response.data;
  },
  createSlot: async (slotData) => {
    const response = await api.post('/timetable', slotData);
    return response.data;
  },
  deleteSlot: async (slotId) => {
    const response = await api.delete(`/timetable/${slotId}`);
    return response.data;
  }
};

export const calendarEventService = {
  getAllEvents: async (eventType = 'ALL') => {
    const response = await api.get('/events', { params: { eventType } });
    return response.data;
  },
  getUpcomingEvents: async () => {
    const response = await api.get('/events/upcoming');
    return response.data;
  },
  getEventsRange: async (start, end) => {
    const response = await api.get('/events/range', { params: { start, end } });
    return response.data;
  },
  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },
  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  }
};

export const aiService = {
  getInsights: async (classId) => {
    const response = await api.get('/ai/insights', { params: { classId } });
    return response.data;
  },
  getStudentPrediction: async (studentId) => {
    const response = await api.get(`/ai/predict/student/${studentId}`);
    return response.data;
  },
  getAllPredictions: async (classId) => {
    const response = await api.get('/ai/predict/students', { params: { classId } });
    return response.data;
  },
  getStudentReport: async (studentId) => {
    const response = await api.get(`/ai/report/student/${studentId}`);
    return response.data;
  },
  chatWithAi: async (chatRequest) => {
    const response = await api.post('/ai/chat', chatRequest);
    return response.data;
  },
  getClusters: async (classId) => {
    const response = await api.get('/ai/clusters', { params: { classId } });
    return response.data;
  },
  getLeaveAnomalies: async (classId) => {
    const response = await api.get('/ai/leave-anomalies', { params: { classId } });
    return response.data;
  }
};