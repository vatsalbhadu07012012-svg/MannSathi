import axios from "axios";

const API = axios.create({
    baseURL: "https://mannsathi-backend.onrender.com:3000/api",
    withCredentials: true,
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("mansathi_token") || localStorage.getItem("mansathi_counsellor_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fallbackScore = {
    score: 78,
    status: "Good",
    progress: 82,
    weekly: [54, 62, 71, 68, 76, 81, 78],
    moodTrend: ["Calm", "Focused", "Reflective", "Balanced", "Hopeful", "Steady", "Bright"],
    todayMood: "Calm",
    lastAssessment: "2 days ago",
};

const fallbackQuote = {
    text: "Small steps still move you forward.",
    author: "ManSathi",
};

const fallbackPlan = [
    {
        id: 1,
        time: "Morning",
        title: "Mindful breathing",
        completed: false,
    },
    {
        id: 2,
        time: "Afternoon",
        title: "Stretch and hydrate",
        completed: false,
    },
    {
        id: 3,
        time: "Evening",
        title: "Reflect on one win",
        completed: false,
    },
    {
        id: 4,
        time: "Night",
        title: "Limit screen time",
        completed: false,
    },
];

export const authApi = {
    register: async (payload) => {
        try {
            const response = await API.post("/auth/register", payload);
            return response.data;
        } catch (error) {
            if (error.response?.data) {
                return { success: false, ...error.response.data };
            }
            return { success: false, message: "Unable to register at this time." };
        }
    },
    login: async (payload) => {
        try {
            const response = await API.post("/auth/login", payload);
            return response.data;
        } catch (error) {
            if (error.response?.data) {
                return { success: false, ...error.response.data };
            }
            return { success: false, message: "Unable to sign in at this time." };
        }
    },
    me: async () => {
        try {
            const response = await API.get("/auth/me");
            return response.data;
        } catch {
            return { success: false, message: "Not authenticated." };
        }
    },
};

export const mentalHealthApi = {
    score: async () => {
        try {
            const response = await API.get("/mental-health/score");
            return response.data;
        } catch {
            await delay(700);
            return fallbackScore;
        }
    },
    checkup: async (payload) => {
        try {
            const response = await API.post("/mental-health/checkup", payload);
            return response.data;
        } catch {
            await delay(700);
            return {
                message: "Checkup saved locally for now.",
                data: payload,
                score: {
                    score: 72,
                    status: "Moderate",
                    category: "Moderate",
                    insights: ["Your responses suggest a need for steady self-care."],
                    recommendations: ["Try a short breathing exercise and a consistent bedtime routine."],
                    scores: {
                        stressScore: 68,
                        anxietyScore: 70,
                        moodScore: 65,
                        sleepScore: 62,
                        energyScore: 66,
                        emotionalBalanceScore: 68,
                        socialScore: 72,
                        concentrationScore: 64,
                        selfEsteemScore: 67,
                        dailyWellnessScore: 69,
                    },
                },
            };
        }
    },
    history: async () => {
        try {
            const response = await API.get("/mental-health/history");
            return response.data;
        } catch {
            await delay(500);
            return [
                { id: 1, date: "Mon", score: 72 },
                { id: 2, date: "Tue", score: 74 },
                { id: 3, date: "Wed", score: 78 },
                { id: 4, date: "Thu", score: 80 },
                { id: 5, date: "Fri", score: 76 },
                { id: 6, date: "Sat", score: 82 },
                { id: 7, date: "Sun", score: 78 },
            ];
        }
    },
};

export const quotesApi = {
    random: async () => {
        try {
            const response = await API.get("/quotes/random");
            return response.data;
        } catch {
            await delay(500);
            return fallbackQuote;
        }
    },
};

export const dailyPlanApi = {
    get: async () => {
        try {
            const response = await API.get("/daily-plan");
            return response.data;
        } catch {
            await delay(600);
            return fallbackPlan;
        }
    },
    create: async (payload) => {
        try {
            const response = await API.post("/daily-plan", payload);
            return response.data;
        } catch {
            await delay(500);
            return { ...payload, id: Date.now() };
        }
    },
    update: async (id, payload) => {
        try {
            const response = await API.put(`/daily-plan/${id}`, payload);
            return response.data;
        } catch {
            await delay(500);
            return { id, ...payload };
        }
    },
};

const fallbackCounsellors = [
    {
        _id: "demo-1",
        fullName: "Dr. Nishi",
        name: "Dr. Nishi",
        qualification: "Clinical Psychologist (M.Phil Clinical Psychology)",
        specialization: ["Anxiety Disorders", "Depression", "Stress Management", "Student Counselling"],
        experienceYears: 8,
        languages: ["English", "Hindi"],
        availability: ["Available Today"],
        consultationTypes: ["Phone", "Chat", "Video"],
        bio: "I help students, young adults, and working professionals manage stress, anxiety, emotional challenges, and personal growth through compassionate guidance and evidence-based counselling.",
        phone: "+91 99876 54321",
        email: "nishi@mansathi.ai",
        photoUrl: "https://ik.imagekit.io/VatsalBh/nishi.jpg",
        consultationFee: 0,
        isFree: true,
        sessionDuration: 45,
        nextAvailable: "Today • 4:30 PM",
        verified: true,
    },
    {
        _id: "demo-2",
        fullName: "Dr. Ramta Dhar",
        name: "Dr. Ramta Dhar",
        qualification: "Counselling Psychologist (Ph.D. Psychology)",
        specialization: ["Relationship Counselling", "Workplace Stress", "Emotional Wellbeing", "Family Therapy"],
        experienceYears: 10,
        languages: ["English", "Hindi"],
        availability: ["Available Tomorrow"],
        consultationTypes: ["Phone", "Chat", "Video"],
        bio: "I specialize in helping individuals and families improve communication, manage workplace stress, build resilience, and build healthier relationships through supportive counselling.",
        phone: "+91 98765 43211",
        email: "ramta.dhar@mansathi.ai",
        photoUrl: "https://ik.imagekit.io/VatsalBh/ramta.jpg?updatedAt=1784521277329",
        consultationFee: 0,
        isFree: true,
        sessionDuration: 60,
        nextAvailable: "Tomorrow • 11:00 AM",
        verified: true,
    },
];

export const counsellorApi = {
    list: async () => {
        try {
            const response = await API.get("/counsellors");
            return response.data.data;
        } catch {
            await delay(700);
            return fallbackCounsellors;
        }
    },
    bookAppointment: async (payload) => {
        try {
            const response = await API.post("/counsellors/appointments", payload);
            return response.data;
        } catch (error) {
            if (error.response?.data) {
                return { success: false, ...error.response.data };
            }
            return { success: false, message: "Unable to book your appointment right now." };
        }
    },
    requestCall: async (payload) => {
        try {
            const response = await API.post("/counsellors/call-request", payload);
            return response.data;
        } catch {
            await delay(700);
            return {
                success: true,
                message: "Your counsellor call request has been queued. We will reach out shortly.",
            };
        }
    },
};

export const chatApi = {
    history: async () => {
        try {
            const response = await API.get("/chat");
            return response.data;
        } catch {
            await delay(500);
            return [];
        }
    },
    send: async (payload) => {
        try {
            const response = await API.post("/chat", payload);
            return response.data;
        } catch {
            await delay(700);
            return { reply: "I’m here with you. Take a slow breath and share what you are feeling." };
        }
    },
    clear: async () => {
        try {
            const response = await API.delete("/chat");
            return response.data;
        } catch {
            return { success: false, message: "Unable to clear chat history." };
        }
    },
};

export const healthTrackerApi = {
    list: async () => {
        try {
            const response = await API.get("/health-tracker");
            return response.data;
        } catch {
            await delay(600);
            return [];
        }
    },
    save: async (payload, id) => {
        try {
            const response = id ? await API.put(`/health-tracker/${id}`, payload) : await API.post("/health-tracker", payload);
            return response.data;
        } catch (error) {
            if (error.response?.data) {
                return { success: false, ...error.response.data };
            }
            return { success: false, message: "Unable to save your health entry." };
        }
    },
    delete: async (id) => {
        try {
            const response = await API.delete(`/health-tracker/${id}`);
            return response.data;
        } catch (error) {
            if (error.response?.data) {
                return { success: false, ...error.response.data };
            }
            return { success: false, message: "Unable to delete your health entry." };
        }
    },
};
