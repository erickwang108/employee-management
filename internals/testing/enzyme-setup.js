const jsdom = require('jsdom');
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

const jsdomInstance = new jsdom.JSDOM();

global.window = jsdomInstance.window;
global.navigator = jsdomInstance.window.navigator;
global.document = jsdomInstance.window.document;

enzyme.configure({ adapter: new Adapter() });
