"use client";

import AnimatedLogo from "./AnimatedLogo";

export default function FeedbackPage() {
  return (
    <section className="relative min-h-screen bg-black text-white overflow-hidden justify-center">
      {/* TOP CONTENT */}
      <div className="relative z-10 px-24 pt-24">
        {/* Heading (left aligned) */}
        <h1 className="text-5xl font-semibold leading-tight mb-2 max-w-3xl">
          trustless payments
          <br />
          borderless work, <span className="text-gray-300">ready to join?</span>
        </h1>

        <p className="text-gray-400 mb-20 max-w-xl">
          Work with anyone, anywhere – backed by systems
          <br />
          you don’t have to trust
        </p>

        {/* FORM (centered horizontally) */}
        <div className="flex justify-center">
          <form className="w-full max-w-2xl space-y-8">
            <p className="text-sm text-gray-500 max-w-xl">
              Almost there! We are perfecting your
              <br />
              experience – launching soon!
            </p>
            <div className="flex gap-8">
              <input
                type="text"
                placeholder="Name"
                className="bg-transparent border-b border-gray-600 w-full py-2 outline-none placeholder-gray-500 focus:border-white transition"
              />
              <input
                type="email"
                placeholder="E-mail:"
                className="bg-transparent border-b border-gray-600 w-full py-2 outline-none placeholder-gray-500 focus:border-white transition"
              />
            </div>

            <div className="relative w-64">
              <select className="bg-transparent border-b border-gray-600 w-full py-2 outline-none text-gray-400 focus:border-white transition appearance-none">
                <option>Select Your Country</option>
                <option>India</option>
                <option>United States</option>
                <option>United Kingdom</option>
              </select>

              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                ▼
              </span>
            </div>

            <button
              type="submit"
              className="bg-gray-200 text-black px-8 py-2 rounded-md flex items-center gap-2 hover:bg-white transition"
            >
              Send →
            </button>
          </form>
        </div>
      </div>

      {/* BOTTOM LOGO ZONE */}
      <div className="bottom-0 left-0 w-full h-[45vh] flex justify-center items-end">
        <AnimatedLogo />
      </div>
    </section>
  );
}
