import { Gender } from "@prisma/client";

// Interface for create patient
export interface IPatient {
  name: string;
  email: string;
  phone: string;
  gender: Gender;
  address?: string;
  profilePhoto?: string;
}
