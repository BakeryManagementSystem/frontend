export default function NotificationsPage() {
    return (
        <main style={{
            padding: "24px",
            minHeight: "calc(100vh - 64px)",
            background: `linear-gradient(135deg, var(--color-bg), var(--color-light))`,
            width: "100%"
        }}>
            <h2 style={{ color: "var(--color-primary)", marginBottom: "16px" }}>Notifications</h2>
            <ul style={{ color: "var(--text-main)" }}>
                <li>New order received</li>
                <li>Low stock alert for croissants</li>
            </ul>
        </main>
    );
}
