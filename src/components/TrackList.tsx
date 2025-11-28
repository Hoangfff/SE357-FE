interface Track {
    id: string;
    title: string;
    artist: string;
    duration: number;
    album?: string;
}

interface TrackListProps {
    onTrackSelect: (track: Track) => void;
}

const TrackList = ({ onTrackSelect }: TrackListProps) => {
    const tracks: Track[] = [
        { id: '1', title: 'Midnight Dreams', artist: 'Luna Sky', duration: 245, album: 'Starlight' },
        { id: '2', title: 'Electric Pulse', artist: 'Neon Waves', duration: 198, album: 'Synthwave Vol. 1' },
        { id: '3', title: 'Ocean Breeze', artist: 'Solar Echo', duration: 223, album: 'Summer Collection' },
        { id: '4', title: 'Urban Nights', artist: 'City Lights', duration: 267, album: 'Metropolitan' },
        { id: '5', title: 'Mountain Echo', artist: 'Nature Sounds', duration: 312, album: 'Wilderness' },
    ];

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="track-list">
            {tracks.map((track, index) => (
                <div
                    key={track.id}
                    className="track-item"
                    onClick={() => onTrackSelect(track)}
                >
                    <div className="track-number">{index + 1}</div>
                    <div className="track-cover-small"></div>
                    <div className="track-info">
                        <h4 className="track-title">{track.title}</h4>
                        <p className="track-artist">{track.artist}</p>
                    </div>
                    <div className="track-album">{track.album}</div>
                    <div className="track-duration">{formatTime(track.duration)}</div>
                </div>
            ))}
        </div>
    );
};

export default TrackList;
