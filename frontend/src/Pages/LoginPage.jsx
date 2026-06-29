// src/pages/LoginPage.jsx
import { useState } from "react"
import { Link, useNavigate } from "react-router"
import useAuthStore from "../Store/AuthStore.js"

function LoginPage() {

  const navigate = useNavigate()
  const {login, isLoggingIn, error} = useAuthStore()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // ─── Handle change ────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setErrors({ ...errors, [name]: "" })
  }

  // ─── Validate ─────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {}
    if (!emailRegex.test(formData.email))
      newErrors.email = "Enter a valid email address"
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ─── Handle submit ────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return
    await login(formData);
    
  }

  // ─── Styles ───────────────────────────────────────────────────
  const s = {
    page:       { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "32px 16px" },
    orb1:       { position: "absolute", top: "-100px", left: "-100px", width: "400px", height: "400px", background: "#1e40af", borderRadius: "50%", filter: "blur(100px)", opacity: 0.5, pointerEvents: "none" },
    orb2:       { position: "absolute", bottom: "-100px", right: "-100px", width: "400px", height: "400px", background: "#2563eb", borderRadius: "50%", filter: "blur(100px)", opacity: 0.5, pointerEvents: "none" },
    orb3:       { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "300px", height: "300px", background: "#4f46e5", borderRadius: "50%", filter: "blur(100px)", opacity: 0.2, pointerEvents: "none" },
    card:       { position: "relative", zIndex: 2, background: "rgba(15,23,42,0.75)", border: "0.5px solid rgba(99,130,246,0.25)", borderRadius: "20px", padding: "32px 28px", width: "100%", maxWidth: "400px" },
    avatar:     { width: "72px", height: "72px", borderRadius: "50%", background: "rgba(37,99,235,0.2)", border: "2px solid rgba(99,130,246,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "32px" },
    title:      { fontSize: "22px", fontWeight: "500", color: "#f0f6ff", textAlign: "center", marginBottom: "4px" },
    sub:        { fontSize: "13px", color: "rgba(148,163,184,0.7)", textAlign: "center", marginBottom: "24px" },
    label:      { display: "block", fontSize: "12px", color: "rgba(148,163,184,0.7)", marginBottom: "6px" },
    fieldWrap:  { position: "relative", marginBottom: "4px" },
    icon:       { position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", color: "rgba(99,130,246,0.6)", pointerEvents: "none" },
    input:      (err) => ({ width: "100%", background: "rgba(30,41,59,0.8)", border: `0.5px solid ${err ? "rgba(239,68,68,0.6)" : "rgba(99,130,246,0.2)"}`, borderRadius: "8px", padding: "10px 14px 10px 38px", color: "#e2e8f0", fontSize: "14px", outline: "none", boxSizing: "border-box" }),
    errMsg:     { fontSize: "11px", color: "#f87171", marginTop: "4px", marginBottom: "8px" },
    apiError:   { fontSize: "13px", color: "#f87171", textAlign: "center", marginBottom: "12px", padding: "10px", background: "rgba(239,68,68,0.1)", borderRadius: "8px", border: "0.5px solid rgba(239,68,68,0.3)" },
    btn:        { width: "100%", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", padding: "11px", fontSize: "14px", fontWeight: "500", cursor: "pointer", marginTop: "8px", opacity: isLoggingIn ? 0.7 : 1 },
    divider:    { display: "flex", alignItems: "center", gap: "10px", margin: "16px 0" },
    dividerLine:{ flex: 1, height: "0.5px", background: "rgba(99,130,246,0.2)" },
    switchText: { textAlign: "center", fontSize: "13px", color: "rgba(148,163,184,0.6)", marginTop: "8px" },
  }

  return (
    <div style={s.page}>
      <div style={s.orb1} />
      <div style={s.orb2} />
      <div style={s.orb3} />

      <div style={s.card}>

        <div style={s.avatar}>💬</div>

        <h1 style={s.title}>Chat<span style={{ color: "#60a5fa" }}>Pulse</span></h1>
        <p style={s.sub}>Welcome back</p>

        {/* api error */}
        {error && <p style={s.apiError}>{error}</p>}

        {/* email */}
        <div style={{ marginBottom: "14px" }}>
          <label style={s.label}>Email</label>
          <div style={s.fieldWrap}>
            <span style={s.icon}>✉</span>
            <input
              style={s.input(!!errors.email)}
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          {errors.email && <p style={s.errMsg}>⚠ {errors.email}</p>}
        </div>

        {/* password */}
        <div style={{ marginBottom: "14px" }}>
          <label style={s.label}>Password</label>
          <div style={s.fieldWrap}>
            <span style={s.icon}>🔒</span>
            <input
              style={s.input(!!errors.password)}
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          {errors.password && <p style={s.errMsg}>⚠ {errors.password}</p>}
        </div>

        <button style={s.btn} onClick={handleSubmit} disabled={isLoggingIn}>
          {isLoggingIn ? "Signing in..." : "Sign in"}
        </button>

        <div style={s.divider}>
          <div style={s.dividerLine} />
          <span style={{ fontSize: "11px", color: "rgba(148,163,184,0.4)" }}>or</span>
          <div style={s.dividerLine} />
        </div>

        <p style={s.switchText}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#60a5fa", textDecoration: "none" }}>
            Sign up free
          </Link>
        </p>

      </div>
    </div>
  )
}

export default LoginPage;