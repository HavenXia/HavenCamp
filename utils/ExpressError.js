// Self-defined error class like AppError in Notes
class ExpressError extends Error {
    // extends class with super
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

// exports the class
module.exports = ExpressError;