'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import { Button } from './ui/button';
import Link from 'next/link';

interface Options {
  url: string;
  name: string;
}

interface GuessSongProps {
  previewUrl: string;
  options: Options[];
  correctOption: string;
  nextQuestion: Function;
  score:number
}

const shuffleArray = (array: Options[]) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const GuessSong: React.FC<GuessSongProps> = ({
  previewUrl,
  options,
  correctOption,
  nextQuestion,
  score
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [shuffledOptions, setShuffledOptions] = useState<Options[]>([]);
  const [color, setColor] = useState('');
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    const shuffled = shuffleArray(options);
    setShuffledOptions(shuffled);
  }, [options]);

  const segments = [30, 35, 30, 35, 40, 45, 37, 25, 35, 45, 32, 30, 37, 35, 24, 38, 31, 45, 35, 40, 30, 35, 30, 45, 40, 30, 37, 32, 45, 40];

  const playSnippet = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;

      if (isPlaying) {
        setIsPlaying(false);
        audioRef.current.pause();
        if (timeoutId) clearTimeout(timeoutId); 
      } else {
        setIsPlaying(true);
        audioRef.current.play();

       
        if (timeoutId) clearTimeout(timeoutId);

        const id = setTimeout(() => {
          audioRef.current?.pause();
          setIsPlaying(false);
          setCurrentTime(0);
        }, 5000); 
        setTimeoutId(id); 
      }
    }
  };

  const handleGuess = (option: string) => {
    setSelectedOption(option);
    if (option === correctOption) {
      setColor('border-2 border-green-400');
    } else {
      setColor('border-2 border-red-400');
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  const trimName = (name: string, length: number) => {
    return name.length > length ? name.substring(0, length) + '...' : name;
  };
  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      audio.addEventListener('timeupdate', onTimeUpdate);
      audio.addEventListener('loadedmetadata', onLoadedMetadata);
    }
    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', onTimeUpdate);
        audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      }
    };
  }, []);

  const filledSegmentsCount = Math.floor((currentTime / 4.5) * segments.length);

  const handleNextQuestion = () => {
    if (timeoutId) clearTimeout(timeoutId); 
    if (audioRef.current) {
      audioRef.current.currentTime = 0; 
    }
    setIsPlaying(false);
    setColor('');
    let temp = 0;
    if (selectedOption === correctOption) {
      temp = 1;
    }
    nextQuestion(temp);
  };
  if(previewUrl===undefined){
   nextQuestion(0)
  }

  return (
    <div>
      <audio ref={audioRef} src={previewUrl} />
      <div className="flex items-center justify-center py-4 gap-4">
        {/* Button to play the snippet */}
        <button onClick={playSnippet}>
          {isPlaying ? (
            <Image src="/pause.svg" alt="Pause" height={30} width={30} />
          ) : (
            <Image src="/play.svg" alt="Play" height={30} width={30} />
          )}
        </button>

        {/* Progress Bar */}
        <div className="flex items-center justify-center">
          {segments.map((height, index) => (
            <div
              className="w-2 rounded-sm border-2 border-black"
              key={index}
              style={{
                height: height,
                backgroundColor: index < filledSegmentsCount ? '#FACC15' : '#ADADAD',
                transition: 'background-color 0.1s ease-in-out',
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex md:gap-5 gap-2 py-10">
        {shuffledOptions.map((option, index) =>
          selectedOption === option.name ? (
            <button
              key={index}
              onClick={() => handleGuess(option.name)}
              className={cn('flex flex-col items-center justify-center gap-2', color)}
            >
              <Image src={option.url} alt={option.name} height={80} width={80} />
              <h1>{trimName(option.name, 10)}</h1>
            </button>
          ) : (
            <button
              key={index}
              disabled={color !== ''}
              onClick={() => handleGuess(option.name)}
              className={cn('flex flex-col items-center justify-center gap-2 ')}
            >
              <Image src={option.url} alt={option.name} height={100} width={100} />
              <h1>{trimName(option.name, 8)}</h1>
            </button>
          )
        )}
      </div>

      <div className="flex items-center justify-center">
        {color !== '' && (
         <div>
           <Button size={'lg'} onClick={handleNextQuestion}>
            Next
          </Button>
           
         </div>
        )}
      </div>
     
    </div>
  );
};

export default GuessSong;
