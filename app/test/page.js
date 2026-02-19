"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function TestPage() {
  const [status, setStatus] = useState("Checking...");
  const [error, setError] = useState("");

  useEffect(() => {
    async function run() {
      try {
        // This just checks if Supabase client can talk (no table needed)
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          setError(error.message);
          setStatus("Supabase connected but got an auth error");
          return;
        }

        setStatus("Supabase connected ✅");
        setError("");
      } catch (e) {
        setStatus("Failed ❌");
        setError(String(e));
      }
    }

    run();
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Test Page</h1>
      <p>{status}</p>
      {error ? <pre style={{ color: "tomato" }}>{error}</pre> : null}
    </main>
  );
}
