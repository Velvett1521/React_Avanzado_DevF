// src/context/ChatReducer.js

// === PERSISTENCIA ===
const loadStateFromStorage = () => {
  try {
    const storedState = localStorage.getItem('devfseek_chat_state');
    if (storedState) {
      const parsed = JSON.parse(storedState);
      return {
        messages: parsed.messages || [],
        history: parsed.history || [],
        currentChatId: parsed.currentChatId || null,
        loading: false,
        error: null,
        model: parsed.model || 'deepseek-r1:1.5b',
      };
    }
  } catch (error) {
    console.error('Error al cargar estado:', error);
  }
  return {
    messages: [],
    history: [],
    currentChatId: null,
    loading: false,
    error: null,
    model: 'deepseek-r1:1.5b',
  };
};

const saveToLocalStorage = (state) => {
  try {
    localStorage.setItem('devfseek_chat_state', JSON.stringify(state));
  } catch (error) {
    console.error('Error al guardar:', error);
  }
};

// === ESTADO INICIAL ===
export const initialState = loadStateFromStorage();

// === TIPOS DE ACCIONES ===
export const ACTION_TYPES = {
  ADD_MESSAGE: 'ADD_MESSAGE',
  LOAD_CONVERSATION: 'LOAD_CONVERSATION',
  DELETE_CONVERSATION: 'DELETE_CONVERSATION',
  CLEAR_CHAT: 'CLEAR_CHAT',
  START_NEW_CHAT: 'START_NEW_CHAT',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_MODEL: 'SET_MODEL',
};

// === REDUCER ===
export const chatReducer = (state, action) => {
  let newState;

  switch (action.type) {
    case ACTION_TYPES.ADD_MESSAGE:
      newState = {
        ...state,
        messages: [...state.messages, action.payload],
      };
      saveToLocalStorage(newState);
      return newState;

    case ACTION_TYPES.LOAD_CONVERSATION:
      newState = {
        ...state,
        messages: action.payload.messages || [],
        currentChatId: action.payload.id,
      };
      saveToLocalStorage(newState);
      return newState;

    case ACTION_TYPES.DELETE_CONVERSATION:
      newState = {
        ...state,
        history: state.history.filter(item => item.id !== action.payload),
      };
      saveToLocalStorage(newState);
      return newState;

    case ACTION_TYPES.CLEAR_CHAT:
      newState = {
        ...state,
        messages: [],
        currentChatId: null,
      };
      saveToLocalStorage(newState);
      return newState;

    case ACTION_TYPES.START_NEW_CHAT:
      let updatedHistory = [...state.history];
      if (state.messages.length > 0) {
        const conversation = {
          id: Date.now(),
          messages: [...state.messages],
          timestamp: new Date().toISOString(),
          title: state.messages[0]?.content?.substring(0, 30) + '...' || 'Nueva conversación',
        };
        updatedHistory = [conversation, ...state.history];
      }
      newState = {
        ...state,
        messages: [],
        history: updatedHistory,
        currentChatId: null,
      };
      saveToLocalStorage(newState);
      return newState;

    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case ACTION_TYPES.SET_MODEL:
      newState = {
        ...state,
        model: action.payload,
      };
      saveToLocalStorage(newState);
      return newState;

    default:
      return state;
  }
};