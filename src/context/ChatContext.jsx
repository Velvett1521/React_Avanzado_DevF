import React, { createContext, useContext, useReducer } from 'react';
import { chatReducer, initialState } from './ChatReducer';

// 1. Crear el contexto
const ChatContext = createContext();

// 2. Crear el Provider
export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Funciones de utilidad para despachar acciones
  const addMessage = (message) => {
    dispatch({ type: 'ADD_MESSAGE', payload: message });
  };

  const loadConversation = (conversation) => {
    dispatch({ type: 'LOAD_CONVERSATION', payload: conversation });
  };

  const deleteConversation = (id) => {
    dispatch({ type: 'DELETE_CONVERSATION', payload: id });
  };

  const clearChat = () => {
    dispatch({ type: 'CLEAR_CHAT' });
  };

  const startNewChat = () => {
    dispatch({ type: 'START_NEW_CHAT' });
  };

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  // Valor del contexto
  const value = {
    state,
    dispatch,
    addMessage,
    loadConversation,
    deleteConversation,
    clearChat,
    startNewChat,
    setLoading,
    setError,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

// 3. Custom hook para usar el contexto
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat debe usarse dentro de un ChatProvider');
  }
  return context;
};