import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Shield, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from 'wagmi';
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSecureWhispersContract } from "@/hooks/useContract";

interface FeedbackFormProps {
  onSubmit: (feedback: { author: string; content: string }) => void;
}

const FeedbackForm = ({ onSubmit }: FeedbackFormProps) => {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { isConnected } = useAccount();
  const { submitFeedback, isPending: isContractPending } = useSecureWhispersContract();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to submit feedback",
        variant: "destructive"
      });
      return;
    }
    
    if (!author.trim() || !content.trim()) {
      toast({
        title: "Incomplete Information",
        description: "Please provide your name and feedback content",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Submit to contract (proposal ID 1 for demo)
      await submitFeedback(1, content.trim(), 5); // Rating 5 for demo
      
      // Also update local state
      onSubmit({ author: author.trim(), content: content.trim() });
      setAuthor("");
      setContent("");
      
      toast({
        title: "Feedback Encrypted & Sent",
        description: "Your feedback has been securely encrypted and submitted to the blockchain",
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Submission Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-secure border-border/50 bg-gradient-bubble">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="w-5 h-5 text-secure-primary" />
          Submit Encrypted Feedback
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Your feedback will be encrypted using FHE before submission to ensure complete privacy.
        </p>
      </CardHeader>
      
      <CardContent>
        {!isConnected && (
          <Alert className="mb-4 border-destructive/20 bg-destructive/5">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to submit feedback
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="author" className="text-sm font-medium">
              Your Name
            </Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter your name..."
              className="border-border/50 focus:border-secure-primary focus:ring-secure-primary/20"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="feedback" className="text-sm font-medium">
              Feedback Content
            </Label>
            <Textarea
              id="feedback"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts on the proposal..."
              className="min-h-[120px] border-border/50 focus:border-secure-primary focus:ring-secure-primary/20 resize-none"
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              Your message will be encrypted before being stored or transmitted.
            </p>
          </div>
          
          <Button 
            type="submit" 
            disabled={!isConnected || isSubmitting || isContractPending || !author.trim() || !content.trim()}
            className="w-full bg-gradient-secure hover:opacity-90 text-white shadow-secure disabled:opacity-50"
          >
            {(isSubmitting || isContractPending) ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Encrypting & Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Encrypted Feedback
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;