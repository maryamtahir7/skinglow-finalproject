import React, { useEffect, useState } from "react";
import { Bell, Check, Trash2, X } from "lucide-react";
import { useUser } from "../context/UserContext";
import { getNotifications, markNotificationRead, deleteNotification } from "../backend/database";
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
            console.log("Notification fetch error:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [user]);

    const handleRead = async (id, link, e) => {
        if (e) e.stopPropagation(); // Prevent bubbling if needed
        try {
            await markNotificationRead(id);
            setNotifications(prev => prev.map(n => n.$id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
            if (link) {
                setOpen(false);
                navigate(link);
            }
        } catch (e) { console.error(e); }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation(); // Prevent triggering the read/navigate action
        try {
            await deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.$id !== id));
            // Recalculate unread count locally just in case
            setUnreadCount(prev => {
                const isRead = notifications.find(n => n.$id === id)?.read;
                return isRead ? prev : Math.max(0, prev - 1);
            });
        } catch (err) {
            console.error("Failed to delete notification", err);
        }
    };

    if (!user) return null;

    return (
        <div className="relative">
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setOpen(!open)}
                className="relative text-muted-foreground hover:text-primary transition-colors"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                )}
            </Button>

            {open && (
                <>
                    {/* Backdrop for mobile */}
                    <div 
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                        onClick={() => setOpen(false)}
                    />

                    <div className="fixed top-[70px] right-4 left-4 md:left-auto md:absolute md:top-full md:right-0 md:mt-2 w-auto md:w-80 p-0 overflow-hidden rounded-2xl border border-border/60 shadow-2xl bg-card/95 backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2 ring-1 ring-black/5">

                        {/* Header */}
                        <div className="p-4 bg-muted/30 border-b border-border/60 flex justify-between items-center backdrop-blur-md">
                            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                                Notifications
                                {unreadCount > 0 && (
                                    <span className="text-[10px] bg-primary text-white px-1.5 py-0.5 rounded-full font-bold">
                                        {unreadCount}
                                    </span>
                                )}
                            </h4>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpen(false);
                                }}
                                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Close notifications"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* List */}
                        <div className="max-h-[60vh] md:max-h-[350px] overflow-y-auto custom-scrollbar bg-card/50">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                                    <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                                        <Bell className="w-5 h-5 opacity-40" />
                                    </div>
                                    <p className="text-sm font-medium text-foreground/80">All caught up!</p>
                                    <p className="text-xs opacity-70 mt-1">No new notifications for now.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border/40">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif.$id}
                                            onClick={(e) => handleRead(notif.$id, notif.link, e)}
                                            className={`group relative p-4 hover:bg-muted/40 transition-all cursor-pointer flex gap-3 items-start ${!notif.read ? "bg-primary/5 hover:bg-primary/10" : ""
                                                }`}
                                        >
                                            {/* Status Dot */}
                                            <div className="mt-1.5 flex-shrink-0">
                                                <div className={`w-2 h-2 rounded-full ring-2 ring-card ${!notif.read ? "bg-primary" : "bg-muted-foreground/30"}`} />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0 pr-6">
                                                <p className={`text-sm leading-snug ${!notif.read ? "font-semibold text-foreground" : "text-muted-foreground font-medium"}`}>
                                                    {notif.message}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground/70 mt-1.5 font-medium flex items-center gap-1">
                                                    {new Date(notif.$createdAt).toLocaleDateString()} • {new Date(notif.$createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>

                                            {/* Delete Action (Visible on Hover) */}
                                            <button
                                                onClick={(e) => handleDelete(notif.$id, e)}
                                                className="absolute top-3 right-3 p-1.5 rounded-lg text-muted-foreground/40 hover:text-red-500 hover:bg-red-500/10 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-200"
                                                title="Delete notification"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer area if needed, e.g. "Mark all read" */}
                        {notifications.length > 0 && (
                            <div className="p-2 border-t border-border/60 bg-muted/20 text-center">
                                <button
                                    onClick={() => {
                                        notifications.forEach(n => !n.read && handleRead(n.$id, null));
                                    }}
                                    className="text-xs text-primary font-semibold hover:underline"
                                >
                                    Mark all as read
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
