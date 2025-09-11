import React, { useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function OwnerUploadProduct() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null);
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setMsg("");
        setLoading(true);

        const token = localStorage.getItem("token"); // token from login

        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        if (description) formData.append("description", description);
        if (category) formData.append("category", category);
        if (image) formData.append("image", image);

        try {
            const res = await fetch(`${API_BASE}/api/products`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`, // ✅ send token
                    Accept: "application/json",
                },
                body: formData, // DO NOT set Content-Type manually
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                const firstError = data?.errors && Object.values(data.errors)?.[0]?.[0];
                setMsg(firstError || data.message || "Upload failed");
                return;
            }

            setMsg("✅ Product uploaded successfully!");
            setName("");
            setDescription("");
            setPrice("");
            setCategory("");
            setImage(null);
        } catch (err) {
            setMsg("⚠️ Network error. Is the Laravel server running?");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="owner-upload-container">
            <h2>Upload Product</h2>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    placeholder="Product name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <textarea
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder="Category (optional)"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Uploading..." : "Upload"}
                </button>
            </form>
            {msg && <p>{msg}</p>}
        </div>
    );
}
