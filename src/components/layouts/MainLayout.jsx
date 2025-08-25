import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../NavBar/Navbar.jsx";
import Sidebar from "../../pages/BuyerSection/Sidebar.jsx";

export default function MainLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Leftmost icon should open drawer on Home only
    const onLeftIconClick = () => {
        if (location.pathname === "/") setSidebarOpen(true);
        else navigate("/"); // optional: jump to Home when tapped elsewhere
    };

    // Close drawer when route changes
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    return (
        <>
            <Navbar onLeftIconClick={onLeftIconClick} />
            {location.pathname === "/" && (
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            )}
            <Outlet />
        </>
    );
}
