/**
 * Admin Service
 * Handles all admin-related API calls: artist applications, reports, user management
 */

import { ENDPOINTS } from '../config/api';
import { apiClient } from '../lib/apiClient';
import type {
    ArtistApplication,
    ArtistApplicationsResponse,
    ArtistApplicationFilter,
    ProcessApplicationResponse,
    Report,
    ReportsResponse,
    AdminUser,
    SearchAccountsResponse,
} from '../types/admin';

export const adminService = {
    // ==================== Artist Applications ====================

    /**
     * Fetch artist applications with optional filters
     */
    async getArtistApplications(filter: ArtistApplicationFilter = {}): Promise<ArtistApplicationsResponse> {
        const params: Record<string, string | number | boolean | undefined> = {
            status: filter.status || 'PENDING',
            page: filter.page || 1,
            limit: filter.limit || 10,
            sortBy: filter.sortBy,
            order: filter.order,
        };

        return apiClient.get<ArtistApplicationsResponse>(ENDPOINTS.admin.artistApplications, { params });
    },

    /**
     * Get a single application by ID
     */
    async getApplicationById(id: number): Promise<ArtistApplication> {
        // Note: If backend doesn't have a single-application endpoint,
        // we can filter from the list or add this endpoint later
        const response = await this.getArtistApplications({ limit: 100 });
        const application = response.data.find(app => app.id === id);
        if (!application) {
            throw new Error('Application not found');
        }
        return application;
    },

    /**
     * Approve an artist application
     */
    async approveApplication(id: number): Promise<ProcessApplicationResponse> {
        return apiClient.patch<ProcessApplicationResponse>(
            ENDPOINTS.admin.processApplication(String(id)),
            { action: 'APPROVE' }
        );
    },

    /**
     * Reject an artist application with reason
     */
    async rejectApplication(id: number, rejectionReason: string): Promise<ProcessApplicationResponse> {
        return apiClient.patch<ProcessApplicationResponse>(
            ENDPOINTS.admin.processApplication(String(id)),
            {
                action: 'REJECT',
                rejectionReason
            }
        );
    },

    // ==================== Reports ====================

    /**
     * Fetch reports with optional filters
     */
    async getReports(filter: {
        status?: string;
        type?: string;
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
    } = {}): Promise<ReportsResponse> {
        const params: Record<string, string | number | boolean | undefined> = {
            status: filter.status,
            type: filter.type,
            startDate: filter.startDate,
            endDate: filter.endDate,
            page: filter.page || 1,
            limit: filter.limit || 10,
        };

        return apiClient.get<ReportsResponse>(ENDPOINTS.admin.reports, { params });
    },

    /**
     * Resolve a report
     */
    async resolveReport(id: number, resolutionNotes: string): Promise<{ message: string; report: Report }> {
        return apiClient.patch<{ message: string; report: Report }>(
            ENDPOINTS.admin.reportResolve(String(id)),
            { resolutionNotes }
        );
    },

    // ==================== User Management ====================

    /**
     * Search accounts
     */
    async searchAccounts(query: string, page: number = 1, limit: number = 10): Promise<SearchAccountsResponse> {
        return apiClient.get<SearchAccountsResponse>(ENDPOINTS.admin.searchAccounts, {
            params: { query, page, limit }
        });
    },

    /**
     * Assign role to user
     */
    async assignRole(userId: number, newRole: 'USER' | 'ARTIST' | 'ADMIN'): Promise<{ message: string; user: AdminUser }> {
        return apiClient.post<{ message: string; user: AdminUser }>(ENDPOINTS.admin.assignRole, {
            userId,
            newRole
        });
    },

    /**
     * Delete account
     */
    async deleteAccount(userId: number): Promise<{ message: string }> {
        return apiClient.delete<{ message: string }>(ENDPOINTS.admin.deleteAccount(String(userId)), {
            // Note: Backend requires confirm: true in body, but DELETE typically doesn't have body
            // This might need adjustment based on actual backend implementation
        });
    },

    /**
     * Get user details
     */
    async getUserDetails(userId: number): Promise<AdminUser> {
        return apiClient.get<AdminUser>(ENDPOINTS.admin.userDetails(String(userId)));
    },

    // ==================== Music Management ====================

    /**
     * Delete music track
     */
    async deleteMusic(trackId: number): Promise<void> {
        await apiClient.delete(ENDPOINTS.admin.musicById(String(trackId)));
    },
};

export default adminService;
