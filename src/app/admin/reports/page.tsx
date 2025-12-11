'use client';

import React, { useState } from 'react';
import { Search, MoreHorizontal, Check, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminFooter from '../components/AdminFooter';
import ReportDetailsModal from '../components/ReportDetailsModal';
import ConfirmationModal from '../components/ConfirmationModal';

// Types
interface Report {
    id: string;
    reporterId: string;
    createdAt: string;
    type: string;
    status: string;
    targetId: string;
    reason: string;
    description: string;
}

// Mock data
const mockReports: Report[] = [
    { id: '1', reporterId: '123', createdAt: '01/01/2020', type: 'Music', status: 'Pending', targetId: '456', reason: 'Lorem ipsum', description: 'Lorem ipsum...' },
    { id: '2', reporterId: '123', createdAt: '01/01/2020', type: 'User', status: 'Pending', targetId: '456', reason: 'Lorem ipsum', description: 'Lorem ipsum...' },
    { id: '3', reporterId: '123', createdAt: '01/01/2020', type: 'Comment', status: 'Pending', targetId: '456', reason: 'Lorem ipsum', description: 'Lorem ipsum...' },
    { id: '4', reporterId: '123', createdAt: '01/01/2020', type: 'Playlist', status: 'Pending', targetId: '456', reason: 'Lorem ipsum', description: 'Lorem ipsum...' },
    { id: '5', reporterId: '123', createdAt: '01/01/2020', type: 'Playlist', status: 'Pending', targetId: '456', reason: 'Lorem ipsum', description: 'Lorem ipsum...' },
    { id: '6', reporterId: '123', createdAt: '01/01/2020', type: 'Playlist', status: 'Pending', targetId: '456', reason: 'Lorem ipsum', description: 'Lorem ipsum...' },
    { id: '7', reporterId: '123', createdAt: '01/01/2020', type: 'Playlist', status: 'Pending', targetId: '456', reason: 'Lorem ipsum', description: 'Lorem ipsum...' },
    { id: '8', reporterId: '123', createdAt: '01/01/2020', type: 'Playlist', status: 'Pending', targetId: '456', reason: 'Lorem ipsum', description: 'Lorem ipsum...' },
    { id: '9', reporterId: '123', createdAt: '01/01/2020', type: 'Playlist', status: 'Pending', targetId: '456', reason: 'Lorem ipsum', description: 'Lorem ipsum...' },
    { id: '10', reporterId: '123', createdAt: '01/01/2020', type: 'Playlist', status: 'Pending', targetId: '456', reason: 'Lorem ipsum', description: 'Lorem ipsum...' },
];

const ReportsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [reports, setReports] = useState(mockReports);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // Modal states
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    // Pagination
    const totalPages = Math.ceil(reports.length / itemsPerPage);
    const paginatedReports = reports.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Filter reports by search
    const filteredReports = paginatedReports.filter(report =>
        report.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.reporterId.includes(searchQuery)
    );

    // Handlers
    const handleViewDetails = (report: Report) => {
        setSelectedReport(report);
        setIsDetailsModalOpen(true);
    };

    const handleResolveClick = (report: Report) => {
        setSelectedReport(report);
        setIsConfirmModalOpen(true);
    };

    const handleMarkResolvedFromDetails = () => {
        // Keep details modal open, show confirm modal
        setIsConfirmModalOpen(true);
    };

    const handleConfirmResolve = () => {
        if (selectedReport) {
            setReports(prev => prev.filter(r => r.id !== selectedReport.id));
        }
        // Close all modals
        setIsConfirmModalOpen(false);
        setIsDetailsModalOpen(false);
        setSelectedReport(null);
    };

    return (
        <div style={pageContainerStyle}>
            {/* Search Bar */}
            <div style={searchContainerStyle}>
                <Search size={18} style={{ color: 'var(--text-secondary)' }} />
                <input
                    type="text"
                    placeholder="Find Report"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={searchInputStyle}
                />
            </div>

            {/* Title */}
            <h1 style={titleStyle}>User Reports</h1>

            {/* Data Grid */}
            <div style={dataGridContainerStyle}>
                {/* Header Row */}
                <div style={headerRowStyle}>
                    <div style={{ ...headerCellStyle, flex: 1 }}>
                        ReporterId <ChevronDown size={14} style={{ marginLeft: '4px' }} />
                    </div>
                    <div style={{ ...headerCellStyle, flex: 1.5 }}>
                        Created At <ChevronDown size={14} style={{ marginLeft: '4px' }} />
                    </div>
                    <div style={{ ...headerCellStyle, flex: 1 }}>
                        Type <ChevronDown size={14} style={{ marginLeft: '4px' }} />
                    </div>
                    <div style={{ ...headerCellStyle, flex: 1 }}>
                        Status <ChevronDown size={14} style={{ marginLeft: '4px' }} />
                    </div>
                    <div style={{ ...headerCellStyle, width: '80px' }}></div>
                </div>

                {/* Data Rows Container */}
                <div style={dataRowsContainerStyle}>
                    {filteredReports.map((report) => (
                        <div key={report.id} style={dataRowStyle}>
                            <div style={{ ...cellStyle, flex: 1 }}>{report.reporterId}</div>
                            <div style={{ ...cellStyle, flex: 1.5 }}>{report.createdAt}</div>
                            <div style={{ ...cellStyle, flex: 1 }}>{report.type}</div>
                            <div style={{ ...cellStyle, flex: 1 }}>{report.status}</div>
                            <div style={{ ...cellStyle, width: '80px', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button
                                    style={iconButtonStyle}
                                    onClick={() => handleViewDetails(report)}
                                    title="View Details"
                                >
                                    <MoreHorizontal size={16} />
                                </button>
                                <button
                                    style={{ ...iconButtonStyle, color: 'var(--primary)' }}
                                    onClick={() => handleResolveClick(report)}
                                    title="Mark as Resolved"
                                >
                                    <Check size={16} />
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

            {/* Report Details Modal */}
            <ReportDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => {
                    setIsDetailsModalOpen(false);
                    setSelectedReport(null);
                }}
                report={selectedReport}
                onMarkResolved={handleMarkResolvedFromDetails}
            />

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmResolve}
                title="Mark as Resolved?"
                message="This will mark the report as resolved and remove it from the pending list."
                type="info"
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

const dataRowsContainerStyle: React.CSSProperties = {
    flex: 1,
    overflow: 'auto'
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

export default ReportsPage;
