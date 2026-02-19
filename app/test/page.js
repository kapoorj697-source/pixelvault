export default async function TestPage() {
  let r2Status = "Checking...";
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/r2-test`, {
      cache: "no-store",
    });

    const data = await res.json();
    r2Status = data.ok ? "R2 connected ✅" : `R2 error ❌ ${data.error}`;
  } catch (e) {
    r2Status = "R2 error ❌ (fetch failed)";
  }

  return (
    <main style={{ padding: 40, color: "white" }}>
      <h1>Test Page</h1>
      <p>Supabase connected ✅</p>
      <p>{r2Status}</p>
    </main>
  );
}
