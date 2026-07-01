import { useEffect } from "react";
import { useChatStore } from "../Store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../Store/useAuthStore";
import Avatar from "./Avatar.jsx"

function ChatsList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat._id}
          className="p-4 transition-colors rounded-lg cursor-pointer bg-cyan-500/10 hover:bg-cyan-500/20"
          onClick={() => setSelectedUser(chat)}
        >
          <div className="flex items-center gap-3">
            <div className={`avatar ${onlineUsers.includes(chat._id) ? "online" : "offline"}`}>
              <Avatar
                fullname={chat.fullname}
                profilePic={chat.profilePic}
                size={48}
              />
              
            </div>
            <h4 className="font-medium truncate text-slate-200">{chat.fullname}</h4>
          </div>
        </div>
      ))}
    </>
  );
}
export default ChatsList;