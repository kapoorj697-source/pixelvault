"use client";
import { useEffect, useState } from "react";

export default function GalleryPage() {
  const [r2, setR2] = useState(null);
  const [files, setFiles] = useState([]);
  const [msg, setMsg] = useState("");

  async function load() {
    const t = await fetch("/api/r2-test").then((r) => r.json());
    setR2(t);

    const f = await fetch("/api/files").then((r) => r.json());
    if (f.ok) setFiles(f.files);
  }

  useEffect(() => {
    load();
  }, []);

  async function uploadFile(e) {
    e.preventDefault();
    setMsg("Uploading...");

    const file = e.target.file.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: fd,
    }).then((r) => r.json());

    if (res.ok) {
      setMsg("Uploaded ✅");
      await load();
    } else {
      setMsg("Upload failed ❌ " + (res.message || ""));
    }
  }

  return (
    <main style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>Gallery (R2)</h1>

      <div style={{ marginBottom: 15 }}>
        <b>R2 Status:</b>{" "}
        {r2?.ok ? "Connected ✅" : "Not Connected ❌"}
        {r2 && (
          <pre style={{ background: "#111", color: "#0f0", padding: 12, marginTop: 10 }}>
            {JSON.stringify(r2, null, 2)}
          </pre>
        )}
      </div>

      <form onSubmit={uploadFile} style={{ marginBottom: 20 }}>
        <input name="file" type="file" />
        <button type="submit" style={{ marginLeft: 10 }}>
          Upload
        </button>
      </form>

      <div style={{ color: "#999", marginBottom: 10 }}>{msg}</div>

      <h3>Files in R2</h3>
      {files.length === 0 ? (
        <p>No files yet</p>
      ) : (
        <ul>
          {files.map((k) => (
            <li key={k}>{k}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
