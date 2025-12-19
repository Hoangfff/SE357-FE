import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Play } from '@/lib/icons';
import '@/styles/search-page.css';

interface SearchResult {
    id: string;
    type: 'song' | 'artist' | 'album' | 'playlist';
    title: string;
    subtitle?: string;
    image: string;
}

// Mock search results
const mockSearchResults: SearchResult[] = [
    // Songs
    { id: '1', type: 'song', title: 'Blinding Lights', subtitle: 'The Weeknd', image: 'https://i.scdn.co/image/ab67616d0000b273912e284e340e4cf03d072e9c' },
    { id: '2', type: 'song', title: 'Save Your Tears', subtitle: 'The Weeknd', image: 'https://i.scdn.co/image/ab67616d0000b273912e284e340e4cf03d072e9c' },
    { id: '3', type: 'song', title: 'Starboy', subtitle: 'The Weeknd ft. Daft Punk', image: 'https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452' },

    // Artists
    { id: '4', type: 'artist', title: 'The Weeknd', subtitle: 'Artist', image: 'https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb' },
    { id: '5', type: 'artist', title: 'Daft Punk', subtitle: 'Artist', image: 'https://i.scdn.co/image/ab6761610000e5eba7bfd7835b5c1eee0c95fa6e' },

    // Albums
    { id: '6', type: 'album', title: 'After Hours', subtitle: 'The Weeknd • 2020', image: 'https://i.scdn.co/image/ab67616d0000b273912e284e340e4cf03d072e9c' },
    { id: '7', type: 'album', title: 'Starboy', subtitle: 'The Weeknd • 2016', image: 'https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452' },

    // Playlists
    { id: '8', type: 'playlist', title: 'The Weeknd Radio', subtitle: 'Playlist • 50 songs', image: 'https://i.scdn.co/image/ab67706f000000027b2e7ee752dc222ff2fd466f' },
];

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState<SearchResult[]>([]);
    const [activeTab, setActiveTab] = useState<'all' | 'songs' | 'artists' | 'albums' | 'playlists'>('all');

    useEffect(() => {
        // Simulate search - filter mock results based on query
        if (query) {
            const filtered = mockSearchResults.filter(result =>
                result.title.toLowerCase().includes(query.toLowerCase()) ||
                result.subtitle?.toLowerCase().includes(query.toLowerCase())
            );
            setResults(filtered);
        } else {
            setResults([]);
        }
    }, [query]);

    const getFilteredResults = () => {
        if (activeTab === 'all') return results;
        return results.filter(r => r.type === activeTab.slice(0, -1) as any);
    };

    const filteredResults = getFilteredResults();

    return (
        <div className="search-page">
            {query && (
                <>
                    <div className="search-header">
                        <h1>Search results for "{query}"</h1>
                        <p className="results-count">
                            {results.length} {results.length === 1 ? 'result' : 'results'} found
                        </p>
                    </div>

                    <div className="search-tabs">
                        <button
                            className={`search-tab ${activeTab === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            All
                        </button>
                        <button
                            className={`search-tab ${activeTab === 'songs' ? 'active' : ''}`}
                            onClick={() => setActiveTab('songs')}
                        >
                            Songs
                        </button>
                        <button
                            className={`search-tab ${activeTab === 'artists' ? 'active' : ''}`}
                            onClick={() => setActiveTab('artists')}
                        >
                            Artists
                        </button>
                        <button
                            className={`search-tab ${activeTab === 'albums' ? 'active' : ''}`}
                            onClick={() => setActiveTab('albums')}
                        >
                            Albums
                        </button>
                        <button
                            className={`search-tab ${activeTab === 'playlists' ? 'active' : ''}`}
                            onClick={() => setActiveTab('playlists')}
                        >
                            Playlists
                        </button>
                    </div>

                    {filteredResults.length > 0 ? (
                        <div className="search-results-grid">
                            {filteredResults.map((result) => (
                                <div key={result.id} className={`search-result-card ${result.type}`}>
                                    <div className="result-image-container">
                                        <div className="result-image">
                                            <img
                                                src={result.image}
                                                alt={result.title}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        </div>
                                        {result.type === 'song' && (
                                            <button className="play-btn">
                                                <Play />
                                            </button>
                                        )}
                                    </div>
                                    <div className="result-info">
                                        <h3 className="result-title">{result.title}</h3>
                                        {result.subtitle && (
                                            <p className="result-subtitle">{result.subtitle}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-results">
                            <h2>No results found for "{query}"</h2>
                            <p>Try different keywords or check your spelling</p>
                        </div>
                    )}
                </>
            )}

            {!query && (
                <div className="search-empty-state">
                    <h2>Search for music</h2>
                    <p>Find your favorite songs, artists, albums, and playlists</p>
                </div>
            )}
        </div>
    );
};

export default SearchPage;
