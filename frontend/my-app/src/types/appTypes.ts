export interface ErrorResponse {
  error: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  emailStatus: string;
}

export interface MaliciousFormat {
  id: string;
  sourceEmail: string;
  sourcePhone: string;
  message: string;
  subject: string;
}
