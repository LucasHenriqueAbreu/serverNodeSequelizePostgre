/**
 * Módulo de validação dos parametros das rotas, aqui devem ser criatos as validações 
 * de acordo com os parâmetros que devemos receber.
 */

import Joi from 'joi';

export default {
    // POST /api/users
    createUser: {
        body: {
            username: Joi.string().required()
        },
    },

    // UPDATE /api/users/:userId
    updateUser: {
        body: {
            username: Joi.string().required(),
        },
        params: {
            userId: Joi.string().hex().required(),
        },
    },

    // POST /api/auth/login
    login: {
        body: {
            username: Joi.string().required(),
            password: Joi.string().required(),
        },
    },
};
