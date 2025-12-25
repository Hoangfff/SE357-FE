'use client';

import { useState, useRef } from 'react';
import { X, Upload, Link, Loader2 } from 'lucide-react';
import { artistService } from '@/services/artistService';

interface UploadMusicModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

type InputMode = 'file' | 'url';

const UploadMusicModal = ({ isOpen, onClose, onSuccess }: UploadMusicModalProps) => {
    const audioInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: '',
        genre: '',
        description: '',
        fileUrl: '',
    });
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [inputMode, setInputMode] = useState<InputMode>('file');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAudioFile(file);
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await artistService.uploadTrack({
                title: formData.title,
                genre: formData.genre || undefined,
                description: formData.description || undefined,
                file: inputMode === 'file' ? audioFile || undefined : undefined,
                fileUrl: inputMode === 'url' ? formData.fileUrl || undefined : undefined,
            });

            // Reset form
            setFormData({ title: '', genre: '', description: '', fileUrl: '' });
            setAudioFile(null);
            setInputMode('file');

            onSuccess();
            onClose();
        } catch (err: unknown) {
            const error = err as { message?: string };
            setError(error.message || 'Failed to upload track. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = formData.title.trim() !== '' &&
        ((inputMode === 'file' && audioFile !== null) ||
            (inputMode === 'url' && formData.fileUrl.trim() !== ''));

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container upload-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Upload New Track</h2>
                    <button className="modal-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form className="upload-form-content" onSubmit={handleSubmit}>
                    {error && (
                        <div className="upload-error">
                            {error}
                        </div>
                    )}

                    {/* Song Details */}
                    <div className="form-group">
                        <label htmlFor="title">Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter track title"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="genre">Genre</label>
                        <input
                            type="text"
                            id="genre"
                            name="genre"
                            value={formData.genre}
                            onChange={handleInputChange}
                            placeholder="e.g. Pop, Rock, Jazz"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Optional description for your track"
                            rows={3}
                        />
                    </div>

                    {/* Input Mode Toggle */}
                    <div className="input-mode-toggle">
                        <button
                            type="button"
                            className={`mode-btn ${inputMode === 'file' ? 'active' : ''}`}
                            onClick={() => setInputMode('file')}
                        >
                            <Upload size={16} />
                            Upload File
                        </button>
                        <button
                            type="button"
                            className={`mode-btn ${inputMode === 'url' ? 'active' : ''}`}
                            onClick={() => setInputMode('url')}
                        >
                            <Link size={16} />
                            Enter URL
                        </button>
                    </div>

                    {/* File Upload */}
                    {inputMode === 'file' && (
                        <div className="form-group">
                            <label>Audio File *</label>
                            <input
                                type="file"
                                ref={audioInputRef}
                                onChange={handleAudioChange}
                                accept="audio/*"
                                style={{ display: 'none' }}
                            />
                            <div
                                className={`file-upload-area ${audioFile ? 'has-file' : ''}`}
                                onClick={() => audioInputRef.current?.click()}
                            >
                                <div className="file-upload-icon">
                                    <Upload size={32} />
                                </div>
                                <p className="file-upload-text">
                                    {audioFile ? 'Change audio file' : 'Click to upload audio file'}
                                </p>
                                <p className="file-upload-hint">MP3, WAV, M4A, OGG up to 50MB</p>
                                {audioFile && (
                                    <p className="file-upload-name">{audioFile.name}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* URL Input */}
                    {inputMode === 'url' && (
                        <div className="form-group">
                            <label htmlFor="fileUrl">Audio URL *</label>
                            <input
                                type="url"
                                id="fileUrl"
                                name="fileUrl"
                                value={formData.fileUrl}
                                onChange={handleInputChange}
                                placeholder="https://example.com/audio.mp3"
                            />
                            <p className="input-hint">Enter a direct link to an audio file</p>
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={!isFormValid || isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={16} className="spinner" />
                                    Uploading...
                                </>
                            ) : (
                                'Upload Track'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadMusicModal;
