export interface UserData {
  id?: string;
  role?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  schoolName?: string;
  currentSession: {
    _id: string;
    academicSession: string;
    term: string;
    startDate: string;
    endDate: string;
  };
  profilePic?: string;
  studentClass?: {
    _id: string;
    className: string;
    level: string;
    section: string;
  };
  isVerified?: boolean;
  isPrincipal?: boolean;
  isFinancialOfficer?: boolean;
  schoolAccountStatus?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  login: (token: string) => void;
  logout: () => void;
}