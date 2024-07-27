'use client'

import { useState } from 'react'
import { Popover, PopoverButton, PopoverPanel, Dialog, DialogPanel } from '@headlessui/react'
import { MagnifyingGlassIcon, IdentificationIcon, ListBulletIcon, HandThumbUpIcon, ClockIcon, ArrowLeftOnRectangleIcon, Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import logo from "../assets/logo.webp"
import profile from "../assets/profile.webp"

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="bg-gray-800 shadow p-2">
            <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
                <div className="flex items-center space-x-6 lg:flex-1">
                    <a href="#" className="-m-1.5 p-1.5">
                        <span className="sr-only">Your Company</span>
                        <img src={logo} alt="Logo" className="h-16 w-auto" />
                    </a>
                    <div className="flex flex-grow items-center justify-center">
                        <div className="flex items-center rounded-full bg-gray-900 p-2 w-full max-w-md mx-6">
                            <input
                                type="text"
                                className="flex-grow bg-transparent px-4 py-2 text-white outline-none placeholder-gray-500"
                                placeholder="Search"
                            />
                            <button className="flex items-center justify-center h-10 w-10 bg-gray-800 rounded-full">
                                <MagnifyingGlassIcon className="h-5 w-5 text-white" />
                            </button>
                        </div>
                    </div>
                    <div className="hidden lg:flex items-center space-x-6">
                        <a href="#" className="text-white hover:text-red-500 mx-2 font-semibold text-xl">Subscriptions</a>
                        <a href="#" className="text-white hover:text-red-500 mx-2 font-semibold text-xl">My Channel</a>
                        <Popover className="relative">
                            <PopoverButton className="block mx-2 text-sm/6 font-semibold text-white/50 focus:outline-none data-[active]:text-white data-[hover]:text-white data-[focus]:outline-1 data-[focus]:outline-white">
                                <img src={profile} alt="Profile" className="h-12 w-auto rounded-full border-emerald-500 border-4" />
                            </PopoverButton>
                            <PopoverPanel
                                transition
                                className="absolute right-0 z-10 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                            >
                                <div className="p-3 font-semibold text-white">
                                    <a className="block rounded-lg py-2 px-3 transition hover:bg-white/5" href="#">
                                        <div className="flex items-center gap-2">
                                            <IdentificationIcon className="h-5 w-5 text-white/30" />
                                            View Profile
                                        </div>
                                    </a>
                                    <a className="block rounded-lg py-2 px-3 transition hover:bg-white/5" href="#">
                                        <div className="flex items-center gap-2">
                                            <ListBulletIcon className="h-5 w-5 text-white/30" />
                                            Playlists
                                        </div>
                                    </a>
                                    <a className="block rounded-lg py-2 px-3 transition hover:bg-white/5" href="#">
                                        <div className="flex items-center gap-2">
                                            <HandThumbUpIcon className="h-5 w-5 text-white/30" />
                                            Liked Videos
                                        </div>
                                    </a>
                                    <a className="block rounded-lg py-2 px-3 transition hover:bg-white/5" href="#">
                                        <div className="flex items-center gap-2">
                                            <ClockIcon className="h-5 w-5 text-white/30" />
                                            Watch History
                                        </div>
                                    </a>
                                </div>
                                <div className="p-3">
                                    <a href="#" className="flex items-center gap-2 transition hover:bg-white/5 py-2 px-3 rounded-lg">
                                        <ArrowLeftOnRectangleIcon className="h-5 w-5 text-white/30" />
                                        Log out
                                    </a>
                                </div>
                            </PopoverPanel>
                        </Popover>
                    </div>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400 hover:text-white"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
            </nav>
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-10 bg-gray-800 bg-opacity-75" />
                <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-gray-800 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <img
                                src={logo}
                                alt="Logo"
                                className="h-16 w-auto"
                            />
                        </a>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-gray-400 hover:text-white"
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="py-6">
                                <a
                                    href="#"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-700"
                                >
                                    Subscriptions
                                </a>
                                <a
                                    href="#"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-700"
                                >
                                    My Channel
                                </a>
                                <a
                                    href="#"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-700"
                                >
                                    View Profile
                                </a>
                                <a
                                    href="#"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-700"
                                >
                                    Playlists
                                </a>
                                <a
                                    href="#"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-700"
                                >
                                    Liked Videos
                                </a>
                                <a
                                    href="#"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-700"
                                >
                                    Watch History
                                </a>
                                <div className="flex items-center rounded-full bg-gray-900 p-2 mt-5">
                                    <input
                                        type="text"
                                        className="flex-grow w-full bg-transparent px-4 py-2 text-white outline-none placeholder-gray-500"
                                        placeholder="Search"
                                    />
                                    <button className="flex items-center justify-center h-10 w-10 bg-gray-800 rounded-full">
                                        <MagnifyingGlassIcon className="h-5 w-5 text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    )
}
