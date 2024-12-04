import { Button } from "@mui/material";
import React from "react";
import { FaGithub } from "react-icons/fa";

const Navbar = () => {
    return (
        <nav className="flex justify-around items-center  bg-blue-950 text-white py-4">
            <div className="logo ml-10 text-2xl font-bold">
                <span>TaskManager</span>
            </div>
            <Button variant="text"
                className=" border border-gray-600 bg-blue-700 rounded-full px-3  "
            >
                <a href="https://github.com/priy-am" className=" flex gap-2 items-center">
                <FaGithub />
                    <span className="">GitHub</span>
                </a>
            </Button>
        </nav>
    );
};

export default Navbar;
