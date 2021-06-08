require('dotenv').config();
const axios = require('axios');
const loginHelpers = require('./utils/loginHelpers');

const CoDAPI = () => {
  const session = {
    isLoggedIn: false,
    cookieHeader: '',
  };

  const login = async (username, password) => {
    try {
      const csrf = await loginHelpers.getCSRF();
      session.cookieHeader = await loginHelpers.getAuthCookies(
        username,
        password,
        csrf
      );
      session.isLoggedIn = true;
    } catch (err) {
      session.errorMessage = err;
    }
  };

  const getSessionInfo = () => {
    return session;
  };

  return { login, getSessionInfo };
};

module.exports = CoDAPI;
