"use client";
import { useEffect, useState } from "react";

export default function GalleryPage() {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("Loading...");
  const [file, setFile] = useState(null);

  const loadFiles = async () => {
    try {
      const res = await fetch("/api/files", { cache: "no-store" });
      const data = await res.json();
      if (data.ok) {
        setFiles(data.keys || data.files || []);
        setStatus("Connected ✅");
      } else {
        setStatus("Not connected ❌");
      }
    } catch (e) {
      setStatus("Not connected ❌");
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const upload = async () => {
    if (!file) return alert("Choose a file first");
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: fd,
    });

    const data = await res.json();
    if (data.ok) {
      alert("Uploaded ✅");
      setFile(null);
      await loadFiles();
    } else {
      alert(data.message || "Upload failed");
    }
  };

  return (
    <div style={{ padding: 24, color: "white" }}>
      <h1>Gallery (R2)</h1>
      <p>R2 Status: {status}</p>

      <div style={{ marginTop: 16 }}>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0])} />
        <button onClick={upload} style={{ marginLeft: 10 }}>Upload</button>
      </div>

      <h3 style={{ marginTop: 24 }}>Files in R2</h3>
      {files.length === 0 ? (
        <p>No files yet</p>
      ) : (
        <ul>
          {files.map((k) => (
            <li key={k}>{k}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
