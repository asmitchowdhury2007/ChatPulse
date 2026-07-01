import { useChatStore } from "../Store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="p-2 m-2 bg-transparent tabs tabs-boxed">
      <button
        onClick={() => setActiveTab("chats")}
        className={`tab ${
          activeTab === "chats" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"
        }`}
      >
        Chats
      </button>

      <button
        onClick={() => {
          console.log("Contacts button clicked");
          setActiveTab("contacts")
        }} 
        className={`tab ${
          activeTab === "contacts" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"
        }`}
      >
        Contacts
      </button>
    </div>
  );
}
export default ActiveTabSwitch;