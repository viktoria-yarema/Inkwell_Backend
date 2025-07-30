// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err, req, res, _next) => {
    console.error(err.stack);
    const status = err.status || 500;
    res.status(status).send({
        status: 'error',
        message: err.message,
    });
};
export default errorHandler;
//# sourceMappingURL=error.js.map