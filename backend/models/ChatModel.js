// backend/models/ChatModel.js
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

// Configurar LowDB
const adapter = new JSONFile('db.json');
const db = new Low(adapter, { messages: [], currentChat: [] });

// Inicializar la base de datos
await db.read();
db.data ||= { messages: [], currentChat: [] };

// Funciones para interactuar con la DB
export const ChatModel = {
  // Obtener todos los mensajes
  async getAllMessages() {
    await db.read();
    return db.data.messages || [];
  },

  // Guardar un mensaje
  async saveMessage(message) {
    await db.read();
    db.data.messages.push(message);
    await db.write();
    return message;
  },

  // Obtener el chat actual
  async getCurrentChat() {
    await db.read();
    return db.data.currentChat || [];
  },

  // Guardar el chat actual
  async saveCurrentChat(messages) {
    await db.read();
    db.data.currentChat = messages;
    await db.write();
    return messages;
  },

  // Eliminar un mensaje por ID
  async deleteMessage(id) {
    await db.read();
    db.data.messages = db.data.messages.filter(msg => msg.id !== id);
    await db.write();
    return { success: true };
  },

  // Limpiar todo
  async clearAll() {
    await db.read();
    db.data.messages = [];
    db.data.currentChat = [];
    await db.write();
    return { success: true };
  }
};

export default db;