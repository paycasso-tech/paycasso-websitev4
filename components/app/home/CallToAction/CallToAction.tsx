"use client";

import CallToActionForm from "./CallToActionForm";

export default function CallToAction() {
  return (
    <div
      id="call-to-action"
      className="w-full flex justify-center items-center bg-black"
    >
      <div
        className="
          w-full max-w-2xl
          py-8 md:py-10
          px-8 md:px-0
          text-center md:text-left
        "
      >
        <h2 className="font-bold text-3xl md:text-4xl lg:text-[2.5rem] mb-6">
          Ready to join the revolution?
        </h2>

        <p className="max-w-[22rem] mx-auto md:mx-0 text-neutral-400">
          Almost there! We are perfecting your experience — launching soon!
        </p>

        <CallToActionForm />
      </div>
    </div>
  );
}
