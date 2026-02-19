export const metadata = {
  title: "PixelVault",
  description: "Simple photo delivery web app"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0b0b0b", color: "#fff", fontFamily: "Arial, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
