var JSDOM = require('jsdom').JSDOM;

global.document = new JSDOM('<!doctype html><html><body></body></html>').window.document;
global.window = document.defaultView;
global.navigator = {userAgent: 'node.js'};