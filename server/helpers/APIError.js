import httpStatus from 'http-status';

/**
 * @extends Error
 */
class ExtendableError extends Error {
    constructor(message, status, isPublic) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        this.status = status;
        this.isPublic = isPublic;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor.name);
    }
}

/**
 * Classe que reprenta um erro da API.
 * @extends ExtendableError
 */
class APIError extends ExtendableError {
    /**
     * Cria um erro da API.
     * @param {string} message - Mensagem de erro.
     * @param {number} status - código de status do erro HTTP.
     * @param {boolean} isPublic - Se a mensagem deve estar visível para o usuário ou não.
     */
    constructor(message, status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = false) {
        super(message, status, isPublic);
    }
}

export default APIError;
