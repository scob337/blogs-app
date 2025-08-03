// Utility function for making authenticated fetch requests
export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const defaultOptions: RequestInit = {
    credentials: 'include', // Always include credentials
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  return fetch(url, defaultOptions);
};

// Utility function for making authenticated POST requests
export const authenticatedPost = async (url: string, data: any, options: RequestInit = {}) => {
  return authenticatedFetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });
};

// Utility function for making authenticated GET requests
export const authenticatedGet = async (url: string, options: RequestInit = {}) => {
  return authenticatedFetch(url, {
    method: 'GET',
    ...options,
  });
};

// Utility function for making authenticated PUT requests
export const authenticatedPut = async (url: string, data: any, options: RequestInit = {}) => {
  return authenticatedFetch(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  });
};

// Utility function for making authenticated DELETE requests
export const authenticatedDelete = async (url: string, options: RequestInit = {}) => {
  return authenticatedFetch(url, {
    method: 'DELETE',
    ...options,
  });
}; 