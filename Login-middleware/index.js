const VALID_STACKS = ['frontend'];
const VALID_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];
const VALID_PACKAGES = [
  'api', 'component', 'hook', 'page', 'state', 'style',
  'auth', 'config', 'middleware', 'utils'
];

const LOGGING_API = '/api/logs'; 
const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;

/**
 * Logs structured application events to a backend logger
 * @param {string} stack - 'frontend'
 * @param {string} level - 'debug' | 'info' | 'warn' | 'error' | 'fatal'
 * @param {string} pkg - Component or feature module (e.g., 'component')
 * @param {string} message - The event description
 */
const log = async (stack, level, pkg, message) => {
  try {
    if (
      !VALID_STACKS.includes(stack) ||
      !VALID_LEVELS.includes(level) ||
      !VALID_PACKAGES.includes(pkg)
    ) {
      return; 
    }

    const body = {
      stack: stack.trim().toLowerCase(),
      level: level.trim().toLowerCase(),
      package: pkg.trim().toLowerCase(),
      message: message.trim(),
    };

    await fetch(LOGGING_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify(body)
    });
  } catch (_) { }
};
export default log;
