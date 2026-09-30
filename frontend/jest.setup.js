import 'whatwg-fetch';
const { TextEncoder, TextDecoder } = require('util');
Object.assign(global, { TextEncoder, TextDecoder });
require('@testing-library/jest-dom');

Element.prototype.scrollTo = jest.fn();
