import { useState, useRef, useEffect } from "react"
import useAuthStore from "../Store/AuthStore.js"

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_CONTACTS = [
  { id: 1, name: "Aria Mehta", avatar: "AM", status: "online", lastSeen: "now" },
  { id: 2, name: "Dev Sharma", avatar: "DS", status: "online", lastSeen: "now" },
  { id: 3, name: "Kiran Roy", avatar: "KR", status: "away", lastSeen: "5m ago" },
  { id: 4, name: "Priya Nair", avatar: "PN", status: "offline", lastSeen: "2h ago" },
  { id: 5, name: "Rohan Das", avatar: "RD", status: "online", lastSeen: "now" },
  { id: 6, name: "Sneha Iyer", avatar: "SI", status: "offline", lastSeen: "yesterday" },
]

const MOCK_CHATS = [
  { id: 1, name: "Aria Mehta", avatar: "AM", status: "online", lastMsg: "Are you free tonight? 🎉", time: "12:42 PM", unread: 2 },
  { id: 2, name: "Dev Sharma", avatar: "DS", status: "online", lastMsg: "Pushed the fix, check it out", time: "11:15 AM", unread: 0 },
  { id: 3, name: "Kiran Roy", avatar: "KR", status: "away", lastMsg: "Sounds good, see you then!", time: "Yesterday", unread: 0 },
  { id: 4, name: "Priya Nair", avatar: "PN", status: "offline", lastMsg: "Thanks for your help 🙏", time: "Mon", unread: 1 },
  { id: 5, name: "Rohan Das", avatar: "RD", status: "online", lastMsg: "Did you see the match?", time: "Sun", unread: 0 },
]

const MOCK_MESSAGES = {
  1: [
    { id: 1, from: "them", text: "Hey! How's it going?", time: "12:30 PM" },
    { id: 2, from: "me", text: "Pretty good! Just wrapping up some work.", time: "12:32 PM" },
    { id: 3, from: "them", text: "Nice! Are you free tonight? 🎉", time: "12:42 PM" },
  ],
  2: [
    { id: 1, from: "them", text: "There was a bug in the auth flow", time: "11:00 AM" },
    { id: 2, from: "me", text: "Yeah I saw it. Working on it.", time: "11:05 AM" },
    { id: 3, from: "them", text: "Pushed the fix, check it out", time: "11:15 AM" },
  ],
  3: [
    { id: 1, from: "me", text: "Lunch at 1?", time: "Yesterday" },
    { id: 2, from: "them", text: "Sounds good, see you then!", time: "Yesterday" },
  ],
  4: [
    { id: 1, from: "them", text: "Could you review my PR when you get a chance?", time: "Mon" },
    { id: 2, from: "me", text: "Sure, I'll take a look.", time: "Mon" },
    { id: 3, from: "them", text: "Thanks for your help 🙏", time: "Mon" },
  ],
  5: [
    { id: 1, from: "them", text: "Did you see the match?", time: "Sun" },
  ],
}

// ─── Status dot ───────────────────────────────────────────────────────────────
const statusColor = { online: "#22c55e", away: "#f59e0b", offline: "#64748b" }

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ initials, size = 40, status }) {
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: "rgba(37,99,235,0.25)",
        border: "1.5px solid rgba(99,130,246,0.35)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.35, fontWeight: 500, color: "#93c5fd",
        letterSpacing: "0.02em",
      }}>
        {initials}
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

// ─── Main Component ───────────────────────────────────────────────────────────
function ChatPage() {
  const { authUser, logout } = useAuthStore()

  const [tab, setTab] = useState("chats")          // "chats" | "contacts"
  const [activePeer, setActivePeer] = useState(null) // the selected user object
  const [messages, setMessages] = useState({})
  const [input, setInput] = useState("")
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false) // sidebar on mobile
  const [search, setSearch] = useState("")
  const bottomRef = useRef(null)

  // Seed mock messages
  useEffect(() => { setMessages(MOCK_MESSAGES) }, [])

  // Auto-scroll on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, activePeer])

  const handleSelectPeer = (peer) => {
    setActivePeer(peer)
    setMobilePanelOpen(false)
  }

  const handleSend = () => {
    if (!input.trim() || !activePeer) return
    const newMsg = {
      id: Date.now(),
      from: "me",
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((prev) => ({
      ...prev,
      [activePeer.id]: [...(prev[activePeer.id] || []), newMsg],
    }))
    setInput("")
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const displayName = authUser?.fullname || authUser?.name || "You"
  const initials = displayName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()

  const filteredContacts = MOCK_CONTACTS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )
  const filteredChats = MOCK_CHATS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  // ─── Style tokens (mirrors LoginPage palette) ──────────────────────────────
  const s = {
    // Page shell
    page: {
      minHeight: "100vh", display: "flex", alignItems: "stretch",
      position: "relative", overflow: "hidden", background: "#060d1f",
    },
    orb1: { position: "fixed", top: "-120px", left: "-120px", width: "440px", height: "440px", background: "#1e40af", borderRadius: "50%", filter: "blur(110px)", opacity: 0.45, pointerEvents: "none", zIndex: 0 },
    orb2: { position: "fixed", bottom: "-120px", right: "-120px", width: "440px", height: "440px", background: "#2563eb", borderRadius: "50%", filter: "blur(110px)", opacity: 0.45, pointerEvents: "none", zIndex: 0 },
    orb3: { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "340px", height: "340px", background: "#4f46e5", borderRadius: "50%", filter: "blur(110px)", opacity: 0.18, pointerEvents: "none", zIndex: 0 },

    // Layout
    layout: {
      position: "relative", zIndex: 1, display: "flex", width: "100%",
      minHeight: "100vh",
    },

    // ── Sidebar ──
    sidebar: {
      width: "320px", minWidth: "280px", maxWidth: "320px", flexShrink: 0,
      display: "flex", flexDirection: "column",
      background: "rgba(10,18,40,0.72)",
      borderRight: "0.5px solid rgba(99,130,246,0.18)",
      backdropFilter: "blur(18px)",
    },

    // Profile strip at top of sidebar
    profileStrip: {
      display: "flex", alignItems: "center", gap: "12px",
      padding: "16px 16px 12px",
      borderBottom: "0.5px solid rgba(99,130,246,0.15)",
    },
    profileName: { flex: 1, fontSize: "14px", fontWeight: 500, color: "#e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
    profileSub: { fontSize: "11px", color: "rgba(148,163,184,0.55)", marginTop: "1px" },
    logoutBtn: {
      background: "rgba(239,68,68,0.1)", border: "0.5px solid rgba(239,68,68,0.3)",
      color: "#f87171", borderRadius: "8px", padding: "6px 10px",
      fontSize: "12px", fontWeight: 500, cursor: "pointer", flexShrink: 0,
      transition: "background 0.15s",
    },

    // Tabs
    tabRow: {
      display: "flex", gap: "0", margin: "12px 12px 0",
      background: "rgba(30,41,59,0.5)", borderRadius: "10px", padding: "3px",
    },
    tab: (active) => ({
      flex: 1, padding: "7px 0", fontSize: "13px", fontWeight: active ? 500 : 400,
      color: active ? "#e2e8f0" : "rgba(148,163,184,0.55)",
      background: active ? "rgba(37,99,235,0.35)" : "transparent",
      border: "none", borderRadius: "8px", cursor: "pointer",
      transition: "all 0.15s",
    }),

    // Search
    searchWrap: { padding: "10px 12px 4px", position: "relative" },
    searchIcon: { position: "absolute", left: "22px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", color: "rgba(99,130,246,0.5)", pointerEvents: "none" },
    searchInput: {
      width: "100%", boxSizing: "border-box",
      background: "rgba(30,41,59,0.7)", border: "0.5px solid rgba(99,130,246,0.2)",
      borderRadius: "8px", padding: "8px 12px 8px 32px",
      color: "#e2e8f0", fontSize: "13px", outline: "none",
    },

    // List
    list: { flex: 1, overflowY: "auto", padding: "6px 0" },
    listItem: (active) => ({
      display: "flex", alignItems: "center", gap: "12px",
      padding: "10px 14px", cursor: "pointer",
      background: active ? "rgba(37,99,235,0.2)" : "transparent",
      borderLeft: active ? "2px solid #3b82f6" : "2px solid transparent",
      transition: "background 0.12s",
    }),
    itemBody: { flex: 1, minWidth: 0 },
    itemName: { fontSize: "14px", fontWeight: 500, color: "#e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
    itemSub: { fontSize: "12px", color: "rgba(148,163,184,0.55)", marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
    itemMeta: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", flexShrink: 0 },
    itemTime: { fontSize: "11px", color: "rgba(148,163,184,0.4)" },
    badge: {
      background: "#2563eb", color: "#fff", borderRadius: "50%",
      width: "18px", height: "18px", fontSize: "11px", fontWeight: 500,
      display: "flex", alignItems: "center", justifyContent: "center",
    },

    // ── Chat window ──
    chatWindow: {
      flex: 1, display: "flex", flexDirection: "column",
      background: "rgba(8,14,32,0.6)", backdropFilter: "blur(12px)",
      minWidth: 0,
    },

    // Chat header
    chatHeader: {
      display: "flex", alignItems: "center", gap: "12px",
      padding: "14px 20px", borderBottom: "0.5px solid rgba(99,130,246,0.15)",
      background: "rgba(10,18,40,0.5)",
    },
    chatHeaderName: { flex: 1, fontSize: "15px", fontWeight: 500, color: "#f0f6ff" },
    chatHeaderSub: { fontSize: "12px", color: "rgba(148,163,184,0.55)", marginTop: "1px" },
    backBtn: {
      display: "none", // shown via inline style on mobile
      background: "transparent", border: "none", color: "#60a5fa",
      fontSize: "22px", cursor: "pointer", padding: "0 4px 0 0",
    },

    // Messages area
    msgArea: {
      flex: 1, overflowY: "auto", padding: "20px 20px 12px",
      display: "flex", flexDirection: "column", gap: "10px",
    },

    // Bubble
    bubble: (fromMe) => ({
      maxWidth: "68%", alignSelf: fromMe ? "flex-end" : "flex-start",
      background: fromMe ? "rgba(37,99,235,0.75)" : "rgba(30,41,59,0.85)",
      border: fromMe ? "0.5px solid rgba(99,130,246,0.4)" : "0.5px solid rgba(99,130,246,0.15)",
      borderRadius: fromMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
      padding: "10px 14px",
    }),
    bubbleText: { fontSize: "14px", color: "#e2e8f0", lineHeight: 1.5, wordBreak: "break-word" },
    bubbleTime: { fontSize: "10px", color: "rgba(148,163,184,0.4)", marginTop: "4px", textAlign: "right" },

    // Empty state
    emptyState: {
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: "12px",
    },
    emptyIcon: { fontSize: "48px", opacity: 0.25 },
    emptyTitle: { fontSize: "16px", fontWeight: 500, color: "rgba(148,163,184,0.5)" },
    emptySub: { fontSize: "13px", color: "rgba(148,163,184,0.3)" },

    // Input bar
    inputBar: {
      display: "flex", alignItems: "flex-end", gap: "10px",
      padding: "12px 16px 16px",
      borderTop: "0.5px solid rgba(99,130,246,0.15)",
      background: "rgba(10,18,40,0.5)",
    },
    textarea: {
      flex: 1, background: "rgba(30,41,59,0.8)",
      border: "0.5px solid rgba(99,130,246,0.2)", borderRadius: "12px",
      padding: "10px 14px", color: "#e2e8f0", fontSize: "14px",
      outline: "none", resize: "none", lineHeight: 1.5,
      maxHeight: "120px", overflowY: "auto", fontFamily: "inherit",
    },
    sendBtn: {
      background: "#2563eb", border: "none", borderRadius: "12px",
      width: "42px", height: "42px", flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", color: "#fff", fontSize: "18px",
      opacity: input.trim() ? 1 : 0.45,
      transition: "opacity 0.15s",
    },

    // Mobile overlay sidebar
    mobileOverlay: {
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      zIndex: 50, display: mobilePanelOpen ? "block" : "none",
    },
    mobileSidebar: {
      position: "fixed", top: 0, left: 0, bottom: 0,
      width: "82vw", maxWidth: "320px",
      zIndex: 51, display: "flex", flexDirection: "column",
      background: "rgba(8,14,32,0.96)",
      borderRight: "0.5px solid rgba(99,130,246,0.18)",
      backdropFilter: "blur(24px)",
      transform: mobilePanelOpen ? "translateX(0)" : "translateX(-100%)",
      transition: "transform 0.25s cubic-bezier(.4,0,.2,1)",
    },

    // Mobile top bar (shown when no peer selected, instead of sidebar)
    mobileTopBar: {
      display: "flex", alignItems: "center", gap: "10px",
      padding: "12px 14px", borderBottom: "0.5px solid rgba(99,130,246,0.15)",
      background: "rgba(10,18,40,0.7)",
    },
    menuBtn: {
      background: "transparent", border: "none", color: "#60a5fa",
      fontSize: "22px", cursor: "pointer", padding: "2px",
    },
    appTitle: { flex: 1, fontSize: "17px", fontWeight: 500, color: "#f0f6ff" },
  }

  // ─── Sidebar content (shared between desktop sidebar + mobile drawer) ───────
  const SidebarContent = ({ onClose }) => (
    <>
      {/* Profile strip */}
      <div style={s.profileStrip}>
        <Avatar initials={initials} size={38} status="online" />
        <div style={s.itemBody}>
          <div style={s.profileName}>{displayName}</div>
          <div style={s.profileSub}>● Online</div>
        </div>
        <button
          style={s.logoutBtn}
          onClick={logout}
          onMouseEnter={(e) => e.target.style.background = "rgba(239,68,68,0.2)"}
          onMouseLeave={(e) => e.target.style.background = "rgba(239,68,68,0.1)"}
        >
          Logout
        </button>
        {onClose && (
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "rgba(148,163,184,0.5)", fontSize: "20px", cursor: "pointer", marginLeft: "2px" }}>✕</button>
        )}
      </div>

      {/* Tabs */}
      <div style={s.tabRow}>
        <button style={s.tab(tab === "chats")} onClick={() => setTab("chats")}>💬 Chats</button>
        <button style={s.tab(tab === "contacts")} onClick={() => setTab("contacts")}>👥 Contacts</button>
      </div>

      {/* Search */}
      <div style={s.searchWrap}>
        <span style={s.searchIcon}>🔍</span>
        <input
          style={s.searchInput}
          placeholder={tab === "chats" ? "Search chats…" : "Search contacts…"}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* List */}
      <div style={s.list}>
        {tab === "chats" ? (
          filteredChats.length === 0
            ? <p style={{ textAlign: "center", color: "rgba(148,163,184,0.35)", fontSize: "13px", marginTop: "24px" }}>No chats found</p>
            : filteredChats.map((chat) => (
              <div
                key={chat.id}
                style={s.listItem(activePeer?.id === chat.id)}
                onClick={() => handleSelectPeer(chat)}
                onMouseEnter={(e) => { if (activePeer?.id !== chat.id) e.currentTarget.style.background = "rgba(37,99,235,0.1)" }}
                onMouseLeave={(e) => { if (activePeer?.id !== chat.id) e.currentTarget.style.background = "transparent" }}
              >
                <Avatar initials={chat.avatar} size={42} status={chat.status} />
                <div style={s.itemBody}>
                  <div style={s.itemName}>{chat.name}</div>
                  <div style={s.itemSub}>{chat.lastMsg}</div>
                </div>
                <div style={s.itemMeta}>
                  <span style={s.itemTime}>{chat.time}</span>
                  {chat.unread > 0 && <span style={s.badge}>{chat.unread}</span>}
                </div>
              </div>
            ))
        ) : (
          filteredContacts.length === 0
            ? <p style={{ textAlign: "center", color: "rgba(148,163,184,0.35)", fontSize: "13px", marginTop: "24px" }}>No contacts found</p>
            : filteredContacts.map((contact) => (
              <div
                key={contact.id}
                style={s.listItem(activePeer?.id === contact.id)}
                onClick={() => handleSelectPeer(contact)}
                onMouseEnter={(e) => { if (activePeer?.id !== contact.id) e.currentTarget.style.background = "rgba(37,99,235,0.1)" }}
                onMouseLeave={(e) => { if (activePeer?.id !== contact.id) e.currentTarget.style.background = "transparent" }}
              >
                <Avatar initials={contact.avatar} size={42} status={contact.status} />
                <div style={s.itemBody}>
                  <div style={s.itemName}>{contact.name}</div>
                  <div style={s.itemSub}>{contact.status === "online" ? "Online" : `Last seen ${contact.lastSeen}`}</div>
                </div>
              </div>
            ))
        )}
      </div>
    </>
  )

  const peerMessages = activePeer ? (messages[activePeer.id] || []) : []

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* Global responsive style injected once */}
      <style>{`
        @media (max-width: 640px) {
          .cp-sidebar { display: none !important; }
          .cp-mobile-topbar { display: flex !important; }
          .cp-back-btn { display: flex !important; align-items: center !important; }
        }
        @media (min-width: 641px) {
          .cp-sidebar { display: flex !important; }
          .cp-mobile-topbar { display: none !important; }
          .cp-back-btn { display: none !important; }
          .cp-mobile-overlay { display: none !important; }
          .cp-mobile-drawer { display: none !important; }
        }
        .cp-msg-area::-webkit-scrollbar,
        .cp-list::-webkit-scrollbar { width: 4px; }
        .cp-msg-area::-webkit-scrollbar-thumb,
        .cp-list::-webkit-scrollbar-thumb { background: rgba(99,130,246,0.25); border-radius: 4px; }
        .cp-textarea::placeholder { color: rgba(148,163,184,0.35); }
        .cp-search-input::placeholder { color: rgba(148,163,184,0.35); }
        * { box-sizing: border-box; }
      `}</style>

      <div style={s.page}>
        {/* Orbs */}
        <div style={s.orb1} />
        <div style={s.orb2} />
        <div style={s.orb3} />

        {/* ── Mobile: overlay + drawer ── */}
        <div className="cp-mobile-overlay" style={s.mobileOverlay} onClick={() => setMobilePanelOpen(false)} />
        <div className="cp-mobile-drawer" style={s.mobileSidebar}>
          <SidebarContent onClose={() => setMobilePanelOpen(false)} />
        </div>

        {/* ── Layout ── */}
        <div style={s.layout}>

          {/* Desktop Sidebar */}
          <div className="cp-sidebar" style={{ ...s.sidebar, display: "flex", flexDirection: "column" }}>
            <SidebarContent />
          </div>

          {/* Chat Window */}
          <div style={s.chatWindow}>

            {/* Mobile top bar (no peer selected) */}
            <div className="cp-mobile-topbar" style={{ ...s.mobileTopBar, display: "none" }}>
              <button style={s.menuBtn} onClick={() => setMobilePanelOpen(true)}>☰</button>
              <span style={s.appTitle}>Chat<span style={{ color: "#60a5fa" }}>Pulse</span></span>
              {authUser && <Avatar initials={initials} size={32} status="online" />}
            </div>

            {activePeer ? (
              <>
                {/* Chat header */}
                <div style={s.chatHeader}>
                  <button
                    className="cp-back-btn"
                    style={{ ...s.backBtn, display: "none" }}
                    onClick={() => setActivePeer(null)}
                  >
                    ←
                  </button>
                  <Avatar initials={activePeer.avatar} size={40} status={activePeer.status} />
                  <div style={s.itemBody}>
                    <div style={s.chatHeaderName}>{activePeer.name}</div>
                    <div style={s.chatHeaderSub}>
                      {activePeer.status === "online" ? "● Online" : activePeer.status === "away" ? "● Away" : "○ Offline"}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="cp-msg-area" style={s.msgArea}>
                  {peerMessages.length === 0 && (
                    <div style={{ textAlign: "center", color: "rgba(148,163,184,0.3)", fontSize: "13px", marginTop: "32px" }}>
                      No messages yet. Say hello! 👋
                    </div>
                  )}
                  {peerMessages.map((msg) => (
                    <div key={msg.id} style={s.bubble(msg.from === "me")}>
                      <div style={s.bubbleText}>{msg.text}</div>
                      <div style={s.bubbleTime}>{msg.time}</div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>

                {/* Input bar */}
                <div style={s.inputBar}>
                  <textarea
                    className="cp-textarea"
                    style={s.textarea}
                    rows={1}
                    placeholder="Type a message…"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button style={s.sendBtn} onClick={handleSend} disabled={!input.trim()}>
                    ➤
                  </button>
                </div>
              </>
            ) : (
              /* Empty / welcome state */
              <div style={s.emptyState}>
                <div style={s.emptyIcon}>💬</div>
                <div style={s.chatHeaderName}>Chat<span style={{ color: "#60a5fa" }}>Pulse</span></div>
                <div style={s.emptyTitle}>Pick a conversation to start chatting</div>
                <div style={s.emptySub}>Your messages are end-to-end encrypted</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatPage
