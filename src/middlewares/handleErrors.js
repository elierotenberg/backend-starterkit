import statuses from 'statuses';

const INTERNAL_SERVER_ERROR = 'Internal Server Error';
const INTERNAL_SERVER_ERROR_CODE = statuses(INTERNAL_SERVER_ERROR);

export default function handleErrors() {
  return function* _handleErrors(next) {
    const { verbosity: { logErrors }, security: { hideErrors, hideStackTrace } } = this.app.context.config;
    try {
      yield next;
    }
    catch(err) {
      // Expected error
      if(err.status && err.status !== statuses(INTERNAL_SERVER_ERROR)) {
        this.status = err.status;
        this.body = {
          status: err.status,
          message: err.message,
        };
      }
      // Unexpected error
      else {
        this.status = INTERNAL_SERVER_ERROR_CODE;
        this.body = {
          status: INTERNAL_SERVER_ERROR_CODE,
          message: hideErrors ? INTERNAL_SERVER_ERROR : err.message,
          stack: (hideStackTrace || !err.stack) ? null : err.stack,
        };
      }
      if(logErrors) {
        console.error(err);
      }
    }
  };
}
