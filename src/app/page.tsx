"use client";
import Image from "next/image";
import { Dancing_Script, Oswald } from "next/font/google";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Data from "./topArtist";
import Link from "next/link";
import { getSpotifyToken } from "@/utils/getSpotifyToken";

interface Artist {
  id: string;

  name: string;
  images: {
    url: string;
  }[];
}
const Dancing = Dancing_Script({ subsets: ["latin"], weight: "700" });
const sofadiOne = Oswald({ subsets: ["latin"], weight: "700" });

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [artists, setArtists] = useState<Artist[]>([]);

  const [selectedArtist, setSelectedArtist] = useState("");
  const [artistName, setArtistName] = useState("");
  const [artistImage, setArtistImage] = useState("");
  

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const fetchedToken = await getSpotifyToken();
      setToken(fetchedToken);
    };

    fetchToken();
  }, [token]);
  useEffect(() => {
    const fetchArtists = async () => {
      if (searchQuery.trim() !== "") {
        const response = await axios.get(`https://api.spotify.com/v1/search`, {
          params: {
            q: searchQuery,
            type: "artist",
            limit: 5,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setArtists(response.data.artists.items);
      } else {
        setArtists([]);
      }
    };
    fetchArtists();
  }, [searchQuery,token]);

  return (
    <div className="w-[100vw] tracking-wider flex h-[100vh] bg-[#141A1E]">
      <div className="mx-auto flex items-center gap-3 flex-col p-10">
        <div>
          <Image
            src="/music.svg"
            alt="music nerd logo"
            height={80}
            width={165}
          />
        </div>
        <div className="flex gap-2 text-xl">
          by{" "}
          <p className=" text-yellow-400 text-2xl">
            <span className={Dancing.className}>Tanishk</span>
          </p>
        </div>
        <div className="flex flex-col items-center text-yellow-400 text-5xl">
          <p className={sofadiOne.className}>Are you a true</p>
          <p className={sofadiOne.className}>music fan?</p>
        </div>

        <div className="md:text-xl pt-6 tracking-normal text-md text-gray-400">
          Guess the track with 5 second <span>snippet</span>
        </div>
        {/*singer profile*/}
        {selectedArtist && (
          <div className="flex flex-col items-center gap-2">
            <Image
              className="h-[60px] w-[60px] rounded-full"
              src={artistImage || ""}
              alt=""
              height={60} width={60}
            />
            <h1 className=" font-semibold tracking-wide">{artistName}</h1>
          </div>
        )}

        {/* search bar */}

        <div className="flex gap-4 w-80 mt-2  bg-gray-800 px-6 py-4 rounded-3xl relative">
          <Image src={"/search.svg"} alt={""} height={30} width={30} />
          <input
            className="bg-transparent outline-none"
            type="text"
            placeholder="Type an artist's name"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value.toLowerCase());
              setSelectedArtist("");
            }}
          />
          {artists.length >= 1 && (
            <div className="absolute z-[1] left-0 top-[70px] flex flex-col gap-3 px-5 py-3 rounded-3xl bg-black">
              {artists.map((items, i) => (
                <button
                  onClick={() => {
                    setSelectedArtist(items.id);

                    setSearchQuery("");
                    setArtistName(items.name);
                    setArtistImage(items.images[0]?.url);
                  }}
                  key={i}
                  className="flex items-center gap-5 w-80 rounded-3xl"
                >
                  <Image
                    src={items.images[1]?.url || "/"}
                    className="h-[40px] w-[40px] rounded-full"
                    alt=""
                    height={50} width={50}
                  />
                  {(items as any).name}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="pt-5 font-semibold">
          {(selectedArtist && (
            <Link
              href={{
                pathname: "/quiz",
                query: {
                  artist: selectedArtist,
                  ticket: token,
                  image: artistImage,
                  naam: artistName,
                },
              }}
            >
              <Button size={"lg"}>I'm ready</Button>
            </Link>
          )) || (
            <Button size={"lg"} disabled>
              Let's Go
            </Button>
          )}
        </div>
        {/* {top artists} */}

        <div className="flex gap-4 pt-2">
          {Data.map((items, i) => (
            <button
              onClick={() => {
                setSelectedArtist(items.id);

                setSearchQuery("");
                setArtistName(items.name);
                setArtistImage(items.img);
              }}
              key={i}
              className="flex flex-col justify-center items-center gap-5  rounded-3xl"
            >
              <Image
                src={items.img || "/"}
                className="h-[40px] w-[40px] rounded-full"
                alt=""
                height={50} width={50}
              />
              <h1 className="text-xs"> {(items as any).name}</h1>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 w-full p-6">

        <Link  href={'https://github.com/TanniTemp/musicNerd'} className=" flex gap-3 items-center">
        <Image src={"/git.svg"} alt={""} height={25} width={25}  /> 
        
        <span>Don't forget to give it a star on GitHub! 🌟</span>
        </Link>
        </div>
      </div>
    </div>
  );
}
