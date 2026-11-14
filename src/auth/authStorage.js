const TOKEN_KEY = "ems_token";
const USER_KEY = "ems_user";

function getUser() {
  const storedUser = localStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null;
  }

  let user;
  try {
    user = JSON.parse(storedUser);
  } catch (error) {
    if (!(error instanceof SyntaxError)) {
      throw error;
    }

    localStorage.removeItem(USER_KEY);
    return null;
  }

  if (!user || typeof user !== "object" || Array.isArray(user)) {
    localStorage.removeItem(USER_KEY);
    return null;
  }

  return user;
}

export const authStorage = {
  saveToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  getToken: () => localStorage.getItem(TOKEN_KEY),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),
  saveUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  getUser,
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
