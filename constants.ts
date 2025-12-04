import { Branch, FollowUpStatus, Customer } from './types';

// Mock Users for Login Simulation
export const MOCK_USERS = [
  { email: 'siam@clinic.com', password: '123', name: 'Sales Siam', branch: Branch.Siam },
  { email: 'thonglor@clinic.com', password: '123', name: 'Sales Thonglor', branch: Branch.Thonglor },
  { email: 'ari@clinic.com', password: '123', name: 'Sales Ari', branch: Branch.Ari },
  { email: 'admin@clinic.com', password: '123', name: 'Super Admin', branch: Branch.All },
  // Requested User
  { email: 'chayangkul.n@gmail.com', password: '1234', name: 'คุณ ชยางกูร (Admin)', branch: Branch.All },
];

// Initial Mock Data to populate "Sheet" if empty
export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'คุณ สมชาย ใจดี',
    phone: '081-234-5678',
    branch: Branch.Siam,
    lastTreatment: 'Laser Toning',
    serviceDate: '2023-10-15',
    status: FollowUpStatus.Pending,
    notes: ''
  },
  {
    id: '2',
    name: 'คุณ วีระศักดิ์ รักสวย',
    phone: '089-987-6543',
    branch: Branch.Siam,
    lastTreatment: 'Botox Full Face',
    serviceDate: '2023-10-10',
    status: FollowUpStatus.Contacted,
    notes: 'สนใจโปรโมชั่นเดือนหน้า'
  },
  {
    id: '3',
    name: 'คุณ แอนนา สวยเสมอ',
    phone: '090-111-2222',
    branch: Branch.Thonglor,
    lastTreatment: 'Ultraformer III',
    serviceDate: '2023-10-18',
    status: FollowUpStatus.Pending,
    notes: ''
  },
  {
    id: '4',
    name: 'คุณ ปีเตอร์ แพท',
    phone: '085-555-5555',
    branch: Branch.Ari,
    lastTreatment: 'Vitamin Drip',
    serviceDate: '2023-10-20',
    status: FollowUpStatus.Booked,
    notes: 'จองคิวซ้ำแล้ว'
  },
  {
    id: '5',
    name: 'คุณ มานี มีตา',
    phone: '086-666-7777',
    branch: Branch.Siam,
    lastTreatment: 'Acne Clear',
    serviceDate: '2023-10-01',
    status: FollowUpStatus.NotInterested,
    notes: 'ย้ายบ้าน'
  }
];

export const STATUS_COLORS = {
  [FollowUpStatus.Pending]: '#F59E0B', // Amber
  [FollowUpStatus.Contacted]: '#3B82F6', // Blue
  [FollowUpStatus.Booked]: '#10B981', // Green
  [FollowUpStatus.NotInterested]: '#EF4444', // Red
};