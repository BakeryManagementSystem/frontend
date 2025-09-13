import { useEffect, useMemo, useRef, useState } from "react";

const now = () => new Date().toISOString();
const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const mockData = () => {
    const conversations = [
        {
            id: "c1",
            name: "GreenGrocer Shop",
            role: "Seller",
            online: true,
            color: "#10b981",
            lastMessage: "Great! We will pack it fresh.",
            unread: 2,
            updatedAt: now(),
        },
        {
            id: "c2",
            name: "Fresh Daily Farm",
            role: "Seller",
            online: false,
            color: "#3b82f6",
            lastMessage: "Order confirmed. Delivery by 6 PM.",
            unread: 0,
            updatedAt: now(),
        },
        {
            id: "c3",
            name: "Buyer Support",
            role: "Support",
            online: true,
            color: "#f59e0b",
            lastMessage: "Let us know if you need further help.",
            unread: 0,
            updatedAt: now(),
        },
    ];

    const messages = {
        c1: [
            { id: "m1", from: "them", text: "Hi! Do you need anything today?", time: now(), status: "seen" },
            { id: "m2", from: "me", text: "Yes, 2kg tomatoes and 1kg potatoes.", time: now(), status: "seen" },
            { id: "m3", from: "them", text: "Great! We will pack it fresh.", time: now(), status: "delivered" },
        ],
        c2: [
            { id: "m1", from: "them", text: "Order confirmed. Delivery by 6 PM.", time: now(), status: "delivered" },
        ],
        c3: [
            { id: "m1", from: "them", text: "Hello! How can we assist you today?", time: now(), status: "seen" },
        ],
    };

    return { conversations, messages };
};

const useAutoScroll = (deps) => {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        el.scrollTop = el.scrollHeight;
    }, deps); // eslint-disable-line react-hooks/exhaustive-deps
    return ref;
};

const styles = {
    page: {
        display: "flex",
        gap: 16,
        padding: 16,
        minHeight: "calc(100vh - 64px)",
        background: "linear-gradient(135deg, var(--color-bg), var(--color-light))",
    },
    card: {
        background: "white",
        borderRadius: 12,
        boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
        overflow: "hidden",
        display: "flex",
        flex: 1,
        minHeight: 520,
    },
    sidebar: {
        width: 340,
        minWidth: 280,
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
    },
    sidebarHeader: {
        padding: 16,
        borderBottom: "1px solid #e5e7eb",
    },
    search: {
        width: "100%",
        padding: "10px 12px",
        borderRadius: 10,
        border: "1px solid #e5e7eb",
        outline: "none",
        background: "#f8fafc",
    },
    convoList: {
        overflowY: "auto",
    },
    convoItem: (active) => ({
        display: "flex",
        gap: 12,
        padding: 12,
        borderBottom: "1px solid #f1f5f9",
        cursor: "pointer",
        background: active ? "#f8fafc" : "transparent",
        transition: "background 0.15s ease",
    }),
    avatar: (color) => ({
        width: 44,
        height: 44,
        borderRadius: "50%",
        background: color,
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        userSelect: "none",
    }),
    badge: {
        minWidth: 22,
        height: 22,
        padding: "0 6px",
        background: "#ef4444",
        color: "white",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
    },
    presenceDot: (online) => ({
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: online ? "#10b981" : "#94a3b8",
        boxShadow: "0 0 0 2px white",
    }),
    main: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
    },
    header: {
        padding: "12px 16px",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    headerLeft: { display: "flex", alignItems: "center", gap: 12 },
    headerMeta: { display: "flex", flexDirection: "column" },
    headerName: { fontWeight: 700, color: "#0f172a" },
    headerSub: { color: "#64748b", fontSize: 12 },
    messages: {
        flex: 1,
        padding: 16,
        overflowY: "auto",
        background:
            "linear-gradient(180deg, rgba(248,250,252,1) 0%, rgba(241,245,249,1) 100%)",
    },
    bubbleRow: (alignRight) => ({
        display: "flex",
        justifyContent: alignRight ? "flex-end" : "flex-start",
        marginBottom: 10,
    }),
    bubble: (mine) => ({
        maxWidth: "70%",
        background: mine ? "#3b82f6" : "white",
        color: mine ? "white" : "#0f172a",
        border: mine ? "none" : "1px solid #e5e7eb",
        padding: "10px 12px",
        borderRadius: 14,
        borderTopRightRadius: mine ? 4 : 14,
        borderTopLeftRadius: mine ? 14 : 4,
        boxShadow: mine ? "0 4px 14px rgba(59,130,246,0.25)" : "0 2px 8px rgba(0,0,0,0.06)",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
    }),
    bubbleMeta: (mine) => ({
        marginTop: 6,
        fontSize: 11,
        color: mine ? "rgba(255,255,255,0.85)" : "#64748b",
        display: "flex",
        gap: 6,
        alignItems: "center",
    }),
    typing: {
        display: "inline-flex",
        gap: 4,
        alignItems: "center",
    },
    dot: (delay) => ({
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "#94a3b8",
        animation: `blink 1.2s ${delay}s infinite ease-in-out`,
    }),
    inputBar: {
        borderTop: "1px solid #e5e7eb",
        padding: 12,
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "white",
    },
    textArea: {
        flex: 1,
        minHeight: 44,
        maxHeight: 120,
        resize: "vertical",
        borderRadius: 10,
        border: "1px solid #e5e7eb",
        outline: "none",
        padding: "10px 12px",
        fontFamily: "inherit",
    },
    sendBtn: {
        padding: "10px 14px",
        borderRadius: 10,
        border: "none",
        background: "#10b981",
        color: "white",
        fontWeight: 700,
        cursor: "pointer",
    },
};

// Inline keyframes injection (once)
const injectKeyframesOnce = (() => {
    let injected = false;
    return () => {
        if (injected) return;
        const style = document.createElement("style");
        style.innerHTML = `
      @keyframes blink {
        0%, 80%, 100% { opacity: 0.3 }
        40% { opacity: 1 }
      }
      ::-webkit-scrollbar { width: 10px; height: 10px; }
      ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 999px; }
      ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    `;
        document.head.appendChild(style);
        injected = true;
    };
})();

function SafeAvatar({ name, color }) {
    const letter = (name || "?").trim().charAt(0).toUpperCase() || "?";
    return <div style={styles.avatar(color)}>{letter}</div>;
}

function TypingIndicator() {
    return (
        <span style={styles.typing}>
      <span style={styles.dot(0)} />
      <span style={styles.dot(0.15)} />
      <span style={styles.dot(0.3)} />
    </span>
    );
}

export default function MessagesPage() {
    const [conversations, setConversations] = useState([]);
    const [messagesByConv, setMessagesByConv] = useState({});
    const [activeId, setActiveId] = useState(null);
    const [search, setSearch] = useState("");
    const [draft, setDraft] = useState("");
    const [typing, setTyping] = useState(false);

    useEffect(() => {
        injectKeyframesOnce();
        const { conversations, messages } = mockData();
        setConversations(conversations);
        setMessagesByConv(messages);
        setActiveId(conversations[0]?.id || null);
    }, []);

    const activeConvo = useMemo(
        () => conversations.find((c) => c.id === activeId) || null,
        [conversations, activeId]
    );

    const filteredConvos = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return conversations;
        return conversations.filter((c) => c.name.toLowerCase().includes(q));
    }, [conversations, search]);

    const msgs = messagesByConv[activeId] || [];
    const scrollRef = useAutoScroll([activeId, msgs.length, typing]);

    const sendMessage = () => {
        const text = draft.trim();
        if (!text || !activeId) return;

        const newMsg = {
            id: `m_${Date.now()}`,
            from: "me",
            text,
            time: now(),
            status: "sent",
        };

        setMessagesByConv((prev) => ({
            ...prev,
            [activeId]: [...(prev[activeId] || []), newMsg],
        }));
        setDraft("");

        // Update preview and order
        setConversations((prev) =>
            prev
                .map((c) =>
                    c.id === activeId
                        ? { ...c, lastMessage: text, updatedAt: now(), unread: 0 }
                        : c
                )
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        );

        // Simulate seller typing and replying
        setTyping(true);
        setTimeout(() => {
            const reply = {
                id: `r_${Date.now()}`,
                from: "them",
                text: "Got it! We will update your order.",
                time: now(),
                status: "delivered",
            };
            setMessagesByConv((prev) => ({
                ...prev,
                [activeId]: [...(prev[activeId] || []), reply],
            }));
            setConversations((prev) =>
                prev.map((c) =>
                    c.id === activeId
                        ? { ...c, lastMessage: reply.text, updatedAt: now(), unread: 1 }
                        : c
                )
            );
            setTyping(false);
        }, 1200);
    };

    const onKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const openConversation = (id) => {
        setActiveId(id);
        setConversations((prev) =>
            prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
        );
    };

    return (
        <main style={{ ...styles.page, width: "100%" }}>
            <section style={styles.card}>
                {/* Sidebar */}
                <aside style={styles.sidebar}>
                    <div style={styles.sidebarHeader}>
                        <input
                            style={styles.search}
                            placeholder="Search chats..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div style={styles.convoList}>
                        {filteredConvos.map((c) => (
                            <div
                                key={c.id}
                                style={styles.convoItem(c.id === activeId)}
                                onClick={() => openConversation(c.id)}
                            >
                                <SafeAvatar name={c.name} color={c.color} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: 8,
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontWeight: 700,
                                                color: "#0f172a",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                            title={c.name}
                                        >
                                            {c.name}
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <div style={styles.presenceDot(c.online)} />
                                            {!!c.unread && <span style={styles.badge}>{c.unread}</span>}
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            color: "#64748b",
                                            fontSize: 13,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            marginTop: 2,
                                        }}
                                        title={c.lastMessage}
                                    >
                                        {c.lastMessage}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filteredConvos.length === 0 && (
                            <div style={{ padding: 16, color: "#64748b" }}>No conversations found.</div>
                        )}
                    </div>
                </aside>

                {/* Main chat */}
                <section style={styles.main}>
                    {/* Header */}
                    {activeConvo ? (
                        <div style={styles.header}>
                            <div style={styles.headerLeft}>
                                <SafeAvatar name={activeConvo.name} color={activeConvo.color} />
                                <div style={styles.headerMeta}>
                                    <span style={styles.headerName}>{activeConvo.name}</span>
                                    <span style={styles.headerSub}>
                    {activeConvo.online ? "Online" : "Offline"} \u00B7 {activeConvo.role}
                  </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={styles.header}>
                            <div style={{ color: "#64748b" }}>Select a conversation</div>
                        </div>
                    )}

                    {/* Messages */}
                    <div ref={scrollRef} style={styles.messages}>
                        {msgs.map((m) => {
                            const mine = m.from === "me";
                            return (
                                <div key={m.id} style={styles.bubbleRow(mine)}>
                                    <div>
                                        <div style={styles.bubble(mine)}>{m.text}</div>
                                        <div style={styles.bubbleMeta(mine)}>
                                            <span>{formatTime(m.time)}</span>
                                            {mine && (
                                                <span>
                          {m.status === "sent" && "✓"}
                                                    {m.status === "delivered" && "✓✓"}
                                                    {m.status === "seen" && "✓✓ Seen"}
                        </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {typing && (
                            <div style={styles.bubbleRow(false)}>
                                <div>
                                    <div style={styles.bubble(false)}>
                                        <TypingIndicator />
                                    </div>
                                    <div style={styles.bubbleMeta(false)}>typing...</div>
                                </div>
                            </div>
                        )}
                        {!msgs.length && !typing && (
                            <div
                                style={{
                                    marginTop: 40,
                                    textAlign: "center",
                                    color: "#64748b",
                                }}
                            >
                                Start a conversation with {activeConvo?.name}.
                            </div>
                        )}
                    </div>

                    {/* Composer */}
                    <div style={styles.inputBar}>
            <textarea
                style={styles.textArea}
                placeholder="Write a message. Press Enter to send, Shift+Enter for a new line."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKeyDown}
            />
                        <button style={styles.sendBtn} onClick={sendMessage} disabled={!draft.trim()}>
                            Send
                        </button>
                    </div>
                </section>
            </section>
        </main>
    );
}