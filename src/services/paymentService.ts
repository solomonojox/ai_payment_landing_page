/*eslint-disable @typescript-eslint/no-explicit-any*/
import type { MakePaymentType, PaymentListType, PaymentType, RecordPaymentType } from "../types/paymentType";
import api from "./api";

export const PaymentService = {
    makePayment: async (data: {email: string}): Promise<any> => {
        const response = await api.post("/api/payments/collectPayment", data);
        return response.data;
    },

    recordPayment: async (data: RecordPaymentType): Promise<any> => {
        const response = await api.post("/api/payments/recordPayment", data);
        return response.data;
    },

    verifyPayment: async (reference: string): Promise<any> => {
        const response = await api.get(`/api/payments/training/verify/${reference}`);
        return response.data;
    },

    getAllPayments: async (filterParams?: string, params?: {
        $top?: number;
        $skip?: number;
        $count?: boolean;
        $filter?: string;
    }) => {
        const queryParams = new URLSearchParams();
        if (params && params.$top !== undefined) queryParams.append('$top', params.$top.toString());
        if (params && params.$skip !== undefined) queryParams.append('$skip', params.$skip.toString());
        if (params && params.$count !== undefined) queryParams.append('$count', params.$count.toString());
        if (params && params.$filter !== undefined) queryParams.append('$filter', params.$filter);

        // combine filterParams and queryParams

        if (filterParams) {
            const filterPairs = filterParams.split("&").filter(Boolean);
            for (const pair of filterPairs) {
                const [key, value] = pair.split("=");
                if (key && value) queryParams.append(key, value);
            }
        }
        // --- Construct final URL with all combined query params
        const finalUrl = `/api/bills/getAllPayments?${queryParams.toString()}`;

        const response = await api.get(finalUrl);
        return {
            payments: response.data.data,
            totalCount: response.data.totalCount
        };
    },

    getStudentPayments: async (studentId: string): Promise<PaymentType> => {
        const response = await api.get(`/api/payments/${studentId}`);
        return response.data;
    },

    downloadReceipt: async (paymentId: string) => {
        const response = await api.get(`/api/fees/receipt/${paymentId}`, {
            responseType: 'blob', // Important for file download
        });

        // Extract filename from header (fallback to default)
        let filename = "results_export";
        const disposition = response.headers["content-disposition"];
        if (disposition && disposition.includes("filename=")) {
            filename = disposition.split("filename=")[1].replace(/['"]/g, "");
        }

        // ✅ Preserve MIME type
        const mimeType = response.headers["content-type"] || "application/octet-stream";
        const blob = new Blob([response.data], { type: mimeType });

        // Create object URL and trigger download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
};