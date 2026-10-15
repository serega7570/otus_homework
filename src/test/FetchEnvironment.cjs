const { TestEnvironment } = require('jest-environment-jsdom');

// Use Node's real Fetch API while rendering React in jsdom. No network calls
// are made by tests: they replace fetch, retaining real Request/Response objects.
module.exports = class FetchEnvironment extends TestEnvironment {
  constructor(config, context) {
    super(config, context);
    Object.assign(this.global, {
      Request, Response, Headers, fetch, AbortController, AbortSignal, DOMException,
    });
  }
};
