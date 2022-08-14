import React, {useContext} from 'react'
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import logo from '../assets/FindAMovie.svg'

// WHEN ADDING FOOTER ADD THIS TO THE BODY OF THE STUFF BEFORE THE FOOTER
// flex flex-col min-h-screen

export default function Footer () {

    const userId = useContext(UserContext)

    return (
        <footer className="p-4 bg-white shadow md:px-6 md:py-8 bg-zinc-900 mt-auto text-white">
            <div className="sm:flex sm:items-center sm:justify-between">
                <a href="/home" className="flex items-center mb-4 sm:mb-0">
                    <img src={logo} alt="logo" />
                    {/* <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">FindAMovie</span> */}
                </a>
                <ul className="flex flex-wrap items-center mb-6 text-sm sm:mb-0 gap-10">
                    <li>
                        <Link to="/">Movies</Link>   
                    </li>
                    <li>
                        <Link to={`/${userId}`}>Profile</Link>   
                    </li>
                </ul>
            </div>
            <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
            <span className="block text-sm sm:text-center">© 2022 FindAMovie. All Rights Reserved.
            </span>
        </footer>
    )
}