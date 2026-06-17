const API_URL = '/api';

export const chatService = {
  // ============================================
  // CONVERSACIONES
  // ============================================
  
  async saveConversation(conversation) {
    try {
      console.log('📤 Guardando conversación:', conversation);
      // Obtener conversaciones existentes
      const existing = await this.getConversations();
      // Agregar nueva conversación al inicio
      const updated = [conversation, ...existing];
      
      const response = await fetch(`${API_URL}/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversations: updated }),
      });
      
      const data = await response.json();
      console.log('✅ Conversaciones guardadas:', data);
      return data.conversations;
    } catch (error) {
      console.error('❌ Error saveConversation:', error);
      throw error;
    }
  },

  async getConversations() {
    try {
      console.log('📤 Obteniendo conversaciones...');
      const response = await fetch(`${API_URL}/conversations`);
      const data = await response.json();
      console.log('✅ Conversaciones obtenidas:', data);
      return data.conversations || [];
    } catch (error) {
      console.error('❌ Error getConversations:', error);
      return [];
    }
  },

  async deleteConversation(id) {
    try {
      const conversations = await this.getConversations();
      const filtered = conversations.filter(c => c.id !== id);
      await fetch(`${API_URL}/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversations: filtered }),
      });
    } catch (error) {
      console.error('Error deleteConversation:', error);
    }
  },

  async clearAll() {
    try {
      await fetch(`${API_URL}/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversations: [] }),
      });
    } catch (error) {
      console.error('Error clearAll:', error);
    }
  },

  // ============================================
  // MENSAJES INDIVIDUALES (chat actual)
  // ============================================
  
  async saveMessage(id, role, content) {
    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, role, content, timestamp: new Date().toISOString() }),
      });
      return response.json();
    } catch (error) {
      console.error('Error saveMessage:', error);
    }
  },

  async getMessages() {
    try {
      const response = await fetch(`${API_URL}/messages`);
      if (!response.ok) return [];
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error getMessages:', error);
      return [];
    }
  },

  async deleteMessage(id) {
    try {
      await fetch(`${API_URL}/messages/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Error deleteMessage:', error);
    }
  }
};