import Link from "next/link";
import { button } from "./style";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center ">
      <div className="flex flex-col  items-center justify-center sm:pt-16 pt-8">
        <div className="relative w-full z-[-1] m-8 sm:m-0">
          <Image
            src={"/twitter.svg"}
            alt={"twitter logo"}
            width={80}
            height={80}
            className="absolute sm:-left-20 -left-0 -rotate-12 md:w-[80px] md:h-[80px] w-[40px] h-[40px]"
          />
          <Image
            src={"/tiktok.svg"}
            alt={"tiktok logo"}
            width={80}
            height={80}
            className="absolute sm:-right-20 right-0 rotate-12 md:w-[80px] md:h-[80px] w-[40px] h-[40px]"
          />
        </div>
        <h1
          className={`relative pt-8 md:text-[120px] lg:text-[160px] sm:text-[80px] text-[50px] font-extrabold text-center`}
        >
          <span
            className="text-white text-transparent clip-text  rounded-xl px-4 mx-4
            bg-gradient-to-r from-rose-500 to-yellow-500
          "
          >
            The
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-rose-500">
            Ad
          </span>{" "}
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-violet-500">
            Manager
          </span>
        </h1>
        <div className="relative w-full z-[-1] m-8 sm:m-0">
          <Image
            src={"/facebook.svg"}
            alt={"facebook logo"}
            width={80}
            height={80}
            className="absolute sm:-left-20 left-0 -rotate-12 md:w-[80px] md:h-[80px] w-[40px] h-[40px]"
          />

          <Image
            src={"/instagram.svg"}
            alt={"instagram logo"}
            width={80}
            height={80}
            className="absolute sm:-right-20 right-0 rotate-12 md:w-[80px] md:h-[80px] w-[40px] h-[40px]"
          />
        </div>

        <Link href={"/campaigns"} className={`${button.violet} m-8`}>
          Open App
        </Link>
      </div>
    </main>
  );
}
