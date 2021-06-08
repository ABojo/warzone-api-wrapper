const axios = require('axios');
const FormData = require('form-data');

const extractCookie = (string) => {
  return string.split('=')[1].split(';')[0];
};

const getCSRF = async () => {
  return extractCookie(
    (await axios('https://s.activision.com/activision/login')).headers[
      'set-cookie'
    ][0]
  );
};

const getAuthCookies = async (username, password, csrf) => {
  const body = new FormData();
  body.append('username', username);
  body.append('password', password);
  body.append('remember_me', 'true');
  body.append('_csrf', csrf);

  const response = await axios.post(
    'https://s.activision.com/do_login?new_SiteId=cod',
    body,
    {
      headers: {
        Cookie: `XSRF-TOKEN=${csrf}; new_SiteId=cod;`,
        ...body.getHeaders(),
      },
      maxRedirects: 0,
      validateStatus: function (status) {
        return status === 302;
      },
    }
  );

  const cookies = response.headers['set-cookie'];
  const actSSOCookie = extractCookie(cookies[1]);
  const expiration = extractCookie(cookies[2]);
  const atkn = extractCookie(cookies[1]);

  return `ACT_SSO_COOKIE=${actSSOCookie}; ACT_SSO_COOKIE_EXPIRY=${expiration}; atkn=${atkn};`;
};

const WarzoneAPI = () => {
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
      const csrf = await getCSRF();
      session.headers.Cookie = await getAuthCookies(username, password, csrf);
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

module.exports = WarzoneAPI;
