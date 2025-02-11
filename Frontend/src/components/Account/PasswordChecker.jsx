import React, { useState } from 'react';
import { MessageCircleQuestionIcon } from 'lucide-react'; // Import the question mark icon

const PasswordStrengthIndicator = ({ password }) => {
    const [passwordStrength, setPasswordStrength] = useState("");

    const evaluatePasswordStrength = (password) => {
        let strength = "";

        if (password.length === 0) {
            setPasswordStrength("");
            return;
        }

        if (password.length < 8) {
            strength = "Password must have more than 8 characters";
        } else if (password.length > 16) {
            strength = "Password cannot be longer than 16 characters";
        } else {
            strength = "Weak";

            const hasUpperCase = /[A-Z]/.test(password);
            const hasNumber = /[0-9]/.test(password);
            const hasSpecialChar = /[!@#$%^&*]/.test(password);

            if (hasUpperCase && hasNumber && hasSpecialChar) {
                strength = "Strong";
            } else if ((hasUpperCase && hasNumber) || (hasUpperCase && hasSpecialChar) || (hasNumber && hasSpecialChar)) {
                strength = "Medium";
            }
        }

        setPasswordStrength(strength);
    };

    // Evaluate password strength whenever the password prop changes
    React.useEffect(() => {
        evaluatePasswordStrength(password);
    }, [password]);

    return (
        <div className="flex justify-between mt-2">
            <p className="">
                Password Strength: 
                <span className={`ml-2 ${passwordStrength === 'Strong' ? 'text-green-600' : passwordStrength === 'Medium' ? 'text-yellow-600' : 'text-red-400'}`}>
                    {passwordStrength}
                </span>
            </p>

            {/* Question mark icon with tooltip */}
            <div className="inline-flex items-center ml-2 relative">
                <MessageCircleQuestionIcon
                    size={20}
                    className="text-teal-500 cursor-pointer"
                    onMouseEnter={(e) => {
                        const tooltip = e.currentTarget.nextSibling;
                        tooltip.classList.remove('hidden');
                    }}
                    onMouseLeave={(e) => {
                        const tooltip = e.currentTarget.nextSibling;
                        tooltip.classList.add('hidden');
                    }}
                />
                {/* Tooltip for password requirements */}
                <div className="absolute hidden w-48 p-2 text-xs text-white bg-black rounded-lg shadow-lg -right-4 top-8 z-10">
                    Password must be at least 8 characters long and contain:
                    <ul className="mt-1 list-disc list-inside">
                        <li>One uppercase letter</li>
                        <li>One number</li>
                        <li>One special character (!@#$%^&*)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PasswordStrengthIndicator;
