import { Gender } from "@prisma/client";

// Interface for create doctor
export interface IDoctor {
  name: string;
  email: string;
  gender: Gender;
  phone: string;
  address?: string;
  profilePhoto?: string;
  registrationNumber: string;
  appointmentFee: number;
  experience?: number;
  qualification: string;
  designation: string;
  currentWorkingPlace: string;
}

export interface IUpdateDoctor {
  name: string;
  email: string;
  gender: Gender;
  phone: string;
  address?: string;
  profilePhoto?: string;
  registrationNumber: string;
  appointmentFee: number;
  experience?: number;
  qualification: string;
  designation: string;
  currentWorkingPlace: string;
  isDeleted: boolean;
  specialties: {
    specialtiesId: string;
    isDeleted: boolean;
  }[];
}
