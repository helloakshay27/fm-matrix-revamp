import { useEffect, useState, useCallback } from 'react';
import { useSpeechContext } from '../contexts/SpeechContext';

export const useSpeechToText = () => {
  const {
    isListening,
    transcript,
    error,
    supported,
    activeId,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechContext();

  return {
    isListening,
    activeId,
    transcript,
    error,
    supported,
    startListening,
    stopListening,
    resetTranscript,
  };
};
