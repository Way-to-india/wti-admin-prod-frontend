'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from '@/services/user.service';

const EmailDialog = ({
  emailDialogOpen,
  setEmailDialogOpen,
  selectedUser,
  emailSubject,
  setEmailSubject,
  emailMessage,
  setEmailMessage,
  isSendingEmail,
  handleSendEmail,
}: {
  emailDialogOpen: boolean;
  setEmailDialogOpen: (open: boolean) => void;
  selectedUser: User | null;
  emailSubject: string;
  setEmailSubject: (subject: string) => void;
  emailMessage: string;
  setEmailMessage: (message: string) => void;
  isSendingEmail: boolean;
  handleSendEmail: () => void;
}) => {
  return (
    <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Send Email to User</DialogTitle>
          <DialogDescription>
            {selectedUser && `Send an email to ${selectedUser.name} (${selectedUser.email})`}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder="Enter email subject..."
            />
          </div>
          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
              placeholder="Write your message here... (HTML supported)"
              rows={10}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-2">
              You can use HTML tags for formatting (e.g., &lt;b&gt;, &lt;i&gt;, &lt;p&gt;,
              &lt;br&gt;, etc.)
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSendEmail}
            disabled={isSendingEmail || !emailSubject || !emailMessage}
          >
            {isSendingEmail ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailDialog;