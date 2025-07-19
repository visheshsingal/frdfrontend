import React from 'react'

const NewsletterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault()
  }

  return (
    <div className="text-center bg-[#f9f9f9] py-10 px-4 rounded-lg shadow-md">
      <p className="text-2xl font-semibold text-[#052659]">Subscribe now & get 20% off</p>
      <p className="text-gray-500 mt-3 max-w-md mx-auto text-sm">
        Join our newsletter for exclusive offers on premium gym supplements and stay updated on new launches.
      </p>
      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-1/2 flex items-center gap-2 mx-auto my-6 border border-gray-300 rounded overflow-hidden"
      >
        <input
          className="w-full px-3 py-2 outline-none text-gray-700 text-sm"
          type="email"
          placeholder="Enter your email"
          required
        />
        <button
          type="submit"
          className="bg-[#052659] text-white text-xs px-6 py-2 hover:bg-[#031e47] transition"
        >
          SUBSCRIBE
        </button>
      </form>
    </div>
  )
}

export default NewsletterBox
