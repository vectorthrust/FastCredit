'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function OnRampCard() {
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

        <Card className="w-[400px] overflow-hidden gap-2 relative pb-0">
          <CardHeader className="z-10">
            <CardTitle className="text-2xl">On-Ramp Collateral</CardTitle>
            <CardDescription>
              Use Alchemy Pay to fund your embedded wallet.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 overflow-hidden relative">
            {/* Control the visible area here */}
            <div className="relative h-[525px] overflow-hidden -mt-24 flex justify-center">
              {/* Full-size iframe inside */}
              <iframe
                title="AlchemyPay On/Off Ramp Widget"
                src="https://ramptest.alchemypay.org?crypto=FTN&fiat=AUD"
                frameBorder={0}
                allow="clipboard-write; fullscreen"
                scrolling="no"
                className="w-[380px] h-[525px] pointer-events-auto"
              />

              {/* White masks (as fake negative margins) */}
              <div className="absolute top-0 left-0 w-full h-[100px] bg-white pointer-events-none" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
