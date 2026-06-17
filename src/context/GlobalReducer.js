// Estado inicial
export const initialState = {
  messages: [],
  history: [],
  currentChat: null,
  loading: false,
  error: null,
  model: 'deepseek-r1:1.5b',
};

// Tipos de acciones
export const ACTION_TYPES = {
  ADD_MESSAGE: 'ADD_MESSAGE',
  ADD_HISTORY: 'ADD_HISTORY',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_CHAT: 'CLEAR_CHAT',
  SET_MODEL: 'SET_MODEL',
  LOAD_HISTORY: 'LOAD_HISTORY',
};

// Reducer
export const globalReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
        history: [...state.history, { 
          id: Date.now(), 
          messages: [...state.messages, action.payload],
          timestamp: new Date().toISOString()
        }],
      };

    case ACTION_TYPES.ADD_HISTORY:
      return {
        ...state,
        history: [action.payload, ...state.history],
      };

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

    case ACTION_TYPES.CLEAR_CHAT:
      return {
        ...state,
        messages: [],
        currentChat: null,
      };

    case ACTION_TYPES.SET_MODEL:
      return {
        ...state,
        model: action.payload,
      };

    case ACTION_TYPES.LOAD_HISTORY:
      return {
        ...state,
        history: action.payload,
      };

    default:
      return state;
  }
};