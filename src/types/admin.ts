/**
 * Admin Types
 * Type definitions for admin module API responses
 */

// Artist Application Status
export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// Artist Application from backend
export interface ArtistApplication {
    id: number;
    userId: number;
    stageName: string;
    bio?: string;
    photoUrl?: string;
    socialLinks?: string;
    status: ApplicationStatus;
    rejectionReason?: string;
    createdAt: string;
    updatedAt?: string;
    // Nested user data from API
    users?: {
        id: number;
        name: string;
        email: string;
        createdAt: string;
    };
}

// API Response types
export interface ArtistApplicationsResponse {
    data: ArtistApplication[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface ProcessApplicationResponse {
    message: string;
}

// Filter params for fetching applications
export interface ArtistApplicationFilter {
    status?: ApplicationStatus;
    page?: number;
    limit?: number;
    sortBy?: 'created_at' | 'stage_name';
    order?: 'asc' | 'desc';
}

// Report types
export type ReportStatus = 'PENDING' | 'RESOLVED';
export type ReportType = 'MUSIC' | 'USER' | 'ARTIST' | 'OTHER';

export interface Report {
    id: number;
    reporterId: number;
    reportedUserId?: number;
    musicId?: number;
    artistId?: number;
    reportType: ReportType;
    reason: string;
    description?: string;
    status: ReportStatus;
    resolutionNotes?: string;
    reportDate: string;
    // Nested data
    reporterUser?: {
        id: number;
        name: string;
        email: string;
    };
    reportedUser?: {
        id: number;
        name: string;
        email: string;
    };
    music?: {
        id: number;
        title: string;
    };
    artistProfile?: {
        id: number;
        stageName: string;
    };
}

export interface ReportsResponse {
    data: Report[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// User/Account types for admin
export interface AdminUser {
    id: number;
    email: string;
    name: string;
    role: 'USER' | 'ARTIST' | 'ADMIN';
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    artistProfiles?: {
        id: number;
        stageName: string;
        status: 'ACTIVE' | 'INACTIVE';
    };
}

export interface SearchAccountsResponse {
    data: AdminUser[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
