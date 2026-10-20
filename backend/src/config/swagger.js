const path = require('path');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'SkyRipple API — Backend Service',
      version: '1.0.0',
      description: 'API RESTful e motor em tempo real para o SkyRipple. Gerenciamento de autenticação, salas, mensagens, direct messages 1x1, favoritos, notificações, denúncias e console administrativo.',
      contact: {
        name: 'SkyRipple Team',
        url: 'https://skyripple-project-web2.vercel.app'
      }
    },
    servers: [
      { url: 'https://skyripple-9vqr.onrender.com/api', description: 'Produção (Render)' },
      { url: 'https://webchat-9vqr.onrender.com/api', description: 'Produção (Legado)' },
      { url: 'http://localhost:3001/api', description: 'Ambiente Local' }
    ],
    tags: [
      { name: 'Auth', description: 'Autenticação, registro, sincronização Google OAuth e perfil' },
      { name: 'Rooms', description: 'Criação, listagem, membros, moderação e cargos de salas' },
      { name: 'Messages', description: 'Mensagens de salas, busca textual e exclusão' },
      { name: 'Directs', description: 'Mensagens diretas privadas 1x1 e busca de contatos' },
      { name: 'Notifications', description: 'Central de notificações e avisos em tempo real' },
      { name: 'Favorites', description: 'Gestão de salas e conversas favoritas' },
      { name: 'Reports', description: 'Denúncias de moderação contra mensagens' },
      { name: 'Feedbacks', description: 'Envio e acompanhamento de feedbacks dos usuários' },
      { name: 'Admin', description: 'Console administrativo e governança do sistema' }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT retornado em /auth/login ou /auth/register'
        },
        AdminAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT de administração retornado em /admin/auth'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            displayName: { type: 'string' },
            profilePhoto: { type: 'string', nullable: true },
            profileDesc: { type: 'string', nullable: true },
            role: { type: 'string', enum: ['user', 'admin'] },
            status: { type: 'string', enum: ['active', 'banned'] },
            public_key: { type: 'string', nullable: true, description: 'Chave pública E2EE do usuário em formato JWK ECDH P-256' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        PublicKeyJwk: {
          type: 'object',
          required: ['kty', 'crv', 'x', 'y'],
          description: 'Chave pública ECDH P-256 serializada em formato JWK',
          properties: {
            kty: { type: 'string', example: 'EC' },
            crv: { type: 'string', example: 'P-256' },
            x: { type: 'string' },
            y: { type: 'string' }
          }
        },
        AttachmentInput: {
          type: 'object',
          description: 'Estrutura de anexo multimídia (áudio, imagem ou documento) em base64 Data URL',
          required: ['url', 'type', 'name'],
          properties: {
            url: { type: 'string', example: 'data:audio/webm;base64,GkXfo59ChoEBQveBAULygQRC...' },
            type: { type: 'string', example: 'audio/webm' },
            name: { type: 'string', example: 'audio-2026-10-19.webm' },
            size: { type: 'integer', example: 1048576 }
          }
        },
        Room: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            type: { type: 'string', enum: ['public', 'private'] },
            description: { type: 'string', nullable: true },
            category: { type: 'string', nullable: true },
            image_url: { type: 'string', nullable: true },
            created_by: { type: 'string', format: 'uuid', nullable: true },
            members_count: { type: 'integer' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        RoomMember: {
          type: 'object',
          properties: {
            room_id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            role: { type: 'string', enum: ['owner', 'moderator', 'user'] },
            joined_at: { type: 'string', format: 'date-time' }
          }
        },
        Message: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            room_id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            content: { type: 'string' },
            image_url: { type: 'string', nullable: true },
            attachment_url: { type: 'string', nullable: true },
            attachment_type: { type: 'string', nullable: true },
            attachment_name: { type: 'string', nullable: true },
            attachment_size: { type: 'integer', nullable: true },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        DirectConversation: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user1_id: { type: 'string', format: 'uuid' },
            user2_id: { type: 'string', format: 'uuid' },
            last_message: { type: 'string', nullable: true },
            last_message_at: { type: 'string', format: 'date-time', nullable: true }
          }
        },
        DirectMessage: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            conversation_id: { type: 'string', format: 'uuid' },
            sender_id: { type: 'string', format: 'uuid' },
            content: { type: 'string' },
            image_url: { type: 'string', nullable: true },
            attachment_url: { type: 'string', nullable: true },
            attachment_type: { type: 'string', nullable: true },
            attachment_name: { type: 'string', nullable: true },
            attachment_size: { type: 'integer', nullable: true },
            read: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Notification: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            type: { type: 'string', enum: ['system', 'message', 'invite', 'reaction', 'info'] },
            title: { type: 'string' },
            content: { type: 'string' },
            link: { type: 'string', nullable: true },
            read: { type: 'boolean' },
            data: { type: 'object', nullable: true },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Favorite: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            item_type: { type: 'string', enum: ['room', 'conversation'] },
            item_id: { type: 'string' },
            title: { type: 'string' },
            content: { type: 'string', nullable: true },
            meta: { type: 'object', nullable: true },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Report: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            message_id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            reason: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'reviewed', 'dismissed'] },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Feedback: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            comment: { type: 'string' },
            images: { type: 'array', items: { type: 'string' } },
            status: { type: 'string', enum: ['pending', 'resolved'] },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Descrição semântica do erro.' }
          }
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
