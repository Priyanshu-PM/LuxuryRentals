// import React from 'react'

import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { app } from "../firebase";

export const CreateListing = () => {

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({

    imageUrls: [],

  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  console.log(formData);

  const handleImageSubmit = (e) => {

    e.preventDefault();

    setUploading(true);
    setImageUploadError(false);

    if(files.length > 0 && files.length  + formData.imageUrls.length < 7) {

      const promises = [];
      for(let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises).then((urls) => {
        // keeping the previous image urls as well
        setFormData({
          ...formData, 
          imageUrls: formData.imageUrls.concat(urls),
        });
        setImageUploadError(false);
        setUploading(false);

      }).catch((error) => {
        setImageUploadError("Image upload Failed : Max image size 2 mb");
        setUploading(false);
      });
    }
    else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {

    return new Promise((resolve, reject) => {

    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    uploadTask.on('state_changed', 
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(progress);
    },
      (error) => {
        reject(error);
      },
      ()=> {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)  => {
            resolve(downloadUrl);
        })
      }
    );
  });
};

  const handleRemoveImage = (index) => {

    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index)
    });
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Create a Listing</h1>
      <form className="flex flex-col sm:flex-row gap-4">

        <div className="flex flex-col gap-4 flex-1">
          <input className="border p-3 rounded-lg" type="text" placeholder="name" id="name" maxLength='62' minLength='10' required/>
          <textarea className="border p-3 rounded-lg" type="text" placeholder="description" id="description" required/>
          <input className="border p-3 rounded-lg" type="text" placeholder="Address" id="address" required/>
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input type="number" id="bedrooms" min="1" max="10" required  className="p-3 border border-gray-300 rounded-lg"/>
              <p>Bedrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input type="number" id="bathrooms" min="1" max="10" required  className="p-3 border border-gray-300 rounded-lg"/>
              <p>Bathrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input type="number" id="regularPrice" min="1" max="10" required  className="p-3 border border-gray-300 rounded-lg"/>
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="number" id="discountedPrice" min="1" max="10" required  className="p-3 border border-gray-300 rounded-lg"/>
              <div className="flex flex-col items-center">
                <p>Discounted Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">Images :
            <span className="font-nor,mal text-gray-600 ml-2">The first image will be the cover (max 6)</span>
          </p>

          <div className="flex gap-4">
            <input onChange={(e) => setFiles(e.target.files)} className="p-3 border border-gray-300 rounded w-full" type="file" id="images" accept="image/*" multiple />   
            <button disabled={uploading} type="button" onClick={handleImageSubmit} className="p-3 text-green-600 border border-green-600 rounded uppercase hover:shadow-lg disabled:opacity-80">{uploading ? "Uploading..." : "Upload"}</button>       
          </div>
          <p className="text-red-600 text-sm">{imageUploadError && imageUploadError}</p>
          {
            formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
              <div key={index} className="flex flex-row items-center justify-between border px-2 rounded-lg">
                <img
                src={url}
                alt="listing image" 
                className="w-40 h-20 object-cover rounded-lg" 
                />
                <button type="button" onClick={() =>handleRemoveImage(index)} className="border border-red-600 text-red-600 rounded-lg p-2 h-fit hover:text-white hover:bg-red-500 transition-all ">Delete</button>
              </div>
              ))
          }
          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          Create Listing
          </button>
        </div>
      </form>
    </main>
  )
};