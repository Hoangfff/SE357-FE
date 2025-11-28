import '../../styles/admin.css';

const AdminPage = () => {
    return (
        <div className="admin-page">
            <h1>Admin Dashboard</h1>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p className="stat-number">1,234</p>
                </div>
                <div className="stat-card">
                    <h3>Total Songs</h3>
                    <p className="stat-number">10,567</p>
                </div>
                <div className="stat-card">
                    <h3>Active Playlists</h3>
                    <p className="stat-number">2,345</p>
                </div>
                <div className="stat-card">
                    <h3>Streams Today</h3>
                    <p className="stat-number">45,678</p>
                </div>
            </div>

            <div className="admin-section">
                <h2>Recent Activity</h2>
                <div className="activity-list">
                    <p>User management, content moderation, and analytics coming soon...</p>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
