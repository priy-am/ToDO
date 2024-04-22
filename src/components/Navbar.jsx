import React from 'react'
import { FaGithub } from "react-icons/fa";

const Navbar = () => {
    return (
        <nav className='flex justify-around bg-blue-950 text-white py-1'>
            <div className="logo ml-10">
                <img className='h-14' src="/todo.png" alt="i-task" />
            </div>
            {/* <ul className='flex items-center gap-9 mr-10'>
                <li className='cursor-pointer text-xl hover:underline hover:font-bold transition-all'>Home</li>
                <li className='cursor-pointer text-xl hover:underline hover:font-bold transition-all'>Your task</li>
            </ul> */}
            <button className="flex items-center justify-between gap-2 bg-blue-700 rounded-full px-3  shadow-lg hover:shadow-blue-500 ring-1 ring-white">
                <FaGithub />
                <span className="">GitHub</span>
            </button>
        </nav>
    )
}

export default Navbar
