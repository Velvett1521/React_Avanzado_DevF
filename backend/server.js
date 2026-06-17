// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Hola Mundo desde Express! 🚀');
});

app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📡 Endpoints:`);
  console.log(`   POST /api/conversations - Guardar conversaciones`);
  console.log(`   GET  /api/conversations - Obtener conversaciones`);
  console.log(`   POST /api/ask - Preguntar a Ollama`);
});