"use client";

import { useEffect, useState } from "react";

export default function GalleryPage() {
  const [keys, setKeys] = useState([]);
  const [status, setStatus] = useState("Checking...");
  const [msg, setMsg] = useState("");
  const [file, setFile] = useState(null);

  async function loadFiles() {
    setMsg("");
    try {
      const res = await fetch("/api/files", { cache: "no-store" });
      const data = await res.json();

      if (data.ok) {
        setKeys(data.keys || []);
        setStatus("Connected ✅");
      } else {
        setKeys([]);
        setStatus("Not connected ❌");
        setMsg(data.message || data.error || "Files API failed");
      }
    } catch (e) {
      setKeys([]);
      setStatus("Not connected ❌");
      setMsg(String(e));
    }
  }

  useEffect(() => {
    loadFiles();
  }, []);

  async function uploadNow() {
    if (!file) {
      setMsg("Choose a file first");
      return;
    }

    try {
      setMsg("Uploading...");
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (!data.ok) {
        setMsg(data.message || data.error || "Upload failed");
        return;
      }

      setMsg("Uploaded ✅");
      setFile(null);
      await loadFiles();
    } catch (e) {
      setMsg(String(e));
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Gallery (R2)</h1>

      <p>
        R2 Status: <b>{status}</b>
      </p>

      <div style={{ marginTop: 10, marginBottom: 16 }}>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button onClick={uploadNow} style={{ marginLeft: 10 }}>
          Upload
        </button>
      </div>

      {msg ? (
        <pre style={{ background: "#111", color: "#0f0", padding: 12 }}>
          {msg}
        </pre>
      ) : null}

      <h3 style={{ marginTop: 20 }}>Photos</h3>

      {keys.length === 0 ? (
        <p>No files yet</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {keys.map((k) => (
            <img
              key={k}
              src={`/api/r2/${k}`}
              alt={k}
              style={{ width: "100%", borderRadius: 10, objectFit: "cover" }}
            />
          ))}
        </div>
      )}
    </main>
  );
}
