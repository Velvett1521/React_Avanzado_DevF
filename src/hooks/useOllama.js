// frontend/src/hooks/useOllama.js
import { useState, useCallback } from 'react';
import { chatService } from '../services/chatService';

export const useOllama = (model = 'deepseek-r1:1.5b') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState('');

  const sendMessage = useCallback(async (prompt) => {
    setLoading(true);
    setError(null);
    setResponse('');

    try {
      console.log('📤 Enviando mensaje a Ollama...');
      const result = await chatService.askOllama(prompt, model);
      console.log('📥 Resultado:', result);
      
      if (result.success) {
        setResponse(result.response);
        return result.response;
      } else {
        throw new Error(result.error || 'Error al obtener respuesta');
      }
    } catch (err) {
      console.error('❌ Error en sendMessage:', err);
      const errorMsg = err.message || 'Error al enviar mensaje';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [model]);

  const clearResponse = useCallback(() => {
    setResponse('');
  }, []);

  return {
    sendMessage,
    loading,
    error,
    response,
    clearResponse,
  };
};