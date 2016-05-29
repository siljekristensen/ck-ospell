"use strict";

/**
 * Check Query Params
 *
 * @param {string} paramName
 * @param {{status: number, message: string}} error
 * @param {string} [value]
 * @return {express.RequestHandler}
 */
module.exports.checkQueryParams = function checkQueryParams(paramName, error, value) {
  return (req) => {
    const param = req.query[paramName];
    const valid = value ? param === value : param;

    if (valid) {
      return null;
    }
    return error;
  };
}

module.exports.asMiddleware = function asMiddleware(fn) {
  return (req, res, next) => {
    const error = fn(req);
    if (error) {
      return next(error);
    }
    return next(null);
  };
}

/**
 * Match Command
 *
 * @param {string} cmd
 * @param {express.RequestHandler} fn
 * @return {express.RequestHandler}
 */
module.exports.matchCommand = function matchCommand(cmd, fn) {
  return (req, res, next) => {
    if (req.query.cmd === cmd) {
      return fn(req, res, next);
    }
    return next(null);
  };
}

/**
 * Error Handler
 *
 * @param {Error} err
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.RequestHandler} next
 */
module.exports.errorHandler = function errorHandler(err, req, res, next) {
  var status = err.status || err.statusCode || 500;
  if (status < 400) {
    status = 500
  }

  res.status(status);

  var body = {
    status: status,
  };

  if (process.env.NODE_ENV !== 'production') {
    body.stack = err.stack;
  }

  // internal server errors
  if (status >= 500) {
    process.stderr.write(JSON.stringify(err.stack, null, 2));
    res.json(body);
    return;
  }

  // client errors
  body.message = err.message;
  body.code = err.code;
  body.name = err.name;
  body.type = err.type;

  res.json(body);
}
