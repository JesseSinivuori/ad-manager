import NavLinks from "./navLinks";

export default function Navbar() {
  return (
    <div className="justify-center flex">
      <div className="max-w-[1000px] w-full bg-stone-50 p-4 border-b border-x border-stone-400/50 rounded-md">
        <div className="flex gap-x-4">
          <NavLinks />
        </div>
      </div>
    </div>
  );
}
