import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/layout.css';



const Layout = () => {
    return (
        <div className="layout">
            <Sidebar />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
