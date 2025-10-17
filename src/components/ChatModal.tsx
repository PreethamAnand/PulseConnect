import { useEffect, useRef, useState } from "react";
import { db, storage } from "@/integrations/firebase/client";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Picker from "emoji-picker-react";

interface ChatModalProps {
  open: boolean;
  onClose: () => void;
  conversationId: string;
  senderId: string;
  receiverId: string;
}

export default function ChatModal({ open, onClose, conversationId, senderId, receiverId }: ChatModalProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const q = query(collection(db, "conversations", conversationId, "messages"), orderBy("timestamp"));
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => d.data()));
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    });
    return () => unsub();
  }, [open, conversationId]);

  const send = async (payload: Partial<{ message: string; imageUrl: string }>) => {
    await addDoc(collection(db, "conversations", conversationId, "messages"), {
      conversation_id: conversationId,
      sender_id: senderId,
      receiver_id: receiverId,
      type: payload.imageUrl ? "image" : "text",
      message: payload.message || "",
      imageUrl: payload.imageUrl || "",
      timestamp: serverTimestamp(),
    });
  };

  const onSend = async () => {
    if (!text.trim()) return;
    await send({ message: text.trim() });
    setText("");
  };

  const uploadImage = async (file: File) => {
    const r = ref(storage, `chat/${conversationId}/${Date.now()}-${file.name}`);
    await uploadBytes(r, file);
    const url = await getDownloadURL(r);
    await send({ imageUrl: url });
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-md shadow-lg flex flex-col h-[80vh]">
        <div className="p-3 border-b flex justify-between items-center">
          <div className="font-semibold">Conversation</div>
          <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {messages.map((m, i) => (
            <div key={i} className={`max-w-[75%] ${m.sender_id===senderId? 'ml-auto text-right':'mr-auto'}`}>
              {m.type === 'image' ? (
                <img src={m.imageUrl} alt="chat attachment" className="rounded-md" />
              ) : (
                <div className="px-3 py-2 bg-gray-100 rounded-md inline-block">{m.message}</div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="p-3 border-t space-y-2">
          {showEmoji && (
            <div className="border rounded">
              <Picker onEmojiClick={(e) => setText((t) => t + e.emoji)} />
            </div>
          )}
          <div className="flex items-center gap-2">
            <Input aria-label="Message" value={text} onChange={(e)=>setText(e.target.value)} placeholder="Type a message..." onKeyDown={(e)=>{ if(e.key==='Enter') onSend(); }} />
            <input aria-label="Upload image" type="file" accept="image/*" onChange={(e)=>{ const f=e.target.files?.[0]; if(f) uploadImage(f); }} />
            <Button variant="outline" onClick={()=>setShowEmoji(s=>!s)}>😊</Button>
            <Button className="blood-btn" onClick={onSend}>Send</Button>
          </div>
        </div>
      </div>
    </div>
  );
}


