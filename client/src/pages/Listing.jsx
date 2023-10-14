// import React from 'react'
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// swiper imports ---------------------------------------

import { Swiper, SwiperSlide } from 'swiper/react';

import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

// ------------------------------------------------------

import { FaMapMarkerAlt, FaBed, FaBath, FaParking, FaChair } from 'react-icons/fa';
import { useSelector } from "react-redux";
import Contact from "../components/Contact";

export default function Listing() {

    // const navigate = useNavigate();

    
    const { currentUser } = useSelector(state => state.user);

    SwiperCore.use([Navigation]);
    const params = useParams();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [contact, setContact] = useState(false);
    const [listing, setListing] = useState({

        imageURLs: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountedPrice: 50,
        offer: false,
        parking: false,
        furnished: false,
    
      });


    useEffect(() => {

        const fetchListing = async () => {
        try {
            setLoading(true);
                const listingId = params.listingId;
                // console.log(listingId);
        
                const res = await fetch(`/api/listing/get/${listingId}`);
                const data = await res.json();
                if(data.success === false) {
                    setError(true);
                    console.log(data.message);
                    setLoading(false);
                    return;
                }
                setListing(data.data);
                setLoading(false);
                setError(false);
                
            } catch (error) {
                
                setLoading(false);
                setError(true);
            }
        };
        
        fetchListing();
        console.log(listing);
    
      }, loading);


  return (
    <main>
    {loading && (<p className="text-center my-7 text-2xl">Loading...</p>)}
    {error && (<p className="text-center my-7 text-2xl">Something went wrong</p>)}
    {listing && !loading && !error && (
        <div className="">
            <Swiper navigation={true}>
            {
                listing.imageURLs.map((url) => (
                    console.log(url),
                    <SwiperSlide key={url}>
                        <div className="h-[500px]" style={{background: `url(${url}) center no-repeat`, backgroundSize: "cover"}}>
                        </div>

                    </SwiperSlide>
                ))
            }
            </Swiper>
            <div className=" max-w-[900px] mx-auto">
            <div className="px-4 my-4 w-full h-full flex  flex-col gap-4"> 
                <div className="flex">
                    <p className="font-bold text-2xl">{listing.name}{ " - "} </p>{" "}
                    <p className="font-bold text-2xl">{" "} $ {listing.offer ? (listing.discountedPrice ) : (listing.regularPrice)} {" "}</p>
                    <p className="font-bold text-2xl">{listing.type === 'rent' && ' / month'}</p>
                </div>
                <div className="flex gap-2">
                <FaMapMarkerAlt className="h-6 w-6 text-green-600"/>
                <p className="font-semibold">{listing.address}</p>
                </div>

                <div className="flex gap-4">
                    <p className="bg-red-800 w-full max-w-[200px] text-white text-center p-2 rounded-md">
                    {listing.type === 'rent' ? 'For Rent' : 'For Sale'}</p>
                    {listing.offer && (

                        <p className="bg-green-700 w-full max-w-[200px] text-white text-center p-2 rounded-md">${+listing.regularPrice - listing.discountedPrice}{" Discount"}</p>
                    )
                    }
                </div>
            </div>
            <p className="px-4 text-slate-700 my-7">
            <span className="font-bold text-black">Description - </span>
            {listing.description}
            </p>
            <ul className="flex px-4 justify-between max-w-[700px]">
            <li className="flex items-center gap-2 text-green-700 font-bold"><FaBed/>{" "}{listing.bedrooms >  1 ? `${listing.bedrooms} Bedrooms` : `${listing.bedrooms} Bed`}</li>
            <li className="flex items-center gap-2 text-green-700 font-bold"><FaBath/>{" "}{listing.bathrooms >  1 ? `${listing.bathrooms} Bathrooms` : `${listing.bathrooms} Bath`}</li>
            <li className="flex items-center gap-2 text-green-700 font-bold"><FaParking/>{" "}{listing.parking ? (<p>Parking</p>) : <p>No parking</p>}</li>
            <li className="flex items-center gap-2 text-green-700 font-bold"><FaChair/>{listing.furnished ? (<p>Furnished</p>) : (<p>Not furnished</p>)}</li>
            </ul>
            
            <div className=" px-4 my-7">
            {
                currentUser && listing.userRef !== currentUser.data.user._id && !contact && (

                    <button onClick={() => setContact(true)}  className="text-semibold w-full p-3 rounded-lg  uppercase bg-slate-700 text-white hover:opacity-95 transition-all">Contact landlord
                    </button>
                )
            }
            {contact && <Contact listing={listing}/>}
            </div>


        
            </div>
        </div>
    )} 
    </main>
  )
}
