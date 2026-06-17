import { useState, useCallback } from 'react';
import { ollamaService } from '../api/ollama';

export const useOllama = (model = 'deepseek-r1:1.5b') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState('');

  const sendMessage = useCallback(async (messages) => {
    setLoading(true);
    setError(null);
    setResponse('');

    try {
      const result = await ollamaService.sendMessage(model, messages);
      setResponse(result);
      return result;
    } catch (err) {
      setError(err.message || 'Error al enviar mensaje');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [model]);

  return {
    sendMessage,
    loading,
    error,
    response,
    clearResponse: () => setResponse(''),
  };
};