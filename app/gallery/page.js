"use client";

import { useEffect, useState } from "react";

export default function GalleryPage() {
  const [status, setStatus] = useState("Checking...");
  const [error, setError] = useState("");
  const [keys, setKeys] = useState([]);
  const [uploading, setUploading] = useState(false);

  async function loadFiles() {
    setError("");
    try {
      const res = await fetch("/api/files", { cache: "no-store" });
      const data = await res.json();

      if (!data.ok) {
        setStatus("Not connected ❌");
        setError(data.message || data.error || "Files API failed");
        setKeys([]);
        return;
      }

      setStatus("Connected ✅");
      setKeys(data.keys || []);
    } catch (e) {
      setStatus("Not connected ❌");
      setError(String(e));
      setKeys([]);
    }
  }

  useEffect(() => {
    loadFiles();
  }, []);

  async function onUpload(e) {
    e.preventDefault();
    setError("");

    const file = e.target.file.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();

      if (!data.ok) {
        setError(data.message || data.error || "Upload failed");
        return;
      }

      // refresh list
      await loadFiles();
      e.target.reset();
    } catch (e) {
      setError(String(e));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Gallery (R2)</h1>

      <p>
        R2 Status: <b>{status}</b>
      </p>

      {error ? (
        <pre style={{ background: "#111", color: "#0f0", padding: 12 }}>
          {error}
        </pre>
      ) : null}

      <form onSubmit={onUpload} style={{ marginTop: 12, marginBottom: 20 }}>
        <input name="file" type="file" />
        <button type="submit" disabled={uploading} style={{ marginLeft: 10 }}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      <h3>Files in R2</h3>
      {keys.length === 0 ? (
        <p>No files yet</p>
      ) : (
        <ul>
          {keys.map((k) => (
            <li key={k}>{k}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
