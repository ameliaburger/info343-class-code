// set exports.config equal to an object like the selenium address you should be using
exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['*-spec.js'],
    rootElement: 'body' // optional - used to find ng-app on whatever element name you put here
    // can use an element selector like here or a css selector
    // rootElement defaults to body
};
