'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, MoreHorizontal, Check, ChevronDown, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import AdminFooter from '../components/AdminFooter';
import ReportDetailsModal from '../components/ReportDetailsModal';
import ConfirmationModal from '../components/ConfirmationModal';
import ResolveReportModal from '../components/ResolveReportModal';
import { adminService } from '../../../services/adminService';
import type { Report, ReportStatus, ReportType } from '../../../types/admin';

const ReportsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [reports, setReports] = useState<Report[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [statusFilter, setStatusFilter] = useState<ReportStatus | ''>('PENDING');
    const [typeFilter, setTypeFilter] = useState<ReportType | ''>('');
    const itemsPerPage = 9;

    // Loading and error states
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Modal states
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);

    // Fetch reports from API
    const fetchReports = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await adminService.getReports({
                status: statusFilter || undefined,
                type: typeFilter || undefined,
                page: currentPage,
                limit: itemsPerPage,
            });

            setReports(response.data);
            setTotalPages(response.meta.totalPages);
            setTotalItems(response.meta.total);
        } catch (err) {
            console.error('Failed to fetch reports:', err);
            setError('Failed to load reports. Please try again.');
            setReports([]);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, statusFilter, typeFilter, itemsPerPage]);

    // Fetch on mount and when filters change
    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    // Filter reports by search (client-side for current page)
    const filteredReports = reports.filter(report =>
        report.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.reportType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(report.reporterId).includes(searchQuery)
    );

    // Handlers
    const handleViewDetails = (report: Report) => {
        setSelectedReport(report);
        setIsDetailsModalOpen(true);
    };

    const handleResolveClick = (report: Report) => {
        setSelectedReport(report);
        // For pending reports, show resolve modal with notes input
        if (report.status === 'PENDING') {
            setIsResolveModalOpen(true);
        } else {
            setIsConfirmModalOpen(true);
        }
    };

    const handleMarkResolvedFromDetails = () => {
        if (selectedReport?.status === 'PENDING') {
            setIsResolveModalOpen(true);
        }
    };

    const handleResolveWithNotes = async (notes: string) => {
        if (!selectedReport) return;

        setIsProcessing(true);
        try {
            await adminService.resolveReport(selectedReport.id, notes);
            // Refresh the list
            await fetchReports();
            setIsResolveModalOpen(false);
            setIsDetailsModalOpen(false);
            setSelectedReport(null);
        } catch (err) {
            console.error('Failed to resolve report:', err);
            setError('Failed to resolve report. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleConfirmResolve = async () => {
        if (!selectedReport) return;

        setIsProcessing(true);
        try {
            await adminService.resolveReport(selectedReport.id, 'Resolved by admin');
            await fetchReports();
            setIsConfirmModalOpen(false);
            setIsDetailsModalOpen(false);
            setSelectedReport(null);
        } catch (err) {
            console.error('Failed to resolve report:', err);
            setError('Failed to resolve report. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const getStatusBadgeStyle = (status: string): React.CSSProperties => ({
        padding: '0.25rem 0.5rem',
        borderRadius: '0.25rem',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: status === 'RESOLVED'
            ? 'rgba(34, 197, 94, 0.2)'
            : 'rgba(234, 179, 8, 0.2)',
        color: status === 'RESOLVED' ? '#22c55e' : '#eab308'
    });

    return (
        <div style={pageContainerStyle}>
            {/* Search Bar and Filters */}
            <div style={topBarStyle}>
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

                <div style={filtersContainerStyle}>
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value as ReportStatus | '');
                            setCurrentPage(1);
                        }}
                        style={selectStyle}
                    >
                        <option value="">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="RESOLVED">Resolved</option>
                    </select>

                    <select
                        value={typeFilter}
                        onChange={(e) => {
                            setTypeFilter(e.target.value as ReportType | '');
                            setCurrentPage(1);
                        }}
                        style={selectStyle}
                    >
                        <option value="">All Types</option>
                        <option value="MUSIC">Music</option>
                        <option value="USER">User</option>
                        <option value="COMMENT">Comment</option>
                        <option value="PLAYLIST">Playlist</option>
                    </select>
                </div>
            </div>

            {/* Title */}
            <h1 style={titleStyle}>
                User Reports
                {totalItems > 0 && <span style={countStyle}>({totalItems})</span>}
            </h1>

            {/* Error Message */}
            {error && (
                <div style={errorStyle}>
                    {error}
                    <button onClick={fetchReports} style={retryButtonStyle}>
                        Retry
                    </button>
                </div>
            )}

            {/* Data Grid */}
            <div style={dataGridContainerStyle}>
                {/* Header Row */}
                <div style={headerRowStyle}>
                    <div style={{ ...headerCellStyle, flex: 1 }}>
                        Reporter <ChevronDown size={14} style={{ marginLeft: '4px' }} />
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
                    <div style={{ ...headerCellStyle, flex: 1.5 }}>
                        Reason
                    </div>
                    <div style={{ ...headerCellStyle, width: '80px' }}></div>
                </div>

                {/* Data Rows Container */}
                <div style={dataRowsContainerStyle}>
                    {isLoading ? (
                        <div style={loadingStyle}>
                            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
                            <p>Loading reports...</p>
                        </div>
                    ) : filteredReports.length === 0 ? (
                        <div style={emptyStyle}>
                            <p>No reports found</p>
                        </div>
                    ) : (
                        filteredReports.map((report) => (
                            <div key={report.id} style={dataRowStyle}>
                                <div style={{ ...cellStyle, flex: 1 }}>
                                    {report.usersReportsReporterUserIdTousers?.name || `User #${report.reporterId}`}
                                </div>
                                <div style={{ ...cellStyle, flex: 1.5 }}>{formatDate(report.reportDate)}</div>
                                <div style={{ ...cellStyle, flex: 1 }}>{report.reportType}</div>
                                <div style={{ ...cellStyle, flex: 1 }}>
                                    <span style={getStatusBadgeStyle(report.status)}>
                                        {report.status}
                                    </span>
                                </div>
                                <div style={{ ...cellStyle, flex: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {report.reason}
                                </div>
                                <div style={{ ...cellStyle, width: '80px', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                    <button
                                        style={iconButtonStyle}
                                        onClick={() => handleViewDetails(report)}
                                        title="View Details"
                                    >
                                        <MoreHorizontal size={16} />
                                    </button>
                                    {report.status === 'PENDING' && (
                                        <button
                                            style={{ ...iconButtonStyle, color: 'var(--primary)' }}
                                            onClick={() => handleResolveClick(report)}
                                            title="Mark as Resolved"
                                        >
                                            <Check size={16} />
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
                        disabled={currentPage === totalPages || isLoading || totalPages === 0}
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

            {/* Resolve Report Modal with Notes */}
            <ResolveReportModal
                isOpen={isResolveModalOpen}
                onClose={() => setIsResolveModalOpen(false)}
                onSubmit={handleResolveWithNotes}
                isProcessing={isProcessing}
            />

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmResolve}
                title="Mark as Resolved?"
                message="This will mark the report as resolved."
                type="info"
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

const filtersContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.75rem'
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

// Add CSS animation for spinner
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'spinner-styles-reports';
    if (!document.getElementById('spinner-styles-reports')) {
        styleSheet.textContent = `
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(styleSheet);
    }
}

export default ReportsPage;
