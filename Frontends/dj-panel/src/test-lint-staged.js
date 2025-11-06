// This is a test file for lint-staged
const test = 'single quotes now';
const longLine =
  'This is a very long line that should be broken up according to prettier rules';

function properlyFormatted() {
  return test + longLine;
}

export default properlyFormatted;
