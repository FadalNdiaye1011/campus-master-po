export { HttpClient, ApiError } from './http-client';
export { ParentService } from './parent-service';
export { UserService } from './services/userService';
export { SemesterService } from './services/semesterService';
export { DepartmentService } from './services/departmentService';
export { ModuleService } from './services/moduleService';
export { MatiereService } from './services/matiereService';
export { StatisticsService } from './services/statisticsService';
export { TeacherCourseService } from './services/teacherCourseService';
export { TeacherAssignmentService } from './services/teacherAssignmentService';
export { TeacherStudentService } from './services/teacherStudentService';
export { TeacherAnnouncementService } from './services/teacherAnnouncementService';
export { StudentCourseService } from './services/studentCourseService';
export { StudentSubmissionService } from './services/studentSubmissionService';
export { TeacherSupportService } from './services/teacherSupportService';

export {
    API_CONFIG,
    API_CONFIGS,
    createApiConfig,
    getApiConfigFromEnv,
    getApiConfigForEnvironment,
} from './config';

export type { ApiEnvironment } from './config';

// Export types
export type {
    ApiConfig,
    ApiResponse,
} from './types';

export type {
    User,
    UserRole,
    UserStatus,
    CreateUserRequest,
    UpdateUserRequest,
    UserResponse,
    PaginatedResponse,
} from './types/user.types';

export type {
    Semester,
    CreateSemesterRequest,
    UpdateSemesterRequest,
} from './types/semester.types';



export type {
    Department,
    CreateDepartmentRequest,
    UpdateDepartmentRequest,
} from './types/department.types';




export type {
    Module,
    CreateModuleRequest,
    UpdateModuleRequest,
} from './types/module.types';




export type {
    Matiere,
    CreateMatiereRequest,
    UpdateMatiereRequest,
} from './types/matiere.types';




export type {
    Statistics,
} from './types/statistics.types';





export type {
    TeacherCourse,
    CreateTeacherCourseRequest,
    UpdateTeacherCourseRequest,
    CourseStats,
    CourseStudent,
    CourseAssignment,
    CourseSupport,
    CourseAnnouncement,
} from './types/teacher-course.types';




export type {
    TeacherAssignment,
    CreateAssignmentRequest,
    UpdateAssignmentRequest,
    AssignmentSubmission,
} from './types/teacher-assignment.types';



export type {
    TeacherStudent,
    StudentProgress,
} from './types/teacher-student.types';




export type {
    TeacherAnnouncement,
    CreateAnnouncementRequest,
    UpdateAnnouncementRequest,
    AnnouncementPriority,
} from './types/teacher-announcement.types';



export type {
    StudentCourse,
    StudentAssignment,
    CourseEnrollment,
} from './types/student-course.types';




export type {
    StudentSubmission,
    CreateSubmissionRequest,
    UpdateSubmissionRequest,
    FileUploadResponse,
} from './types/student-submission.types';


export type {
    TeacherSupport,
    CreateSupportRequest,
} from './types/teacher-support.types';