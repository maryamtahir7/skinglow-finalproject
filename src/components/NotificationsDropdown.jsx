import React, { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";
import { useUser } from "../context/UserContext";
import { getNotifications, markNotificationRead } from "../backend/database";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotificationsDropdown() {
    const { user } = useUser();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const res = await getNotifications(user.$id);
            setNotifications(res.documents);
            setUnreadCount(res.documents.filter(n => !n.read).length);
        } catch (error) {
            // Silent fail if collection doesn't exist yet
            console.log("Notification fetch error (ignore if setup incomplete):", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [user]);

    const handleRead = async (id, link) => {
        try {
            await markNotificationRead(id);
            setNotifications(prev => prev.map(n => n.$id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
            if (link) navigate(link);
        } catch (e) { console.error(e); }
    };

    if (!user) return null;

    return (
        <div className="relative">
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setOpen((prev) => !prev)}
                className="relative text-muted-foreground hover:text-primary"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
            </Button>

            {open && (
                <>
                    {/* Mobile Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                        onClick={() => setOpen(false)}
                    />
                    
                    {/* Dropdown Panel */}
                    <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] md:max-w-[90vw] p-0 overflow-hidden rounded-xl border border-border shadow-xl bg-card z-50">
                        <div className="p-3 sm:p-4 bg-secondary/30 border-b border-border flex justify-between items-center">
                            <h4 className="font-bold text-sm text-foreground">Notifications</h4>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                                        {unreadCount} New
                                    </span>
                                )}
                                <button
                                    onClick={() => setOpen(false)}
                                    className="md:hidden p-1 rounded hover:bg-secondary/50 text-muted-foreground"
                                    aria-label="Close notifications"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="max-h-[60vh] md:max-h-[300px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground text-sm">
                                    <Bell className="w-8 h-8 opacity-20 mx-auto mb-2" />
                                    <p className="text-xs sm:text-sm">No notifications yet.</p>
                                </div>
                            ) : (
                                notifications.map((notif) => (
                                    <div
                                        key={notif.$id}
                                        onClick={() => {
                                            handleRead(notif.$id, notif.link);
                                            setOpen(false);
                                        }}
                                        className={`p-3 sm:p-4 border-b border-border last:border-0 active:bg-secondary/30 cursor-pointer transition ${
                                            !notif.read ? "bg-primary/5" : ""
                                        }`}
                                    >
                                        <div className="flex gap-2 sm:gap-3">
                                            <div
                                                className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                                                    !notif.read ? "bg-primary" : "bg-transparent"
                                                }`}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p
                                                    className={`text-xs sm:text-sm leading-relaxed ${
                                                        !notif.read
                                                            ? "font-semibold text-foreground"
                                                            : "text-muted-foreground"
                                                    }`}
                                                >
                                                    {notif.message}
                                                </p>
                                                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 opacity-70">
                                                    {new Date(notif.$createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
