'use client';

import React, { useState } from 'react';
import { Search, MoreHorizontal, Trash2, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminFooter from '../components/AdminFooter';
import ApplicationDetailsModal from '../components/ApplicationDetailsModal';
import ConfirmationModal from '../components/ConfirmationModal';

// Types
interface Application {
    id: string;
    userId: string;
    createdAt: string;
    stageName: string;
    socialLink: string;
    name?: string;
}

// Mock data
const mockApplications: Application[] = [
    { id: '1', userId: '123', createdAt: '01/01/2020', stageName: 'Connor', socialLink: 'SocialLink...', name: 'Pharrell Williams' },
    { id: '2', userId: '123', createdAt: '01/01/2020', stageName: 'Connor', socialLink: 'SocialLink...' },
    { id: '3', userId: '123', createdAt: '01/01/2020', stageName: 'Connor', socialLink: 'SocialLink...' },
    { id: '4', userId: '123', createdAt: '01/01/2020', stageName: 'Connor', socialLink: 'SocialLink...' },
    { id: '5', userId: '123', createdAt: '01/01/2020', stageName: 'Connor', socialLink: 'SocialLink...' },
    { id: '6', userId: '123', createdAt: '01/01/2020', stageName: 'Connor', socialLink: 'SocialLink...' },
    { id: '7', userId: '123', createdAt: '01/01/2020', stageName: 'Connor', socialLink: 'SocialLink...' },
    { id: '8', userId: '123', createdAt: '01/01/2020', stageName: 'Connor', socialLink: 'SocialLink...' },
    { id: '9', userId: '123', createdAt: '01/01/2020', stageName: 'Connor', socialLink: 'SocialLink...' },
    { id: '10', userId: '123', createdAt: '01/01/2020', stageName: 'Connor', socialLink: 'SocialLink...' },
];

const ApplicationsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [applications, setApplications] = useState(mockApplications);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // Modal states
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        type: 'approve' | 'decline' | 'delete';
        application: Application | null;
    }>({ isOpen: false, type: 'approve', application: null });

    // Pagination
    const totalPages = Math.ceil(applications.length / itemsPerPage);
    const paginatedApplications = applications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Filter applications by search
    const filteredApplications = paginatedApplications.filter(app =>
        app.stageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.userId.includes(searchQuery)
    );

    // Handlers
    const handleViewDetails = (app: Application) => {
        setSelectedApplication(app);
        setIsDetailsModalOpen(true);
    };

    const handleDeleteClick = (app: Application) => {
        setConfirmModal({ isOpen: true, type: 'delete', application: app });
    };

    const handleApproveFromDetails = () => {
        setConfirmModal({ isOpen: true, type: 'approve', application: selectedApplication });
    };

    const handleDeclineFromDetails = () => {
        setConfirmModal({ isOpen: true, type: 'decline', application: selectedApplication });
    };

    const handleConfirmAction = () => {
        if (!confirmModal.application) return;

        // Handle the action based on type
        if (confirmModal.type === 'delete' || confirmModal.type === 'decline') {
            setApplications(prev => prev.filter(app => app.id !== confirmModal.application!.id));
        } else if (confirmModal.type === 'approve') {
            // In real app, this would create an artist profile
            setApplications(prev => prev.filter(app => app.id !== confirmModal.application!.id));
        }

        setConfirmModal({ isOpen: false, type: 'approve', application: null });
        setIsDetailsModalOpen(false);
        setSelectedApplication(null);
    };

    const getConfirmModalContent = () => {
        switch (confirmModal.type) {
            case 'approve':
                return {
                    title: 'Confirm Approval?',
                    message: 'An Artist profile will be created for the applicant and this artist application will be deleted.'
                };
            case 'decline':
                return {
                    title: 'Confirm Rejection?',
                    message: 'This artist application will be deleted.'
                };
            case 'delete':
                return {
                    title: 'Confirm Deletion?',
                    message: 'This artist application will be deleted.'
                };
        }
    };

    return (
        <div style={pageContainerStyle}>
            {/* Search Bar */}
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

            {/* Title */}
            <h1 style={titleStyle}>Artist Applications</h1>

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
                    <div style={{ ...headerCellStyle, flex: 1 }}>
                        Socials <ChevronDown size={14} style={{ marginLeft: '4px' }} />
                    </div>
                    <div style={{ ...headerCellStyle, width: '80px' }}></div>
                </div>

                {/* Data Rows Container */}
                <div style={dataRowsContainerStyle}>
                    {filteredApplications.map((app) => (
                        <div key={app.id} style={dataRowStyle}>
                            <div style={{ ...cellStyle, flex: 1 }}>{app.userId}</div>
                            <div style={{ ...cellStyle, flex: 1.5 }}>{app.createdAt}</div>
                            <div style={{ ...cellStyle, flex: 1.5 }}>{app.stageName}</div>
                            <div style={{ ...cellStyle, flex: 1 }}>{app.socialLink}</div>
                            <div style={{ ...cellStyle, width: '80px', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button
                                    style={iconButtonStyle}
                                    onClick={() => handleViewDetails(app)}
                                    title="View Details"
                                >
                                    <MoreHorizontal size={16} />
                                </button>
                                <button
                                    style={{ ...iconButtonStyle, color: 'var(--warning)' }}
                                    onClick={() => handleDeleteClick(app)}
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div style={paginationStyle}>
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        style={paginationButtonStyle}
                    >
                        <ChevronLeft size={16} />
                    </button>

                    <span style={pageNumberStyle}>{currentPage}</span>

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
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
            />

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, type: 'approve', application: null })}
                onConfirm={handleConfirmAction}
                title={getConfirmModalContent().title}
                message={getConfirmModalContent().message}
                type="warning"
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

const titleStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: 0
};

const dataGridContainerStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    height: '500px', // Fixed height to fit 10 items
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

export default ApplicationsPage;
