"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES } from "./countries";

export default function CallToActionFields() {
  return (
    <>
      <div className="w-full flex flex-col md:flex-row gap-6 md:gap-4">
        <input
          className="border-b w-full pb-2 text-sm placeholder:text-neutral-500/70 bg-black focus-visible:outline-0 text-neutral-400"
          type="text"
          placeholder="Name"
        />

        <input
          className="border-b w-full pb-2 text-sm placeholder:text-neutral-500/70 bg-black focus-visible:outline-0 text-neutral-400"
          type="email"
          placeholder="Email"
        />
      </div>

      <Select>
        <SelectTrigger className="w-full md:w-1/2 px-0 border-b border-0 rounded-none bg-transparent text-neutral-500/70 focus:ring-0">
          <SelectValue placeholder="Select Your Country" />
        </SelectTrigger>

        <SelectContent className="rounded-none bg-neutral-950 border border-neutral-800">
          {COUNTRIES.map((country) => (
            <SelectItem
              key={country}
              value={country}
              className="text-white focus:bg-neutral-800"
            >
              {country}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
