import { io } from "socket.io-client";

let socketInstance = null;
let listeners = {};

const resolveSocketUrl = () => {
    // Prefer Vite env var (VITE_SOCKET_URL) when available, else derive from current host
    const envUrl = import.meta.env.VITE_SOCKET_URL;
    if (envUrl && typeof envUrl === "string") return envUrl;
    const proto = window.location.protocol;
    const host = window.location.hostname;
    return `${proto}//${host}:3000`;
};

const socketService = {
    init(token) {
        // If an existing socket is connected but token changed, reconnect with new token
        if (socketInstance && socketInstance.connected) {
            return socketInstance;
        }

        const url = resolveSocketUrl();
        socketInstance = io(url, {
            auth: { token },
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: Infinity,
            transports: ["websocket"],
        });

        socketInstance.on("connect", () => {
            console.log("Socket connected:", socketInstance.id);
        });

        socketInstance.on("disconnect", (reason) => {
            console.log("Socket disconnected", reason);
        });

        socketInstance.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
        });

        return socketInstance;
    },

    getInstance() {
        return socketInstance;
    },

    on(event, callback) {
        if (!socketInstance) {
            console.warn("Socket not initialized");
            return;
        }

        if (!listeners[event]) listeners[event] = new Set();
        listeners[event].add(callback);
        socketInstance.on(event, callback);
    },

    off(event, callback) {
        if (!socketInstance) return;
        socketInstance.off(event, callback);
        if (listeners[event]) {
            listeners[event].delete(callback);
            if (listeners[event].size === 0) delete listeners[event];
        }
    },

    offAll() {
        if (!socketInstance) return;
        // Remove all stored listeners
        Object.keys(listeners).forEach((event) => {
            listeners[event].forEach((cb) => socketInstance.off(event, cb));
        });
        listeners = {};
    },

    emit(event, data) {
        if (!socketInstance) {
            console.warn("Socket not initialized");
            return;
        }
        socketInstance.emit(event, data);
    },

    disconnect() {
        if (socketInstance) {
            this.offAll();
            socketInstance.disconnect();
            socketInstance = null;
        }
    },

    isConnected() {
        return socketInstance?.connected || false;
    },
};

export default socketService;
