'use strict';
// Hermes throws ReferenceError for undeclared globals even with optional chaining.
// expo HMR code uses `document?.currentScript` which fails when `document` is
// completely undeclared. Assigning undefined makes it a defined global so ?. works.
if (typeof global.document === 'undefined') {
  global.document = undefined;
}
if (typeof global.location === 'undefined') {
  global.location = undefined;
}
