export interface MakePaymentType {
  billId: string | null;
  amount: number | null;
}

export interface RecordPaymentType {
  billId: string;
  studentId: string;
  amount: number;
  method: string;
  reference: string
}

export interface PaymentType {
  billId: string;
  studentId: string;
  amount: number;
  method: string;
  reference: string;
  receiptUrl?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentListType {
  _id: string;
  billId: {
    _id: string;
    totalAmount: number;
    amountPaid: number;
    balance: number;
    status: string;
  };
  studentId: {
    _id: string;
    fullName: string;
    regNumber: string;
  };
  amount: number;
  method: string;
  reference: string;
  paystackUrl: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialOverviewType {
  outstanding: number;
  collected: number;
  totalExpected: number;
}