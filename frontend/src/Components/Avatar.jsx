

function Avatar() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>

      {/* glow ring */}
      <div style={{
        width: "160px", height: "160px", borderRadius: "50%",
        background: "rgba(37,99,235,0.15)",
        border: "1.5px solid rgba(99,130,246,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
      }}>

        {/* floating animation wrapper */}
        <div style={{ animation: "float 3s ease-in-out infinite" }}>
          <svg width="110" height="110" viewBox="0 0 110 110" fill="none">

            {/* head */}
            <circle cx="55" cy="38" r="22" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" />
            {/* eyes */}
            <circle cx="47" cy="34" r="3" fill="#60a5fa" />
            <circle cx="63" cy="34" r="3" fill="#60a5fa" />
            {/* smile */}
            <path d="M46 46 Q55 54 64 46" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* body */}
            <rect x="33" y="60" width="44" height="36" rx="16" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" />

            {/* waving hand — left */}
            <g style={{ transformOrigin: "70% 80%", animation: "wave 2s ease-in-out infinite" }}>
              <rect x="13" y="55" width="22" height="10" rx="5" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" />
              <rect x="11" y="48" width="8" height="14" rx="4" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" />
              <rect x="17" y="44" width="8" height="14" rx="4" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" />
              <rect x="23" y="45" width="8" height="13" rx="4" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" />
              <rect x="29" y="48" width="7" height="11" rx="3.5" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" />
            </g>

            {/* right arm */}
            <rect x="75" y="60" width="22" height="10" rx="5" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" />

            {/* legs */}
            <rect x="40" y="96" width="10" height="12" rx="5" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" />
            <rect x="60" y="96" width="10" height="12" rx="5" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" />

          </svg>
        </div>
      </div>

      {/* text */}
      <div style={{ textAlign: "center" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "500", color: "#e2e8f0", marginBottom: "4px" }}>
          Welcome to ChatPulse
        </h3>
        <p style={{ fontSize: "12px", color: "rgba(148,163,184,0.6)" }}>
          Connect with people in real time
        </p>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "5px",
          background: "rgba(16,185,129,0.1)", border: "0.5px solid rgba(16,185,129,0.3)",
          borderRadius: "20px", padding: "3px 10px", fontSize: "11px",
          color: "#34d399", marginTop: "8px",
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
          1,200+ users online
        </div>
      </div>

      {/* animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes wave {
          0%   { transform: rotate(0deg); }
          15%  { transform: rotate(20deg); }
          30%  { transform: rotate(-10deg); }
          45%  { transform: rotate(20deg); }
          60%  { transform: rotate(-5deg); }
          75%  { transform: rotate(15deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>

    </div>
  )
}

export default Avatar;