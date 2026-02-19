"use client";

import { useEffect, useState } from "react";

export default function GalleryPage() {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("Checking...");

  const loadFiles = async () => {
    try {
      const res = await fetch("/api/r2/list");
      const data = await res.json();

      if (data.ok) {
        setFiles(data.files);
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
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/r2/upload", {
      method: "POST",
      body: fd,
    });

    const data = await res.json();

    if (data.ok) {
      loadFiles();
      setFile(null);
    } else {
      alert("Upload failed");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Gallery (R2)</h1>

      <p>R2 Status: {status}</p>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={upload}>Upload</button>

      <h3 style={{ marginTop: 30 }}>Files in R2</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 15,
        }}
      >
        {files.map((k) => (
          <img
            key={k}
            src={`/api/r2/${k}`}
            alt={k}
            style={{
              width: "100%",
              borderRadius: 12,
              objectFit: "cover",
            }}
          />
        ))}
      </div>
    </div>
  );
}
