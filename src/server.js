import express from 'express';
import fs from 'fs';
import yaml from 'js-yaml';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/authRoutes.js';
import labelRoutes from './routes/labelRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('tiny'));
}

const specs = yaml.load(fs.readFileSync('./docs/openapi.yaml', 'utf8'));

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Task Management API',
    docs: '/api-docs',
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/labels', labelRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((error, req, res) => {
  const status = error.status || 500;
  const message = error.message || 'Internal Server Error';
  res.status(status).json({ error: message });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

export default app;
