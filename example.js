const CoDAPI = require('./CoDAPI');

const login = async () => {
  const { ACTI_EMAIL, ACTI_PASSWORD } = process.env;
  const APIInstance = await CoDAPI(ACTI_EMAIL, ACTI_PASSWORD);
};

login();
