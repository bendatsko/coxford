import { X } from 'lucide-react';
import { useState } from 'react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback }),
      });

      if (!response.ok) {
        throw new Error('Failed to send feedback');
      }

      setIsSubmitted(true);
      
      setTimeout(() => {
        setFeedback('');
        setIsSubmitted(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError('Failed to send feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-card rounded-2xl shadow-lg border border-border/40">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
          aria-label="Close feedback modal"
        >
          <X size={20} className="text-muted-foreground" />
        </button>

        <div className="p-6">
          {!isSubmitted ? (
            <>
              <h2 className="text-2xl font-semibold mb-2">Share Your Thoughts</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Have an idea for improvement? Found something broken? Let us know.
              </p>

              <form onSubmit={handleSubmit}>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Your feedback..."
                  className="w-full min-h-[160px] p-3 rounded-xl bg-muted/50 border border-border/60 focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/50 text-foreground resize-none cursor-text"
                  required
                />
                {error && (
                  <p className="text-destructive text-sm mt-2">{error}</p>
                )}
                <div className="mt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || !feedback.trim()}
                    className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-medium transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Feedback'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="py-8 text-center">
              <h2 className="text-2xl font-semibold mb-2">Thanks!</h2>
              <p className="text-muted-foreground">Your feedback has been sent.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 