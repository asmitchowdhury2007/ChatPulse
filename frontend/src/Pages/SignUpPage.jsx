
import { useState } from "react"
import { Link, useNavigate } from "react-router"
import {useAuthStore} from "../Store/useAuthStore.js"


function SignupPage() {

  const navigate  = useNavigate()
  const { signup, isSigningUp, error } = useAuthStore()

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  })
  const [errors, setErrors]               = useState({})
  const [passwordStrength, setStrength]   = useState(0)

  // ─── Regex ────────────────────────────────────────────────────
  const fullnameRegex = /^[a-zA-Z\s]{3,50}$/
  const emailRegex    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

  // ─── Password strength checker ────────────────────────────────
  const checkStrength = (password) => {
    let s = 0
    if (password.length >= 8)       s++
    if (/[A-Z]/.test(password))     s++
    if (/\d/.test(password))        s++
    if (/[@$!%*?&]/.test(password)) s++
    setStrength(s)
  }

  // ─── Handle input change ──────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setErrors({ ...errors, [name]: "" })
    if (name === "password") checkStrength(value)
  }

  // ─── Validate ─────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {}
    if (!fullnameRegex.test(formData.fullname))
      newErrors.fullname = "Name must be 3–50 characters, letters only"
    if (!emailRegex.test(formData.email))
      newErrors.email = "Enter a valid email address"
    if (!passwordRegex.test(formData.password))
      newErrors.password = "Min 8 chars with uppercase, number and special character"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ─── Handle submit ────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return
    await signup(formData);
    
  }

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][passwordStrength]
  const strengthColor = ["", "#ef4444", "#f59e0b", "#3b82f6", "#10b981"][passwordStrength]

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
    btn:        { width: "100%", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", padding: "11px", fontSize: "14px", fontWeight: "500", cursor: "pointer", marginTop: "8px", opacity: isSigningUp ? 0.7 : 1 },
    switchText: { textAlign: "center", fontSize: "13px", color: "rgba(148,163,184,0.6)", marginTop: "16px" },
  }

  return (
    <div style={s.page}>
      
        <div style={s.orb1} />
        <div style={s.orb2} />
      <div style={s.orb3} />
      
      <div style={s.card}>

        <div style={s.avatar}>👤</div>

        <h1 style={s.title}>Chat<span style={{ color: "#60a5fa" }}>Pulse</span></h1>
        <p style={s.sub}>Create your account</p>

        {/* api error */}
        {error && <p style={s.apiError}>{error}</p>}

        {/* fullname */}
        <div style={{ marginBottom: "14px" }}>
          <label style={s.label}>Full name</label>
          <div style={s.fieldWrap}>
            <span style={s.icon}>👤</span>
            <input
              style={s.input(!!errors.fullname)}
              type="text"
              name="fullname"
              placeholder="John Doe"
              value={formData.fullname}
              onChange={handleChange}
            />
          </div>
          {errors.fullname && <p style={s.errMsg}>⚠ {errors.fullname}</p>}
        </div>

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

          {/* strength bar */}
          {formData.password && (
            <>
              <div style={{ display: "flex", gap: "4px", marginTop: "6px" }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} style={{
                    flex: 1, height: "3px", borderRadius: "2px",
                    background: i <= passwordStrength ? strengthColor : "rgba(99,130,246,0.15)",
                    transition: "background 0.3s",
                  }} />
                ))}
              </div>
              <p style={{ fontSize: "11px", color: strengthColor, marginTop: "4px" }}>
                {strengthLabel} password
              </p>
            </>
          )}

          {errors.password && <p style={s.errMsg}>⚠ {errors.password}</p>}
        </div>

        <button style={s.btn} onClick={handleSubmit} disabled={isSigningUp}>
          {isSigningUp ? "Creating account..." : "Create account"}
        </button>

        <p style={s.switchText}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#60a5fa", textDecoration: "none" }}>
            Sign in
          </Link>
        </p>

      </div>
      
    </div>
  )
}

export default SignupPage;