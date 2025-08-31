import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./components/layouts/MainLayout.jsx";

// Auth
import LoginSignupPage from "./pages/Auth/LoginSignupPage.jsx";

// Buyer Section pages
import Homepage from "./pages/BuyerSection/Homepage.jsx";
import BuyerPage from "./pages/BuyerSection/BuyerPage.jsx";
import CartPage from "./pages/BuyerSection/CartPage.jsx";
import MessagesPage from "./pages/BuyerSection/MessagesPage.jsx";
import NotificationsPage from "./pages/BuyerSection/NotificationsPage.jsx";
import StatusPage from "./pages/BuyerSection/StatusPage.jsx";
import OrdersPage from "./pages/BuyerSection/OrdersPage.jsx";
import SettingsPage from "./pages/BuyerSection/SettingsPage.jsx";
import ReviewsPage from "./pages/BuyerSection/ReviewsPage.jsx";
import HelpPage from "./pages/BuyerSection/HelpPage.jsx";
import ProfilePage from "./pages/BuyerSection/ProfilePage.jsx";

// ⬇️ NEW: import your Owner page component (create it if not present)
import OwnerPage from "./pages/OwnerSection/OwnerPge.jsx";

import "./App.css";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Protected routes inside MainLayout */}
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<Homepage />} />
                        <Route path="/shop" element={<BuyerPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/messages" element={<MessagesPage />} />
                        <Route path="/notifications" element={<NotificationsPage />} />
                        <Route path="/status" element={<StatusPage />} />
                        <Route path="/BuyerPage" element={<BuyerPage />} />
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/reviews" element={<ReviewsPage />} />
                        <Route path="/help" element={<HelpPage />} />
                        <Route path="/profile" element={<ProfilePage />} />

                        {/* ⬇️ NEW: owner landing */}
                        <Route path="/OwnerPage" element={<OwnerPage />} />
                    </Route>

                    {/* Auth outside the layout */}
                    <Route path="/auth" element={<LoginSignupPage />} />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
