const jwt = require('jsonwebtoken')

const logger = require('./logger')

const requestLogger = (req, res, next) => {
    logger.info('Method:', req.method)
    logger.info('Path:  ', req.path)
    logger.info('Body:  ', req.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'})
}

const errorHandler = (error, req, res, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({error: error.message})
    } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({error: 'Invalid token'})
    }

    next(error)
}

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    let token = null

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        token = authorization.substring(7)
    }

    req.token = token

    next()
}

const userExtractor = (req, res, next) => {
    const token = req.token
    req.user = null

    if (!token) {
        return res.status(401).json({
            error: 'Token is missing or invalid'
        })
    }

    let decodedToken

    try {
        decodedToken = jwt.verify(token, process.env.SECRET)
    } catch (e) {
        return res.status(401).json({
            error: 'Token is missing or invalid'
        })
    }

    if (!decodedToken.id) {
        return res.status(401).json({
            error: 'Token is missing or invalid'
        })
    }

    req.user = decodedToken.id

    next()
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor,
}
