"use client";
import { link } from "@/app/style";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({
  href,
  text,
  className,
}: {
  href: string;
  text: string;
  className: string;
}) => {
  return (
    <Link href={href} className={className}>
      {text}
    </Link>
  );
};

export default function NavLinks() {
  const pathname = usePathname();

  const navLinks = [
    {
      href: "/",
      text: "Home",
    },
    {
      href: "/campaigns",
      text: "Campaigns",
    },
  ];

  return (
    <>
      {navLinks.map((navLink) => (
        <NavLink
          key={navLink.href}
          href={navLink.href}
          text={navLink.text}
          className={`${pathname === navLink.href ? link.active : link.normal}`}
        />
      ))}
    </>
  );
}
