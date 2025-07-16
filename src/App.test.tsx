import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('Renders hello world', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', {
        level: 1,
      }),
    ).toHaveTextContent('Hello World');
  });
  // beforeEach(() => {
  //   Element.prototype.scrollIntoView = jest.fn();
  //   Element.prototype.scrollIntoViewIfNeeded = jest.fn();
  // });

  it('Displays title', async () => {
    render(<App />);

    expect(await screen.findByTestId('test-title')).toHaveTextContent('Gogo Q1 2023');
  });

  it('Displays the blocks correctly', async () => {
    render(<App />);

    const blocks = await screen.findAllByTestId('test-block');
    expect(blocks[0]).toHaveTextContent(
      'Good day, and welcome to the first quarter 2023 GoGo Inc. earnings conference call.',
    );
    expect(blocks[50]).toHaveTextContent('The first is the higher level of maintenance events.');
    expect(blocks[blocks.length - 1]).toHaveTextContent('This now concludes our call, and you may disconnect.');
  });

  it('Highlights block correctly on audio time update', async () => {
    render(<App />);

    const audio = await screen.findByTestId('test-audio');

    // No highlight initially
    expect(screen.queryByTestId('test-block-highlighted')).not.toBeInTheDocument();

    // First span is 0 - 6s
    fireEvent.timeUpdate(audio, {
      target: {
        currentTime: 2,
      },
    });
    expect(await screen.findByTestId('test-block-highlighted')).toHaveTextContent(
      'Good day, and welcome to the first quarter 2023 GoGo Inc. earnings conference call.',
    );

    // A random block from 2387 - 2389s
    fireEvent.timeUpdate(audio, {
      target: {
        currentTime: 2388,
      },
    });
    expect(await screen.findByTestId('test-block-highlighted')).toHaveTextContent('So we make it up to the quantity.');

    // Last block 4021 - 4037s
    fireEvent.timeUpdate(audio, {
      target: {
        currentTime: 4030,
      },
    });
    expect(await screen.findByTestId('test-block-highlighted')).toHaveTextContent(
      'This now concludes our call, and you may disconnect.',
    );
  });

  it('Highlighted block has correct styles', async () => {
    render(<App />);

    const audio = await screen.findByTestId('test-audio');

    // First span is 0 - 6s
    fireEvent.timeUpdate(audio, {
      target: {
        currentTime: 2,
      },
    });
    expect(await screen.findByTestId('test-block-highlighted')).toHaveClass('block-highlighted');
  });

  it('Seeks audio to correct time on span click', async () => {
    render(<App />);

    const audio = await screen.findByTestId('test-audio');

    // This block is 26.68 - 30.06s
    fireEvent.click(screen.getByText("Please be advised that today's conference is being recorded."));

    expect(audio).toHaveProperty('currentTime', 26.68);
  });
});
