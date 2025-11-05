import { Gender } from "@prisma/client";

// Interface for create admin
export interface IAdmin {
  name: string;
  email: string;
  gender: Gender;
  phone: string;
  address?: string;
  profilePhoto?: string;
}
