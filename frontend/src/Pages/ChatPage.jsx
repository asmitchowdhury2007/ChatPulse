import { useChatStore } from "../Store/useChatStore";

import BorderAnimatedContainer from "../components/BorderAnimatedContainer.jsx";
import ProfileHeader from "../Components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

function ChatPage() {
  
  const { activeTab, selectedUser } = useChatStore();
  console.log("activeTab:", activeTab);
  return (
    
    <div className="relative w-full max-w-6xl h-[800px]">
      <BorderAnimatedContainer>
        {/* LEFT SIDE */}
        <div className="flex flex-col w-80 bg-slate-800/50 backdrop-blur-sm">
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 p-4 space-y-2 overflow-y-auto">
            <ChatsList />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col flex-1 bg-slate-900/50 backdrop-blur-sm">
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}
export default ChatPage;