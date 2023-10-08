/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';

export default function SignIn() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({});
  const {error, loading } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id] : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
      
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-center text-3xl font-bold my-7'>Sign in</h1>
      <form className=' flex flex-col gap-4'>
        <input 
        type='email' 
        placeholder='email' 
        className='p-3 rounded-lg border' 
        id='email' 
        onChange={handleChange}
        />
        <input 
        type='password' 
        placeholder='password' 
        className='p-3 rounded-lg border' 
        id='password' 
        onChange={handleChange}
        />
        <button 
        disabled={loading} 
        className='bg-slate-700 text-white disabled:opacity-70 disabled:cursor-not-allowed p-3 rounded-lg uppercase hover:opacity-95' 
        onClick={handleSubmit}
        >{
          loading ? "Loading...": "Sign in" }</button>
      </form>
      <div className='flex gap-2 mt-5 font-semibold'>
      <p>Not registered yet ?</p>
      <Link to={"/sign-in"} className='text-blue-600'><span>Register</span></Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}
