import { UserRole } from '@charmbooking/common';

export interface SalonAdminPayload {
  id: string;
  adminId: string;
  email: string;
  role: UserRole.SalonAdmin;
}

export interface CustomerPayload {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole.Customer;
}

export interface SuperAdminPayload {
  username: string;
  role: UserRole.SuperAdmin;
}
