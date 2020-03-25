const dotenv = require('dotenv');
const fs = require('fs');

const filePath = './development.env';

config = dotenv.parse(fs.readFileSync(filePath));

process.env = { ...process.env, ...config };

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};
