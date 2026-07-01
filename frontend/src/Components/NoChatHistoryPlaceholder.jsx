import { MessageCircleIcon } from "lucide-react";

const NoChatHistoryPlaceholder = ({ name }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="flex items-center justify-center w-16 h-16 mb-5 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-400/10">
        <MessageCircleIcon className="size-8 text-cyan-400" />
      </div>
      <h3 className="mb-3 text-lg font-medium text-slate-200">
        Start your conversation with {name}
      </h3>
      <div className="flex flex-col max-w-md mb-5 space-y-3">
        <p className="text-sm text-slate-400">
          This is the beginning of your conversation. Send a message to start chatting!
        </p>
        <div className="w-32 h-px mx-auto bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <button className="px-4 py-2 text-xs font-medium transition-colors rounded-full text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20">
          👋 Say Hello
        </button>
        <button className="px-4 py-2 text-xs font-medium transition-colors rounded-full text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20">
          🤝 How are you?
        </button>
        <button className="px-4 py-2 text-xs font-medium transition-colors rounded-full text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20">
          📅 Meet up soon?
        </button>
      </div>
    </div>
  );
};

export default NoChatHistoryPlaceholder;