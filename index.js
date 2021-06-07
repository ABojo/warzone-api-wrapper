require('dotenv').config();
const axios = require('axios');

const CoDAPI = async (email, password) => {
  const auth = async () => {
    const headers = (await axios('https://s.activision.com/activision/login'))
      .headers['set-cookie'];
  };
};
