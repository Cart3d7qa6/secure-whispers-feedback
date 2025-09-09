import { useState } from "react";
import SecureHeader from "@/components/SecureHeader";
import CommentBubble from "@/components/CommentBubble";
import FeedbackForm from "@/components/FeedbackForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  isOwn?: boolean;
}

const Index = () => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Sarah Chen",
      content: "The technical approach looks solid, but I'd like to see more details on the security implementation. How will you handle key management across different environments?",
      timestamp: "2 hours ago",
      isOwn: false
    },
    {
      id: "2", 
      author: "You",
      content: "Great question about key management. We're planning to use hardware security modules (HSMs) for production environments and a secure key derivation system for development.",
      timestamp: "1 hour ago",
      isOwn: true
    },
    {
      id: "3",
      author: "Marcus Rodriguez",
      content: "The budget allocation seems reasonable, though I wonder if we should allocate more resources to testing. Given the sensitive nature of this project, extensive security auditing will be crucial.",
      timestamp: "45 minutes ago",
      isOwn: false
    }
  ]);

  const handleNewFeedback = (feedback: { author: string; content: string }) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      author: feedback.author,
      content: feedback.content,
      timestamp: "Just now",
      isOwn: false
    };
    
    setComments(prev => [...prev, newComment]);
  };

  return (
    <div className="min-h-screen bg-background">
      <SecureHeader />
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Comments Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 text-foreground">
                Encrypted Feedback Thread
              </h2>
              <p className="text-sm text-muted-foreground">
                All messages are protected with FHE encryption. {comments.length} secure {comments.length === 1 ? 'comment' : 'comments'}.
              </p>
            </div>
            
            <Separator className="mb-6" />
            
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-1">
                {comments.map((comment) => (
                  <CommentBubble
                    key={comment.id}
                    id={comment.id}
                    author={comment.author}
                    content={comment.content}
                    timestamp={comment.timestamp}
                    isOwn={comment.isOwn}
                    encrypted={true}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
          
          {/* Feedback Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <FeedbackForm onSubmit={handleNewFeedback} />
              
              {/* Security info */}
              <div className="mt-6 p-4 bg-secure-secondary/30 rounded-lg border border-secure-primary/20">
                <h3 className="text-sm font-semibold text-secure-primary mb-2">
                  🔒 Security Features
                </h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Fully Homomorphic Encryption (FHE)</li>
                  <li>• Zero-knowledge architecture</li>
                  <li>• End-to-end privacy protection</li>
                  <li>• Secure multi-party computation ready</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;