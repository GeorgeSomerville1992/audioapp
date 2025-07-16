import { useEffect, useState, useRef } from 'react';
import { useTranscript } from '../hooks/useTranscript';
import { type AudioBlock } from '../types';

export const Home = () => {
  const { loading, data, error } = useTranscript();
  const [audioTime, setAudioTime] = useState<number>(0);
  const [selectedText, setSelectedText] = useState<AudioBlock>();

  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleSound = () => {
    const audioFile = audioRef.current;
    if (audioFile.duration > 0 && !audioFile.paused) {
      setAudioTime(audioFile.currentTime);
      audioFile.pause();
    } else {
      setAudioTime(audioFile.currentTime);
      audioFile.play();
    }
  };

  useEffect(() => {
    if(audioTime === 0 || !data?.blocks) return;
    const foundAudioBlock = data?.blocks.find((block: AudioBlock) => {
      return audioTime >= block.start && audioTime <= block.end;
    });

    setSelectedText(foundAudioBlock);
  }, [audioTime, data]);

  if (loading || !data?.blocks) return <h2> Loading...</h2>;

  if (error) return <h2> Error </h2>;

  const { audioUrl } = data;
  // Save the audio to a ref to avoid re-creating it on every render
  // Now the text is highlighted when we pause and play the audio, 
  // And we have the time of the audio in the state, we can use this to scrub the audio based on when the user
  // clicks on the block of text
  if (!audioRef.current) {
    audioRef.current = new Audio(audioUrl);
  }

  return (
    <main>
      <div className="transcript">
        <h1 data-testid="test-title">Title</h1>
        <ul className="blocks overflow-scroll">
          {data?.blocks &&
            data?.blocks.length &&
            data?.blocks.map((block: AudioBlock) => {
              const isHighlighted = selectedText?.text === block.text;
              return (
                <li>
                  <p className={isHighlighted ? 'block-highlighted' : ''}> {block.text} </p>
                </li>
              );
            })}
        </ul>
      </div>
      <audio
          controls
          src={data.audioUrl}
          className="audio"
          data-testid="test-audio"
          onPlay={() => {
            toggleSound();
          }}
          onPause={() => {
            toggleSound();
          }}
        />
    </main>
  );
};
