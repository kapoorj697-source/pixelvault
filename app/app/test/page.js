"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function TestPage() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from("clients").select("*").limit(10);
      if (!error) setClients(data || []);
    }
    load();
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Supabase Test</h1>
      <pre>{JSON.stringify(clients, null, 2)}</pre>
    </main>
  );
}
