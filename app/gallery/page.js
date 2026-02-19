"use client";
import { useEffect, useState } from "react";

export default function Gallery() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetch("/api/files")
      .then(r => r.json())
      .then(data => {
        if (data.keys) setFiles(data.keys);
      });
  }, []);

  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

  return (
    <div>
      <h2>Files in R2</h2>

      {files.length === 0 && <p>No files yet</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        {files.map(f => (
          <img
            key={f}
            src={`${base}/${f}`}
            style={{ width: "100%", borderRadius: 10 }}
          />
        ))}
      </div>
    </div>
  );
}
