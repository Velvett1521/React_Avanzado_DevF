// backend/controllers/chatController.js
import { ChatModel } from '../models/ChatModel.js';

export const chatController = {
  // Obtener todos los mensajes
  async getMessages(req, res) {
    try {
      const messages = await ChatModel.getAllMessages();
      res.json({
        success: true,
        data: messages,
        count: messages.length
      });
    } catch (error) {
      console.error('❌ Error en getMessages:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Guardar un mensaje
  async saveMessage(req, res) {
    const { id, role, content, timestamp } = req.body;

    if (!id || !role || !content) {
      return res.status(400).json({
        success: false,
        error: 'ID, role y content son requeridos'
      });
    }

    try {
      const message = {
        id,
        role,
        content,
        timestamp: timestamp || new Date().toISOString()
      };
      
      await ChatModel.saveMessage(message);
      
      res.status(201).json({
        success: true,
        data: message
      });
    } catch (error) {
      console.error('❌ Error en saveMessage:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Obtener el chat actual
  async getCurrentChat(req, res) {
    try {
      const chat = await ChatModel.getCurrentChat();
      res.json({
        success: true,
        data: chat
      });
    } catch (error) {
      console.error('❌ Error en getCurrentChat:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Guardar el chat actual
  async saveCurrentChat(req, res) {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        error: 'Se requiere un array de mensajes'
      });
    }

    try {
      await ChatModel.saveCurrentChat(messages);
      res.json({
        success: true,
        data: messages,
        count: messages.length
      });
    } catch (error) {
      console.error('❌ Error en saveCurrentChat:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Eliminar mensaje
  async deleteMessage(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID es requerido'
      });
    }

    try {
      await ChatModel.deleteMessage(id);
      res.json({
        success: true,
        message: 'Mensaje eliminado correctamente'
      });
    } catch (error) {
      console.error('❌ Error en deleteMessage:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Limpiar todo
  async clearAll(req, res) {
    try {
      await ChatModel.clearAll();
      res.json({
        success: true,
        message: 'Base de datos limpiada correctamente'
      });
    } catch (error) {
      console.error('❌ Error en clearAll:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};