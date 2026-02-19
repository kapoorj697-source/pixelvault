"use client";

import { useEffect, useState } from "react";

export default function Gallery() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetch("/api/files")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          setFiles(data.keys || []);
        }
      });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Gallery (R2)</h1>

      <h3>Files in R2</h3>

      {files.length === 0 && <p>No files yet</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {files.map((key) => {
          const url = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;

          return (
            <img
              key={key}
              src={url}
              style={{ width: "100%", borderRadius: 8 }}
            />
          );
        })}
      </div>
    </div>
  );
}
