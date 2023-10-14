import React, {useState, useEffect } from 'react'

export default function Contact({listing}) {

    const [landLord, setLandLord] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {

        const fetchOwner = async () => {

            try {
                
                console.log(listing.userRef);
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                // console.log(data);
                setLandLord(data.data);
                console.log(landLord);

            } catch (error) {
                console.log("error while fetching")
            }
        };

        fetchOwner();

    }, [listing.userRef]);

    const handleChange = (e) => {

        setMessage(e.target.value);
        console.log(message);
    };

  return (
    <div>
        {
            landLord && (
                <div className='flex flex-col gap-4'>
                <p>Contact <span>{landLord.username}</span> for <span>{listing.name.toLowerCase()}</span></p>
                <textarea onChange={(e) => handleChange(e)} name='message' id='message' value={message} className='bg-transparent rounded-lg' rows={"2"}>
                </textarea>
                </div>
                )
        }
    </div>
  )
}
