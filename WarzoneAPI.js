const axios = require('axios');
const FormData = require('form-data');

//extracts the value from the passed in cookie
const extractCookie = (string) => {
  return string.split('=')[1].split(';')[0];
};

//makes requests for the csrf token thats required to login
const getCSRF = async () => {
  const response = await axios('https://s.activision.com/activision/login');
  const csrfHeader = response.headers['set-cookie'][0];
  const csrfToken = extractCookie(csrfHeader);

  return csrfToken;
};

//posts a login request + returns required cookie header for making requests
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

  if (cookies[0].includes('LOGIN_FAILURE'))
    throw new Error('Sorry you entered invalid login information!');

  const actSSOCookie = extractCookie(cookies[1]);
  const expiration = extractCookie(cookies[2]);
  const atkn = extractCookie(cookies[1]);

  return `ACT_SSO_COOKIE=${actSSOCookie}; ACT_SSO_COOKIE_EXPIRY=${expiration}; atkn=${atkn};`;
};

//wraps methods that require auth cookies so methods that require it cant be used
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

//the prototype object that contains the methods that each instance of the API will call
const prototype = {
  login: async function (username, password) {
    const csrf = await getCSRF();
    this.session.headers.Cookie = await getAuthCookies(
      username,
      password,
      csrf
    );
    this.session.isLoggedIn = true;
  },

  searchPlayer: requireLogin(async function (platform, username) {
    const response = await axios(
      `https://my.callofduty.com/api/papi-client/crm/cod/v2/platform/${platform}/username/${encodeURIComponent(
        username
      )}/search`,
      { headers: this.session.headers }
    );

    return response.data;
  }),

  getStats: requireLogin(async function (platform, username) {
    const response = await axios(
      `https://my.callofduty.com/api/papi-client/stats/cod/v1/title/mw/platform/${platform}/gamer/${encodeURIComponent(
        username
      )}/profile/type/wz
    `,
      { headers: this.session.headers }
    );
    return response.data;
  }),

  getMatches: requireLogin(async function (platform, username) {
    const response = await axios(
      `https://my.callofduty.com/api/papi-client/crm/cod/v2/title/mw/platform/${platform}/gamer/${encodeURIComponent(
        username
      )}/matches/wz/start/0/end/0/details`,
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

//returns the API object with the correct prototype + properties that contain details about its auth status
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
