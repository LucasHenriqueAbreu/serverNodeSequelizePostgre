import express from 'express';

import userRoutes from './user.route';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

// monta as rotas do usuário em /users
router.use('/users', userRoutes);



export default router;
