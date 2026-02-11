import type { Config } from 'jest';
import nextJest from 'next/jest.js';
import * as util from 'util';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
    pretendToBeVisual: true,
    customExportConditions: ['node', 'node-addons', 'browser', 'default'],
    resources: 'usable',
    runScripts: 'dangerously',
    html: '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body></body></html>',
  },
  setupFiles: ['<rootDir>/setupGlobals.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  preset: 'ts-jest',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^/meds_master.json$': '<rootDir>/__mocks__/meds_master.json',
    '^lucide-react$': '<rootDir>/__mocks__/lucide-react.tsx',
    '^node-fetch$': '<rootDir>/__mocks__/fetch.ts',
    '^(.*)next/dist/compiled/web-streams/fetch$': '<rootDir>/__mocks__/fetch.ts',
  },
  // Add more setup options before each test is run
  // setupFiles: ['<rootDir>/jest.setup.js'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
