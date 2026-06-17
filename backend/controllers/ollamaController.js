// backend/controllers/ollamaController.js
import axios from 'axios';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api';

export const ollamaController = {
  async askOllama(req, res) {
    const { prompt, model = 'deepseek-r1:1.5b' } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'El prompt es requerido'
      });
    }

    try {
      console.log(`📤 Enviando a Ollama: "${prompt.substring(0, 50)}..."`);

      // Llamar a Ollama con timeout de 2 minutos
      const ollamaResponse = await axios.post(
        `${OLLAMA_URL}/generate`,
        {
          model: model,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.7,
            num_predict: 500  // Límite de tokens en la respuesta
          }
        },
        {
          timeout: 120000, // 120 segundos
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        }
      );

      // Obtener la respuesta
      let result = ollamaResponse.data?.response || '';

      // Limpiar etiquetas <think> si existen
      result = result.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

      // Si no hay resultado, mensaje por defecto
      if (!result) {
        result = 'No se pudo generar una respuesta. Intenta de nuevo.';
      }

      console.log(`✅ Respuesta recibida (${result.length} caracteres)`);

      // Enviar respuesta exitosa
      return res.json({
        success: true,
        response: result,
        model: model,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Error en Ollama:', error.message);
      console.error('Detalles:', error);

      // Manejar errores específicos
      if (error.code === 'ECONNREFUSED') {
        return res.status(503).json({
          success: false,
          error: 'No se pudo conectar a Ollama',
          details: 'Asegúrate de que Ollama esté corriendo en localhost:11434'
        });
      }

      if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
        return res.status(504).json({
          success: false,
          error: 'Ollama está tardando demasiado',
          details: 'El modelo está procesando tu mensaje, intenta con preguntas más cortas'
        });
      }

      if (error.response?.status === 404) {
        return res.status(404).json({
          success: false,
          error: 'Modelo no encontrado',
          details: `El modelo "${model}" no está disponible. Usa "ollama pull ${model}" para descargarlo.`
        });
      }

      // Error genérico
      return res.status(500).json({
        success: false,
        error: 'Error al procesar la solicitud',
        details: error.message
      });
    }
  },

  async healthCheck(req, res) {
    try {
      const response = await axios.get(`${OLLAMA_URL}/tags`, {
        timeout: 5000
      });

      return res.json({
        status: 'ok',
        ollama: 'connected',
        models: response.data.models || []
      });
    } catch (error) {
      return res.status(503).json({
        status: 'error',
        ollama: 'disconnected',
        error: error.message
      });
    }
  }
};