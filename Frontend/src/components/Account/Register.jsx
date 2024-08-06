import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import logo from "../assets/SNlogo.png";
import axios from 'axios';
import Cookies from "js-cookie"
import { NavLink, useNavigate } from 'react-router-dom';

export default function Register() {

    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState("")
    const [avatarFile, setAvatarFile] = useState("")
    const [coverImageFile, setCoverImageFile] = useState("")

    const navigate = useNavigate()

    useEffect(() => {
        const user = Cookies.get("user") ? true : false

        if (user) navigate("/")
    }, [])

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const data = new FormData()
        
        for (let x in formData) data.append(x, formData[x])
        data.append("avatar", avatarFile)
        data.append("coverImage", coverImageFile)

        axios.post("/api/users/register", data)
        .then(res => {
            let userDetails = res.data.data
            Cookies.set("user", JSON.stringify(userDetails))

            navigate("/")   // Redirect to home page
        })
        .catch(e => setErrorMessage(e.response.data.data))
        
        
    }
    return (
        <section>
            <div className="flex mt-5 items-center justify-center">
                <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
                    <div className="mb-2 flex justify-center">
                        <img src={logo} className=' h-56' alt="Logo" />
                    </div>
                    <h2 className="text-center text-2xl font-bold leading-tight text-white">
                        Sign up to StreamNest
                    </h2>
                    <p className="mt-3 mb-6 text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <NavLink
                            to={"/signin"}
                            title=""
                            className="font-semibold text-gray- transition-all duration-200 hover:underline"
                        >
                            Sign in
                        </NavLink>
                    </p>
                    <form onSubmit={handleSubmit} onChange={() => setErrorMessage("")} className="flex flex-col items-center">
                        <div className=" flex flex-col mt-2 w-fit space-y-4">

                            {/* Row 1 */}
                            <div className='flex w-fit flex-row max-sm:space-x-5 sm:space-x-20'>

                                <div id='FULLNAME'>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="fullname" className="text-base font-medium text-gray-300">
                                            {' '}
                                            Fullname{' '}
                                        </label>
                                    </div>
                                    <div className="">
                                        <input
                                            className="flex h-10 w-60 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                            type="text" required
                                            placeholder="Fullname"
                                            name='fullname'
                                            value={formData.fullname}
                                            onChange={handleInput}
                                        />
                                    </div>
                                </div>

                                <div id='USERNAME'>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="username" className="text-base font-medium text-gray-300">
                                            {' '}
                                            Username{' '}
                                        </label>
                                    </div>
                                    <div className="">
                                        <input
                                            className="flex h-10 w-60 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                            type="text" required
                                            placeholder="Username"
                                            name='username'
                                            value={formData.username}
                                            onChange={handleInput}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Row 2 */}
                            <div className='flex w-fit flex-row max-sm:space-x-5 sm:space-x-20'>

                                <div id='EMAIL'>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="email" className="text-base font-medium text-gray-300">
                                            {' '}
                                            Email{' '}
                                        </label>
                                    </div>
                                    <div className="">
                                        <input
                                            className="flex h-10 w-60 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                            type="email" required
                                            placeholder="Email"
                                            name='email'
                                            value={formData.email}
                                            onChange={handleInput}
                                        />
                                    </div>
                                </div>

                                <div id='password'>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="password" className="text-base font-medium text-gray-300">
                                            {' '}
                                            Password{' '}
                                        </label>
                                    </div>
                                    <div className="">
                                        <input
                                            className="flex h-10 w-60 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                            type="password" required
                                            placeholder="Password"
                                            name='password'
                                            value={formData.password}
                                            onChange={handleInput}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Row 3 */}
                            <div className='flex w-fit flex-row max-sm:space-x-5 sm:space-x-20'>

                                <div id='FULLNAME'>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="avatar" className="text-base font-medium text-gray-300">
                                            {' '}
                                            Avatar{' '}
                                        </label>
                                    </div>
                                    <div className="">
                                        <input
                                            className=" p-2 mt-1 bg-gray-800 text-white borderflex w-60 rounded-md border focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                            type="file" required
                                            onChange={e => setAvatarFile(e.target.files[0])}
                                        />
                                    </div>
                                </div>

                                <div id='USERNAME'>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="Cover Image" className="text-base font-medium text-gray-300">
                                            {' '}
                                            Cover Image{' '}
                                        </label>
                                    </div>
                                    <div className="">
                                        <input
                                            className=" p-2 mt-1 bg-gray-800 text-white borderflex w-60 rounded-md border focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                            type="file"
                                            onChange={e => setCoverImageFile(e.target.files[0])}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {errorMessage && (
                            <div className="flex text-red-500 text-lg justify-center my-2">
                                {errorMessage}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="inline-flex mt-6 w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                            >
                                Get started <ArrowRight className="ml-2" size={16} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}
