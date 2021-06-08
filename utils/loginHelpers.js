const axios = require('axios');
const FormData = require('form-data');

const extractCookie = (string) => {
  return string.split('=')[1].split(';')[0];
};

exports.getCSRF = async () => {
  return extractCookie(
    (await axios('https://s.activision.com/activision/login')).headers[
      'set-cookie'
    ][0]
  );
};

exports.getAuthCookies = async (username, password, csrf) => {
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
