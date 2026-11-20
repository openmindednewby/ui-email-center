import '@testing-library/jest-dom';

jest.mock('react-native-web', () => ({
  ...jest.requireActual<Record<string, unknown>>('react-native-web'),
  codegenNativeComponent: () => 'View',
}));
