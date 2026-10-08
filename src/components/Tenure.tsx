"use client";

import { useSyncExternalStore } from "react";

// How long something that is still going has been running. The server renders
// just "Ongoing", so the page reads correctly with JS off; once the browser
// has hydrated it adds the month count, worked out from today's date.

const subscribe = () => () => {};

export default function Tenure({ sinceYear, sinceMonth }: { sinceYear: number; sinceMonth: number }) {
  // sinceMonth is 1-based (Aug = 8)
  const months = useSyncExternalStore(
    subscribe,
    () => {
      const now = new Date();
      return (now.getFullYear() - sinceYear) * 12 + (now.getMonth() + 1 - sinceMonth);
    },
    () => null,
  );

  if (months === null) return <>Ongoing</>;
  if (months < 1) return <>Ongoing · started this month</>;
  return (
    <>
      Ongoing · {months} {months === 1 ? "month" : "months"}
    </>
  );
}
