import "@testing-library/jest-dom";

const originalWarn = console.warn;

beforeAll(() => {
  jest.spyOn(console, "warn").mockImplementation((message, ...rest) => {
    if (String(message).includes("React Router Future Flag")) return;
    originalWarn(message, ...rest);
  });
});
