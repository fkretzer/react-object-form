var JSDOM = require('jsdom').JSDOM;


var Enzyme = require('enzyme');
var Adapter = require('enzyme-adapter-react-15');

Enzyme.configure({ adapter: new Adapter() });

global.document = new JSDOM('<!doctype html><html><body></body></html>').window.document;
global.window = document.defaultView;
global.navigator = {userAgent: 'node.js'};