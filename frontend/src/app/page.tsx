import Image from "next/image";
import Hero from "./components/Hero";

export default function Home() {
  return (
    <div className="">
        <Hero/>
        <div className="absolute bottom-0 left-0 mb-4 ml-4 text-sm text-gray-500">
          <span><b>Built</b> with ❤️ by Hitarth & Ali</span>
        </div>
        <div className="absolute bottom-0 right-0 mb-4 mr-4 text-sm text-gray-500">
          <span><b>Powered</b> by Bahamut
            <img
                  src="https://s1.coincarp.com/logo/2/fastex.png?style=200&v=1696814957"
                  alt="icon"
                  className="inline-block w-4 h-4 ml-1 mb-1"
              />
          </span>
        </div>
    </div>
  );
}
