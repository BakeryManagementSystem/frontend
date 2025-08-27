import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        phone: "",
        userType: localStorage.getItem("user_type") || "buyer"
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/auth");
        }
    }, [isAuthenticated, navigate]);

    const handleLogout = () => {
        logout();
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_type");
        navigate("/auth");
    };

    const handleSaveChanges = () => {
        // TODO: Implement API call to save changes
        setIsEditing(false);
    };

    return (
        <main style={{
            padding: "24px",
            minHeight: "calc(100vh - 64px)",
            background: `linear-gradient(135deg, var(--color-bg), var(--color-light))`,
            width: "100%"
        }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px"
                }}>
                    <h2 style={{ color: "var(--color-primary)" }}>Profile</h2>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: "var(--color-accent)",
                            color: "white",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "8px",
                            cursor: "pointer"
                        }}
                    >
                        Logout
                    </button>
                </div>

                <div style={{
                    background: "var(--color-light)",
                    borderRadius: "16px",
                    padding: "24px",
                    boxShadow: "0 8px 24px rgba(102, 57, 166, 0.08)"
                }}>
                    {/* Profile Image Section */}
                    <div style={{ textAlign: "center", marginBottom: "24px" }}>
                        <div style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "60px",
                            background: "var(--color-primary)",
                            margin: "0 auto 16px",
                            display: "grid",
                            placeItems: "center",
                            color: "white",
                            fontSize: "48px"
                        }}>
                            👤
                        </div>
                        <button style={{
                            background: "var(--color-primary)",
                            color: "white",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "8px",
                            cursor: "pointer"
                        }}>
                            Change Photo
                        </button>
                    </div>

                    {/* Profile Information */}
                    <div style={{ display: "grid", gap: "20px" }}>
                        <div>
                            <label style={{
                                display: "block",
                                marginBottom: "8px",
                                color: "var(--color-secondary)",
                                fontWeight: "500"
                            }}>
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={userData.name}
                                onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                                disabled={!isEditing}
                                placeholder="Enter your full name"
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    border: "1px solid rgba(102, 57, 166, 0.2)",
                                    borderRadius: "8px",
                                    fontSize: "16px",
                                    backgroundColor: isEditing ? "white" : "rgba(102, 57, 166, 0.05)"
                                }}
                            />
                        </div>

                        <div>
                            <label style={{
                                display: "block",
                                marginBottom: "8px",
                                color: "var(--color-secondary)",
                                fontWeight: "500"
                            }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={userData.email}
                                onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                                disabled={!isEditing}
                                placeholder="Enter your email"
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    border: "1px solid rgba(102, 57, 166, 0.2)",
                                    borderRadius: "8px",
                                    fontSize: "16px",
                                    backgroundColor: isEditing ? "white" : "rgba(102, 57, 166, 0.05)"
                                }}
                            />
                        </div>

                        <div>
                            <label style={{
                                display: "block",
                                marginBottom: "8px",
                                color: "var(--color-secondary)",
                                fontWeight: "500"
                            }}>
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={userData.phone}
                                onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                                disabled={!isEditing}
                                placeholder="Enter your phone number"
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    border: "1px solid rgba(102, 57, 166, 0.2)",
                                    borderRadius: "8px",
                                    fontSize: "16px",
                                    backgroundColor: isEditing ? "white" : "rgba(102, 57, 166, 0.05)"
                                }}
                            />
                        </div>

                        <div style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "12px",
                            marginTop: "16px"
                        }}>
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        style={{
                                            background: "var(--color-bg)",
                                            color: "var(--color-primary)",
                                            border: "1px solid var(--color-primary)",
                                            padding: "8px 16px",
                                            borderRadius: "8px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveChanges}
                                        style={{
                                            background: "var(--color-primary)",
                                            color: "white",
                                            border: "none",
                                            padding: "8px 16px",
                                            borderRadius: "8px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Save Changes
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    style={{
                                        background: "var(--color-primary)",
                                        color: "white",
                                        border: "none",
                                        padding: "8px 16px",
                                        borderRadius: "8px",
                                        cursor: "pointer"
                                    }}
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
