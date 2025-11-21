// Test file to demonstrate ESLint + Prettier + Husky integration
// This file intentionally has issues that will be auto-fixed

export const testFunction = () => {
  // This console.log will trigger a warning
  console.log("This will show a warning");

  // This will be auto-fixed by ESLint
  const unchangedVariable = "test";

  // This will be formatted by Prettier
  const obj = { a: 1, b: 2, c: 3 };

  // Any type will trigger a warning
  const data: any = { test: "value" };

  return {
    unchangedVariable,
    obj,
    data,
  };
};

// Missing semicolons will be added by Prettier
const example = "test";

// Inconsistent spacing will be fixed
function demo() {
  return "formatted";
}

export { demo };
