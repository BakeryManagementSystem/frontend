import React from "react";

const API_BASE = "http://localhost:8000";

export default function OwnerUploadProduct() {
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [price, setPrice] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [image, setImage] = React.useState(null);
    const [ownerId, setOwnerId] = React.useState(""); // optional: set after login
    const [msg, setMsg] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setMsg("");
        setLoading(true);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        if (description) formData.append("description", description);
        if (category) formData.append("category", category);
        if (image) formData.append("image", image);
        if (ownerId) formData.append("owner_id", ownerId);

        try {
            const res = await fetch(`${API_BASE}/api/products`, {
                method: "POST",
                body: formData, // multipart/form-data
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                const firstError =
                    data?.errors && Object.values(data.errors)?.[0]?.[0];
                setMsg(firstError || data.message || "Upload failed");
                return;
            }

            setMsg("Product uploaded successfully!");
            setName("");
            setDescription("");
            setPrice("");
            setCategory("");
            setImage(null);
        } catch (err) {
            setMsg("Network error. Is the Laravel server running?");
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

                {/* If you keep owner_id on client side after login */}
                {/* <input
          type="number"
          placeholder="Owner ID"
          value={ownerId}
          onChange={(e) => setOwnerId(e.target.value)}
        /> */}

                <button type="submit" disabled={loading}>
                    {loading ? "Uploading..." : "Upload"}
                </button>
            </form>
            {msg && <p>{msg}</p>}
        </div>
    );
}
