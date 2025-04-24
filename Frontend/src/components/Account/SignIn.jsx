import React, { useState, useEffect } from 'react';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/Streamnest.png"
import Loading from '../AppComponents/Loading';

export default function SignIn({ onSwitchToRegister }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = Cookies.get('user') ? true : false;
        if (user) navigate('/home');
    }, []);

    const handleInput = (e) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            username: value,
            email: value,
            password: prev.password
        }));
        setErrorMessage('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.username && !formData.email) {
            return setErrorMessage('Please enter your username or email.');
        }

        axios.post('/api/users/login', formData)
            .then((res) => {
                navigate('/home');
            })
            .catch(error => {
                setLoading(false)
                setErrorMessage(error.response?.data?.data || 'An error occurred')
            });
    };

    return (
        <div className="w-full max-w-3xl bg-white/10 p-12 rounded-3xl shadow-xl">
            <div className="flex items-center mb-8">
                <img src={logo} alt="logo" className='h-28 mr-6 logo' />
                <div>
                    <h2 className="text-4xl font-extrabold text-white">Welcome Back</h2>
                    <p className="mt-3 text-lg text-gray-300">
                        Don't have an account?{' '}
                        <button
                            onClick={onSwitchToRegister}
                            className="font-semibold text-purple-400 hover:text-purple-300 hover:underline"
                        >
                            Create a free account
                        </button>
                    </p>
                </div>
            </div>

            {
                loading ? (
                    <Loading auth={true} loader={{ setLoading }} />
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label className="block text-lg font-semibold text-gray-300">
                                Username or Email
                            </label>
                            <input
                                type="text" name='username' id='username'
                                className="w-full mt-3 rounded-xl border border-gray-600 bg-gray-900 px-5 py-4 text-xl text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                placeholder="Enter your username or email"
                                value={formData.username}
                                onChange={handleInput}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-lg font-semibold text-gray-300">
                                Password
                            </label>
                            <div className="relative mt-3">
                                <input
                                    name='password' id='password'
                                    className="w-full rounded-xl border border-gray-600 bg-gray-900 px-5 py-4 text-xl text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 text-xl transition"
                                >
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                        </div>

                        {errorMessage && (
                            <div className="p-4 bg-red-500/20 border border-red-400 text-lg font-semibold text-red-400 rounded-lg">
                                {errorMessage}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full flex items-center justify-center rounded-2xl cursor-pointer bg-purple-500 px-6 py-5 text-2xl font-bold text-white transition-all duration-300 hover:bg-purple-600 hover:shadow-xl"
                        >
                            Sign In <ArrowRight className="ml-3" size={24} />
                        </button>
                    </form>
                )
            }
        </div>
    );
}
