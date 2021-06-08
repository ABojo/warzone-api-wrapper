const CoDAPI = require('./CoDAPI');

const login = async () => {
  const { ACTI_EMAIL, ACTI_PASSWORD } = process.env;
  const APIInstance = CoDAPI();
  await APIInstance.login(ACTI_EMAIL, ACTI_PASSWORD);
  console.log(APIInstance.getSessionInfo());
};

login();
