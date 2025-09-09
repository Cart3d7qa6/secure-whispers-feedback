import { Lock, User, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommentBubbleProps {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  isOwn?: boolean;
  encrypted?: boolean;
}

const CommentBubble = ({ 
  id, 
  author, 
  content, 
  timestamp, 
  isOwn = false, 
  encrypted = true 
}: CommentBubbleProps) => {
  return (
    <div className={cn(
      "flex gap-3 mb-6 animate-in slide-in-from-bottom-2 duration-300",
      isOwn ? "flex-row-reverse" : "flex-row"
    )}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-secure flex items-center justify-center shadow-bubble">
          <User className="w-5 h-5 text-white" />
        </div>
      </div>
      
      {/* Comment content */}
      <div className={cn(
        "flex-1 max-w-md",
        isOwn ? "text-right" : "text-left"
      )}>
        {/* Header */}
        <div className={cn(
          "flex items-center gap-2 mb-2 text-sm text-muted-foreground",
          isOwn ? "flex-row-reverse" : "flex-row"
        )}>
          <span className="font-medium">{author}</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{timestamp}</span>
          </div>
          {encrypted && (
            <div className="flex items-center gap-1 text-secure-primary">
              <Lock className="w-3 h-3" />
              <span className="text-xs">FHE</span>
            </div>
          )}
        </div>
        
        {/* Bubble */}
        <div className={cn(
          "relative rounded-bubble p-4 shadow-bubble transition-all duration-300 hover:shadow-secure",
          isOwn 
            ? "bg-gradient-secure text-white ml-8" 
            : "bg-gradient-bubble text-foreground mr-8 border border-border/50"
        )}>
          {/* Bubble tail */}
          <div className={cn(
            "absolute top-4 w-3 h-3 transform rotate-45",
            isOwn 
              ? "-right-1.5 bg-secure-primary" 
              : "-left-1.5 bg-white border-l border-t border-border/50"
          )}></div>
          
          {/* Content */}
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
          
          {/* Encryption indicator */}
          {encrypted && (
            <div className={cn(
              "mt-2 pt-2 border-t text-xs flex items-center gap-1",
              isOwn 
                ? "border-white/20 text-white/80" 
                : "border-border/30 text-muted-foreground"
            )}>
              <Lock className="w-3 h-3" />
              <span>End-to-end encrypted</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentBubble;