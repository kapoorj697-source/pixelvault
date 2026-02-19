export default function Home() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ margin: 0, fontSize: 44 }}>PixelVault</h1>
        <p style={{ opacity: 0.8, marginTop: 10 }}>Your gallery is live 🚀</p>

        <div style={{ marginTop: 20 }}>
          <a
            href="/test"
            style={{
              display: "inline-block",
              padding: "10px 14px",
              border: "1px solid #333",
              borderRadius: 10,
              color: "#fff",
              textDecoration: "none"
            }}
          >
            Open /test
          </a>
        </div>
      </div>
    </main>
  );
}
