import type { Role } from "../user";

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  phone: string;
  role: Role;
}

export interface UpdateUserDto {
  firstName: string;
  lastName: string;
  phone: string;
  role: Role;
}
