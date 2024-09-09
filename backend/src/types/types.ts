import { Request, Response } from "express";

export interface RequestWithUser extends Request {
  user?: { userId: string }; // Adjust the type according to your needs
}

export interface ContactData {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
}
