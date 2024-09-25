'use client';

import GuessSong from "@/components/GuessSong";
import Result from "@/components/Result";
import axios from "axios";
import {Dancing_Script, Oswald} from 'next/font/google';
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

// Force dynamic rendering to prevent prerender errors
export const dynamic = 'force-dynamic';

const oswald = Oswald({ subsets: ['latin'], weight: "700" });
const Dancing = Dancing_Script({ subsets: ['latin'], weight: "700" });

interface Album {
  id: string;
  name: string;
  images: {
    height: number;
    url: string;
    width: number;
  }[];
}

interface Track {
  preview_url: string;
  id: string;
  album: Album;
  name: string;
}

function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InnerPage />
    </Suspense>
  );
}

function InnerPage() {
  const searchparam = useSearchParams();
  const selectedArtist = searchparam.get("artist");
  const token = searchparam.get("ticket");
  const image = searchparam.get("image");
  const name = searchparam.get("naam");

  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentQuestion, SetCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  const nextQues = (number: number) => {
    SetCurrentQuestion(currentQuestion + 1);
    setScore(score + number);
  };

  useEffect(() => {
    const getTopTracks = async () => {
      if (!selectedArtist) return;
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/artists/${selectedArtist}/top-tracks`,
          {
            params: {
              country: "US",
              limit: 10,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTracks(response.data.tracks);
      } catch (error) {
        console.error(error);
      }
    };
    getTopTracks();
  }, [selectedArtist, token]);

  if (tracks.length <= 5) {
    return (
      <div className="w-[100vw] h-[100vh] items-center justify-center flex">
        <div className="flex gap-2 text-yellow-400">
          <Image src={"/music.svg"} alt={""} height={100} width={140} />
          by<span className={Dancing.className}> Tanishk</span>
        </div>
      </div>
    );
  }

  if (currentQuestion > 7) {
    return (
      <Result url={image} score={score} name={name} />
    );
  }

  const options = [
    { url: tracks[currentQuestion].album.images[0].url, name: tracks[currentQuestion].name },
    { url: tracks[currentQuestion + 1].album.images[0].url, name: tracks[currentQuestion + 1].name },
    { url: tracks[currentQuestion + 2].album.images[0].url, name: tracks[currentQuestion + 2].name },
  ];

  return (
    <div className="w-[100vw] tracking-wider flex h-[100vh] bg-[#141A1E]">
      <div className="mx-auto flex items-center gap-3 flex-col p-10">
        <div className="flex gap-2 text-yellow-400">
          <Image src={"/music.svg"} alt={""} height={100} width={140} />
          by<span className={Dancing.className}> Tanishk</span>
        </div>

        <div className={oswald.className}>
          <h1 className="flex pb-3 pt-3 items-center justify-center text-yellow-400 text-2xl font-bold">
            Play the track and pick
          </h1>
          <h1 className="flex items-center justify-center text-yellow-400 text-2xl font-bold">
            the right song name
          </h1>
        </div>

        <div>
          <GuessSong
            previewUrl={tracks[currentQuestion].preview_url}
            options={options}
            correctOption={tracks[currentQuestion].name}
            nextQuestion={nextQues}
            score={score}
          />
        </div>
      </div>
    </div>
  );
}

export default Page;