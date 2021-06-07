require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');

const getCSRF = async () => {
  return (await axios('https://s.activision.com/activision/login')).headers[
    'set-cookie'
  ][0]
    .split('=')[1]
    .split(';')[0];
};

const getAuthTokens = async (username, password, csrf) => {
  const body = new FormData();
  body.append('username', username);
  body.append('password', password);
  body.append('remember_me', 'true');
  body.append('_csrf', csrf);

  const response = await axios.post(
    'https://s.activision.com/do_login?new_SiteId=activision',
    body,
    {
      headers: {
        Cookie: `XSRF-TOKEN=${csrf}; new_SiteId=activision;`,
        ...body.getHeaders(),
      },
    }
  );

  return response;
};

const CoDAPI = async (username, password) => {
  const csrf = await getCSRF();
  const authTokens = await getAuthTokens(username, password, csrf);
};

module.exports = CoDAPI;
