
function AuthLayout({ children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>

      {/* top left orb */}
      <div style={{
        position: "absolute", top: "-100px", left: "-100px",
        width: "400px", height: "400px",
        background: "#1e40af",
        borderRadius: "50%",
        filter: "blur(100px)",
        opacity: "0.5",
        pointerEvents: "none"
      }} />

      {/* bottom right orb */}
      <div style={{
        position: "absolute", bottom: "-100px", right: "-100px",
        width: "400px", height: "400px",
        background: "#2563eb",
        borderRadius: "50%",
        filter: "blur(100px)",
        opacity: "0.5",
        pointerEvents: "none"
      }} />

      {/* center orb */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "300px", height: "300px",
        background: "#4f46e5",
        borderRadius: "50%",
        filter: "blur(100px)",
        opacity: "0.25",
        pointerEvents: "none"
      }} />

      {/* content */}
      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "480px", padding: "0 16px" }}>
        {children}
      </div>

    </div>
  )
}

export default AuthLayout;