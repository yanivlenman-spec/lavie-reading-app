import { useCallback, useEffect, useRef, useState } from 'react';

export interface TranscriptEvent {
  transcript: string;
  isFinal: boolean;
}

interface Options {
  lang: string;
  onTranscript: (transcripts: string[], isFinal: boolean) => void;
}

function getSpeechRecognition(): typeof SpeechRecognition | null {
  if (typeof window === 'undefined') return null;
  return (
    (window as any).SpeechRecognition ??
    (window as any).webkitSpeechRecognition ??
    null
  );
}

export function useSpeechRecognition({ lang, onTranscript }: Options) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const activeRef = useRef(false);
  const onTranscriptRef = useRef(onTranscript);
  onTranscriptRef.current = onTranscript;

  const isSupported = getSpeechRecognition() !== null;

  const stop = useCallback(() => {
    activeRef.current = false;
    try {
      recognitionRef.current?.stop();
    } catch {}
    setIsListening(false);
  }, []);

  const start = useCallback(() => {
    const SR = getSpeechRecognition();
    if (!SR) return;

    // Tear down any existing instance
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current.onresult = null;
      recognitionRef.current.onerror = null;
      recognitionRef.current.onend = null;
    }

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const finalAlts: string[] = [];
      const interimAlts: string[] = [];

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        // Collect all alternatives (not just [0]) so proper nouns get a second chance
        for (let alt = 0; alt < result.length; alt++) {
          const t = result[alt]?.transcript?.trim();
          if (t) {
            (result.isFinal ? finalAlts : interimAlts).push(t);
          }
        }
      }

      if (finalAlts.length > 0) {
        onTranscriptRef.current(finalAlts, true);
      } else if (interimAlts.length > 0) {
        onTranscriptRef.current(interimAlts, false);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      if (event.error === 'not-allowed') {
        activeRef.current = false;
        setIsListening(false);
        return;
      }
      console.warn('[STT] error:', event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
      // Auto-restart so child doesn't have to tap again
      if (activeRef.current) {
        try {
          recognition.start();
          setIsListening(true);
        } catch {
          activeRef.current = false;
        }
      }
    };

    recognitionRef.current = recognition;
    activeRef.current = true;

    try {
      recognition.start();
    } catch {
      activeRef.current = false;
    }
  }, [lang]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      activeRef.current = false;
      try { recognitionRef.current?.stop(); } catch {}
    };
  }, []);

  return { isListening, isSupported, start, stop };
}
