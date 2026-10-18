const path = require('path');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'WebChat API - Backend',
      version: '1.0.0',
      description: 'API RESTful para gerenciamento do WebChat.',
    },
    servers: [
      { url: 'https://webchat-9vqr.onrender.com/api', description: 'Produção (Render)' },
      { url: 'http://localhost:3001/api', description: 'Local' }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    }
  },
  apis: [path.join(__dirname, '..', 'routes', '*.js').replace(/\\/g, '/')],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
console.log('[SWAGGER] Procurando arquivos em:', swaggerOptions.apis[0]);
console.log(`[SWAGGER] ${Object.keys(swaggerDocs.paths || {}).length} rota(s) encontrada(s)`);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = {
  swaggerOptions,
  swaggerDocs,
  setupSwagger
};
