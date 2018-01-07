'use strict'

function httpError(status, defaultMessage) {
  return function(message) {
    this.status = status;
    this.message = message || defaultMessage;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  NotFound: httpError(404, 'Not found'),
  InternalError: httpError(500, 'Bad request'),
  Bad: httpError(200, 'OK'),
  Validation: httpError(200, 'Validation fails')
}
