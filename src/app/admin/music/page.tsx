'use client';

import React, { useState } from 'react';
import { Search, MoreHorizontal, Trash2, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminFooter from '../components/AdminFooter';
import MusicDetailsModal from '../components/MusicDetailsModal';
import DeleteReasonModal from '../components/DeleteReasonModal';
import ConfirmationModal from '../components/ConfirmationModal';

// Types
interface Music {
    id: string;
    musicId: string;
    title: string;
    uploadedBy: string;
    totalReports: number;
    createdAt: string;
}

// Mock data
const mockMusic: Music[] = [
    { id: '1', musicId: '123', title: 'Music Title', uploadedBy: 'Connor', totalReports: 100, createdAt: '01/01/2020' },
    { id: '2', musicId: '123', title: 'Music Title', uploadedBy: 'Connor', totalReports: 100, createdAt: '01/01/2020' },
    { id: '3', musicId: '123', title: 'Music Title', uploadedBy: 'Connor', totalReports: 100, createdAt: '01/01/2020' },
    { id: '4', musicId: '123', title: 'Music Title', uploadedBy: 'Connor', totalReports: 100, createdAt: '01/01/2020' },
    { id: '5', musicId: '123', title: 'Music Title', uploadedBy: 'Connor', totalReports: 100, createdAt: '01/01/2020' },
    { id: '6', musicId: '123', title: 'Music Title', uploadedBy: 'Connor', totalReports: 100, createdAt: '01/01/2020' },
    { id: '7', musicId: '123', title: 'Music Title', uploadedBy: 'Connor', totalReports: 100, createdAt: '01/01/2020' },
    { id: '8', musicId: '123', title: 'Music Title', uploadedBy: 'Connor', totalReports: 100, createdAt: '01/01/2020' },
    { id: '9', musicId: '123', title: 'Music Title', uploadedBy: 'Connor', totalReports: 100, createdAt: '01/01/2020' },
    { id: '10', musicId: '123', title: 'Music Title', uploadedBy: 'Connor', totalReports: 100, createdAt: '01/01/2020' },
];

const MusicPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [musicList, setMusicList] = useState(mockMusic);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // Modal states
    const [selectedMusic, setSelectedMusic] = useState<Music | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    // Pagination
    const totalPages = Math.ceil(musicList.length / itemsPerPage);
    const paginatedMusic = musicList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Filter music by search
    const filteredMusic = paginatedMusic.filter(music =>
        music.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        music.musicId.includes(searchQuery)
    );

    // Handlers
    const handleViewDetails = (music: Music) => {
        setSelectedMusic(music);
        setIsDetailsModalOpen(true);
    };

    const handleDeleteClick = (music: Music) => {
        setSelectedMusic(music);
        setIsReasonModalOpen(true);
    };

    const handleDeleteFromDetails = () => {
        // Keep details modal open, show reason modal
        setIsReasonModalOpen(true);
    };

    const handleDismissFromDetails = () => {
        // Just close the details modal without deleting
        setIsDetailsModalOpen(false);
        setSelectedMusic(null);
    };

    const handleReasonSubmit = (_reason: string) => {
        setIsReasonModalOpen(false);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedMusic) {
            setMusicList(prev => prev.filter(m => m.id !== selectedMusic.id));
        }
        // Close all modals
        setIsConfirmModalOpen(false);
        setIsDetailsModalOpen(false);
        setSelectedMusic(null);
    };

    const handleCancelConfirm = () => {
        setIsConfirmModalOpen(false);
        // Go back to reason modal
        setIsReasonModalOpen(true);
    };

    return (
        <div style={pageContainerStyle}>
            {/* Search Bar */}
            <div style={searchContainerStyle}>
                <Search size={18} style={{ color: 'var(--text-secondary)' }} />
                <input
                    type="text"
                    placeholder="Find Music"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={searchInputStyle}
                />
            </div>

            {/* Title */}
            <h1 style={titleStyle}>Music Reported By Users</h1>

            {/* Data Grid */}
            <div style={dataGridContainerStyle}>
                {/* Header Row */}
                <div style={headerRowStyle}>
                    <div style={{ ...headerCellStyle, flex: 1 }}>
                        MusicId <ChevronDown size={14} style={{ marginLeft: '4px' }} />
                    </div>
                    <div style={{ ...headerCellStyle, flex: 1.5 }}>
                        Title <ChevronDown size={14} style={{ marginLeft: '4px' }} />
                    </div>
                    <div style={{ ...headerCellStyle, flex: 1.5 }}>
                        Uploaded By <ChevronDown size={14} style={{ marginLeft: '4px' }} />
                    </div>
                    <div style={{ ...headerCellStyle, flex: 1 }}>
                        Total Report <ChevronDown size={14} style={{ marginLeft: '4px' }} />
                    </div>
                    <div style={{ ...headerCellStyle, width: '80px' }}></div>
                </div>

                {/* Data Rows Container */}
                <div style={dataRowsContainerStyle}>
                    {filteredMusic.map((music) => (
                        <div key={music.id} style={dataRowStyle}>
                            <div style={{ ...cellStyle, flex: 1 }}>{music.musicId}</div>
                            <div style={{ ...cellStyle, flex: 1.5 }}>{music.title}</div>
                            <div style={{ ...cellStyle, flex: 1.5 }}>{music.uploadedBy}</div>
                            <div style={{ ...cellStyle, flex: 1 }}>{music.totalReports}</div>
                            <div style={{ ...cellStyle, width: '80px', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button
                                    style={iconButtonStyle}
                                    onClick={() => handleViewDetails(music)}
                                    title="View Details"
                                >
                                    <MoreHorizontal size={16} />
                                </button>
                                <button
                                    style={{ ...iconButtonStyle, color: 'var(--warning)' }}
                                    onClick={() => handleDeleteClick(music)}
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

            {/* Music Details Modal */}
            <MusicDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => {
                    setIsDetailsModalOpen(false);
                    setSelectedMusic(null);
                }}
                music={selectedMusic}
                onDelete={handleDeleteFromDetails}
                onDismiss={handleDismissFromDetails}
            />

            {/* Delete Reason Modal */}
            <DeleteReasonModal
                isOpen={isReasonModalOpen}
                onClose={() => {
                    setIsReasonModalOpen(false);
                    if (!isDetailsModalOpen) {
                        setSelectedMusic(null);
                    }
                }}
                onDelete={handleReasonSubmit}
            />

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={handleCancelConfirm}
                onConfirm={handleConfirmDelete}
                title="Confirm Deletion?"
                message="Delete selected music and notify it's uploader"
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

export default MusicPage;
