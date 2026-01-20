
import { Project, ProjectStatus, ProjectType } from './types';

// TODO: Thay thế chuỗi rỗng bên dưới bằng URL từ Google Apps Script Web App của bạn
// Ví dụ: "https://script.google.com/macros/s/AKfycbx.../exec"
export const GOOGLE_SCRIPT_URL = ""; 

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    year: 2026,
    code: 'TA2026',
    description: 'Tech Awards 2026',
    type: ProjectType.ANNUAL,
    department: 'Công nghệ',
    status: ProjectStatus.IN_PROGRESS,
    phase: 'Thiết kế Landing Page',
    quarter: 1,
    techHandoff: '2026-03-15',
    releaseDate: '2026-04-01',
    pm: 'HieuNT',
    designer: 'AnhTH',
    po: 'MinhLQ',
    kpi: '10M Traffic',
    dashboardUrl: 'https://bi.vnexpress.net/ta2026',
    notes: 'Ưu tiên trải nghiệm mobile.'
  }
];

export const DEPARTMENTS = [
  'Sản phẩm', 'Công nghệ', 'Xe', 'Thể thao', 'Giáo dục', 
  'Pháp luật', 'Kinh doanh', 'Đời sống', 'Du lịch', 'Số hóa'
];

export const PRODUCT_MANAGERS = [
  'NgocDT', 
  'HieuNT', 
  'AnhTH'
];

export const TECH_TEAM = [
  'TrangNT', 
  'NhuanTP', 
  'LinhNTN', 
  'NgocNV', 
  'BinhVH', 
  'VietLX', 
  'ThaoPP'
];

// Extracted from Sheet Data observed (UX/UI Column)
export const DESIGNERS = [
  'SonLH', 'TrungTD', 'TungTD', 'DatNH', 'NamNH', 'SonVN'
];

// Combined list for general dropdowns
export const TEAM_MEMBERS = [
  ...PRODUCT_MANAGERS,
  ...TECH_TEAM,
  ...DESIGNERS,
  'Chị Thanh Vân', 'Anh Minh Kha', 'Chị Thanh Hải', 'Anh Lê' // Common POs/Requesters
];

// Specific Profile Data
export const MEMBER_PROFILES: Record<string, {
  fullName: string;
  dob: string;
  department: string;
  position: string;
  email: string;
  startDate: string;
  avatar?: string;
}> = {
  'TungTD': {
    fullName: 'Trần Duy Tùng',
    dob: '08/10/1992',
    department: 'Phòng Sản phẩm - VnExpress',
    position: 'UI Designer',
    email: 'tungtd10@fpt.com.vn',
    startDate: '16/10/2017',
    // Using a placeholder that resembles a professional profile or the uploaded image context if available
    avatar: 'https://ui-avatars.com/api/?name=Tran+Duy+Tung&background=1e1e1e&color=fff&size=512' 
  }
};

// Legacy exports
export const PMS = PRODUCT_MANAGERS;
