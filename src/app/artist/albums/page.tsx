import { Play, Shuffle, Plus, Download, Upload, Queue, MoreHorizontal, ChevronRight } from '../../../lib/icons';
import '../../../styles/my-albums-page.css';

// Sample album data for artist
const myAlbumsData = [
    {
        id: 1,
        title: 'Random Access Memories',
        year: 2023,
        songCount: 22,
        duration: '1 hr 14 min',
        image: 'https://i.scdn.co/image/ab67616d0000b273a7c37f72a5d1040c05e30916'
    },
    {
        id: 2,
        title: 'Random Access Memories (10th Anniversary Edition)',
        year: 2013,
        songCount: 22,
        duration: '1 hr 14 min',
        image: 'https://i.scdn.co/image/ab67616d0000b273a7c37f72a5d1040c05e30916'
    },
    {
        id: 3,
        title: 'Random Access Memories',
        year: 2013,
        songCount: 13,
        duration: '1 hr 14 min',
        image: 'https://i.scdn.co/image/ab67616d0000b273a7c37f72a5d1040c05e30916'
    },
    {
        id: 4,
        title: 'TRON: Legacy Reconfigured',
        year: 2011,
        songCount: 15,
        duration: '1 hr 14 min',
        image: 'https://i.scdn.co/image/ab67616d0000b2730dc3f8e185f92c4a5a4f7f5c'
    },
];

const MyAlbumsPage = () => {
    const handleCreateAlbum = () => {
        // TODO: Implement create album modal
        console.log('Create new album clicked');
    };

    const handlePlayAlbum = (albumId: number) => {
        console.log('Play album:', albumId);
    };

    const handleShufflePlay = (albumId: number) => {
        console.log('Shuffle play album:', albumId);
    };

    const handleAddMusic = (albumId: number) => {
        console.log('Add music to album:', albumId);
    };

    const handleDownload = (albumId: number) => {
        console.log('Download album:', albumId);
    };

    const handleUpload = (albumId: number) => {
        console.log('Upload to album:', albumId);
    };

    return (
        <div className="my-albums-page">
            {/* Header with Create Button */}
            <div className="my-albums-header">
                <h1>My Albums</h1>
                <button className="create-album-btn" onClick={handleCreateAlbum}>
                    <Plus />
                    <span>Create New Album</span>
                </button>
            </div>

            {/* Albums List */}
            <div className="my-albums-list">
                {myAlbumsData.map((album) => (
                    <div key={album.id} className="album-row">
                        {/* Album Cover */}
                        <div className="album-cover">
                            <img
                                src={album.image}
                                alt={album.title}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        </div>

                        {/* Album Info */}
                        <div className="album-info">
                            <h3 className="album-row-title">{album.title}</h3>
                            <p className="album-meta">
                                <span>{album.year}</span>
                                <span>{album.songCount} songs</span>
                                <span>{album.duration}</span>
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="album-actions">
                            <button
                                className="action-btn play-btn"
                                title="Play"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePlayAlbum(album.id);
                                }}
                            >
                                <Play />
                            </button>

                            <button
                                className="action-btn shuffle-btn"
                                title="Play in mix order"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleShufflePlay(album.id);
                                }}
                            >
                                <Shuffle />
                            </button>

                            <button
                                className="action-btn"
                                title="Add music to album"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddMusic(album.id);
                                }}
                            >
                                <Plus />
                            </button>

                            <button
                                className="action-btn"
                                title="Add to queue"
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                <Queue />
                            </button>

                            <button
                                className="action-btn"
                                title="Download album"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(album.id);
                                }}
                            >
                                <Download />
                            </button>

                            <button
                                className="action-btn"
                                title="Upload music"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpload(album.id);
                                }}
                            >
                                <Upload />
                            </button>

                            <button
                                className="action-btn"
                                title="More options"
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                <MoreHorizontal />
                            </button>
                        </div>

                        {/* Expand Arrow */}
                        <div className="album-expand">
                            <ChevronRight />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyAlbumsPage;
