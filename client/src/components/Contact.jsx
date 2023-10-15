import React, {useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

export default function Contact({listing}) {

    // console.log(listing.userRef);
    const [landLord, setLandLord] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {

        const fetchOwner = async () => {

            try {
                
                // console.log(listing.userRef);
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                // console.log(data);
                setLandLord(data);
                // console.log(landLord);

            } catch (error) {
                console.log("error while fetching")
            }
        };

        fetchOwner();

    }, [listing.userRef]);

    const handleChange = (e) => {

        setMessage(e.target.value);
        // console.log(message);
    };

  return (
    <div>
        {
            landLord && (
                <div className='flex flex-col gap-4'>
                <p>Contact <span>{landLord.username}</span> for <span>{listing.name.toLowerCase()}</span></p>
                <textarea placeholder='Enter your message here...' onChange={(e) => handleChange(e)} name='message' id='message' value={message} className=' rounded-lg border p-2' rows={"2"}>
                </textarea>
                <Link to={`mailto:${landLord.email}?subject=Regarding ${listing.name}&body=${message} `} className='bg-slate-700 text-white p-3 text-center uppercase rounded-lg hover:opacity-95'>
                Send Message
                </Link>
                </div>
                )
        }
    </div>
  )
}
