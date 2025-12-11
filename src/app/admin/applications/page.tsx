'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, MoreHorizontal, Trash2, ChevronDown, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import AdminFooter from '../components/AdminFooter';
import ApplicationDetailsModal from '../components/ApplicationDetailsModal';
import ConfirmationModal from '../components/ConfirmationModal';
import RejectReasonModal from '../components/RejectReasonModal';
import { adminService } from '../../../services/adminService';
import type { ArtistApplication, ApplicationStatus } from '../../../types/admin';

const ApplicationsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [applications, setApplications] = useState<ArtistApplication[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [statusFilter, setStatusFilter] = useState<ApplicationStatus>('PENDING');
    const itemsPerPage = 9;

    // Loading and error states
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Modal states
    const [selectedApplication, setSelectedApplication] = useState<ArtistApplication | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        type: 'approve' | 'decline' | 'delete';
        application: ArtistApplication | null;
    }>({ isOpen: false, type: 'approve', application: null });

    // Fetch applications from API
    const fetchApplications = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await adminService.getArtistApplications({
                status: statusFilter,
                page: currentPage,
                limit: itemsPerPage,
                sortBy: 'created_at',
                order: 'desc',
            });

            setApplications(response.data);
            setTotalPages(response.meta.totalPages);
            setTotalItems(response.meta.total);
        } catch (err) {
            console.error('Failed to fetch applications:', err);
            setError('Failed to load applications. Please try again.');
            setApplications([]);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, statusFilter, itemsPerPage]);

    // Fetch on mount and when filters change
    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    // Filter applications by search (client-side for current page)
    const filteredApplications = applications.filter(app =>
        app.stageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.users?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.users?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handlers
    const handleViewDetails = (app: ArtistApplication) => {
        setSelectedApplication(app);
        setIsDetailsModalOpen(true);
    };

    const handleDeleteClick = (app: ArtistApplication) => {
        setConfirmModal({ isOpen: true, type: 'delete', application: app });
    };

    const handleApproveFromDetails = () => {
        setConfirmModal({ isOpen: true, type: 'approve', application: selectedApplication });
    };

    const handleDeclineFromDetails = () => {
        // Open reject reason modal instead of directly confirming
        setIsRejectModalOpen(true);
    };

    const handleRejectWithReason = async (reason: string) => {
        if (!selectedApplication) return;

        setIsProcessing(true);
        try {
            await adminService.rejectApplication(selectedApplication.id, reason);
            // Remove from local state
            setApplications(prev => prev.filter(app => app.id !== selectedApplication.id));
            setIsRejectModalOpen(false);
            setIsDetailsModalOpen(false);
            setSelectedApplication(null);
        } catch (err) {
            console.error('Failed to reject application:', err);
            setError('Failed to reject application. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleConfirmAction = async () => {
        if (!confirmModal.application) return;

        setIsProcessing(true);
        try {
            if (confirmModal.type === 'approve') {
                await adminService.approveApplication(confirmModal.application.id);
                setApplications(prev => prev.filter(app => app.id !== confirmModal.application!.id));
            } else if (confirmModal.type === 'delete' || confirmModal.type === 'decline') {
                // For delete without reason, use a default message
                await adminService.rejectApplication(
                    confirmModal.application.id,
                    'Application deleted by admin'
                );
                setApplications(prev => prev.filter(app => app.id !== confirmModal.application!.id));
            }
        } catch (err) {
            console.error('Failed to process application:', err);
            setError('Failed to process application. Please try again.');
        } finally {
            setIsProcessing(false);
            setConfirmModal({ isOpen: false, type: 'approve', application: null });
            setIsDetailsModalOpen(false);
            setSelectedApplication(null);
        }
    };

    const getConfirmModalContent = () => {
        switch (confirmModal.type) {
            case 'approve':
                return {
                    title: 'Confirm Approval?',
                    message: 'An Artist profile will be created for the applicant and this artist application will be marked as approved.'
                };
            case 'decline':
                return {
                    title: 'Confirm Rejection?',
                    message: 'This artist application will be rejected.'
                };
            case 'delete':
                return {
                    title: 'Confirm Deletion?',
                    message: 'This artist application will be deleted.'
                };
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    return (
        <div style={pageContainerStyle}>
            {/* Search Bar and Status Filter */}
            <div style={topBarStyle}>
                <div style={searchContainerStyle}>
                    <Search size={18} style={{ color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        placeholder="Find Application"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={searchInputStyle}
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value as ApplicationStatus);
                        setCurrentPage(1);
                    }}
                    style={selectStyle}
                >
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                </select>
            </div>

            {/* Title */}
            <h1 style={titleStyle}>
                Artist Applications
                {totalItems > 0 && <span style={countStyle}>({totalItems})</span>}
            </h1>

            {/* Error Message */}
            {error && (
                <div style={errorStyle}>
                    {error}
                    <button onClick={fetchApplications} style={retryButtonStyle}>
                        Retry
                    </button>
                </div>
            )}

            {/* Data Grid */}
            <div style={dataGridContainerStyle}>
                {/* Header Row */}
                <div style={headerRowStyle}>
                    <div style={{ ...headerCellStyle, flex: 1 }}>
                        UserId <ChevronDown size={14} style={{ marginLeft: '4px' }} />
                    </div>
                    <div style={{ ...headerCellStyle, flex: 1.5 }}>
                        Created At <ChevronDown size={14} style={{ marginLeft: '4px' }} />
                    </div>
                    <div style={{ ...headerCellStyle, flex: 1.5 }}>
                        Stage Name <ChevronDown size={14} style={{ marginLeft: '4px' }} />
                    </div>
                    <div style={{ ...headerCellStyle, flex: 1.5 }}>
                        User Name <ChevronDown size={14} style={{ marginLeft: '4px' }} />
                    </div>
                    <div style={{ ...headerCellStyle, width: '80px' }}></div>
                </div>

                {/* Data Rows Container */}
                <div style={dataRowsContainerStyle}>
                    {isLoading ? (
                        <div style={loadingStyle}>
                            <Loader2 size={32} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                            <p>Loading applications...</p>
                        </div>
                    ) : filteredApplications.length === 0 ? (
                        <div style={emptyStyle}>
                            <p>No applications found</p>
                        </div>
                    ) : (
                        filteredApplications.map((app) => (
                            <div key={app.id} style={dataRowStyle}>
                                <div style={{ ...cellStyle, flex: 1 }}>{app.userId}</div>
                                <div style={{ ...cellStyle, flex: 1.5 }}>{formatDate(app.createdAt)}</div>
                                <div style={{ ...cellStyle, flex: 1.5 }}>{app.stageName}</div>
                                <div style={{ ...cellStyle, flex: 1.5 }}>{app.users?.name || '-'}</div>
                                <div style={{ ...cellStyle, width: '80px', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                    <button
                                        style={iconButtonStyle}
                                        onClick={() => handleViewDetails(app)}
                                        title="View Details"
                                    >
                                        <MoreHorizontal size={16} />
                                    </button>
                                    {statusFilter === 'PENDING' && (
                                        <button
                                            style={{ ...iconButtonStyle, color: 'var(--warning)' }}
                                            onClick={() => handleDeleteClick(app)}
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                <div style={paginationStyle}>
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1 || isLoading}
                        style={paginationButtonStyle}
                    >
                        <ChevronLeft size={16} />
                    </button>

                    <span style={pageNumberStyle}>{currentPage}</span>

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages || isLoading}
                        style={paginationButtonStyle}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Footer */}
            <AdminFooter />

            {/* Application Details Modal */}
            <ApplicationDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                application={selectedApplication}
                onApprove={handleApproveFromDetails}
                onDecline={handleDeclineFromDetails}
                showActions={statusFilter === 'PENDING'}
            />

            {/* Reject Reason Modal */}
            <RejectReasonModal
                isOpen={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                onSubmit={handleRejectWithReason}
                isProcessing={isProcessing}
            />

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, type: 'approve', application: null })}
                onConfirm={handleConfirmAction}
                title={getConfirmModalContent().title}
                message={getConfirmModalContent().message}
                type="warning"
                isLoading={isProcessing}
            />
        </div>
    );
};

// Styles
const pageContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
};

const topBarStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap'
};

const searchContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: '0.75rem 1rem',
    borderRadius: '2rem',
    maxWidth: '300px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
};

const searchInputStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    width: '100%'
};

const selectStyle: React.CSSProperties = {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.5rem',
    padding: '0.75rem 1rem',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    cursor: 'pointer',
    outline: 'none'
};

const titleStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
};

const countStyle: React.CSSProperties = {
    fontSize: '1rem',
    fontWeight: 400,
    color: 'var(--text-secondary)'
};

const errorStyle: React.CSSProperties = {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '0.5rem',
    padding: '1rem',
    color: '#ef4444',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const retryButtonStyle: React.CSSProperties = {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '0.25rem',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    fontSize: '0.875rem'
};

const dataGridContainerStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    height: '500px',
    display: 'flex',
    flexDirection: 'column'
};

const headerRowStyle: React.CSSProperties = {
    display: 'flex',
    padding: '1rem 1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
};

const headerCellStyle: React.CSSProperties = {
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
};

const dataRowStyle: React.CSSProperties = {
    display: 'flex',
    padding: '0.75rem 1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    alignItems: 'center'
};

const cellStyle: React.CSSProperties = {
    color: 'var(--text-primary)',
    fontSize: '0.875rem'
};

const iconButtonStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    padding: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transition: 'color 0.2s ease'
};

const dataRowsContainerStyle: React.CSSProperties = {
    flex: 1,
    overflow: 'auto'
};

const loadingStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: '1rem',
    color: 'var(--text-secondary)'
};

const emptyStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: 'var(--text-secondary)'
};

const paginationStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem',
    marginTop: 'auto'
};

const paginationButtonStyle: React.CSSProperties = {
    background: 'transparent',
    border: '1px solid var(--secondary)',
    borderRadius: '4px',
    padding: '4px 8px',
    cursor: 'pointer',
    color: 'var(--secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const pageNumberStyle: React.CSSProperties = {
    color: 'var(--secondary)',
    fontSize: '0.875rem',
    minWidth: '24px',
    textAlign: 'center',
    border: '1px solid var(--secondary)',
    padding: '4px 8px',
    borderRadius: '4px'
};

// Add CSS animation for spinner
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
if (typeof document !== 'undefined' && !document.getElementById('spinner-styles')) {
    styleSheet.id = 'spinner-styles';
    document.head.appendChild(styleSheet);
}

export default ApplicationsPage;
