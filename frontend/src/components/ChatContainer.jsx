import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useRef  } from "react";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

function ChatContainer() {
  const {selectedUser, getMessagesByUserId, messages, isMessagesLoading, subscribeToMessages, unsubscribeFromMessages, typingUsers } = useChatStore();
  const isPartnerTyping = typingUsers.includes(selectedUser?._id);
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);


   useEffect(() => {
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages()


    return () => unsubscribeFromMessages();
   },[selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]);

    useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isPartnerTyping]);



  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
         <div className="max-w-3xl mx-auto space-y-6">
          {messages.map(msg => (
            <div key={msg._id}
              className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chatstart"}`}
            >
              <div className={
                `chat-bubble relative ${
                msg.senderId === authUser._id
                  ? "bg-cyan-600 text-white"
                   : "bg-slate-800 text-slate-200"
                }`}
                >
                  {msg.image && (
                    <img src={msg.image} alt="Shared" className="rounded-lg h-48 object-cover" />
                  )}
                  {msg.text && <p className="mt-2">{msg.text}</p>}
                  <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                   {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
              </div> 
            </div> 
          ))}

          {isPartnerTyping && (
            <div className="chat chat-start">
              <div className="chat-bubble bg-slate-800 text-slate-200 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
              </div>
            </div>
          )}

          {/* 👇 scroll target */}
          <div  ref={messageEndRef}  />
         </div>
        ) : isMessagesLoading ? <MessagesLoadingSkeleton /> :  (
          isPartnerTyping ? (
            <div className="max-w-3xl mx-auto">
              <div className="chat chat-start">
                <div className="chat-bubble bg-slate-800 text-slate-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                </div>
              </div>
            </div>
          ) : <NoChatHistoryPlaceholder name={selectedUser.fullName}/>
        )}

      </div>

      <MessageInput />
      </>
  );
}

export default ChatContainer;
