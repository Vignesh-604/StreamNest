import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import logo from "../assets/SNlogo.png";
import axios from 'axios';
import Cookies from "js-cookie"
import { NavLink, useNavigate } from 'react-router-dom';

export default function SignIn() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate()

    // If user logged in then redirect to home page
    useEffect(() => {
        const user = Cookies.get("user") ? true : false

        if (user) navigate("/")
    }, [])

    // Login
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate that at least one of username or email is filled
        if (!username && !email) {
            return setErrorMessage("Please fill in either the username or email.")
        }
        setErrorMessage("");

        const formData = { username, email, password }
        console.log(formData);

        // Form submission logic here
        axios.post("/api/users/login", formData)
            .then((res) => {
                let userDetails = res.data.data.user
                Cookies.set("user", JSON.stringify(userDetails))

                navigate("/")   // Redirect to home page
            })
            .catch(error => console.log(error))
    };

    return (
        <section>
            <div className="flex mt-5 items-center justify-center">
                <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
                    <div className="mb-2 flex justify-center">
                        <img src={logo} className=' h-56' alt="Logo" />
                    </div>
                    <h2 className="text-center text-2xl font-bold leading-tight text-white">
                        Sign in to your account
                    </h2>
                    <p className="mt-3 text-center text-sm text-gray-400">
                        Don't have an account?{' '}
                        <NavLink
                            to={"/register"}
                            title=""
                            className="font-semibold text-gray- transition-all duration-200 hover:underline"
                        >
                            Create a free account
                        </NavLink>
                    </p>
                    <form onSubmit={handleSubmit} onChange={() => setErrorMessage("")} className="">
                        <div className="mt-2 space-y-4">
                            <div>
                                <label htmlFor="username" className="text-base font-medium text-gray-300">
                                    {' '}
                                    Username{' '}
                                </label>
                                <div className="">
                                    <input
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                        type="text" name='username' id='username'
                                        placeholder="Username"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email" className="text-base font-medium text-gray-300">
                                    {' '}
                                    Email address{' '}
                                </label>
                                <div className="">
                                    <input
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                        type="email"
                                        placeholder="Email"
                                        autoComplete='email'
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="text-base font-medium text-gray-300">
                                        {' '}
                                        Password{' '}
                                    </label>
                                </div>
                                <div className="">
                                    <input
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                        type="password" required
                                        placeholder="Password"
                                        autoComplete='current-password'
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            {errorMessage && (
                                <div className="flex text-red-500 text-lg justify-center">
                                    {errorMessage}
                                </div>
                            )}
                            <div>
                                <button
                                    type="submit"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            submitSearch();
                                        }
                                    }}
                                    className="inline-flex mt-2 w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                                >
                                    Get started <ArrowRight className="ml-2" size={16} />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
