import { useChat } from '../context/ChatContext';
import { useOllama } from './useOllama';
import { useState } from 'react';

export const useChatLogic = () => {
  const { state, addMessage, setError } = useChat();
  const [input, setInput] = useState('');
  const { sendMessage, loading } = useOllama(state.model);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    addMessage(userMessage);
    setInput('');

    try {
      const history = state.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      history.push(userMessage);

      const response = await sendMessage(history);
      addMessage({ role: 'assistant', content: response });
    } catch (err) {
      setError(err.message || 'Error al enviar mensaje');
    }
  };

  return {
    input,
    setInput,
    loading,
    handleSubmit,
    messages: state.messages,
    error: state.error,
  };
};