// backend/routes/apiRoutes.js
import express from 'express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const router = express.Router();

// Configurar LowDB
const adapter = new JSONFile('db.json');
const db = new Low(adapter, { messages: [], conversations: [] });

// Leer la base de datos
await db.read();
db.data ||= { messages: [], conversations: [] };

// ============================================
// RUTAS DE CONVERSACIONES
// ============================================

// Guardar todas las conversaciones
router.post('/conversations', async (req, res) => {
  const { conversations } = req.body;
  try {
    db.data.conversations = conversations || [];
    await db.write();
    res.json({ 
      success: true, 
      conversations: db.data.conversations,
      count: db.data.conversations.length
    });
  } catch (error) {
    console.error('Error guardando conversaciones:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener todas las conversaciones
router.get('/conversations', async (req, res) => {
  try {
    await db.read();
    res.json({ 
      conversations: db.data.conversations || [],
      count: db.data.conversations?.length || 0
    });
  } catch (error) {
    console.error('Error obteniendo conversaciones:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// RUTAS DE MENSAJES (Chat actual)
// ============================================

// Obtener mensajes del chat actual
router.get('/messages', async (req, res) => {
  try {
    await db.read();
    res.json({ 
      success: true, 
      data: db.data.messages || []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Guardar mensaje en el chat actual
router.post('/messages', async (req, res) => {
  const { id, role, content, timestamp } = req.body;
  
  if (!id || !role || !content) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    await db.read();
    db.data.messages.push({ id, role, content, timestamp: timestamp || new Date().toISOString() });
    await db.write();
    res.status(201).json({ success: true, data: { id, role, content } });
  } catch (error) {
    console.error('Error guardando mensaje:', error);
    res.status(500).json({ error: error.message });
  }
});

// Eliminar todos los mensajes
router.delete('/messages', async (req, res) => {
  try {
    await db.read();
    db.data.messages = [];
    await db.write();
    res.json({ success: true, message: 'Mensajes eliminados' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// RUTAS DE OLLAMA
// ============================================

// Endpoint para preguntar a Ollama
router.post('/ask', async (req, res) => {
  const { prompt, model = 'deepseek-r1:1.5b' } = req.body;

  if (!prompt) {
    return res.status(400).json({ 
      success: false, 
      error: 'El prompt es requerido' 
    });
  }

  try {
    console.log(`📤 Enviando a Ollama: "${prompt.substring(0, 50)}..."`);

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 500
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`);
    }

    const data = await response.json();
    let result = data.response || '';

    // Limpiar etiquetas <think>
    result = result.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

    if (!result) {
      result = 'No se pudo generar una respuesta. Intenta de nuevo.';
    }

    console.log(`✅ Respuesta recibida (${result.length} caracteres)`);

    res.json({
      success: true,
      response: result,
      model: model,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error en /api/ask:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al procesar la solicitud'
    });
  }
});

// ============================================
// RUTAS DE PRUEBA
// ============================================

router.get('/test', (req, res) => {
  res.json({
    success: true,
    mensaje: '¡Servidor funcionando!',
    timestamp: new Date().toISOString()
  });
});

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;