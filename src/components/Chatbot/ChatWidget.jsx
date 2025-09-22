// src/components/Chatbot/ChatWidget.jsx
import { useEffect, useRef, useState } from "react";
import "./ChatWidget.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function ChatWidget({
                                       title = "Smart Bakery AI",
                                       subtitle = "Ask about products, orders, shop info…",
                                   }) {
    const [open, setOpen] = useState(false);
    const [sending, setSending] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState(() => [
        {
            role: "assistant",
            text:
                "Hi! I’m your Smart Bakery assistant. Ask me about products, orders, inventory, revenue, or shop details.",
        },
    ]);

    const token =
        localStorage.getItem("token") || localStorage.getItem("access_token");

    const listRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (!listRef.current) return;
        listRef.current.scrollTop = listRef.current.scrollHeight;
    }, [messages, open]);

    // ESC closes the widget when open
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape" && open) setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    const send = async () => {
        const text = input.trim();
        if (!text || sending) return;

        setMessages((m) => [...m, { role: "user", text }]);
        setInput("");
        setSending(true);

        try {
            const res = await fetch(`${API_BASE}/api/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ message: text }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok || !data?.ok) {
                setMessages((m) => [
                    ...m,
                    {
                        role: "assistant",
                        text:
                            data?.message ||
                            "Sorry, I couldn’t process that. Please try rephrasing your question.",
                        error: true,
                    },
                ]);
            } else {
                setMessages((m) => [
                    ...m,
                    { role: "assistant", text: data.answer || "(No answer)" },
                ]);
            }
        } catch (e) {
            console.error(e);
            setMessages((m) => [
                ...m,
                {
                    role: "assistant",
                    text:
                        "Network error talking to the assistant. Please check your server and try again.",
                    error: true,
                },
            ]);
        } finally {
            setSending(false);
            inputRef.current?.focus();
        }
    };

    const onKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
        }
    };

    return (
        <>
            {/* Floating button */}
            {!open && (
                <button
                    className="cb-fab"
                    aria-label="Open chat"
                    title="Ask our AI assistant"
                    onClick={() => setOpen(true)}
                >
                    <svg viewBox="0 0 24 24" className="cb-fab-icon">
                        <path
                            fill="currentColor"
                            d="M12 3C7.03 3 3 6.58 3 11c0 2.08.89 3.97 2.34 5.43L4 21l4.76-1.99C9.62 19.66 10.78 20 12 20c4.97 0 9-3.58 9-8s-4.03-9-9-9zm-1 5h2v6h-2V8zm0 8h2v2h-2v-2z"
                        />
                    </svg>
                </button>
            )}

            {/* Drawer */}
            {open && (
                <div className="cb-drawer">
                    <div className="cb-header">
                        <div className="cb-header-left">
                            <div className="cb-brand">🤖</div>
                            <div className="cb-titles">
                                <div className="cb-title">{title}</div>
                                <div className="cb-subtitle">{subtitle}</div>
                            </div>
                        </div>
                        <button
                            className="cb-close"
                            aria-label="Close chat"
                            onClick={() => setOpen(false)}
                            title="Close"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="cb-body" ref={listRef}>
                        {messages.map((m, idx) => (
                            <div
                                key={idx}
                                className={`cb-msg ${
                                    m.role === "user" ? "cb-msg-user" : "cb-msg-ai"
                                } ${m.error ? "cb-msg-error" : ""}`}
                            >
                                <div className="cb-bubble">{m.text}</div>
                            </div>
                        ))}
                        {sending && (
                            <div className="cb-msg cb-msg-ai">
                                <div className="cb-bubble">
                  <span className="cb-dots">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="cb-inputbar">
            <textarea
                ref={inputRef}
                className="cb-input"
                rows={1}
                placeholder="Type your question…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
            />
                        <button
                            className="cb-send"
                            onClick={send}
                            disabled={sending || !input.trim()}
                            title="Send"
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
