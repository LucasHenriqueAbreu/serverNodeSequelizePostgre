import httpStatus from 'http-status';
import db from '../../config/sequelize';

const User = db.User;

/**
 * Classe responsável pelas operações relacionadas ao usuário.
 */
class UserController {

    /**
     * Carregar usuário e anexa na req.
     */
    async load(req, res, next, id) {
        try {
            const userFoundResponse = await User.findById(id);
            if (!userFoundResponse) {
                const e = new Error('User does not exist');
                e.status = httpStatus.NOT_FOUND;
                return next(e);
            }
            req.user = userFoundResponse; // eslint-disable-line no-param-reassign
            return next();
        } catch (error) {
            return next(error);
        }
    }

    /**
     * Busca o usário
     * @returns {User}
     */
    get(req, res) {
        return res.json(req.user);
    }

    /**
     * Cria um novo usuário.
     * @property {string} req.body.username - O username do usuário.
     * @property {string} req.body.mobileNumber - O mobileNumber do usuário.
     * @returns {User}
     */
    create(req, res, next) {
        const user = User.build({
            username: req.body.username,
        });

        user
            .save()
            .then(savedUser => res.json(savedUser))
            .catch(e => next(e));
    }

    /**
     * Atualiza um usuário já existente
     * @property {string} req.body.username - O nome de usuário do usuário.
     * @property {string} req.body.mobileNumber - O número de telefone do usuário.
     * @returns {User}
     */
    update(req, res, next) {
        const user = req.user;
        user.username = req.body.username;
        user.mobileNumber = req.body.mobileNumber;

        user
            .save()
            .then(savedUser => res.json(savedUser))
            .catch(e => next(e));
    }

    /**
     * Busca uma lista de usuários.
     * @property {number} req.query.skip - Número de usuários a serem ignorados.
     * @property {number} req.query.limit - Número limite de usuários a serem retornados.
     * @returns {User[]}
     */
    list(req, res, next) {
        const { limit = 50 } = req.query;
        User.findAll({ limit })
            .then(users => res.json(users))
            .catch(e => next(e));
    }

    /**
     * Deleta um usuário.
     * @returns {User}
     */
    remove(req, res, next) {
        const user = req.user;
        const username = req.user.username;
        user
            .destroy()
            .then(() => res.json(username))
            .catch(e => next(e));
    }
}

export default new UserController();
