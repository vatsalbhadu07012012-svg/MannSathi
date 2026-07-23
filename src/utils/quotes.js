export const MOTIVATION_QUOTES = [
    { id: "quote-1", quote: "You do not have to be fearless, just brave enough to begin.", author: "Mary T. Blige" },
    { id: "quote-2", quote: "Small steps still move you forward.", author: "ManSathi" },
    { id: "quote-3", quote: "You are allowed to rest, recover, and begin again.", author: "Unknown" },
    { id: "quote-4", quote: "Your mind deserves kindness as much as your body does.", author: "Unknown" },
    { id: "quote-5", quote: "Progress is still progress, even if it looks quiet.", author: "Unknown" },
    { id: "quote-6", quote: "The strongest thing you can do today is take one gentle step.", author: "Unknown" },
    { id: "quote-7", quote: "Confidence grows when you keep showing up for yourself.", author: "Unknown" },
    { id: "quote-8", quote: "Mindfulness is the quiet power of returning to the present.", author: "Unknown" },
    { id: "quote-9", quote: "Your healing does not need to be loud to be real.", author: "Unknown" },
    { id: "quote-10", quote: "One calm breath can change the course of your day.", author: "Unknown" },
    { id: "quote-11", quote: "You are not behind; you are becoming.", author: "Unknown" },
    { id: "quote-12", quote: "A little self-care each day can build a stronger life.", author: "Unknown" },
];

export const QUOTE_STORAGE_KEY = "mansathi_current_quote";

export const getStoredQuote = () => {
    if (typeof window === "undefined") return null;
    try {
        const item = window.localStorage.getItem(QUOTE_STORAGE_KEY);
        if (!item) return null;
        const parsed = JSON.parse(item);
        return MOTIVATION_QUOTES.find((quote) => quote.id === parsed.id) ?? null;
    } catch {
        return null;
    }
};

export const persistQuote = (quote) => {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(quote));
    } catch {
        // Ignore storage errors silently.
    }
};

export const getInitialQuote = () => {
    const storedQuote = getStoredQuote();
    if (storedQuote) return storedQuote;
    return MOTIVATION_QUOTES[Math.floor(Math.random() * MOTIVATION_QUOTES.length)];
};

export const getNextQuote = (currentQuote, quoteHistory = []) => {
    const currentId = currentQuote?.id;
    const available = MOTIVATION_QUOTES.filter((entry) => entry.id !== currentId && !quoteHistory.includes(entry.id));

    if (available.length > 0) {
        const nextQuote = available[Math.floor(Math.random() * available.length)];
        return { quote: nextQuote, history: [...quoteHistory, nextQuote.id] };
    }

    const fallback = MOTIVATION_QUOTES.find((entry) => entry.id !== currentId) ?? MOTIVATION_QUOTES[0];
    return { quote: fallback, history: [] };
};
