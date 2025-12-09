'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

interface Activity {
    id: number;
    timestamp: string;
    action: string;
}

interface ActivitiesTableProps {
    activities: Activity[];
    itemsPerPage?: number;
}

const ActivitiesTable = ({ activities, itemsPerPage = 5 }: ActivitiesTableProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const totalPages = Math.ceil(activities.length / itemsPerPage);

    const sortedActivities = [...activities].sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    const paginatedActivities = sortedActivities.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const toggleSortOrder = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    return (
        <div style={containerStyle}>
            <h3 style={titleStyle}>Activities</h3>

            <div style={tableContainerStyle}>
                {/* Table Header */}
                <div style={tableHeaderStyle}>
                    <div
                        style={headerCellStyle}
                        onClick={toggleSortOrder}
                    >
                        Time stamp <ChevronDown size={14} style={{ marginLeft: '4px' }} />
                    </div>
                    <div style={{ ...headerCellStyle, textAlign: 'right' }}>
                        Action <ChevronDown size={14} style={{ marginLeft: '4px' }} />
                    </div>
                </div>

                {/* Table Body */}
                <div style={tableBodyStyle}>
                    {paginatedActivities.map((activity) => (
                        <div key={activity.id} style={tableRowStyle}>
                            <div style={cellStyle}>{activity.timestamp}</div>
                            <div style={{ ...cellStyle, textAlign: 'right' }}>{activity.action}</div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div style={paginationStyle}>
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        style={paginationButtonStyle}
                    >
                        <ChevronLeft size={16} />
                    </button>

                    <span style={pageNumberStyle}>{currentPage}</span>

                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        style={paginationButtonStyle}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const containerStyle: React.CSSProperties = {
    marginTop: '2rem'
};

const titleStyle: React.CSSProperties = {
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: '1rem',
    color: 'var(--text-primary)'
};

const tableContainerStyle: React.CSSProperties = {
    border: '1px solid var(--secondary)',
    borderRadius: '0.75rem',
    overflow: 'hidden',
    backgroundColor: 'transparent'
};

const tableHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem 1.5rem',
    borderBottom: '1px solid rgba(6, 182, 212, 0.3)',
    backgroundColor: 'transparent'
};

const headerCellStyle: React.CSSProperties = {
    color: 'var(--text-secondary)',
    fontSize: '0.75rem',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
};

const tableBodyStyle: React.CSSProperties = {
    minHeight: '200px'
};

const tableRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
};

const cellStyle: React.CSSProperties = {
    color: 'var(--text-secondary)',
    fontSize: '0.875rem'
};

const paginationStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem',
    borderTop: '1px solid rgba(6, 182, 212, 0.3)'
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

export default ActivitiesTable;
