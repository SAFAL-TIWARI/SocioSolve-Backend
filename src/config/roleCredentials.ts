import { UserRole } from '../types/index.js';

export interface RoleCredential {
  role: UserRole;
  email: string;
  password: string;
  alternativePasswords?: string[];
  name: string;
  district: string;
  designation?: string;
  departmentName?: string;
  institutionName?: string;
  isVerified: boolean;
}

// Configured role accounts. Kept in backend now, easily overridden with .env variables later.
export const ROLE_ACCOUNTS: Record<UserRole, RoleCredential> = {
  citizen: {
    role: 'citizen',
    email: process.env.ROLE_CITIZEN_EMAIL || 'citizen@jharkhand.gov.in',
    password: process.env.ROLE_CITIZEN_PASSWORD || 'Password@2026',
    alternativePasswords: ['Citizen@2026', 'password', 'Password@2026'],
    name: 'Pooja Kumari',
    district: 'Ranchi',
    designation: 'Civic Resident & Community Validator',
    isVerified: true,
  },
  government: {
    role: 'government',
    email: process.env.ROLE_GOVERNMENT_EMAIL || 'officer@jharkhand.gov.in',
    password: process.env.ROLE_GOVERNMENT_PASSWORD || 'Password@2026',
    alternativePasswords: ['Officer@2026', 'password', 'Password@2026'],
    name: 'Dr. Rajeshwar Prasad',
    district: 'Ranchi',
    designation: 'District Nodal Officer (DW&S Dept)',
    departmentName: 'Drinking Water & Sanitation Department',
    isVerified: true,
  },
  university: {
    role: 'university',
    email: process.env.ROLE_UNIVERSITY_EMAIL || 'faculty@bitmesra.ac.in',
    password: process.env.ROLE_UNIVERSITY_PASSWORD || 'Password@2026',
    alternativePasswords: ['Faculty@2026', 'password', 'Password@2026'],
    name: 'Prof. A. K. Sinha',
    district: 'Ranchi',
    designation: 'Dean of Research & Innovation',
    institutionName: 'Birla Institute of Technology, Mesra',
    isVerified: true,
  },
  student: {
    role: 'student',
    email: process.env.ROLE_STUDENT_EMAIL || 'student@bitmesra.ac.in',
    password: process.env.ROLE_STUDENT_PASSWORD || 'Password@2026',
    alternativePasswords: ['Student@2026', 'password', 'Password@2026'],
    name: 'Rohit Verma',
    district: 'Ranchi',
    designation: 'Student Innovator (B.Tech ECE)',
    institutionName: 'Birla Institute of Technology, Mesra',
    isVerified: true,
  },
  industry: {
    role: 'industry',
    email: process.env.ROLE_INDUSTRY_EMAIL || 'csr@tatasteel.com',
    password: process.env.ROLE_INDUSTRY_PASSWORD || 'Password@2026',
    alternativePasswords: ['Industry@2026', 'password', 'Password@2026'],
    name: 'Anita Sen',
    district: 'East Singhbhum',
    designation: 'Director of CSR & Community Grants',
    institutionName: 'Tata Steel Foundation',
    isVerified: true,
  },
  admin: {
    role: 'admin',
    email: process.env.ROLE_ADMIN_EMAIL || 'admin@jharkhand.gov.in',
    password: process.env.ROLE_ADMIN_PASSWORD || 'Password@2026',
    alternativePasswords: ['Admin@2026', 'password', 'Password@2026'],
    name: 'State IT Secretary & Chief Secretary Admin',
    district: 'Ranchi',
    designation: 'State Platform Administrator & Chief Secretary Office',
    departmentName: 'Department of Information Technology & e-Gov',
    isVerified: true,
  },
};

export const findRoleAccountByEmail = (email: string): RoleCredential | undefined => {
  const normalized = email.trim().toLowerCase();
  return Object.values(ROLE_ACCOUNTS).find(
    (acc) => acc.email.toLowerCase() === normalized
  );
};
