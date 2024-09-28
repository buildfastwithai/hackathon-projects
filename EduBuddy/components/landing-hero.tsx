"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import TypewriterComponent from "typewriter-effect";
import { Button } from "@/components/ui/button";

export const LandingHero = () => {
  const { isSignedIn } = useAuth();

  return (
    <div className="text-white font-bond py-36 text-center space-y-5">
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-bold">
        <h1>Your AI Study Companion</h1>
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 p-2">
          <TypewriterComponent
            options={{
              strings: [
                "Doubts Solving",
                "Flashcards",
                "Code Assistant",
                "Quiz Generation",
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
      </div>
      <div >
        <div className="p-5">
        </div>
        <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
          <Button
            variant="premium"
            className="md:text-lg p-4 md:p-6 rounded-full font-semibold"
          >
            Explore Now!
          </Button>
        </Link>
      </div>
      <div className="text-zinc-400 text-xs md:text-sm font-normal">
        New Features lined up.
      </div>
    </div>
  );
};
