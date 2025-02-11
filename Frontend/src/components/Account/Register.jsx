import React, { useState, useEffect } from 'react';
import { ArrowRight, Eye, EyeOff, Film, Play, Video } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle } from 'lucide-react';
import Cookies from "js-cookie";
import axios from "axios";
import PasswordStrengthIndicator from './PasswordChecker';

const FeatureSection = ({ icon, title, features }) => (
    <div>
        <div className="flex items-center space-x-3 mb-4">
            {React.cloneElement(icon, { className: "h-6 w-6 text-purple-500" })}
            <span className="text-xl font-semibold text-white">{title}</span>
        </div>
        <ul className="space-y-3">
            {features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-500" />
                    <span className="text-lg text-white">{feature}</span>
                </li>
            ))}
        </ul>
    </div>
);

export default function Register() {
    const [formData, setFormData] = useState({
        fullname: "",
        username: "",
        password: "",
        confirmPassword: ""
    });
    const [avatarFile, setAvatarFile] = useState("");
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = Cookies.get("user") ? true : false;
        if (user) navigate("/");
    }, []);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
        setErrorMessage("");
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setFormData(prevData => ({
            ...prevData,
            password: value
        }));
        setPasswordMatch(value === formData.confirmPassword);
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setFormData(prevData => ({
            ...prevData,
            confirmPassword: value
        }));
        setPasswordMatch(value === formData.password);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        const data = new FormData();
        for (let x in formData) {
            if (x !== 'confirmPassword') data.append(x, formData[x]);
        }
        data.append("avatar", avatarFile);

        axios.post("/api/users/register", data)
            .then(res => {
                let userDetails = res.data.data;
                Cookies.set("user", JSON.stringify(userDetails));
                navigate("/");
            })
            .catch(e => setErrorMessage(e.response.data.data));
    };

    return (
        <section>
            <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
                <div className="relative flex items-end px-4 pb-10 pt-60 sm:px-6 sm:pb-16 md:justify-center lg:px-8 lg:pb-24 max-lg:hidden">
                    <div className="absolute inset-0">
                        <img
                            className="h-full w-full rounded-md object-cover object-top"
                            src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d"
                            alt="Content creator workspace"
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                    <div className="relative">
                        <div className="w-full max-w-xl xl:mx-auto xl:w-full xl:max-w-xl xl:pr-24">
                            <h3 className="text-4xl font-bold text-white">
                                Share your creativity with the world
                            </h3>
                            <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                                <FeatureSection icon={<Video />} title="For Creators" features={[
                                    "High-quality video hosting",
                                    "Powerful creator tools",
                                    "Engage with your audience"
                                ]} />
                                <FeatureSection icon={<Play />} title="For Viewers" features={[
                                    "Unlimited HD streaming",
                                    "Personalized recommendations",
                                    "Interactive community"
                                ]} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-2">
                    <div className="w-full max-w-3xl bg-white/10 p-12 rounded-3xl shadow-xl">
                        <div className="flex items-center mb-8">
                            <Film className="h-12 w-12 text-purple-500 mr-4" />
                            <div>
                                <h2 className="text-4xl font-extrabold text-white">Create Your Account</h2>
                                <p className="mt-3 text-lg text-gray-300">
                                    Already have an account?{" "}
                                    <Link to="/signin" className="font-semibold text-purple-400 hover:text-purple-300 hover:underline">
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-lg font-semibold text-gray-300">Full Name</label>
                                    <input
                                        className="w-full mt-3 rounded-xl border border-gray-600 bg-gray-900 px-5 py-4 text-xl text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                        name="fullname"
                                        placeholder="Enter your full name"
                                        required
                                        value={formData.fullname}
                                        onChange={handleInput}
                                    />
                                </div>
                                <div>
                                    <label className="block text-lg font-semibold text-gray-300">Username</label>
                                    <input
                                        className="w-full mt-3 rounded-xl border border-gray-600 bg-gray-900 px-5 py-4 text-xl text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                        name="username"
                                        placeholder="For example: mr_white"
                                        required
                                        value={formData.username}
                                        onChange={handleInput}
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-lg font-semibold text-gray-300">Password</label>
                                    <div className="relative mt-3">
                                        <input
                                            className="w-full rounded-xl border border-gray-600 bg-gray-900 px-5 py-4 text-xl text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="Create a password"
                                            required
                                            value={formData.password}
                                            onChange={handlePasswordChange}
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 text-xl transition"
                                        >
                                            {showPassword ? <EyeOff /> : <Eye />}
                                        </button>
                                    </div>
                                    {formData.password && <PasswordStrengthIndicator password={formData.password} />}
                                </div>

                                <div>
                                    <label className="block text-lg font-semibold text-gray-300">Confirm Password</label>
                                    <input
                                        className="w-full mt-3 rounded-xl border border-gray-600 bg-gray-900 px-5 py-4 text-xl text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                        type={showPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder="Confirm your password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                    />
                                    {formData.confirmPassword && (
                                        <p className={`text-lg mt-2 font-medium ${passwordMatch ? "text-green-400" : "text-red-400"}`}>
                                            {passwordMatch ? "✅ Passwords match" : "❌ Passwords do not match"}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-lg font-semibold text-gray-300">Profile Picture</label>
                                    <input
                                        className="w-full mt-3 rounded-xl border border-gray-600 bg-gray-900 px-5 py-4 text-lg text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-lg font-semibold text-gray-300">Preview</label>
                                    <div className="mt-3 h-28 w-28 rounded-full border-4 border-gray-600 flex items-center justify-center overflow-hidden bg-gray-900">
                                        {avatarPreview ? (
                                            <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="text-gray-400 text-lg">No image</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {errorMessage && (
                                <div className="p-4 bg-red-500/20 border border-red-400 text-lg font-semibold text-red-400 rounded-lg">
                                    {errorMessage}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center rounded-2xl bg-purple-500 px-6 py-5 text-2xl font-bold text-white transition-all duration-300 hover:bg-purple-600 hover:shadow-xl"
                            >
                                Create Account <ArrowRight className="ml-3" size={24} />
                            </button>
                        </form>
                    </div>
                </div>


            </div>
        </section>
    );
}