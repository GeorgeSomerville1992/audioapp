import { useEffect, useState, useRef } from 'react';
import { useTranscript } from '../hooks/useTranscript';
import { type AudioBlock } from '../types';
import { findAudioBlock } from '../utils';

export const Home = () => {
  const { loading, data, error } = useTranscript();
  const [audioTime, setAudioTime] = useState(0);
  const [selectedText, setSelectedText] = useState<AudioBlock>();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleBlockClick = (block: AudioBlock) => {
    const audioFile = audioRef.current;
    if (!audioFile) return;

    // Set the current time of the audio to the start of the block
    audioFile.currentTime = block.start;
    setAudioTime(block.start);

    // Highlight the text block
    setSelectedText(block);
  };

  const handleScrubberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const audioFile = audioRef.current;
    if (!audioFile || !data) return;

    // Get the current time of the audio
    const newTime = parseFloat(event.target.value);
    setAudioTime(newTime);
    audioFile.currentTime = newTime;

    // Find the block that corresponds to the current time
    const foundAudioBlock = findAudioBlock(data, newTime);

    if (foundAudioBlock) {
      setSelectedText(foundAudioBlock);
    }
  };

  const togglePlay = () => {
    const audioFile = audioRef.current;
    if (!audioFile) return;
    audioFile.play.call(audioFile);

    setAudioTime(audioFile.currentTime);
  };

  const togglePause = () => {
    const audioFile = audioRef.current;
    if (!audioFile) return;
    audioFile.pause.call(audioFile);

    setAudioTime(audioFile.currentTime);
  };

  // Set audio text if audioTime changes
  useEffect(() => {
    if (audioTime === 0 || !data?.blocks) return;

    const foundAudioBlock = data.blocks.find((block) => audioTime >= block.start && audioTime <= block.end);

    setSelectedText(foundAudioBlock);
  }, [audioTime, data]);

  if (error) return <h2> Error </h2>;

  if (loading) return <h2> Loading...</h2>;

  if (!data?.blocks.length) return <h2> No data </h2>;

  const { audioUrl, blocks } = data;

  return (
    <>
      <header className="bg-dark-grey w-screen pt-4 pb-4">
        <div className="flex justify-center items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">Audio App</h1>
        </div>
      </header>
      <main>
        <div className="transcript">
          <h1 data-testid="test-title">Transcript</h1>
          <ul className="blocks overflow-scroll">
            {blocks.length > 0 &&
              blocks.map((block: AudioBlock) => {
                const isHighlighted = selectedText?.text === block.text;
                return (
                  <li
                    data-testid={isHighlighted ? 'test-block-highlighted' : 'test-block'}
                    onClick={() => handleBlockClick(block)}
                  >
                    <p className={isHighlighted ? 'block-highlighted' : ''}> {block.text} </p>
                  </li>
                );
              })}
          </ul>
        </div>
        <audio ref={audioRef} controls id="audio" src={audioUrl} className="audio" data-testid="test-audio" hidden />
        <button type="button" data-testid="test-play-button" aria-label="Play" onClick={togglePlay}>
          Play
        </button>
        <button type="button" data-testid="test-pause-button" aria-label="Pause" onClick={togglePause}>
          Pause
        </button>
        <input
          type="range"
          id="audio-scrubber"
          aria-label="Audio Scrubber"
          min="0"
          max={audioRef.current?.duration}
          value={audioTime}
          onChange={handleScrubberChange}
        />
      </main>
      <footer className="mt-8 text-center text-gray-600 w-full bg-dark-grey flex fixed bottom-0 justify-center items-center">
        <p>© George</p>
      </footer>
    </>
  );
};
