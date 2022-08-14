import React from 'react'
import { Link } from "react-router-dom";

export default function LoginToReview () {
    return (
        <div className="pt-8">
            <div className="max-w-lg mx-auto text-center mb-16">
                <p className="mb-8 font-heading font-semibold text-3xl sm:text-5xl text-white">Login to leave a review!</p>
                <Link to="/home" className="px-8 py-3 font-semibold rounded dark:bg-violet-400 dark:text-gray-900">Login</Link>
            </div>
            <p className='border-b border-gray-100'></p>
        </div>
    )
}