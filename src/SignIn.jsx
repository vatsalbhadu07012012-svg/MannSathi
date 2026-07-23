import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useToast } from "./context/ToastContext";
import PasswordStrengthIndicator from "./components/PasswordStrengthIndicator";
import { evaluatePasswordStrength } from "./utils/passwordValidator";
import "./App.css";

const SignIn = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const { pushToast } = useToast();
    const [errorMessages, setErrorMessages] = useState({});
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [showPasswordPanel, setShowPasswordPanel] = useState(false);

    const passwordStrength = useMemo(() => evaluatePasswordStrength(password), [password]);

    useEffect(() => {
        if (!password) {
            setShowPasswordPanel(false);
        }
    }, [password]);

    const validateInputs = (userName, email, passwordValue) => {
        const errors = {};

        if (!/^[A-Za-z0-9]+$/.test(userName)) {
            errors.username = "Username can only contain letters and numbers.";
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = "Please enter a valid email address.";
        }

        if (!passwordStrength.isStrongEnough) {
            errors.password = "Please create a stronger password. Use at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.";
        }

        return errors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const userName = event.target.username.value.trim();
        const email = event.target.email.value.trim();
        const passwordValue = event.target.password.value;

        const errors = validateInputs(userName, email, passwordValue);
        setErrorMessages(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        setLoading(true);
        try {
            const response = await register({ username: userName, email, password: passwordValue });
            if (response?.token) {
                pushToast("Your account is ready. Welcome to ManSathi.", "success");
                navigate("/home");
            } else {
                pushToast("We could not create your account right now.", "error");
            }
        } catch {
            pushToast("Something went wrong during registration.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordFocus = () => {
        setIsPasswordFocused(true);
        if (!password) {
            setShowPasswordPanel(true);
        }
    };

    const handlePasswordBlur = () => {
        setIsPasswordFocused(false);
        if (!password) {
            setShowPasswordPanel(false);
        }
    };

    const handlePasswordChange = (event) => {
        const nextPassword = event.target.value;
        setPassword(nextPassword);
        if (nextPassword) {
            setShowPasswordPanel(true);
        }
    };

    const shouldShowPanel = isPasswordFocused || showPasswordPanel || password.length > 0;

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="mb-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-violet-500 via-cyan-400 to-emerald-400 text-lg font-semibold text-white">M</div>
                    <h1>Create Account</h1>
                    <p>Join a calm space designed for your wellbeing.</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <label>
                        Username
                        <input type="text" name="username" placeholder="Choose a username" required />
                    </label>
                    {errorMessages.username && <p className="error-text">{errorMessages.username}</p>}

                    <label>
                        Email
                        <input type="email" name="email" placeholder="your@email.com" required />
                    </label>
                    {errorMessages.email && <p className="error-text">{errorMessages.email}</p>}

                    <label>
                        Password
                        <input type="password" name="password" placeholder="Create a password" required minLength="8" maxLength="64" value={password} onChange={handlePasswordChange} onFocus={handlePasswordFocus} onBlur={handlePasswordBlur} />
                    </label>
                    <PasswordStrengthIndicator password={password} isVisible={shouldShowPanel} />
                    {errorMessages.password && <p className="error-text">{errorMessages.password}</p>}

                    <button type="submit" disabled={loading || !passwordStrength.isStrongEnough}>
                        {loading ? "Creating account..." : "Sign up"}
                    </button>
                </form>
                <p className="toggle-text">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
