import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useWebSocketContext } from "@/contexts/WebSocketContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCommunityMessageSchema, type InsertCommunityMessage } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { sr } from "date-fns/locale";
import { Crown, Trophy, Shield, User as UserIcon, Trash2, Send, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type CommunityMessageWithUser = {
  id: number;
  userId: number;
  username: string;
  rank: "user" | "vip" | "legend" | "admin";
  message: string;
  createdAt: string;
};

function getRankColor(rank: string): string {
  switch (rank) {
    case "vip":
      return "text-blue-500 dark:text-blue-400";
    case "legend":
      return "text-yellow-500 dark:text-yellow-400";
    case "admin":
      return "text-destructive";
    default:
      return "text-muted-foreground";
  }
}

function getRankIcon(rank: string) {
  switch (rank) {
    case "vip":
      return <Crown className="h-3 w-3 text-blue-500 dark:text-blue-400" />;
    case "legend":
      return <Trophy className="h-3 w-3 text-yellow-500 dark:text-yellow-400" />;
    case "admin":
      return <Shield className="h-3 w-3 text-destructive" />;
    default:
      return null;
  }
}

interface MessageItemProps {
  message: CommunityMessageWithUser;
  isOwnMessage: boolean;
  isAdmin: boolean;
  onDelete: (messageId: number) => void;
}

function MessageItem({ message, isOwnMessage, isAdmin, onDelete }: MessageItemProps) {
  const canDelete = isOwnMessage || isAdmin;
  const rankIcon = getRankIcon(message.rank);

  return (
    <div
      className={cn("flex flex-col gap-1", isOwnMessage ? "items-start" : "items-end")}
      data-testid={`message-${message.id}`}
    >
      <div className="flex items-center gap-2">
        {!isOwnMessage && (
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {message.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
        <div className="flex items-center gap-1">
          {rankIcon}
          <span className={cn("text-sm font-medium", getRankColor(message.rank))}>
            {message.username}
          </span>
        </div>
        {isOwnMessage && (
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {message.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      <div className={cn("flex items-start gap-2 max-w-[75%]", isOwnMessage ? "flex-row" : "flex-row-reverse")}>
        <div
          className={cn(
            "rounded-md p-3",
            isOwnMessage ? "bg-muted" : "bg-primary/10"
          )}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
        </div>

        {canDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onDelete(message.id)}
            data-testid={`button-delete-message-${message.id}`}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </div>

      <span className="text-xs text-muted-foreground" data-testid={`timestamp-${message.id}`}>
        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true, locale: sr })}
      </span>
    </div>
  );
}

interface MessageListProps {
  messages: CommunityMessageWithUser[];
  isLoading: boolean;
  currentUserId: number | undefined;
  isAdmin: boolean;
  onDelete: (messageId: number) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  endRef: React.RefObject<HTMLDivElement>;
}

function MessageList({ messages, isLoading, currentUserId, isAdmin, onDelete, containerRef, endRef }: MessageListProps) {
  if (isLoading) {
    return (
      <ScrollArea className="h-[500px] px-4">
        <div className="space-y-4 py-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-20 w-3/4" />
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  }

  if (messages.length === 0) {
    return (
      <ScrollArea className="h-[500px] px-4">
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
          <MessageSquare className="h-12 w-12 mb-4 opacity-50" />
          <p className="text-lg mb-2">Nema poruka u chatu</p>
          <p className="text-sm">Budite prvi koji će poslati poruku!</p>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="h-[500px] px-4" ref={containerRef}>
      <div className="space-y-4 py-4">
        {messages.map((message) => (
          <div key={message.id} className="group">
            <MessageItem
              message={message}
              isOwnMessage={message.userId === currentUserId}
              isAdmin={isAdmin}
              onDelete={onDelete}
            />
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </ScrollArea>
  );
}

interface MessageInputProps {
  onSubmit: (message: string) => void;
  isPending: boolean;
  cooldownSeconds: number;
  resetTrigger?: number;
}

function MessageInput({ onSubmit, isPending, cooldownSeconds, resetTrigger }: MessageInputProps) {
  const form = useForm<InsertCommunityMessage>({
    resolver: zodResolver(insertCommunityMessageSchema),
    defaultValues: {
      message: "",
    },
  });

  const handleSubmit = (data: InsertCommunityMessage) => {
    onSubmit(data.message);
  };

  useEffect(() => {
    if (resetTrigger) {
      form.reset({ message: "" });
    }
  }, [resetTrigger, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Pošalji poruku..."
                  maxLength={85}
                  rows={3}
                  disabled={isPending || cooldownSeconds > 0}
                  data-testid="textarea-message"
                  className="resize-none"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between gap-2">
          {cooldownSeconds > 0 ? (
            <p className="text-sm text-muted-foreground" data-testid="text-cooldown">
              Sledeća poruka za {cooldownSeconds}s
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              {form.watch("message")?.length || 0}/85
            </p>
          )}

          <Button
            type="submit"
            disabled={isPending || cooldownSeconds > 0 || !form.watch("message")?.trim()}
            data-testid="button-send-message"
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            Pošalji
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function CommunityChat() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { subscribe } = useWebSocketContext();
  const [messages, setMessages] = useState<CommunityMessageWithUser[]>([]);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const cooldownIntervalRef = useRef<NodeJS.Timeout>();

  const { data: fetchedMessages = [], isLoading } = useQuery<CommunityMessageWithUser[]>({
    queryKey: ["/api/community-chat"],
    enabled: !!user,
  });

  useEffect(() => {
    setMessages(fetchedMessages);
  }, [fetchedMessages]);

  const isNearBottom = () => {
    const container = containerRef.current;
    if (!container) return true;

    const scrollArea = container.querySelector('[data-radix-scroll-area-viewport]');
    if (!scrollArea) return true;

    const { scrollHeight, scrollTop, clientHeight } = scrollArea;
    return scrollHeight - (scrollTop + clientHeight) < 64;
  };

  const scrollToBottom = (smooth = true) => {
    if (isNearBottom()) {
      endRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
    }
  };

  useEffect(() => {
    scrollToBottom(false);
  }, [messages]);

  const [formResetTrigger, setFormResetTrigger] = useState(0);

  const postMutation = useMutation({
    mutationFn: async (message: string) => {
      return apiRequest("POST", "/api/community-chat", { message });
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["/api/community-chat"] });
      setFormResetTrigger(prev => prev + 1);
    },
    onError: (error: Error) => {
      if (error.message.includes("Rate limit") || error.message.includes("10 sekund")) {
        setCooldownSeconds(10);
        
        if (cooldownIntervalRef.current) {
          clearInterval(cooldownIntervalRef.current);
        }

        cooldownIntervalRef.current = setInterval(() => {
          setCooldownSeconds((prev) => {
            if (prev <= 1) {
              if (cooldownIntervalRef.current) {
                clearInterval(cooldownIntervalRef.current);
              }
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        toast({
          title: "Sačekajte malo",
          description: "Možete slati poruke svakih 10 sekundi",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Greška",
          description: error.message || "Nije moguće poslati poruku",
          variant: "destructive",
        });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (messageId: number) => {
      return apiRequest("DELETE", `/api/community-chat/${messageId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community-chat"] });
      toast({
        title: "Uspešno",
        description: "Poruka je obrisana",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Greška",
        description: error.message || "Nije moguće obrisati poruku",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    const unsubscribe = subscribe((message) => {
      if (message.type === "community-chat:new") {
        const newMessage = message.message as CommunityMessageWithUser;
        setMessages((prev) => {
          if (prev.some(m => m.id === newMessage.id)) {
            return prev;
          }
          const updated = [...prev, newMessage];
          return updated;
        });
        setTimeout(() => scrollToBottom(true), 100);
      } else if (message.type === "community-chat:delete") {
        setMessages((prev) => prev.filter((m) => m.id !== message.messageId));
      }
    });

    return unsubscribe;
  }, [subscribe]);

  useEffect(() => {
    return () => {
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current);
      }
    };
  }, []);

  const handleSubmit = (message: string) => {
    postMutation.mutate(message);
  };

  const handleDelete = (messageId: number) => {
    deleteMutation.mutate(messageId);
  };

  if (!user) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="py-16">
          <div className="text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Prijavite se da pristupite chatu</p>
            <p className="text-sm">Chat zajednice je dostupan samo registrovanim korisnicima</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isAdmin = user.role === "admin" || user.rank === "admin";

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          Chat Zajednice
        </CardTitle>
        <CardDescription>
          Razgovarajte sa drugim članovima zajednice Studio LeFlow
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <MessageList
          messages={messages}
          isLoading={isLoading}
          currentUserId={user.id}
          isAdmin={isAdmin}
          onDelete={handleDelete}
          containerRef={containerRef}
          endRef={endRef}
        />

        <MessageInput
          onSubmit={handleSubmit}
          isPending={postMutation.isPending}
          cooldownSeconds={cooldownSeconds}
          resetTrigger={formResetTrigger}
        />
      </CardContent>
    </Card>
  );
}
