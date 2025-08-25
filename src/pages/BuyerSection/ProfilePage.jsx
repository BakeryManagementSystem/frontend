export default function ProfilePage() {
    return (
        <main style={{
            padding: "24px",
            minHeight: "calc(100vh - 64px)",
            background: `linear-gradient(135deg, var(--color-bg), var(--color-light))`,
            width: "100%"
        }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <h2 style={{ color: "var(--color-primary)", marginBottom: "24px" }}>Profile</h2>

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
                                placeholder="Enter your full name"
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    border: "1px solid rgba(102, 57, 166, 0.2)",
                                    borderRadius: "8px",
                                    fontSize: "16px"
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
                                placeholder="Enter your email"
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    border: "1px solid rgba(102, 57, 166, 0.2)",
                                    borderRadius: "8px",
                                    fontSize: "16px"
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
                                placeholder="Enter your phone number"
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    border: "1px solid rgba(102, 57, 166, 0.2)",
                                    borderRadius: "8px",
                                    fontSize: "16px"
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
                                Delivery Address
                            </label>
                            <textarea
                                placeholder="Enter your delivery address"
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    border: "1px solid rgba(102, 57, 166, 0.2)",
                                    borderRadius: "8px",
                                    fontSize: "16px",
                                    minHeight: "100px",
                                    resize: "vertical"
                                }}
                            />
                        </div>

                        <button style={{
                            background: "var(--color-primary)",
                            color: "white",
                            border: "none",
                            padding: "12px",
                            borderRadius: "8px",
                            fontSize: "16px",
                            fontWeight: "500",
                            cursor: "pointer",
                            marginTop: "16px"
                        }}>
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
