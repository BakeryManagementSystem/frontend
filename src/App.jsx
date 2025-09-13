// File: 'frontend/src/App.jsx'
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
import BuyerProfileView from "./pages/BuyerSection/BuyerProfileView.jsx";
import BuyerProfileEdit from "./pages/BuyerSection/BuyerProfileEdit.jsx";
import OwnerDashboard from "./pages/OwnerSection/OwnerDashboard.jsx";
import IngredientUploadPage from "./pages/OwnerSection/IngredientUploadPage.jsx";

// Owner Section
import OwnerPage from "./pages/OwnerSection/OwnerPage.jsx";
import ShopProfilePage from "./pages/OwnerSection/ShopProfilePage.jsx";
import OwnerShopProfileEdit from "./pages/OwnerSection/OwnerShopProfileEdit.jsx";
import Inbox from "./pages/OwnerSection/Inbox.jsx";
import OrderStatus from "./pages/OwnerSection/OrderStatus.jsx";

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
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <ProfilePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile/edit"
                            element={
                                <ProtectedRoute>
                                    <BuyerProfileEdit />
                                </ProtectedRoute>
                            }
                        />

                        {/* Owner shop profile */}
                        <Route
                            path="/owner/shop"
                            element={
                                <ProtectedRoute>
                                    <ShopProfilePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/owner/shop/edit"
                            element={
                                <ProtectedRoute>
                                    <OwnerShopProfileEdit />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/owner"
                            element={
                                <ProtectedRoute>
                                    <OwnerPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/owner/dashboard"
                            element={
                                <ProtectedRoute>
                                    <OwnerDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/owner/ingredients/upload"
                            element={
                                <ProtectedRoute>
                                    <IngredientUploadPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/owner/inbox"
                            element={
                                <ProtectedRoute>
                                    <Inbox />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/owner/orders"
                            element={
                                <ProtectedRoute>
                                    <OrderStatus />
                                </ProtectedRoute>
                            }
                        />
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