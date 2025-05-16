import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
          <b>Fast</b>Credit
          <img
          src="https://s1.coincarp.com/logo/2/fastex.png?style=200&v=1696814957"
          alt="icon"
          className="inline-block w-8 h-8 align-super ml-1 mb-3"
        />
          <br />
          <span className="text-[#ff008c]">Decentralized credit ratings</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-400 mb-10">
        FastCredit is a blazing-fast, decentralized platform redefining credit ratings for the DeFi era—transparent, trustless, and borderless.
        </p>
        <Button className="relative group px-8 py-6 text-lg hover:opacity-90">
          <span className="relative z-10">Get started</span>
          <div className="absolute inset-0 bg-white/20 blur-lg group-hover:blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
        </Button>
      </div>
    </div>
  )
}
