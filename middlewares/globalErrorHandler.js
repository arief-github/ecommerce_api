export const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err?.statusCode ? err?.statusCode : 500;
    const message = err?.message;

    res.status(statusCode).json({
        statusCode,
        message
    })
}

//  404 Error Handler
export const notFound = (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    next(err);
}
