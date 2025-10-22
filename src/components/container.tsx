import React, { PropsWithChildren } from "react";

/** Simple max-width container with consistent side padding */
export default function Container({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return <div className={`container-safe ${className}`}>{children}</div>;
}
