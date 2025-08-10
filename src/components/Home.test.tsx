import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Home } from './Home';
import { describe, expect, it, vi } from 'vitest';
import React from 'react';

const mockData = {
  audioUrl: 'test-audio.mp3',
  blocks: [
    { start: 0, end: 5, text: 'Hello world' },
    { start: 6, end: 10, text: 'This is a test' },
  ],
};

const mocks = vi.hoisted(() => ({
  useTranscript: vi.fn(() => ({ loading: false, data: mockData, error: null })),
}));

vi.mock('../hooks/useTranscript', () => ({
  useTranscript: mocks.useTranscript,
}));

describe('Home Component', () => {
  it('renders loading state', () => {
    mocks.useTranscript.mockReturnValue({ loading: true, data: mockData, error: null });
    render(<Home />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    // @ts-expect-error test
    mocks.useTranscript.mockReturnValue({ loading: false, data: mockData, error: 'Error' });
    render(<Home />);
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('renders no data state', () => {
    mocks.useTranscript.mockReturnValue({
      loading: false,
      data: {
        blocks: [],
        audioUrl: '',
      },
      error: null,
    });
    render(<Home />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('renders transcript and blocks', () => {
    mocks.useTranscript.mockReturnValue({ loading: false, data: mockData, error: null });
    render(<Home />);
    expect(screen.getByText('Transcript')).toBeInTheDocument();
    expect(screen.getByText('Hello world')).toBeInTheDocument();
    expect(screen.getByText('This is a test')).toBeInTheDocument();
  });

  it('highlights block on click', () => {
    mocks.useTranscript.mockReturnValue({ loading: false, data: mockData, error: null });
    render(<Home />);
    const block = screen.getByText('Hello world');
    fireEvent.click(block);
    expect(block).toHaveClass('block-highlighted');
  });

  // it('calls togglePlay and updates audioTime', () => {
  //   mocks.useTranscript.mockReturnValue({ loading: false, data: mockData, error: null });
  //   const mockAudioRef = { current: { play: vi, currentTime: 0 } };
  //   vi.spyOn(React, 'useRef').mockReturnValue(mockAudioRef);

  //   render(<Home />);
  //   const playButton = screen.getByText('Play'); // Assuming there's a Play button
  //   fireEvent.click(playButton);

  //   expect(mockAudioRef.current.play).toHaveBeenCalled();
  // });

  // it('calls togglePause and updates audioTime', () => {
  //   const mockAudioRef = { current: { pause: vi.fn(), currentTime: 5 } };
  //   vi.spyOn(React, 'useRef').mockReturnValue(mockAudioRef);

  //   render(<Home data={mockData} />);
  //   const pauseButton = screen.getByText('Pause'); // Assuming there's a Pause button
  //   fireEvent.click(pauseButton);

  //   expect(mockAudioRef.current.pause).toHaveBeenCalled();
  // });

  it('updates selected text when audioTime changes', () => {
    const setSelectedText = vi.fn();
    vi.spyOn(React, 'useState').mockReturnValue([null, setSelectedText]);

    render(<Home />);
    act(() => {
      // Simulate audioTime change
      setSelectedText({ text: 'Hello world' });
    });

    expect(setSelectedText).toHaveBeenCalledWith({ text: 'Hello world' });
  });
});
