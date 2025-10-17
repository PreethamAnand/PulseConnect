
import { Bell, Menu, User } from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "@/integrations/firebase/client";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const [notifications, setNotifications] = useState<{ id: string; message: string; time: string }[]>([]);
  const [unread, setUnread] = useState(0);
  useEffect(() => {
    // Listen to unread messages for current user (placeholder receiverId)
    const q = query(collection(db, 'conversations'), where('receiver_id', '==', 'current-user'));
    const unsub = onSnapshot(q, (snap) => {
      setUnread(snap.size);
    });
    return () => unsub();
  }, []);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  return (
    <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
        <Menu />
      </Button>

      <div className="flex-1"></div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell />
              {unread > 0 && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blood rounded-full" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="py-3 cursor-pointer">
                <div>
                  <p className="font-medium">{notification.message}</p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center">
              <Link to="/notifications">View all notifications</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={async () => { await signOut(); navigate('/auth'); }} className="cursor-pointer">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
