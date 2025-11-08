import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useWebSocketContext } from "@/contexts/WebSocketContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Send, Loader2, Check, CheckCheck, User } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  imageUrl: string | null;
  deleted: boolean;
  createdAt: string;
  isRead: boolean;
}

interface OtherUser {
  id: number;
  username: string;
  email: string;
}

interface ChatInterfaceProps {
  selectedUserId: number;
  onBack: () => void;
}

export default function ChatInterface({ selectedUserId, onBack }: ChatInterfaceProps) {
  const { user } = useAuth();
  const { send, subscribe } = useWebSocketContext();
  const queryClient = useQueryClient();
  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const { data: messages, isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages/conversation", selectedUserId],
    queryFn: async () => {
      const res = await fetch(`/api/messages/conversation/${selectedUserId}`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
    refetchInterval: 10000,
  });

  const { data: otherUser } = useQuery<OtherUser>({
    queryKey: ["/api/users", selectedUserId],
    queryFn: async () => {
      const res = await fetch(`/api/users/${selectedUserId}`);
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: selectedUserId,
          content,
        }),
      });
      if (!res.ok) throw new Error("Failed to send message");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages/conversation", selectedUserId] });
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      setMessageText("");
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/messages/mark-read", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otherUserId: selectedUserId }),
      });
      if (!res.ok) throw new Error("Failed to mark as read");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages/conversation", selectedUserId] });
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
    },
  });

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (messages && messages.length > 0 && !markAsReadMutation.isPending) {
      const hasUnreadMessages = messages.some(msg => !msg.isRead && msg.receiverId === user?.id);
      if (hasUnreadMessages) {
        markAsReadMutation.mutate();
      }
    }
  }, [messages, user?.id, markAsReadMutation.isPending]);

  useEffect(() => {
    const unsubscribe = subscribe((message) => {
      if (message.type === "new_message") {
        queryClient.invalidateQueries({ queryKey: ["/api/messages/conversation", selectedUserId] });
        queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
        scrollToBottom();
        
        if (message.message.senderId === selectedUserId) {
          markAsReadMutation.mutate();
        }
      }
      
      if (message.type === "typing_start" && message.userId === selectedUserId) {
        setOtherUserTyping(true);
      }
      
      if (message.type === "typing_stop" && message.userId === selectedUserId) {
        setOtherUserTyping(false);
      }
      
      if (message.type === "message_read") {
        queryClient.invalidateQueries({ queryKey: ["/api/messages/conversation", selectedUserId] });
      }
    });

    return unsubscribe;
  }, [subscribe, selectedUserId, queryClient, scrollToBottom]);

  const handleTyping = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
      send({ type: "typing_start", receiverId: selectedUserId });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      send({ type: "typing_stop", receiverId: selectedUserId });
    }, 500);
  }, [isTyping, send, selectedUserId]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    sendMessageMutation.mutate(messageText.trim());
    
    if (isTyping) {
      setIsTyping(false);
      send({ type: "typing_stop", receiverId: selectedUserId });
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (messagesLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <Card className="border-0 md:border-b rounded-none">
        <div className="p-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="md:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{otherUser?.username || "Učitavanje..."}</h3>
            {otherUserTyping && (
              <p className="text-xs text-muted-foreground italic">Korisnik kuca...</p>
            )}
          </div>
        </div>
      </Card>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4 pb-4">
          {messages && messages.length > 0 ? (
            messages.map((message) => {
              const isOwn = message.senderId === user?.id;
              
              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    isOwn ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[70%] rounded-lg px-4 py-2 group relative",
                      isOwn
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground",
                      message.deleted && "opacity-60"
                    )}
                  >
                    {message.deleted ? (
                      <p className="text-sm italic text-muted-foreground">Poruka obrisana</p>
                    ) : (
                      <>
                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                        {message.imageUrl && (
                          <img
                            src={message.imageUrl}
                            alt="attachment"
                            className="mt-2 rounded max-w-full h-auto"
                          />
                        )}
                      </>
                    )}
                    <div className={cn(
                      "flex items-center gap-1 mt-1",
                      isOwn ? "justify-end" : "justify-start"
                    )}>
                      <span className={cn(
                        "text-xs opacity-0 group-hover:opacity-100 transition-opacity",
                        isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}>
                        {format(new Date(message.createdAt), "HH:mm")}
                      </span>
                      {isOwn && (
                        <span className={cn(
                          "text-xs flex items-center",
                          isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                        )}>
                          {message.isRead ? (
                            <CheckCheck className="w-3 h-3" />
                          ) : (
                            <Check className="w-3 h-3" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <p>Nema poruka</p>
              <p className="text-sm mt-1">Pošaljite prvu poruku da započnete konverzaciju</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <Card className="border-0 md:border-t rounded-none">
        <div className="p-4 flex gap-2">
          <Textarea
            value={messageText}
            onChange={(e) => {
              setMessageText(e.target.value);
              handleTyping();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Napišite poruku..."
            className="min-h-[60px] max-h-[120px] resize-none"
            disabled={sendMessageMutation.isPending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!messageText.trim() || sendMessageMutation.isPending}
            size="icon"
            className="h-[60px] w-[60px] flex-shrink-0"
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
