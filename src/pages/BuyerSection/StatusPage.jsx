export default function StatusPage() {
    return (
        <main style={{
            padding: "24px",
            minHeight: "calc(100vh - 64px)",
            background: `linear-gradient(135deg, var(--color-bg), var(--color-light))`,
            width: "100%"
        }}>
            <h2 style={{ color: "var(--color-primary)", marginBottom: "16px" }}>Status</h2>
            <p style={{ color: "var(--text-main)" }}>System status and quick metrics here.</p>
        </main>
    );
}
