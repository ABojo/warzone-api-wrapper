require('dotenv').config();
const axios = require('axios');
const loginHelpers = require('./utils/loginHelpers');

const CoDAPI = () => {
  const session = {
    isLoggedIn: false,
    headers: {
      Cookie: '',
    },
  };

  const requireLogin = (cb) => {
    return function (platform, username) {
      if (session.isLoggedIn === true) {
        return cb(platform, username);
      } else {
        throw new Error(
          'You must call the .login() method with a valid activision email/password before making this request!'
        );
      }
    };
  };

  const login = async (username, password) => {
    try {
      const csrf = await loginHelpers.getCSRF();
      session.headers.Cookie = await loginHelpers.getAuthCookies(
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

  const searchPlayer = requireLogin(async (platform, username) => {
    const response = await axios(
      `https://my.callofduty.com/api/papi-client/crm/cod/v2/platform/${platform}/username/${username}/search`,
      { headers: session.headers }
    );

    return response.data;
  });

  const getStats = requireLogin(async (platform, username) => {
    const response = await axios(
      `https://my.callofduty.com/api/papi-client/stats/cod/v1/title/mw/platform/${platform}/gamer/${username}/profile/type/wz
    `,
      { headers: session.headers }
    );
    return response.data;
  });

  const getMatches = requireLogin(async (platform, username) => {
    const response = await axios(
      `https://my.callofduty.com/api/papi-client/crm/cod/v2/title/mw/platform/${platform}/gamer/${username}/matches/wz/start/0/end/0/details`,
      { headers: session.headers }
    );

    return response.data;
  });

  const getMatchDetails = async (id) => {
    const response =
      await axios(`https://www.callofduty.com/api/papi-client/crm/cod/v2/title/mw/platform/battle/fullMatch/wz/${id}/it
    `);

    return response.data;
  };

  return {
    login,
    getSessionInfo,
    searchPlayer,
    getStats,
    getMatches,
    getMatchDetails,
  };
};

module.exports = CoDAPI;
