import React, { createContext, useContext, useState, useCallback } from "react";

const ChatContext = createContext();

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChatContext must be used within ChatProvider");
    }
    return context;
};

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [typing, setTyping] = useState(false);
    const [onlineStatus, setOnlineStatus] = useState(true);
    const [optimisticMessages, setOptimisticMessages] = useState([]); // Messages sent but not confirmed
    const [readReceipts, setReadReceipts] = useState({}); // Track message read status

    /**
     * Add a message (real or optimistic)
     */
    const addMessage = useCallback((message, isOptimistic = false) => {
        setMessages((prev) => {
            // Prevent duplicates
            const exists = prev.some((m) => m._id === message._id || (isOptimistic && m.tempId === message.tempId));
            if (exists) return prev;

            return [...prev, { ...message, isOptimistic }];
        });

        if (isOptimistic) {
            setOptimisticMessages((prev) => [...prev, message]);
        }
    }, []);

    /**
     * Confirm an optimistic message (mark as sent)
     */
    const confirmMessage = useCallback((tempId, realMessage) => {
        setMessages((prev) =>
            prev.map((m) => {
                if (m.tempId === tempId) {
                    return { ...realMessage, isOptimistic: false };
                }
                return m;
            }),
        );

        setOptimisticMessages((prev) => prev.filter((m) => m.tempId !== tempId));
    }, []);

    /**
     * Mark message as delivered
     */
    const markAsDelivered = useCallback((messageId) => {
        setMessages((prev) =>
            prev.map((m) => {
                if (m._id === messageId) {
                    return { ...m, delivered: true };
                }
                return m;
            }),
        );
    }, []);

    /**
     * Mark message as read
     */
    const markAsRead = useCallback((messageId) => {
        setMessages((prev) =>
            prev.map((m) => {
                if (m._id === messageId) {
                    return { ...m, seen: true };
                }
                return m;
            }),
        );

        setReadReceipts((prev) => ({ ...prev, [messageId]: true }));
    }, []);

    /**
     * Replace all messages (when loading history)
     */
    const setAllMessages = useCallback((msgs) => {
        setMessages(msgs || []);
        setOptimisticMessages([]);
    }, []);

    /**
     * Clear all messages (on logout, etc.)
     */
    const clearMessages = useCallback(() => {
        setMessages([]);
        setOptimisticMessages([]);
        setReadReceipts({});
    }, []);

    const value = {
        messages,
        typing,
        setTyping,
        onlineStatus,
        setOnlineStatus,
        optimisticMessages,
        readReceipts,
        addMessage,
        confirmMessage,
        markAsDelivered,
        markAsRead,
        setAllMessages,
        clearMessages,
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
