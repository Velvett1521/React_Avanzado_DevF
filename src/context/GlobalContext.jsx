import React, { createContext, useContext, useReducer } from 'react';
import { initialState, globalReducer } from './GlobalReducer';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  const addMessage = (message) => {
    dispatch({ type: 'ADD_MESSAGE', payload: message });
  };

  const saveHistory = () => {
    dispatch({ type: 'SAVE_HISTORY' });
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

  const clearChat = () => {
    dispatch({ type: 'CLEAR_CHAT' });
  };

  const value = {
    state,
    dispatch,
    addMessage,
    saveHistory,
    startNewChat,
    setLoading,
    setError,
    clearChat,
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext debe usarse dentro de GlobalProvider');
  }
  return context;
};