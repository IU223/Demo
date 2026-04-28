// src/app/models/employee.model.ts
export interface Employee {
  employee_id: string;
  name?: string;
  name_a?: string;
  area?: string;
  factory?: string;
  department?: string;
  status?: string;
  hire_date?: string;
  resin_date?: string;
  checked?: boolean;
}

export interface EmployeeFilter {
  startDate?: Date | null;
  endDate?: Date | null;
  area?: string;
  factory?: string;
  searchText?: string;
  skip?: number;
  limit?: number;
}

export interface EmployeeResponse {
  data: Employee[];
  total: number;
}

export interface SelectOption {
  value: string;
  label: string;
}
