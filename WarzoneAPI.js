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

const requireLogin = function (cb) {
  return function (platform, username) {
    if (this.session.isLoggedIn === true) {
      return cb.call(this, platform, username);
    } else {
      throw new Error(
        'You must call the .login() method with a valid activision email/password before making this request!'
      );
    }
  };
};

const prototype = {
  login: async function (username, password) {
    try {
      const csrf = await getCSRF();
      this.session.headers.Cookie = await getAuthCookies(
        username,
        password,
        csrf
      );
      this.session.isLoggedIn = true;
    } catch (err) {
      this.session.errorMessage = err;
    }
  },

  getSessionInfo: function () {
    return this.session;
  },

  searchPlayer: requireLogin(async function (platform, username) {
    const response = await axios(
      `https://my.callofduty.com/api/papi-client/crm/cod/v2/platform/${platform}/username/${username}/search`,
      { headers: this.session.headers }
    );

    return response.data;
  }),

  getStats: requireLogin(async function (platform, username) {
    const response = await axios(
      `https://my.callofduty.com/api/papi-client/stats/cod/v1/title/mw/platform/${platform}/gamer/${username}/profile/type/wz
    `,
      { headers: this.session.headers }
    );
    return response.data;
  }),

  getMatches: requireLogin(async function (platform, username) {
    const response = await axios(
      `https://my.callofduty.com/api/papi-client/crm/cod/v2/title/mw/platform/${platform}/gamer/${username}/matches/wz/start/0/end/0/details`,
      { headers: this.session.headers }
    );

    return response.data;
  }),

  getMatchDetails: async function (id) {
    const response =
      await axios(`https://www.callofduty.com/api/papi-client/crm/cod/v2/title/mw/platform/battle/fullMatch/wz/${id}/it
    `);

    return response.data;
  },
};

const WarzoneAPI = () => {
  return Object.assign(Object.create(prototype), {
    session: {
      isLoggedIn: false,
      headers: {
        Cookie: '',
      },
    },
  });
};

module.exports = WarzoneAPI;
