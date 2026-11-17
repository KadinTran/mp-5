
"use client";

import { useState } from "react";
import styled from "styled-components";

const Container = styled.main`
    min-height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2vh 2vw;
    margin: 0;
    background: #764ba2;
    font: 400 1vw 'Poppins', sans-serif;
`;
const Card = styled.div`
    width: 90%;
    max-width: 40%;
    padding: 3%;
    background: white;
    border-radius: 1.5vw;
    @media (max-width: 768px) {
        max-width: 90%;
        padding: 6%;
        border-radius: 3vw;
    }
`;
const Heading = styled.h1`
    font-size: 2vw;
    font-weight: 700;
    text-align: center;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1vh;
    margin-bottom: 2.5vh;
`;

const Label = styled.label`
    font-size: 0.95vw;
    font-weight: 600;
    color: #333;
`;

const Input = styled.input`
    padding: 1.5vh 1.2vw;
    border: 0.08vw solid;
    border-radius: 0.6vw;
    font-size: 1vw;
    font-family: inherit;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
        border-color: #667eea;
    }

    &::placeholder {
        color: #aaa;
    }
`;

const SubmitButton = styled.button`
    width: 100%;
    padding: 1.6vh;
    border: none;
    border-radius: 0.6vw;
    background: #667eea;
    color: white;
    font-size: 1.05vw;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
        background: #5365cc;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const ErrorMessage = styled.p`
    margin-top: 2vh;
    padding: 1.5vh 1vw;
    border-radius: 0.6vw;
    background: #fee2e2;
    color: #b91c1c;
    font-size: 0.95vw;
`;

const Result = styled.div`
    margin-top: 3vh;
    padding: 2vh 1.5vw;
    background: #f0fdf4;
    border: 0.08vw solid #bbf7d0;
    border-radius: 0.6vw;
`;

const ResultText = styled.p`
    color: #166534;
    font-weight: 600;
    margin-bottom: 1.5vh;
    font-size: 1vw;
`;

const ShortLink = styled.a`
    display: block;
    color: #2563eb;
    overflow-wrap: anywhere;
    margin-bottom: 2vh;
    font-size: 0.95vw;
`;

const CopyButton = styled.button`
    padding: 1.1vh 1.3vw;
    background: #16a34a;
    color: white;
    border: none;
    border-radius: 0.5vw;
    font-size: 0.9vw;
    font-family: inherit;
    cursor: pointer;

    &:hover {
        background: #15803d;
    }
`;
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
        <Container>
            <Card>
                <Heading>URL Shortener</Heading>

                <form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label htmlFor="url">Your URL</Label>
                        <Input
                            id="url"
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="alias">Custom Alias</Label>
                        <Input
                            id="alias"
                            type="text"
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                            placeholder="custom-alias"
                            required
                        />
                    </FormGroup>

                    <SubmitButton type="submit">
                        Shorten My URL
                    </SubmitButton>
                </form>

                {error && <ErrorMessage>{error}</ErrorMessage>}
                {shortURL && (
                    <Result>
                        <ResultText>Your shortened URL:</ResultText>
                        <ShortLink href={shortURL} target="_blank" rel="noopener noreferrer">{shortURL}</ShortLink>
                        {/* noopener and noreferrer are security measures to prevent redirecting to scam websites*/}
                        {/*https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/*/}

                        <CopyButton
                            type="button"
                            onClick={() => navigator.clipboard.writeText(shortURL)}
                        >
                            Copy URL
                        </CopyButton>
                    </Result>
                )}
            </Card>

        </Container>
    );
}
