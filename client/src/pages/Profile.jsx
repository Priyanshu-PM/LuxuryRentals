/* eslint-disable no-unused-vars */

import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase';
import { 
  updateUserStart, 
  updateUserSuccess, 
  updateUserFailure, 
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure
} from '../redux/user/userSlice';

import { Link } from 'react-router-dom';

export default function Profile() {

  const dispatch = useDispatch();

  const { currentUser, loading, error } = useSelector((state) => state.user); 
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePrec] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  const [formData, setFormData] = useState({});
  // console.log(formData);

  // console.log(file);

  useEffect(() => {
    if(file) {
      handleFileUpload(file);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const handleFileUpload = async (file) => {

    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePrec(Math.round(progress));
      },
      (error) => {
        // Handle any errors that occur during the upload.
        setFileUploadError(true);
      },
      () => {
        // Handle successful upload completion.
        // console.log('Upload complete');
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => 
            setFormData({...formData, avatar: downloadURL}));
      }
    );
  };

  const handleChange = (e) => {

      setFormData({
        ...formData, 
        [e.target.id]: e.target.value
      });
  };

  // console.log(currentUser);
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser.data.user._id}`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if(data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);

    } catch (error) {

      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {

    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser.data.user._id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if(data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));

    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {

      dispatch(signOutUserStart());

      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if(data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));


    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async (e) => {

      e.preventDefault();
      try {
        setShowListingsError(false);
        const res = await fetch(`/api/user/listings/${currentUser.data.user._id}`);
        const data = await res.json();
        if(data.success == false) {
          setShowListingsError(true);
          return;
        }

        setUserListings(data.data);
        console.log(userListings);

      } catch (error) {
        setShowListingsError(true);
      }
  };


  
  const handleDeleteListing = async (id) => {

    try {
      // e.preventDefault();
      // console.log("handle delete clicked");
      
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if(data.success == false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) => prev.filter((listing) => listing._id !== id));


    } catch (error) {
      console.log("error occured");
    }
  };
  
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-bold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <input 
      onChange={(e) => setFile(e.target.files[0])} 
      type='file' 
      accept='image/*' 
      ref={fileRef} hidden/>
      <img onClick={() =>  fileRef.current.click()}
      className='mt-2 rounded-full self-center h-28 w-28'
      src={formData.avatar || currentUser.data.user.avatar} 
      alt='profile'
      />
      <p className='text-sm self-center font-semibold'>
      {
        fileUploadError ?
        (<span className='text-red-700 text-center'>Error Image Upload (image must be less than 2 mb)</span>) :
        (
          filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700 text-center'>{`Uploading ${filePerc}`}</span>
          ) : (
            filePerc === 100 ? (
              <span className='text-green-600 text-center'>Image Uploaded successfully</span>

            ) : ""
          )
        )
      }
      </p>
      <input type='text' 
      defaultValue={currentUser.data.user.username}
      placeholder='username' 
      id='username'
      className='border p-3 rounded-lg'
      onChange={handleChange}
      />

      <input type='email' 
      defaultValue={currentUser.data.user.email}
      placeholder='email' 
      id='email'
      className='border p-3 rounded-lg'
      onChange={handleChange}
      />

      <input type='password' 
      placeholder='password' 
      id='password'
      className='border p-3 rounded-lg'
      onChange={handleChange}
      />

      <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 transition-all'>
      {
        loading ? "Loading..." : "Update"
      }
      </button>
      <Link
        className='bg-green-600 text-white rounded-lg p-3 text-center uppercase hover:opacity-95' 
        to={'/create-listing'}>
      Create Listing
      </Link>
      </form>
      <div className='font-semibold flex justify-between mt-5'>
      <span 
        onClick={handleDeleteUser}
        className='text-red-600 cursor-pointer'>Delete account</span>
      <span 
        onClick={handleSignOut}
        className='text-red-600 cursor-pointer'>Sign out</span>
      </div>
      <p className='mt-5 text-red-600 text-center'>{error ? error : ""}</p>
      <p className='mt-5 text-green-600 text-center'>{updateSuccess ? "User updated successfully" : ""}</p>
      <button onClick={handleShowListings} className='text-green-700 font-semibold w-full'>Show listings</button>
      {showListingsError && <p className='text-red-600 mt-5'>Error showing listings</p>}
      <div className='flex flex-col gap-4 mt-5'>
      {
        userListings && userListings.length > 0 && (

          <div className=''>
          <p className='text-center font-bold text-black'>My Listings</p>
          {
          
          userListings.map((listing, index) => ( 
            <div key={index} className="flex flex-row items-center justify-between border px-2 rounded-lg p-2 hover:shadow-md transition-all">
              <Link  to={`/listing/${listing._id}`}>
                
                <div className='flex flex-row justify-between space-between items-center gap-4'>
                  <img
                  src={listing.imageURLs[0]}
                  alt="listing image" 
                  className="w-40 h-20 object-cover rounded-lg" 
                  />
                  <p className='font-semibold hover:underline truncate'>{listing.name}</p>
                
                </div>
                
              </Link>
              <div className='flex flex-col gap-2 justify-between '>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='border border-green-600 text-green-600 p-1 px-3 rounded-lg w-full'>Edit</button>
                </Link>
                <button onClick={() => handleDeleteListing(listing._id)} className='border border-red-700 text-red-700 p-1 px-3 rounded-lg'>Delete</button>
              </div>
              
              </div>
            )
          )
        }

          </div>
        )
      }
      </div>

    </div>
  )
}
