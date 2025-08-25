export default function Homepage() {
    return (
        <main style={{
            padding: "24px",
            minHeight: "calc(100vh - 64px)",
            background: `linear-gradient(135deg, var(--color-bg), var(--color-light))`,
            width: "100%"
        }}>
            <h1 style={{
                color: "var(--color-primary)",
                marginBottom: 8,
                fontSize: "2rem",
                fontWeight: "bold"
            }}>
                Smart Bakery Management System
            </h1>
            <p style={{
                color: "var(--text-main)",
                fontSize: "1.1rem"
            }}>
                Tap the menu icon (top-left) to open the drawer.
            </p>
        </main>
    );
}
