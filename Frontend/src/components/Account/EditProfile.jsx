import React, { useState } from "react";
import axios from "axios";
import { X, Save, Eye, EyeOff } from "lucide-react";
import PasswordStrengthIndicator from "./PasswordChecker";
import { showCustomAlert } from "../Utils/utility";
import { useOutletContext } from "react-router-dom";

export default function EditProfile({ isOpen, onClose, user, setUser }) {
    const [formData, setFormData] = useState({ fullname: user.fullname });
    const [avatarFile, setAvatarFile] = useState(null);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const {setUserData} = useOutletContext()

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (e) => {
        if (e.target.files.length > 0) {
            setAvatarFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError("");

        // Update user details (fullname & email)
        if (formData.fullname !== user.fullname) {
            axios.patch("/api/users/update_details", { fullname: formData.fullname })
                .then(res => {
                    setUser(prev => ({ ...prev, fullname: res.data.data.fullname }))
                    setUserData(user => ({...user, fullname: res.data.data.fullname }))
                    onClose()
                })
                .catch(err => setError(err.response?.data?.message || "Failed to update details"));
        }

        // Update avatar
        if (avatarFile) {
            const formData = new FormData();
            formData.append("avatar", avatarFile);

            axios.patch("/api/users/update_avatar", formData, { headers: { "Content-Type": "multipart/form-data" } })
                .then(res => {
                    setUser(prev => ({ ...prev, avatar: res.data.data.avatar }))
                    setUserData(user => ({ ...user, avatar: res.data.data.avatar }))
                    onClose()
                })
                .catch(err => setError(err.response?.data?.message || "Failed to update avatar"));
        }

        // Update password if both old & new password fields are filled
        if (oldPassword && newPassword) {
            axios.patch("/api/users/update_password", { oldPassword, newPassword })
                .then(() => {
                    showCustomAlert("Password Changed Successfully!!")
                    onClose()
                })
                .catch(err => setError(err.response?.data?.message || "Failed to update password"));
        }

        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-[#1e2030] rounded-lg w-full max-w-md m-4 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Edit Profile</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <label className="text-gray-400 text-sm">Full Name</label>
                        <input
                            type="text"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-[#2a2b3e] text-white border border-gray-700 focus:outline-none"
                        />
                    </div>

                    {/* Avatar Upload */}
                    <div>
                        <label className="text-gray-400 text-sm">Profile Picture</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="w-full px-4 py-2 rounded-lg bg-[#2a2b3e] cursor-pointer text-white border border-gray-700 focus:outline-none"
                        />
                    </div>

                    {/* Password Update */}
                    <div className="border-t border-gray-700 pt-4">
                        <h3 className="text-gray-400 text-sm mb-2">Change Password (Optional)</h3>

                        {/* Old Password */}
                        <div className="relative">
                            <input
                                type={showOldPassword ? "text" : "password"}
                                placeholder="Old Password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-[#2a2b3e] text-white border border-gray-700 focus:outline-none"
                            />
                            <button type="button" className="absolute right-3 top-2 text-gray-400" onClick={() => setShowOldPassword(!showOldPassword)}>
                                {showOldPassword ? <EyeOff className="w-5 h-5 cursor-pointer" /> : <Eye className="w-5 h-5 cursor-pointer" />}
                            </button>
                        </div>

                        {/* New Password */}
                        <div className="relative mt-2">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-[#2a2b3e] text-white border border-gray-700 focus:outline-none"
                            />
                            <button type="button" className="absolute right-3 top-2 text-gray-400" onClick={() => setShowNewPassword(!showNewPassword)}>
                                {showNewPassword ? <EyeOff className="w-5 h-5 cursor-pointer" /> : <Eye className="w-5 h-5 cursor-pointer" />}
                            </button>
                        </div>

                        {/* Password Strength Indicator */}
                        <PasswordStrengthIndicator password={newPassword} />
                    </div>

                    {/* Error Message */}
                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        className={`w-full bg-[#7c3aed] hover:bg-[#6d28d9] cursor-pointer px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${loading ? "hidden" : ""}`}
                    >
                        {loading ? "Saving..." : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
