import React from 'react'
import { Link } from 'react-router-dom';
import  {FaSearch} from 'react-icons/fa';
import { useSelector } from 'react-redux';

export default function Header() {

    const { currentUser } = useSelector((state) => state.user);
  return (
    <header>
        <div className='bg-slate-200 flex p-3 justify-between items-center mx-auto'>
            <Link to={"/"}>
                <h1 className='text-xl font-bold sm:text-2xl flex flex-wrap'>
                    <span className='text-slate-500'>Luxury</span>
                    <span className='text-slate-700'>Rentals</span>
                </h1>
            </Link>
            <form className='bg-slate-100 p-3 rounded-lg flex items-center'>
                <input type='text' placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64'/>
                <FaSearch className='text-slate-600'/>
            </form>
            <ul className='flex gap-4 font-semibold text-slate-700 items-center'>
                <li className='hidden sm:inline hover:underline'>Home</li>
                <Link to={"/about"}>
                    <li className='hidden sm:inline hover:underline'>About</li>
                </Link>
                <Link to={"/profile"} className='flex items-center justify-center'>
                {currentUser ? (
                    <img 
                        className='h-10 w-10 rounded-full'
                        src={currentUser.data.user.avatar} 
                        alt='profile'
                    />
                ): (
                    <li className= 'hover:underline'>
                    Sign In
                    </li>

                )}
                </Link>
            </ul>
        </div>
    </header>
  )
}
