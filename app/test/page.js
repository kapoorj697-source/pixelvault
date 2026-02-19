"use client";
import { useEffect, useState } from "react";

export default function TestPage() {
  const [r2, setR2] = useState("Checking...");
  const [raw, setRaw] = useState("");

  useEffect(() => {
    async function run() {
      try {
        // relative call -> same domain, no base url problems
        const res = await fetch("/api/r2-test");
        const data = await res.json();
        setRaw(JSON.stringify(data, null, 2));
        setR2(data.ok ? "R2 connected ✅" : "R2 error ❌");
      } catch (e) {
        setR2("R2 error ❌ (fetch failed)");
        setRaw(String(e));
      }
    }
    run();
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Test Page</h1>
      <p>Supabase connected ✅</p>
      <p>{r2}</p>
      <pre>{raw}</pre>
    </main>
  );
}
