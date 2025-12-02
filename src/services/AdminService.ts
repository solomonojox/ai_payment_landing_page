import type { UserEditType, UserType } from '../types/userType';
import api from "./api";

export const AdminService = {
    getAll: async (): Promise<UserType[]> => {
        try {
            const response = await api.get("/api/Admin/getAll");

            return response.data;
        } catch (error) {
            console.log(error);
            throw error
        }
    },

    create: async (data: Omit<UserEditType, "id">): Promise<UserEditType> => {
        const response = await api.post("/api/Admin/register", data);
        return response.data;
    },

    update: async (id: string, data: UserEditType): Promise<UserEditType> => {
        const response = await api.put(`/api/Admin/update/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/admin/api/AdminUser/${id}`);
    },
};