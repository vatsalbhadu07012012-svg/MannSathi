export const getPasswordStrength = (password) => {
    if (!password) {
        return {
            score: 0,
            label: "Very Weak",
            color: "bg-red-500",
            checks: [
                { label: "At least 8 characters", passed: false },
                { label: "Contains an uppercase letter", passed: false },
                { label: "Contains a number", passed: false },
                { label: "Contains a special character", passed: false },
            ],
        };
    }

    const checks = [
        { label: "At least 8 characters", passed: password.length >= 8 },
        { label: "Contains an uppercase letter", passed: /[A-Z]/.test(password) },
        { label: "Contains a number", passed: /\d/.test(password) },
        { label: "Contains a special character", passed: /[!@#$%^&*()_+\-=.?/<>,.]/.test(password) },
    ];

    const score = checks.filter((check) => check.passed).length;

    let label = "Very Weak";
    let color = "bg-red-500";

    if (score === 4) {
        label = "Strong";
        color = "bg-emerald-500";
    } else if (score === 3) {
        label = "Good";
        color = "bg-lime-500";
    } else if (score === 2) {
        label = "Fair";
        color = "bg-yellow-500";
    } else if (score === 1) {
        label = "Weak";
        color = "bg-red-500";
    }

    return { score, label, color, checks };
};
