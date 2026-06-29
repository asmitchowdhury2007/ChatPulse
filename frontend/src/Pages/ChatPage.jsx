import { useState, useRef, useEffect } from "react"
import useAuthStore from "../Store/AuthStore.js"

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_CONTACTS = [
  { id: 1, name: "Aria Mehta",  avatar: "AM", status: "online",  lastSeen: "now" },
  { id: 2, name: "Dev Sharma",  avatar: "DS", status: "online",  lastSeen: "now" },
  { id: 3, name: "Kiran Roy",   avatar: "KR", status: "away",    lastSeen: "5m ago" },
  { id: 4, name: "Priya Nair",  avatar: "PN", status: "offline", lastSeen: "2h ago" },
  { id: 5, name: "Rohan Das",   avatar: "RD", status: "online",  lastSeen: "now" },
  { id: 6, name: "Sneha Iyer",  avatar: "SI", status: "offline", lastSeen: "yesterday" },
]

const MOCK_CHATS = [
  { id: 1, name: "Aria Mehta",  avatar: "AM", status: "online",  lastMsg: "Are you free tonight? 🎉",      time: "12:42 PM", unread: 2 },
  { id: 2, name: "Dev Sharma",  avatar: "DS", status: "online",  lastMsg: "Pushed the fix, check it out", time: "11:15 AM", unread: 0 },
  { id: 3, name: "Kiran Roy",   avatar: "KR", status: "away",    lastMsg: "Sounds good, see you then!",   time: "Yesterday",unread: 0 },
  { id: 4, name: "Priya Nair",  avatar: "PN", status: "offline", lastMsg: "Thanks for your help 🙏",      time: "Mon",      unread: 1 },
  { id: 5, name: "Rohan Das",   avatar: "RD", status: "online",  lastMsg: "Did you see the match?",       time: "Sun",      unread: 0 },
]

const MOCK_MESSAGES = {
  1: [
    { id: 1, from: "them", text: "Hey! How's it going?",                    time: "12:30 PM" },
    { id: 2, from: "me",   text: "Pretty good! Just wrapping up some work.", time: "12:32 PM" },
    { id: 3, from: "them", text: "Nice! Are you free tonight? 🎉",          time: "12:42 PM" },
  ],
  2: [
    { id: 1, from: "them", text: "There was a bug in the auth flow",        time: "11:00 AM" },
    { id: 2, from: "me",   text: "Yeah I saw it. Working on it.",           time: "11:05 AM" },
    { id: 3, from: "them", text: "Pushed the fix, check it out",            time: "11:15 AM" },
  ],
  3: [
    { id: 1, from: "me",   text: "Lunch at 1?",                             time: "Yesterday" },
    { id: 2, from: "them", text: "Sounds good, see you then!",              time: "Yesterday" },
  ],
  4: [
    { id: 1, from: "them", text: "Could you review my PR when free?",       time: "Mon" },
    { id: 2, from: "me",   text: "Sure, I'll take a look.",                 time: "Mon" },
    { id: 3, from: "them", text: "Thanks for your help 🙏",                 time: "Mon" },
  ],
  5: [
    { id: 1, from: "them", text: "Did you see the match?",                  time: "Sun" },
  ],
}

const statusColor = { online: "#22c55e", away: "#f59e0b", offline: "#64748b" }

// ─── Generic Avatar (for contacts / chat partners — NOT clickable) ────────────
function Avatar({ initials, size = 40, status, imgSrc }) {
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: "rgba(37,99,235,0.25)",
        border: "1.5px solid rgba(99,130,246,0.35)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.35, fontWeight: 500, color: "#93c5fd",
        overflow: "hidden",
      }}>
        {imgSrc
          ? <img src={imgSrc} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : initials}
      </div>
      {status && (
        <span style={{
          position: "absolute", bottom: 1, right: 1,
          width: size * 0.25, height: size * 0.25,
          borderRadius: "50%", background: statusColor[status],
          border: "1.5px solid #0f172a",
        }} />
      )}
    </div>
  )
}

// ─── Profile Avatar ───────────────────────────────────────────────────────────
// Accepts onUpload (the store action) — handles preview + upload in one place
function ProfileAvatar({ initials, size, imgSrc, onImageChange, onUpload }) {
  const [hovered, setHovered] = useState(false)
  const fileInputRef = useRef(null)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed (JPG, PNG, GIF, WebP…)")
      e.target.value = ""
      return
    }

    const reader = new FileReader()
    reader.onload = async (ev) => {
      const base64 = ev.target.result

      // 1. Show preview instantly
      onImageChange(base64)

      // 2. Upload to Cloudinary via store → backend
      if (onUpload) {
        const cloudinaryUrl = await onUpload(base64)
        // 3. Swap base64 preview with the real Cloudinary URL
        if (cloudinaryUrl) onImageChange(cloudinaryUrl)
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  return (
    <div
      style={{ position: "relative", flexShrink: 0, cursor: "pointer", userSelect: "none" }}
      onClick={() => fileInputRef.current.click()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title="Click to change profile photo"
    >
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: "rgba(37,99,235,0.25)",
        border: `2px solid ${hovered ? "rgba(99,130,246,0.8)" : "rgba(99,130,246,0.35)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.35, fontWeight: 500, color: "#93c5fd",
        overflow: "hidden", position: "relative",
        transition: "border-color 0.2s",
        boxShadow: hovered ? "0 0 0 3px rgba(37,99,235,0.25)" : "none",
      }}>
        {imgSrc
          ? <img src={imgSrc} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <span>{initials}</span>}

        {/* Camera overlay on hover */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: "rgba(0,0,0,0.6)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.2s",
        }}>
          <span style={{ fontSize: size * 0.3, lineHeight: 1 }}>📷</span>
          <span style={{ fontSize: size * 0.2, color: "#fff", fontWeight: 600, marginTop: 2 }}>Edit</span>
        </div>
      </div>

      {/* Online dot */}
      <span style={{
        position: "absolute", bottom: 1, right: 1,
        width: size * 0.25, height: size * 0.25,
        borderRadius: "50%", background: "#22c55e",
        border: "2px solid #0f172a", zIndex: 2,
      }} />

      {/* Hidden file input — images only */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/gif, image/webp, image/svg+xml"
        style={{ display: "none" }}
        onChange={handleFile}
      />
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({
  displayName, initials, profileImg, setProfileImg, onUpload,
  tab, setTab, search, setSearch,
  filteredChats, filteredContacts,
  activePeer, onSelectPeer, logout, onClose,
}) {
  const pill = {
    display: "flex", margin: "12px 12px 0",
    background: "rgba(30,41,59,0.5)", borderRadius: "10px", padding: "3px",
  }
  const tabBtn = (active) => ({
    flex: 1, padding: "7px 0", fontSize: "13px", fontWeight: active ? 500 : 400,
    color: active ? "#e2e8f0" : "rgba(148,163,184,0.55)",
    background: active ? "rgba(37,99,235,0.35)" : "transparent",
    border: "none", borderRadius: "8px", cursor: "pointer", transition: "all 0.15s",
  })
  const listItem = (active) => ({
    display: "flex", alignItems: "center", gap: "12px",
    padding: "10px 14px", cursor: "pointer",
    background: active ? "rgba(37,99,235,0.2)" : "transparent",
    borderLeft: active ? "2px solid #3b82f6" : "2px solid transparent",
    transition: "background 0.12s",
  })

  return (
    <>
      {/* Profile strip */}
      <div style={{
        display: "flex", alignItems: "center", gap: "12px",
        padding: "16px 16px 12px",
        borderBottom: "0.5px solid rgba(99,130,246,0.15)",
      }}>
        {/* ← onUpload is now correctly passed down */}
        <ProfileAvatar
          initials={initials}
          size={42}
          imgSrc={profileImg}
          onImageChange={setProfileImg}
          onUpload={onUpload}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "14px", fontWeight: 500, color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {displayName}
          </div>
          <div style={{ fontSize: "11px", color: "rgba(148,163,184,0.55)", marginTop: "1px" }}>● Online</div>
        </div>
        <button
          onClick={logout}
          style={{
            background: "rgba(239,68,68,0.1)", border: "0.5px solid rgba(239,68,68,0.3)",
            color: "#f87171", borderRadius: "8px", padding: "6px 10px",
            fontSize: "12px", fontWeight: 500, cursor: "pointer", flexShrink: 0,
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.22)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
        >Logout</button>
        {onClose && (
          <button onClick={onClose} style={{
            background: "transparent", border: "none",
            color: "rgba(148,163,184,0.5)", fontSize: "20px", cursor: "pointer",
          }}>✕</button>
        )}
      </div>

      {/* Tabs */}
      <div style={pill}>
        <button style={tabBtn(tab === "chats")}    onClick={() => setTab("chats")}>💬 Chats</button>
        <button style={tabBtn(tab === "contacts")} onClick={() => setTab("contacts")}>👥 Contacts</button>
      </div>

      {/* Search */}
      <div style={{ padding: "10px 12px 4px", position: "relative" }}>
        <span style={{ position: "absolute", left: "22px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", color: "rgba(99,130,246,0.5)", pointerEvents: "none" }}>🔍</span>
        <input
          style={{
            width: "100%", boxSizing: "border-box",
            background: "rgba(30,41,59,0.7)", border: "0.5px solid rgba(99,130,246,0.2)",
            borderRadius: "8px", padding: "8px 12px 8px 32px",
            color: "#e2e8f0", fontSize: "13px", outline: "none",
          }}
          placeholder={tab === "chats" ? "Search chats…" : "Search contacts…"}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* List */}
      <div className="cp-list" style={{ flex: 1, overflowY: "auto", padding: "6px 0" }}>
        {tab === "chats"
          ? filteredChats.length === 0
            ? <p style={{ textAlign: "center", color: "rgba(148,163,184,0.35)", fontSize: "13px", marginTop: "24px" }}>No chats found</p>
            : filteredChats.map((chat) => (
              <div key={chat.id} style={listItem(activePeer?.id === chat.id)}
                onClick={() => onSelectPeer(chat)}
                onMouseEnter={(e) => { if (activePeer?.id !== chat.id) e.currentTarget.style.background = "rgba(37,99,235,0.1)" }}
                onMouseLeave={(e) => { if (activePeer?.id !== chat.id) e.currentTarget.style.background = "transparent" }}
              >
                <Avatar initials={chat.avatar} size={42} status={chat.status} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "14px", fontWeight: 500, color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{chat.name}</div>
                  <div style={{ fontSize: "12px", color: "rgba(148,163,184,0.55)", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{chat.lastMsg}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", flexShrink: 0 }}>
                  <span style={{ fontSize: "11px", color: "rgba(148,163,184,0.4)" }}>{chat.time}</span>
                  {chat.unread > 0 && (
                    <span style={{ background: "#2563eb", color: "#fff", borderRadius: "50%", width: "18px", height: "18px", fontSize: "11px", fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>{chat.unread}</span>
                  )}
                </div>
              </div>
            ))
          : filteredContacts.length === 0
            ? <p style={{ textAlign: "center", color: "rgba(148,163,184,0.35)", fontSize: "13px", marginTop: "24px" }}>No contacts found</p>
            : filteredContacts.map((contact) => (
              <div key={contact.id} style={listItem(activePeer?.id === contact.id)}
                onClick={() => onSelectPeer(contact)}
                onMouseEnter={(e) => { if (activePeer?.id !== contact.id) e.currentTarget.style.background = "rgba(37,99,235,0.1)" }}
                onMouseLeave={(e) => { if (activePeer?.id !== contact.id) e.currentTarget.style.background = "transparent" }}
              >
                <Avatar initials={contact.avatar} size={42} status={contact.status} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "14px", fontWeight: 500, color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{contact.name}</div>
                  <div style={{ fontSize: "12px", color: "rgba(148,163,184,0.55)", marginTop: "2px" }}>{contact.status === "online" ? "Online" : `Last seen ${contact.lastSeen}`}</div>
                </div>
              </div>
            ))
        }
      </div>
    </>
  )
}

// ─── ChatPage ─────────────────────────────────────────────────────────────────
function ChatPage() {
  // ── All hooks at the top, nothing outside this function ──
  const { authUser, logout, updateProfilePic } = useAuthStore()

  const [tab, setTab]                     = useState("chats")
  const [activePeer, setActivePeer]       = useState(null)
  const [messages, setMessages]           = useState(MOCK_MESSAGES)
  const [input, setInput]                 = useState("")
  const [mobilePanelOpen, setMobilePanel] = useState(false)
  const [search, setSearch]               = useState("")
  const [profileImg, setProfileImg]       = useState(null)

  const bottomRef = useRef(null)

  // Sync profile pic from authUser whenever it changes (fixes refresh issue)
  useEffect(() => {
    if (authUser?.profilePic) setProfileImg(authUser.profilePic)
  }, [authUser])

  // Auto scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, activePeer])

  const handleSelectPeer = (peer) => {
    setActivePeer(peer)
    setMobilePanel(false)
  }

  const handleSend = () => {
    if (!input.trim() || !activePeer) return
    const msg = {
      id: Date.now(), from: "me", text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((prev) => ({ ...prev, [activePeer.id]: [...(prev[activePeer.id] || []), msg] }))
    setInput("")
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  // fullname (lowercase n) matches your MongoDB field
  const displayName = authUser?.fullname || authUser?.fullName || authUser?.name || "You"
  const initials    = displayName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()

  const filteredChats    = MOCK_CHATS.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
  const filteredContacts = MOCK_CONTACTS.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))

  const sidebarProps = {
    displayName, initials, profileImg, setProfileImg,
    onUpload: updateProfilePic,   // ← store action passed as onUpload
    tab, setTab, search, setSearch,
    filteredChats, filteredContacts,
    activePeer, onSelectPeer: handleSelectPeer, logout,
  }

  const peerMsgs = activePeer ? (messages[activePeer.id] || []) : []

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        @media (max-width: 640px) {
          .cp-sidebar       { display: none !important; }
          .cp-mobile-topbar { display: flex !important; }
          .cp-back-btn      { display: flex !important; align-items: center !important; }
        }
        @media (min-width: 641px) {
          .cp-sidebar        { display: flex !important; }
          .cp-mobile-topbar  { display: none !important; }
          .cp-back-btn       { display: none !important; }
          .cp-mobile-overlay { display: none !important; }
          .cp-mobile-drawer  { display: none !important; }
        }
        .cp-msg-area::-webkit-scrollbar,
        .cp-list::-webkit-scrollbar { width: 4px; }
        .cp-msg-area::-webkit-scrollbar-thumb,
        .cp-list::-webkit-scrollbar-thumb { background: rgba(99,130,246,0.25); border-radius: 4px; }
        textarea::placeholder, input::placeholder { color: rgba(148,163,184,0.35); }
      `}</style>

      <div style={{ minHeight: "100vh", display: "flex", alignItems: "stretch", position: "relative", overflow: "hidden", background: "#060d1f" }}>

        {/* Orbs */}
        <div style={{ position: "fixed", top: "-120px", left: "-120px", width: "440px", height: "440px", background: "#1e40af", borderRadius: "50%", filter: "blur(110px)", opacity: 0.45, pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "fixed", bottom: "-120px", right: "-120px", width: "440px", height: "440px", background: "#2563eb", borderRadius: "50%", filter: "blur(110px)", opacity: 0.45, pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "340px", height: "340px", background: "#4f46e5", borderRadius: "50%", filter: "blur(110px)", opacity: 0.18, pointerEvents: "none", zIndex: 0 }} />

        {/* Mobile overlay */}
        <div className="cp-mobile-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50, display: mobilePanelOpen ? "block" : "none" }} onClick={() => setMobilePanel(false)} />

        {/* Mobile drawer */}
        <div className="cp-mobile-drawer" style={{
          position: "fixed", top: 0, left: 0, bottom: 0, width: "82vw", maxWidth: "320px",
          zIndex: 51, display: "flex", flexDirection: "column",
          background: "rgba(8,14,32,0.97)", borderRight: "0.5px solid rgba(99,130,246,0.18)",
          backdropFilter: "blur(24px)",
          transform: mobilePanelOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s cubic-bezier(.4,0,.2,1)",
        }}>
          <Sidebar {...sidebarProps} onClose={() => setMobilePanel(false)} />
        </div>

        {/* Main layout */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", width: "100%", minHeight: "100vh" }}>

          {/* Desktop sidebar */}
          <div className="cp-sidebar" style={{
            width: "320px", minWidth: "280px", maxWidth: "320px", flexShrink: 0,
            display: "flex", flexDirection: "column",
            background: "rgba(10,18,40,0.72)", borderRight: "0.5px solid rgba(99,130,246,0.18)",
            backdropFilter: "blur(18px)",
          }}>
            <Sidebar {...sidebarProps} />
          </div>

          {/* Chat window */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "rgba(8,14,32,0.6)", backdropFilter: "blur(12px)", minWidth: 0 }}>

            {/* Mobile top bar */}
            <div className="cp-mobile-topbar" style={{ display: "none", alignItems: "center", gap: "10px", padding: "12px 14px", borderBottom: "0.5px solid rgba(99,130,246,0.15)", background: "rgba(10,18,40,0.7)" }}>
              <button style={{ background: "transparent", border: "none", color: "#60a5fa", fontSize: "22px", cursor: "pointer" }} onClick={() => setMobilePanel(true)}>☰</button>
              <span style={{ flex: 1, fontSize: "17px", fontWeight: 500, color: "#f0f6ff" }}>Chat<span style={{ color: "#60a5fa" }}>Pulse</span></span>
              <ProfileAvatar
                initials={initials}
                size={32}
                imgSrc={profileImg}
                onImageChange={setProfileImg}
                onUpload={updateProfilePic}
              />
            </div>

            {activePeer ? (
              <>
                {/* Chat header */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 20px", borderBottom: "0.5px solid rgba(99,130,246,0.15)", background: "rgba(10,18,40,0.5)" }}>
                  <button className="cp-back-btn" style={{ display: "none", background: "transparent", border: "none", color: "#60a5fa", fontSize: "22px", cursor: "pointer", padding: "0 4px 0 0" }} onClick={() => setActivePeer(null)}>←</button>
                  <Avatar initials={activePeer.avatar} size={40} status={activePeer.status} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "15px", fontWeight: 500, color: "#f0f6ff" }}>{activePeer.name}</div>
                    <div style={{ fontSize: "12px", color: "rgba(148,163,184,0.55)", marginTop: "1px" }}>
                      {activePeer.status === "online" ? "● Online" : activePeer.status === "away" ? "● Away" : "○ Offline"}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="cp-msg-area" style={{ flex: 1, overflowY: "auto", padding: "20px 20px 12px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {peerMsgs.length === 0 && (
                    <div style={{ textAlign: "center", color: "rgba(148,163,184,0.3)", fontSize: "13px", marginTop: "32px" }}>No messages yet. Say hello! 👋</div>
                  )}
                  {peerMsgs.map((msg) => (
                    <div key={msg.id} style={{
                      maxWidth: "68%", alignSelf: msg.from === "me" ? "flex-end" : "flex-start",
                      background: msg.from === "me" ? "rgba(37,99,235,0.75)" : "rgba(30,41,59,0.85)",
                      border: msg.from === "me" ? "0.5px solid rgba(99,130,246,0.4)" : "0.5px solid rgba(99,130,246,0.15)",
                      borderRadius: msg.from === "me" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      padding: "10px 14px",
                    }}>
                      <div style={{ fontSize: "14px", color: "#e2e8f0", lineHeight: 1.5, wordBreak: "break-word" }}>{msg.text}</div>
                      <div style={{ fontSize: "10px", color: "rgba(148,163,184,0.4)", marginTop: "4px", textAlign: "right" }}>{msg.time}</div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>

                {/* Input bar */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", padding: "12px 16px 16px", borderTop: "0.5px solid rgba(99,130,246,0.15)", background: "rgba(10,18,40,0.5)" }}>
                  <textarea
                    style={{ flex: 1, background: "rgba(30,41,59,0.8)", border: "0.5px solid rgba(99,130,246,0.2)", borderRadius: "12px", padding: "10px 14px", color: "#e2e8f0", fontSize: "14px", outline: "none", resize: "none", lineHeight: 1.5, maxHeight: "120px", overflowY: "auto", fontFamily: "inherit" }}
                    rows={1}
                    placeholder="Type a message…"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    style={{ background: "#2563eb", border: "none", borderRadius: "12px", width: "42px", height: "42px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", fontSize: "18px", opacity: input.trim() ? 1 : 0.45, transition: "opacity 0.15s" }}
                  >➤</button>
                </div>
              </>
            ) : (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                <div style={{ fontSize: "48px", opacity: 0.25 }}>💬</div>
                <div style={{ fontSize: "18px", fontWeight: 500, color: "#f0f6ff" }}>Chat<span style={{ color: "#60a5fa" }}>Pulse</span></div>
                <div style={{ fontSize: "16px", fontWeight: 500, color: "rgba(148,163,184,0.5)" }}>Pick a conversation to start chatting</div>
                <div style={{ fontSize: "13px", color: "rgba(148,163,184,0.3)" }}>Your messages are end-to-end encrypted</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatPage