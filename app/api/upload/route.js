async function uploadNow() {
  if (!files.length) {
    setMsg("Choose files first");
    return;
  }

  try {
    setMsg("Uploading...");

    const fd = new FormData();

    // IMPORTANT: backend getAll("file") expects multiple "file" fields
    for (const f of files) fd.append("file", f);

    // IMPORTANT: backend expects slug
    fd.append("slug", slug);

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
    setFiles([]);
    await loadFiles();
  } catch (e) {
    setMsg(String(e));
  }
}
