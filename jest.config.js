const { createJestConfig } = require('tsdx/dist/createJestConfig');
const { paths } = require('tsdx/dist/constants');

process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';

const tsdxJestConfig = createJestConfig(undefined, paths.appRoot);

module.exports = {
  ...tsdxJestConfig,
  setupFilesAfterEnv: ['./jest.setup.ts'],
};
