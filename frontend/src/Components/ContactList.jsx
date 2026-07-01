import { useEffect } from "react";
import { useChatStore } from "../Store/useChatStore.js";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton.jsx";
import { useAuthStore } from "../Store/useAuthStore.js";
import Avatar from "./Avatar.jsx"

function ContactList() {
  console.log("ContactList rendered");
  const { getAllContacts, allContacts, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <>
      {allContacts.map((contact) => (
      
        <div
          
          key={contact._id}
          className="p-4 transition-colors rounded-lg cursor-pointer bg-cyan-500/10 hover:bg-cyan-500/20"
          onClick={() => setSelectedUser(contact)}
        >
          <div className="flex items-center gap-3">
            
            <div className={`avatar ${onlineUsers.includes(contact._id) ? "online" : "offline"}`}>
              <div className={`avatar ${onlineUsers.includes(contact._id) ? "online" : "offline"}`}>
                  <Avatar
                    fullname={contact.fullname}
                    profilePic={contact.profilePic}
                    size={48}
                  />
              </div>
              
            </div>
            <h4 className="font-medium text-slate-200">{contact.fullname}</h4>
          </div>
        </div>
      ))}
    </>
  );
}
export default ContactList;