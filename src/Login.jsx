import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useToast } from "./context/ToastContext";
import "./App.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { pushToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrors({});

        const email = event.target.email.value.trim();
        const password = event.target.password.value.trim();
        const validationErrors = {};

        if (!email) {
            validationErrors.email = "Email is required.";
        } else if (!EMAIL_REGEX.test(email)) {
            validationErrors.email = "Please enter a valid email address.";
        }

        if (!password) {
            validationErrors.password = "Password is required.";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setLoading(false);
            return;
        }

        try {
            const response = await login({ email, password });
            if (response?.success) {
                pushToast("Welcome back to ManSathi.", "success");
                navigate("/home");
            } else {
                pushToast(response?.message || "Invalid email or password.", "error");
            }
        } catch {
            pushToast("Something went wrong during sign-in.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="mb-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-violet-500 via-cyan-400 to-emerald-400 text-lg font-semibold text-white">M</div>
                    <h1>Welcome back</h1>
                    <p>Access your calm, supportive space.</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <label>
                        Email
                        <input type="email" name="email" placeholder="your@email.com" aria-label="Email" />
                        {errors.email && <p className="error-text">{errors.email}</p>}
                    </label>
                    <label>
                        Password
                        <input type="password" name="password" placeholder="Enter password" aria-label="Password" />
                        {errors.password && <p className="error-text">{errors.password}</p>}
                    </label>
                    <button type="submit" disabled={loading}>
                        {loading ? "Signing in..." : "Login"}
                    </button>
                </form>
                <p className="toggle-text">
                    Don&apos;t have an account? <Link to="/signup">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
