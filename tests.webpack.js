const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.use(chaiAsPromised);

// Configure Enzyme for React 16:
Enzyme.configure({ adapter: new Adapter() });

const context = require.context('./test', true, /\.spec\.js$/);
context.keys().forEach(context);
