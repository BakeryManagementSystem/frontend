import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import MainLayout from "./components/layouts/MainLayout.jsx";

// Auth
import LoginPage from "./pages/Auth/Login.jsx";
import SignupPage from "./pages/Auth/SignIn.jsx";

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

// Owner Section
import OwnerPage from "./pages/OwnerSection/OwnerPge.jsx";

import "./App.css";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<Homepage />} />
                        <Route path="/shop" element={<BuyerPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/messages" element={<MessagesPage />} />
                        <Route path="/notifications" element={<NotificationsPage />} />
                        <Route path="/status" element={<StatusPage />} />
                        <Route path="/buyer" element={<BuyerPage />} />
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/reviews" element={<ReviewsPage />} />
                        <Route path="/help" element={<HelpPage />} />
                        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                        <Route path="/owner" element={<ProtectedRoute><OwnerPage /></ProtectedRoute>} />
                    </Route>
                    <Route path="/auth" element={<LoginPage />} />
                    <Route path="/signin" element={<SignupPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;