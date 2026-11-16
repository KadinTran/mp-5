
"use client";

import { useState } from "react";

export default function Shortener() {
    const [url, setUrl] = useState("");
    const [alias, setAlias] = useState("");
    const [shortURL, setShortURL] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: { preventDefault: () => void }) {
        e.preventDefault();

        setError("");
        setShortURL("");

        try {
            const response = await fetch("/api/shorten", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    url: url,
                    alias: alias
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error);
                return;
            }

            setShortURL(`${window.location.origin}/${alias}`);

            setUrl("");
            setAlias("");

        } catch {
            setError("Something went wrong. Please try again.");
        }
    }

    return (
        <div>
            <h1>URL Shortener</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="url">Your URL</label>
                    <input
                        id="url"
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="alias">Custom Alias</label>
                    <input
                        id="alias"
                        type="text"
                        value={alias}
                        onChange={(e) => setAlias(e.target.value)}
                        placeholder="custom-alias"
                        required
                    />
                </div>

                <button type="submit">
                    Shorten My URL
                </button>
            </form>

            {error && (<p style={{ color: "red" }}>{error}</p>)}
            {shortURL && (
                <div>
                    <p>Your shortened URL:</p>
                    <a href={shortURL} target="_blank" rel="noopener noreferrer">{shortURL}</a>
                    {/* noopener and noreferrer are security measures to prevent redirecting to scam websites*/}
                    {/*https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/*/}

                    <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(shortURL)}
                    >
                        Copy URL
                    </button>
                </div>
            )}
        </div>
    );
}
