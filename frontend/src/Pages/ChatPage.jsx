import { useState, useRef, useEffect } from "react"
import useAuthStore from "../Store/AuthStore.js"
import useContactStore from "../Store/ContactStore.js"


const statusColor = { online: "#22c55e", away: "#f59e0b", offline: "#64748b" }

// Deterministic pastel-blue hue per name, for group member colour-coding (WhatsApp-style)
const NAME_COLORS = ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#c084fc", "#22d3ee", "#fb923c"]
function colorForName(name = "") {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return NAME_COLORS[Math.abs(hash) % NAME_COLORS.length]
}

// ─── Generic Avatar (for contacts / DM partners — NOT clickable) ──────────────
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

// ─── Group Avatar — overlapping circles of first 2-3 members, WhatsApp style ──
function GroupAvatar({ members = [], size = 40, imgSrc }) {
  if (imgSrc) {
    return (
      <div style={{
        width: size, height: size, borderRadius: "50%", flexShrink: 0,
        overflow: "hidden", border: "1.5px solid rgba(99,130,246,0.35)",
      }}>
        <img src={imgSrc} alt="group" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    )
  }

  const shown = members.slice(0, 3)
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: "rgba(37,99,235,0.18)",
        border: "1.5px solid rgba(99,130,246,0.3)",
        display: "grid",
        gridTemplateColumns: shown.length > 1 ? "1fr 1fr" : "1fr",
        gridTemplateRows: shown.length > 2 ? "1fr 1fr" : "1fr",
        overflow: "hidden",
      }}>
        {shown.map((m, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            background: `${colorForName(m.fullname)}33`,
            color: colorForName(m.fullname),
            fontSize: size * 0.2, fontWeight: 600,
            gridColumn: shown.length === 3 && i === 0 ? "1 / 3" : "auto",
          }}>
            {m.profilePic || m.fullname?.[0]}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Profile Avatar (clickable, with upload) ──────────────────────────────────
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
      onImageChange(base64)
      if (onUpload) {
        const cloudinaryUrl = await onUpload(base64)
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
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: "rgba(0,0,0,0.6)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          opacity: hovered ? 1 : 0, transition: "opacity 0.2s",
        }}>
          <span style={{ fontSize: size * 0.3, lineHeight: 1 }}>📷</span>
          <span style={{ fontSize: size * 0.2, color: "#fff", fontWeight: 600, marginTop: 2 }}>Edit</span>
        </div>
      </div>
      <span style={{
        position: "absolute", bottom: 1, right: 1,
        width: size * 0.25, height: size * 0.25,
        borderRadius: "50%", background: "#22c55e",
        border: "2px solid #0f172a", zIndex: 2,
      }} />
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

// ─── New Group Modal ───────────────────────────────────────────────────────────
function NewGroupModal({ contacts, onClose, onCreate }) {
  const [selected, setSelected] = useState([])
  const [groupName, setGroupName] = useState("")
  const [search, setSearch] = useState("")
  const [step, setStep] = useState(1) // 1 = pick members, 2 = name the group

  const toggleMember = (contact) => {
    setSelected((prev) =>
      prev.some((m) => m.id === contact.id)
        ? prev.filter((m) => m.id !== contact.id)
        : [...prev, contact]
    )
  }

  const filteredContacts = contacts.filter((contact) => contact.fullname.toLowerCase().includes(search.toLowerCase()))
  const handleCreate = () => {
    if (!groupName.trim() || selected.length === 0) return
    onCreate({ name: groupName.trim(), members: selected })
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: "420px", maxHeight: "85vh",
          background: "rgba(13,20,42,0.97)",
          border: "0.5px solid rgba(99,130,246,0.25)",
          borderRadius: "18px",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "16px 18px",
          borderBottom: "0.5px solid rgba(99,130,246,0.15)",
        }}>
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              style={{ background: "transparent", border: "none", color: "#60a5fa", fontSize: "20px", cursor: "pointer" }}
            >←</button>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "16px", fontWeight: 500, color: "#f0f6ff" }}>
              {step === 1 ? "Add group members" : "New group"}
            </div>
            {step === 1 && selected.length > 0 && (
              <div style={{ fontSize: "12px", color: "rgba(148,163,184,0.6)", marginTop: "2px" }}>
                {selected.length} selected
              </div>
            )}
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "rgba(148,163,184,0.5)", fontSize: "20px", cursor: "pointer" }}>✕</button>
        </div>

        {step === 1 ? (
          <>
            {/* Selected chips */}
            {selected.length > 0 && (
              <div style={{ display: "flex", gap: "8px", padding: "12px 14px 0", flexWrap: "wrap" }}>
                {selected.map((m) => (
                  <div key={m.id} style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    background: "rgba(37,99,235,0.2)", border: "0.5px solid rgba(99,130,246,0.3)",
                    borderRadius: "16px", padding: "4px 8px 4px 4px",
                  }}>
                   <Avatar initials={m.fullname.split(" ").map((w) => w[0]).join("").slice(0, 2)}imgSrc={m.profilePic}size={22}/>
                    <span style={{ fontSize: "12px", color: "#e2e8f0" }}>{m.fullname.split(" ")[0]}</span>
                    <span
                      onClick={() => toggleMember(m)}
                      style={{ cursor: "pointer", color: "rgba(148,163,184,0.6)", fontSize: "13px", marginLeft: "2px" }}
                    >✕</span>
                  </div>
                ))}
              </div>
            )}

            {/* Search */}
            <div style={{ padding: "12px 14px 4px", position: "relative" }}>
              <span style={{ position: "absolute", left: "24px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", color: "rgba(99,130,246,0.5)", pointerEvents: "none" }}>🔍</span>
              <input
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: "rgba(30,41,59,0.7)", border: "0.5px solid rgba(99,130,246,0.2)",
                  borderRadius: "8px", padding: "9px 12px 9px 34px",
                  color: "#e2e8f0", fontSize: "13px", outline: "none",
                }}
                placeholder="Search contacts…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Contact list with checkboxes */}
            <div style={{ flex: 1, overflowY: "auto", padding: "8px 0", minHeight: "200px" }}>
              {filteredContacts.map((contact) => {
                const isSelected = selected.some((m) => m.id === contact.id)
                return (
                  <div
                    key={contact._id}
                    onClick={() => toggleMember(contact)}
                    style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      padding: "10px 16px", cursor: "pointer",
                      background: isSelected ? "rgba(37,99,235,0.12)" : "transparent",
                    }}
                  >
                    <Avatar initials={contact.fullname.split(" ").map((w) => w[0]).join("").slice(0, 2)}imgSrc={contact.profilePic}size={38}status={contact.status}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "14px", fontWeight: 500, color: "#e2e8f0" }}>{contact.fullname}</div>
                      <div style={{ fontSize: "12px", color: "rgba(148,163,184,0.5)" }}>
                        {contact.status === "online" ? "Online" : `Offline`}
                      </div>
                    </div>
                    <div style={{
                      width: "20px", height: "20px", borderRadius: "50%",
                      border: `2px solid ${isSelected ? "#3b82f6" : "rgba(148,163,184,0.3)"}`,
                      background: isSelected ? "#3b82f6" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, transition: "all 0.15s",
                    }}>
                      {isSelected && <span style={{ color: "#fff", fontSize: "12px" }}>✓</span>}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Next button */}
            <div style={{ padding: "14px 16px", borderTop: "0.5px solid rgba(99,130,246,0.15)" }}>
              <button
                onClick={() => selected.length > 0 && setStep(2)}
                disabled={selected.length === 0}
                style={{
                  width: "100%", background: "#2563eb", color: "#fff", border: "none",
                  borderRadius: "10px", padding: "11px", fontSize: "14px", fontWeight: 500,
                  cursor: selected.length === 0 ? "not-allowed" : "pointer",
                  opacity: selected.length === 0 ? 0.5 : 1,
                }}
              >
                Next ({selected.length})
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Step 2: name the group */}
            <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
              <GroupAvatar members={selected} size={84} />
              <input
                autoFocus
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: "rgba(30,41,59,0.7)", border: "0.5px solid rgba(99,130,246,0.2)",
                  borderRadius: "10px", padding: "11px 14px",
                  color: "#e2e8f0", fontSize: "14px", outline: "none", textAlign: "center",
                }}
                placeholder="Group name…"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                maxLength={40}
              />
              <div style={{ fontSize: "12px", color: "rgba(148,163,184,0.5)", textAlign: "center" }}>
                {selected.map((m) => m.fullname.split(" ")[0]).join(", ")}
              </div>
            </div>

            <div style={{ padding: "0 16px 16px" }}>
              <button
                onClick={handleCreate}
                disabled={!groupName.trim()}
                style={{
                  width: "100%", background: "#2563eb", color: "#fff", border: "none",
                  borderRadius: "10px", padding: "11px", fontSize: "14px", fontWeight: 500,
                  cursor: !groupName.trim() ? "not-allowed" : "pointer",
                  opacity: !groupName.trim() ? 0.5 : 1,
                }}
              >
                Create Group
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({
  displayName, initials, profileImg, setProfileImg, onUpload,
  tab, setTab, search, setSearch,
  filteredChats, filteredContacts,
  activePeer, onSelectPeer, logout, onClose,
  onOpenNewGroup,
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
        <ProfileAvatar
          initials={initials} size={42} imgSrc={profileImg}
          onImageChange={setProfileImg} onUpload={onUpload}
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

      {/* Search + New Group row */}
      <div style={{ display: "flex", gap: "8px", padding: "10px 12px 4px", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", color: "rgba(99,130,246,0.5)", pointerEvents: "none" }}>🔍</span>
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
        {tab === "chats" && (
          <button
            onClick={onOpenNewGroup}
            title="New group"
            style={{
              flexShrink: 0, width: "34px", height: "34px",
              background: "rgba(37,99,235,0.25)", border: "0.5px solid rgba(99,130,246,0.35)",
              borderRadius: "8px", color: "#93c5fd", fontSize: "16px",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(37,99,235,0.4)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(37,99,235,0.25)"}
          >👥➕</button>
        )}
      </div>

      {/* List */}
      <div className="cp-list" style={{ flex: 1, overflowY: "auto", padding: "6px 0" }}>
        {tab === "chats"
          ? filteredChats.length === 0
            ? <p style={{ textAlign: "center", color: "rgba(148,163,184,0.35)", fontSize: "13px", marginTop: "24px" }}>No chats found</p>
            : filteredChats.map((chat) => (
              <div key={chat.id} style={listItem(activePeer?.id === chat.id && activePeer?.type === chat.type)}
                onClick={() => onSelectPeer(chat)}
                onMouseEnter={(e) => { if (!(activePeer?.id === chat.id && activePeer?.type === chat.type)) e.currentTarget.style.background = "rgba(37,99,235,0.1)" }}
                onMouseLeave={(e) => { if (!(activePeer?.id === chat.id && activePeer?.type === chat.type)) e.currentTarget.style.background = "transparent" }}
              >
                {chat.type === "group"
                  ? <GroupAvatar members={chat.members} size={42} imgSrc={chat.imgSrc} />
                  : <Avatar initials={chat.fullname.split(" ").map((w) => w[0]).join("").slice(0, 2)}imgSrc={chat.profilePic}size={42}status={chat.status}/>}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    {chat.type === "group" && <span style={{ fontSize: "11px" }}>👥</span>}
                    <div style={{ fontSize: "14px", fontWeight: 500, color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{chat.fullname}</div>
                  </div>
                  <div style={{ fontSize: "12px", color: "rgba(148,163,184,0.55)", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {chat.type === "group" && chat.lastSender ? `${chat.lastSender}: ` : ""}{chat.lastMsg}
                  </div>
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
              <div key={contact._id} style={listItem(activePeer?._id === contact._id && activePeer?.type !== "group")}
                onClick={() => onSelectPeer({ ...contact, type: "dm" })}
                onMouseEnter={(e) => { if (activePeer?._id !== contact._id) e.currentTarget.style.background = "rgba(37,99,235,0.1)" }}
                onMouseLeave={(e) => { if (activePeer?._id !== contact._id) e.currentTarget.style.background = "transparent" }}
              >
                <Avatar initials={contact.fullname.split(" ").map(word => word[0]).join("").slice(0, 2).toUpperCase()}imgSrc={contact.profilePic}size={42}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "14px", fontWeight: 500, color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{contact.fullname}</div>
                  <div style={{ fontSize: "12px", color: "rgba(148,163,184,0.55)", marginTop: "2px" }}>{contact.status === "online" ? "Online" : `Offline`}</div>
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
  const { authUser, logout, updateProfilePic } = useAuthStore()
  const {contacts,getAllContacts,isLoadingContacts} = useContactStore()
  const [tab, setTab]                     = useState("chats")
  const [activePeer, setActivePeer]       = useState(null)
  const [messages, setMessages]           = useState({})
  const [input, setInput]                 = useState("")
  const [mobilePanelOpen, setMobilePanel] = useState(false)
  const [search, setSearch]               = useState("")
  const [profileImg, setProfileImg]       = useState(null)
  const [chats, setChats]                 = useState([])
  const [showNewGroup, setShowNewGroup]   = useState(false)
  const [nextGroupId, setNextGroupId]     = useState(1000)

  const bottomRef = useRef(null)

  useEffect(() => {
    if (authUser?.profilePic) setProfileImg(authUser.profilePic)
  }, [authUser]);

  useEffect(() => {
    getAllContacts();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, activePeer])

  const handleSelectPeer = (peer) => {
    setActivePeer(peer)
    setMobilePanel(false)
  }

  const handleSend = () => {
    if (!input.trim() || !activePeer) return
    const peerId = activePeer._id || activePeer.id   // works for both real contacts and mock groups
    const msg = {
      id: Date.now(), from: "me", text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((prev) => ({ ...prev, [peerId]: [...(prev[peerId] || []), msg] }))
    setInput("")

    setChats((prev) => prev.map((c) =>
      (c._id || c.id) === peerId
        ? { ...c, lastMsg: msg.text, time: msg.time, lastSender: activePeer.type === "group" ? "You" : undefined }
        : c
    ))
  }
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const handleCreateGroup = ({ name, members }) => {
    const id = nextGroupId
    setNextGroupId((n) => n + 1)

    const newGroup = {
      id, type: "group", name, members,
      lastMsg: `You created the group "${name}"`,
      lastSender: "", time: "now", unread: 0,
    }

    setChats((prev) => [newGroup, ...prev])

    setMessages((prev) => ({
      ...prev,
      [id]: [
        { id: 1, from: "system", text: `You created the group "${fullname}"`, time: "now" },
        { id: 2, from: "system", text: `You added ${members.map((m) => m.fullname.split(" ")[0]).join(", ")}`, time: "now" },
      ],
    }))

    setShowNewGroup(false)
    setTab("chats")
    setActivePeer(newGroup)
    setMobilePanel(false)
  }

  const displayName = authUser?.fullname || authUser?.fullName || authUser?.fullname || "You"
  const initials    = displayName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()

  const filteredChats    = chats.filter((c) => c.fullname.toLowerCase().includes(search.toLowerCase()))
  const filteredContacts = contacts.filter((c) =>c.fullname.toLowerCase().includes(search.toLowerCase()))

  const sidebarProps = {
    displayName, initials, profileImg, setProfileImg,
    onUpload: updateProfilePic,
    tab, setTab, search, setSearch,
    filteredChats, filteredContacts,
    activePeer, onSelectPeer: handleSelectPeer, logout,
    onOpenNewGroup: () => setShowNewGroup(true),
  }

  const peerMsgs = activePeer ? (messages[activePeer._id] || []) : []
  const isGroup = activePeer?.type === "group"

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

        {/* New Group Modal */}
        {showNewGroup && (
          <NewGroupModal
            contacts={contacts}
            onClose={() => setShowNewGroup(false)}
            onCreate={handleCreateGroup}
          />
        )}

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
                initials={initials} size={32} imgSrc={profileImg}
                onImageChange={setProfileImg} onUpload={updateProfilePic}
              />
            </div>

            {activePeer ? (
              <>
                {/* Chat header */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 20px", borderBottom: "0.5px solid rgba(99,130,246,0.15)", background: "rgba(10,18,40,0.5)" }}>
                  <button className="cp-back-btn" style={{ display: "none", background: "transparent", border: "none", color: "#60a5fa", fontSize: "22px", cursor: "pointer", padding: "0 4px 0 0" }} onClick={() => setActivePeer(null)}>←</button>

                  {isGroup
                    ? <GroupAvatar members={activePeer.members} size={40} imgSrc={activePeer.imgSrc} />
                    : <Avatar initials={activePeer.fullname?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()} imgSrc={activePeer.profilePic} size={40} status={activePeer.status}/>}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "15px", fontWeight: 500, color: "#f0f6ff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activePeer.fullname}</div>
                    <div style={{ fontSize: "12px", color: "rgba(148,163,184,0.55)", marginTop: "1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {isGroup
                        ? `${activePeer.members.length} members: ${activePeer.members.map((m) => m.fullname.split(" ")[0]).join(", ")}`
                        : activePeer.status === "online" ? "● Online" : activePeer.status === "away" ? "● Away" : "Offline"}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="cp-msg-area" style={{ flex: 1, overflowY: "auto", padding: "20px 20px 12px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {peerMsgs.length === 0 && (
                    <div style={{ textAlign: "center", color: "rgba(148,163,184,0.3)", fontSize: "13px", marginTop: "32px" }}>No messages yet. Say hello! 👋</div>
                  )}
                  {peerMsgs.map((msg) =>
                    msg.from === "system" ? (
                      // System / "you created the group" style message — centered pill
                      <div key={msg.id} style={{
                        alignSelf: "center",
                        background: "rgba(30,41,59,0.6)",
                        border: "0.5px solid rgba(99,130,246,0.15)",
                        borderRadius: "12px", padding: "6px 14px",
                        fontSize: "12px", color: "rgba(148,163,184,0.7)",
                        textAlign: "center", maxWidth: "80%",
                      }}>
                        {msg.text}
                      </div>
                    ) : (
                      <div key={msg.id} style={{
                        maxWidth: "68%", alignSelf: msg.from === "me" ? "flex-end" : "flex-start",
                        background: msg.from === "me" ? "rgba(37,99,235,0.75)" : "rgba(30,41,59,0.85)",
                        border: msg.from === "me" ? "0.5px solid rgba(99,130,246,0.4)" : "0.5px solid rgba(99,130,246,0.15)",
                        borderRadius: msg.from === "me" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                        padding: "10px 14px",
                      }}>
                        {/* sender name shown in groups for "them" messages */}
                        {isGroup && msg.from !== "me" && msg.sender && (
                          <div style={{ fontSize: "12px", fontWeight: 600, color: colorForName(msg.sender), marginBottom: "2px" }}>
                            {msg.sender}
                          </div>
                        )}
                        <div style={{ fontSize: "14px", color: "#e2e8f0", lineHeight: 1.5, wordBreak: "break-word" }}>{msg.text}</div>
                        <div style={{ fontSize: "10px", color: "rgba(148,163,184,0.4)", marginTop: "4px", textAlign: "right" }}>{msg.time}</div>
                      </div>
                    )
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Input bar */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", padding: "12px 16px 16px", borderTop: "0.5px solid rgba(99,130,246,0.15)", background: "rgba(10,18,40,0.5)" }}>
                  <textarea
                    style={{ flex: 1, background: "rgba(30,41,59,0.8)", border: "0.5px solid rgba(99,130,246,0.2)", borderRadius: "12px", padding: "10px 14px", color: "#e2e8f0", fontSize: "14px", outline: "none", resize: "none", lineHeight: 1.5, maxHeight: "120px", overflowY: "auto", fontFamily: "inherit" }}
                    rows={1}
                    placeholder={isGroup ? `Message ${activePeer.fullname}…` : "Type a message…"}
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