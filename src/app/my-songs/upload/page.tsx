import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@/styles/my-songs-page.css';

const UploadIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const ImageIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
    </svg>
);

// Mock albums for dropdown
const mockAlbums = [
    { id: '1', title: 'First Light' },
    { id: '2', title: 'Chill Vibes' },
];

const UploadSongPage = () => {
    const navigate = useNavigate();
    const audioInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: '',
        albumId: '',
        duration: '',
    });
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAudioFile(file);
            // Try to get duration from audio file
            const audio = new Audio();
            audio.src = URL.createObjectURL(file);
            audio.onloadedmetadata = () => {
                const duration = Math.floor(audio.duration);
                setFormData(prev => ({ ...prev, duration: duration.toString() }));
            };
        }
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverImage(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // In a real app, you would upload to your backend here
        console.log('Uploading song:', { ...formData, audioFile, coverImage });

        setIsSubmitting(false);
        navigate('/home/my-songs');
    };

    const isFormValid = formData.title.trim() !== '' && audioFile !== null;

    return (
        <div className="upload-page">
            <div className="upload-page-header">
                <h1>Upload New Song</h1>
                <p>Share your music with the world</p>
            </div>

            <form className="upload-form" onSubmit={handleSubmit}>
                {/* Song Details Section */}
                <div className="form-section">
                    <h3>Song Details</h3>
                    <div className="form-group">
                        <label htmlFor="title">Song Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter song title"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="albumId">Album (Optional)</label>
                        <select
                            id="albumId"
                            name="albumId"
                            value={formData.albumId}
                            onChange={handleInputChange}
                        >
                            <option value="">Single (No Album)</option>
                            {mockAlbums.map(album => (
                                <option key={album.id} value={album.id}>{album.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="duration">Duration (seconds)</label>
                        <input
                            type="number"
                            id="duration"
                            name="duration"
                            value={formData.duration}
                            onChange={handleInputChange}
                            placeholder="Auto-detected from file"
                            min="1"
                        />
                    </div>
                </div>

                {/* Audio File Section */}
                <div className="form-section">
                    <h3>Audio File *</h3>
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
                            <UploadIcon />
                        </div>
                        <p className="file-upload-text">
                            {audioFile ? 'Change audio file' : 'Click to upload audio file'}
                        </p>
                        <p className="file-upload-hint">MP3, WAV, FLAC up to 50MB</p>
                        {audioFile && (
                            <p className="file-upload-name">{audioFile.name}</p>
                        )}
                    </div>
                </div>

                {/* Cover Image Section */}
                <div className="form-section">
                    <h3>Cover Image (Optional)</h3>
                    <input
                        type="file"
                        ref={imageInputRef}
                        onChange={handleCoverChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                    <div
                        className={`file-upload-area ${coverImage ? 'has-file' : ''}`}
                        onClick={() => imageInputRef.current?.click()}
                    >
                        <div className="file-upload-icon">
                            <ImageIcon />
                        </div>
                        <p className="file-upload-text">
                            {coverImage ? 'Change cover image' : 'Click to upload cover image'}
                        </p>
                        <p className="file-upload-hint">JPG, PNG up to 5MB (Square recommended)</p>
                        {coverImage && (
                            <p className="file-upload-name">{coverImage.name}</p>
                        )}
                    </div>
                </div>

                {/* Form Actions */}
                <div className="form-actions">
                    <Link to="/home/my-songs" className="btn-cancel">Cancel</Link>
                    <button
                        type="submit"
                        className="btn-submit"
                        disabled={!isFormValid || isSubmitting}
                    >
                        {isSubmitting ? 'Uploading...' : 'Upload Song'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UploadSongPage;
