"use client";

import { useEffect, useMemo, useState } from "react";

function toSlug(str) {
  return (str || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")   // remove special
    .replace(/\s+/g, "-")          // spaces -> dash
    .replace(/-+/g, "-");          // multiple dashes -> one
}

export default function GalleryPage() {
  const [keys, setKeys] = useState([]);
  const [status, setStatus] = useState("Checking...");
  const [msg, setMsg] = useState("");
  const [file, setFile] = useState(null);

  // NEW: client + album
  const [clientName, setClientName] = useState("jai-vinisha");
  const [albumName, setAlbumName] = useState("wedding");

  const clientSlug = useMemo(() => toSlug(clientName), [clientName]);
  const albumSlug = useMemo(() => toSlug(albumName), [albumName]);

  // full slug = folder path
  const fullSlug = useMemo(() => {
    if (clientSlug && albumSlug) return `${clientSlug}/${albumSlug}`;
    if (clientSlug) return clientSlug;
    return "";
  }, [clientSlug, albumSlug]);

  async function loadFiles() {
    setMsg("");
    try {
      const res = await fetch("/api/files", { cache: "no-store" });
      const data = await res.json();

      if (data.ok) {
        const allKeys = data.keys || [];

        // show only current slug files
        const filtered = fullSlug
          ? allKeys.filter((k) => k.startsWith(fullSlug + "/"))
          : allKeys;

        setKeys(filtered);
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
    // reload when slug changes
  }, [fullSlug]);

  async function uploadNow() {
    if (!file) {
      setMsg("Choose a file first");
      return;
    }

    if (!fullSlug) {
      setMsg("Client/Album slug required");
      return;
    }

    try {
      setMsg("Uploading...");
      const fd = new FormData();
      fd.append("file", file);
      fd.append("slug", fullSlug); // ✅ IMPORTANT

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (!data.ok) {
        setMsg(data.message || data.error || "Upload failed");
        return;
      }

      setMsg(`Uploaded ✅ to: ${fullSlug}`);
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

      {/* NEW: Client + Album fields */}
      <div style={{ marginTop: 10, marginBottom: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          placeholder="Client name (e.g. Jai Vinisha)"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          style={{ padding: 8, minWidth: 240 }}
        />
        <input
          placeholder="Album name (e.g. Wedding)"
          value={albumName}
          onChange={(e) => setAlbumName(e.target.value)}
          style={{ padding: 8, minWidth: 240 }}
        />

        <div style={{ paddingTop: 8 }}>
          <b>Slug:</b> {fullSlug || "-"}
        </div>
      </div>

      {/* Upload */}
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

      <h3 style={{ marginTop: 20 }}>Photos ({fullSlug || "all"})</h3>

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
