const OLLAMA_URL = 'http://localhost:11434/api';

export const ollamaService = {
  // Enviar mensaje a Ollama
  async sendMessage(model, messages) {
    try {
      const response = await fetch(`${OLLAMA_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data.message.content;
    } catch (error) {
      console.error('Error al conectar con Ollama:', error);
      throw error;
    }
  },

  // Obtener lista de modelos disponibles
  async getModels() {
    try {
      const response = await fetch(`${OLLAMA_URL}/tags`);
      if (!response.ok) throw new Error('Error al obtener modelos');
      const data = await response.json();
      return data.models;
    } catch (error) {
      console.error('Error al obtener modelos:', error);
      return [];
    }
  }
};