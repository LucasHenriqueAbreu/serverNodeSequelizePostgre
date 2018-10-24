import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import httpStatus from 'http-status';
import expressWinston from 'express-winston';
import expressValidation from 'express-validation';
import helmet from 'helmet';
import winstonInstance from './winston';
import routes from '../server/routes/index.route';
import config from './config';
import APIError from '../server/helpers/APIError';

const app = express();

if (config.env === 'development') {
    app.use(logger('dev'));
}

// Parse parametros do body e adiciona a req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// app seguro, definindo vários cabeçalhos HTTP
app.use(helmet());

// CORS - Cross Origin Resource Sharing
app.use(cors());

// ativar o log detalhado da API no modo dev.
if (config.env === 'development') {
    expressWinston.requestWhitelist.push('body');
    expressWinston.responseWhitelist.push('body');
    app.use(expressWinston.logger({
        winstonInstance,
        meta: true, // optional: log meta data about request (defaults to true)
        msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
        colorStatus: true, // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
    }));
}

// monta todas as rotas no path /api
app.use('/api', routes);

// Se o erro não for uma instância de APIError, converte para.
app.use((err, req, res, next) => {
    if (err instanceof expressValidation.ValidationError) {
        const unifiedErrorMessage = err.errors
            .map(error => error.messages.join('. '))
            .join(' and ');
        const error = new APIError(unifiedErrorMessage, err.status, true);
        return next(error);
    } else if (!(err instanceof APIError)) {
        const apiError = new APIError(err.message, err.status, err.isPublic);
        return next(apiError);
    }
    return next(err);
});

// pega 404 e encaminhar para manipulador de erro
app.use((req, res, next) => {
    const err = new APIError('API not found', httpStatus.NOT_FOUND);
    return next(err);
});

// erro de log nos transportes winston, exceto ao executar o conjunto de testes
if (config.env !== 'test') {
    app.use(expressWinston.errorLogger({
        winstonInstance,
    }));
}

// manipulador de erros, envie o stacktrace apenas durante o desenvolvimento
app.use((
    err,
    req,
    res,
    next,
) =>
    res.status(err.status).json({
        message: err.isPublic ? err.message : httpStatus[err.status],
        stack: config.env === 'development' ? err.stack : {},
    }));

export default app;
