const DEFAULT_RETURN_PATH = '/';
const AUTH_PATHS = ['/sign-in', '/create-account'];

const safeReturnPath = path => {
  if (!path || path.charAt(0) !== '/' || path.indexOf('//') === 0 || AUTH_PATHS.indexOf(path.split('?')[0]) !== -1) {
    return DEFAULT_RETURN_PATH;
  }
  return path;
};

export const createAuthLocation = (pathname, currentLocation) => {
  const currentPath = currentLocation
    ? `${currentLocation.pathname || '/'}${currentLocation.search || ''}`
    : DEFAULT_RETURN_PATH;
  return {
    pathname,
    state: { returnTo: safeReturnPath(currentPath) },
  };
};

export const getReturnPath = location => safeReturnPath(
  location && location.state ? location.state.returnTo : DEFAULT_RETURN_PATH
);
