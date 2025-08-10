import { useState, useEffect } from 'react';
import { type Audio } from '../types.ts';
const url = 'https://main.d319k8lxxb3z56.amplifyapp.com/api/transcripts/gg1aa17c-0a31-495c-8e9d-6179de3d3111';

export const useTranscript = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Audio | null>(null);

  const fetchTranscript = async () => {
    setLoading(true);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch transcript');
      }
      const result = await response.json();
      setData(result);
    } catch (err: unknown) {
      // additional logging for issue here
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };
  // useTransscript will run teive regardless
  useEffect(() => {
    console.log('running useEffect in useTranscript');
    if (!data) {
      console.log('fetching transcript');
      fetchTranscript();
    }
  }, [data]);

  return {
    loading,
    error,
    data,
  };
};
