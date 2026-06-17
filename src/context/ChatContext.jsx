import React, { createContext, useContext, useReducer } from 'react';
import { chatReducer, initialState } from './ChatReducer';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

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

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat debe usarse dentro de un ChatProvider');
  }
  return context;
};