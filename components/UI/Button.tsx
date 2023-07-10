"use client";

import React from "react";

export const Button = React.forwardRef(function Button(
  {
    onClick,
    className,
    type,
    children,
  }: {
    onClick: () => void;
    className: string;
    type?: "button" | "submit" | "reset" | undefined;
    children?: React.ReactNode;
  },
  ref: React.Ref<HTMLButtonElement> | undefined
) {
  return (
    <button
      type={type ?? "button"}
      onClick={onClick}
      className={className}
      ref={ref}
    >
      {children}
    </button>
  );
});
