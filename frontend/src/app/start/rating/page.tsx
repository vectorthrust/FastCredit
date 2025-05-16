'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IoDiamondOutline } from "react-icons/io5";

export default function RatingCard() {
  // You can change this color to any color you want
  const medalColor = "cyan" // Options: emerald, amber, rose, sky, violet, etc.
  const ratingLetter = "A" // Change this to any letter you want

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <h1 className="text-5xl font-bold tracking-tight mb-6 text-center">
          <b>Fast</b>Credit
          <img
            src="https://s1.coincarp.com/logo/2/fastex.png?style=200&v=1696814957"
            alt="icon"
            className="inline-block w-6 h-6 align-super ml-1 mb-1"
          />
        </h1>

        <Card className="w-96 overflow-hidden gap-2 relative pb-0">
          <CardHeader className="z-10">
            <CardTitle className="text-2xl">Your credit rating</CardTitle>
            <CardDescription>
              Our model trained on real-financial data and your documents + collateral derived this as a fair rating.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 pt-0 overflow-hidden relative">
            <div className="flex flex-col items-center justify-center">
              {/* Simple inner card */}
              <Card className="w-full border border-gray-200 p-4 pb-3">
                {/* Badge Container with continuous spin animation */}
                <div className="relative w-56 h-56 mx-auto flex items-center justify-center perspective-badge">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* This div creates a 3D container for the spinning badge */}
                    <div className="badge-3d-container relative w-full h-full flex items-center justify-center">
                      {/* Outer Ring */}
                      <div className="absolute w-full h-full rounded-full border-4 border-cyan-200 bg-cyan-50 opacity-50"></div>

                      {/* Inner Medal - Centered Circle */}
                      <div className="absolute w-3/5 h-3/5 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-lg flex items-center justify-center">
                        {/* Rating Letter */}
                        <span className="text-7xl font-bold text-white">
                            <IoDiamondOutline/>
                        </span>
                      </div>

                      {/* Shine Effect */}
                      <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-white opacity-10 rounded-full blur-md"></div>
                    </div>
                  </div>
                </div>

                {/* Rating Text */}
                <div className=" text-center">
                  <h3 className="text-2xl font-bold text-cyan-600">Diamond</h3>
                  <p className="text-gray-500 mt-1">Your credit score is in the top 10%</p>
                </div>
                
                {/* Simple footer */}
                <div className="pt-3 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
                  <h1 className="text-medium text-black font-bold tracking-tight text-center">
                    <b>Fast</b>Credit
                    <img
                        src="https://s1.coincarp.com/logo/2/fastex.png?style=200&v=1696814957"
                        alt="icon"
                        className="inline-block w-2 h-2 align-super"
                    />
                    </h1>
                  <span>0xDEad...F00d</span>
                </div>
              </Card>
            </div>
          </CardContent>

          {/* Add the CSS for the animation */}
          <style jsx>{`
            .perspective-badge {
              perspective: 1000px;
            }
            
            .badge-3d-container {
              transform-style: preserve-3d;
              animation: spin 8s linear infinite;
            }
            
            @keyframes spin {
              0% {
                transform: rotateY(0deg);
              }
              100% {
                transform: rotateY(360deg);
              }
            }
          `}</style>
        </Card>
      </div>
    </div>
  )
}
