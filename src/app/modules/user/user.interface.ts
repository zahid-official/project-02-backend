// Interface for create patient
export interface CreatePatient {
  patient: {
    name: string;
    email: string;
    phone: string;
    gender: "MALE" | "FEMALE";
    address?: string;
    profilePhoto?: string;
  };
  password: string;
}
