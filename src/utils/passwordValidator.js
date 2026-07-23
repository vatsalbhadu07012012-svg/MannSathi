export const PASSWORD_REQUIREMENTS = [
    { label: "At least 8 characters", passed: (password) => password.length >= 8 },
    { label: "One uppercase letter", passed: (password) => /[A-Z]/.test(password) },
    { label: "One lowercase letter", passed: (password) => /[a-z]/.test(password) },
    { label: "One number", passed: (password) => /\d/.test(password) },
    { label: "One special character", passed: (password) => /[!@#$%^&*()_+\-=.?/<>,.]/.test(password) },
];

export const evaluatePasswordStrength = (password = "") => {
    const normalizedPassword = password ?? "";
    const checks = PASSWORD_REQUIREMENTS.map((requirement) => ({
        label: requirement.label,
        passed: requirement.passed(normalizedPassword),
    }));

    const score = [normalizedPassword.length >= 8, /[A-Z]/.test(normalizedPassword) && /[a-z]/.test(normalizedPassword), /\d/.test(normalizedPassword), /[!@#$%^&*()_+\-=.?/<>,.]/.test(normalizedPassword)].filter(Boolean).length;

    let label = "Very Weak";
    let colorClass = "bg-slate-300 dark:bg-slate-700";
    let textClass = "text-slate-500 dark:text-slate-400";
    let description = "Enter a password to check its strength.";

    if (!normalizedPassword) {
        label = "Very Weak";
        colorClass = "bg-slate-300 dark:bg-slate-700";
        textClass = "text-slate-500 dark:text-slate-400";
        description = "Enter a password to check its strength.";
    } else if (score === 1) {
        label = "Weak";
        colorClass = "bg-red-500";
        textClass = "text-red-600 dark:text-red-400";
        description = "Add more variety to make this password stronger.";
    } else if (score === 2) {
        label = "Fair";
        colorClass = "bg-amber-500";
        textClass = "text-amber-600 dark:text-amber-400";
        description = "You are getting there. Add a few more strength boosts.";
    } else if (score === 3) {
        label = "Good";
        colorClass = "bg-lime-500";
        textClass = "text-lime-600 dark:text-lime-400";
        description = "This password is strong enough for registration.";
    } else if (score === 4) {
        label = "Strong";
        colorClass = "bg-emerald-500";
        textClass = "text-emerald-600 dark:text-emerald-400";
        description = "Excellent choice. This password is strong and secure.";
    }

    return {
        score,
        label,
        colorClass,
        textClass,
        checks,
        description,
        isStrongEnough: score >= 3,
    };
};
