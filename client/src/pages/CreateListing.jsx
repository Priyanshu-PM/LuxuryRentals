// import React from 'react'

export const CreateListing = () => {
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Create a Listing</h1>
      <form className="flex flex-col sm:flex-row">
        <div className="flex flex-col gap-4 flex-1">
          <input className="border p-3 rounded-lg" type="text" placeholder="name" id="name" maxLength='62' minLength='10' required/>
          <textarea className="border p-3 rounded-lg" type="text" placeholder="description" id="description" required/>
          <input className="border p-3 rounded-lg" type="text" placeholder="Address" id="address" required/>
          <div>
            <div>
              <input type="checkbox"  />
            </div>
          </div>
        </div>
      </form>
    </main>
  )
}
