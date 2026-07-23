import React, { memo } from "react";

const getTimestamp = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "";

    return parsedDate.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

const getReceiptLabel = (message, isMyMessage) => {
    if (!isMyMessage) {
        return null;
    }

    if (message?.seen) {
        return "✓✓ Read";
    }

    if (message?.delivered) {
        return "✓✓ Delivered";
    }

    return "✓ Sent";
};

export const getMessageOwnership = (message, currentUserId) => {
    const normalizedCurrentId = currentUserId ? String(currentUserId) : "";
    const normalizedSenderId = message?.senderId != null ? String(message.senderId) : "";
    const isOwnMessage = Boolean(normalizedCurrentId && normalizedSenderId && normalizedSenderId === normalizedCurrentId);

    if (import.meta.env.DEV && normalizedCurrentId && normalizedSenderId) {
        console.debug("[chat-align]", {
            currentUserId: normalizedCurrentId,
            senderId: normalizedSenderId,
            isOwnMessage,
            message: message?.message,
        });
    }

    return isOwnMessage;
};

/**
 * MessageBubble component - displays a single chat message
 * Handles alignment based on whether it's the current user's message
 */
export const MessageBubble = memo(({ message, isMyMessage, senderName, senderAvatar, showAvatar = true, isConsecutive = false }) => {
    const receiptLabel = getReceiptLabel(message, isMyMessage);

    return (
        <div className={`flex w-full ${isMyMessage ? "justify-end" : "justify-start"}`} role="listitem" aria-label={isMyMessage ? "Your message" : `${senderName || "Incoming"} message`}>
            {!isMyMessage && <div className={`mr-2 shrink-0 ${showAvatar ? "self-end" : "self-end opacity-0"}`}>{showAvatar ? <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-slate-200/80 bg-linear-to-br from-violet-500/70 to-cyan-400/80 text-sm font-semibold text-white shadow-lg dark:border-white/10">{senderAvatar ? <img src={senderAvatar} alt={senderName || "Sender"} className="h-full w-full object-cover" /> : <span>{(senderName || "U").charAt(0).toUpperCase()}</span>}</div> : <div className="h-9 w-9" />}</div>}

            <div className={`max-w-[88%] sm:max-w-[70%] ${isMyMessage ? "ml-auto" : "mr-auto"} ${isConsecutive ? "mt-1" : "mt-2"}`}>
                <div className={`rounded-[1.25rem] border px-4 py-3 shadow-[0_10px_35px_rgba(2,6,23,0.25)] backdrop-blur-sm whitespace-pre-wrap wrap-break-word ${isMyMessage ? "border-transparent bg-linear-to-r from-violet-600 to-cyan-500 text-white" : "border-slate-200/80 bg-white/90 text-slate-900 dark:border-white/15 dark:bg-slate-900/80 dark:text-slate-100"}`}>
                    {!isMyMessage && senderName && !isConsecutive && <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-200">{senderName}</p>}
                    <p className="text-sm leading-6 whitespace-pre-wrap wrap-break-word">{message.message}</p>

                    <div className={`mt-2 flex items-center gap-2 ${isMyMessage ? "justify-end" : "justify-start"}`}>
                        <span className={`text-[11px] ${isMyMessage ? "text-white/80" : "text-slate-500 dark:text-slate-400"}`}>{getTimestamp(message.createdAt)}</span>
                        {receiptLabel && <span className="text-[11px] text-cyan-700 dark:text-cyan-100">{receiptLabel}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
});

MessageBubble.displayName = "MessageBubble";

/**
 * TypingIndicator component - shows when someone is typing
 */
export const TypingIndicator = memo(({ isTyping, typingName }) => {
    if (!isTyping) return null;

    return (
        <div className="flex items-center gap-2 rounded-3xl bg-white/80 px-4 py-3 text-slate-700 shadow-sm dark:bg-white/10 dark:text-slate-300">
            <div className="flex gap-1">
                <span className="block h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="block h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="block h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-sm text-slate-700 dark:text-slate-300">{typingName || "Someone"} is typing...</span>
        </div>
    );
});

TypingIndicator.displayName = "TypingIndicator";

/**
 * MessageInput component - handles message input and submission
 */
export const MessageInput = memo(({ value, onChange, onSubmit, disabled, placeholder }) => {
    return (
        <form onSubmit={onSubmit} className="border-t border-slate-200/80 bg-white/90 p-4 dark:border-white/10 dark:bg-slate-950/50">
            <div className="flex flex-col gap-3 sm:flex-row">
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            onSubmit(e);
                        }
                    }}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="flex-1 rounded-full border border-slate-300/70 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-slate-900/80 dark:text-white"
                    maxLength="1000"
                    autoFocus
                    aria-label="Message input"
                />
                <button type="submit" disabled={disabled || !value.trim()} className="rounded-full bg-linear-to-r from-violet-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 hover:opacity-90 transition-opacity" aria-label="Send message">
                    Send
                </button>
            </div>
        </form>
    );
});

MessageInput.displayName = "MessageInput";

/**
 * ChatHeader component - displays chat title and status
 */
export const ChatHeader = memo(({ title, subtitle, onlineStatus, onlineLabel = "Online" }) => {
    return (
        <div className="border-b border-slate-200/80 px-6 py-4 dark:border-white/10">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-700 dark:text-cyan-200">Private Chat</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{title}</p>
                    {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
                </div>
                <div className={`rounded-full border ${onlineStatus ? "border-emerald-500/30 bg-emerald-500/10" : "border-slate-300/80 bg-slate-100/80"} px-4 py-2 text-sm ${onlineStatus ? "text-emerald-700 dark:text-emerald-200" : "text-slate-700 dark:text-slate-300"}`}>
                    {onlineStatus ? "🟢" : "⚪"} {onlineStatus ? onlineLabel : "Offline"}
                </div>
            </div>
        </div>
    );
});

ChatHeader.displayName = "ChatHeader";

/**
 * MessagesContainer component - displays all messages and handles scrolling
 */
export const MessagesContainer = memo(
    React.forwardRef(({ messages, currentUserId, isLoading, emptyState }, ref) => {
        if (isLoading) {
            return (
                <div className="flex flex-1 items-center justify-center px-4 py-8">
                    <div className="text-slate-400">Loading messages...</div>
                </div>
            );
        }

        if (messages.length === 0) {
            return (
                <div className="flex flex-1 items-center justify-center px-4 py-8">
                    <div className="text-center text-slate-400">{emptyState || "No messages yet. Start the conversation!"}</div>
                </div>
            );
        }

        return (
            <div className="flex-1 space-y-1 overflow-y-auto px-4 py-4" ref={ref} role="log" aria-live="polite">
                {messages.map((message, index) => {
                    const isMyMessage = getMessageOwnership(message, currentUserId);
                    const isConsecutive = index > 0 && messages[index - 1]?.senderId && message.senderId && String(messages[index - 1].senderId) === String(message.senderId);

                    return <MessageBubble key={message._id || `${message.createdAt}-${message.message}-${index}`} message={message} isMyMessage={isMyMessage} isConsecutive={isConsecutive} />;
                })}
                <div ref={ref} />
            </div>
        );
    }),
);

MessagesContainer.displayName = "MessagesContainer";
