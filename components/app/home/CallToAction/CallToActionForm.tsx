"use client";

import { Button } from "@/components/ui/button";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import CallToActionFields from "./CallToActionFields";

export default function CallToActionForm() {
  return (
    <form className="my-8 space-y-6">
      <CallToActionFields />

      <Button
        size="sm"
        type="submit"
        className="
          px-10
          w-full md:max-w-32
          flex justify-center items-center gap-2
        "
      >
        <span>Send</span>
        <IconArrowNarrowRight />
      </Button>
    </form>
  );
}
