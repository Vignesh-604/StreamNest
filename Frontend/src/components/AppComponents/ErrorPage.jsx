import { ArrowLeft, HomeIcon } from 'lucide-react'
import React from 'react'
import logo from "../assets/SNlogo.png"
import { useNavigate } from 'react-router-dom'

export default function ErrorPage() {

    const navigate = useNavigate()

  return (
    <div className="py-10">
      <div className="text-center flex flex-col items-center">
        <img src={logo} className='h-56' />

        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 text-base leading-7 text-gray-600">
          Sorry, we couldn&apos:t find the page you&apos;re looking for.
        </p>
        <div className="mt-4 flex items-center justify-center gap-x-3">
          <button
            type="button" onClick={() => navigate(-1)}
            className="inline-flex items-center rounded-md border border-black px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            <ArrowLeft size={16} className="mr-2" />
            Go back
          </button>
          <button
            type="button" onClick={() => navigate("/")}
            className="inline-flex rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            <HomeIcon size={16} className="mr-2" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  )
}
