// the wrap function that catch the error in a function
const wrapAsync = (fn) => {
    return function (req, res, next) {
        //  catch error in function and return the next()
        fn(req, res, next).catch(e => next(e))
    }
}

module.exports = wrapAsync;