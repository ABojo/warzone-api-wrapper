const CoDAPI = require('./CoDAPI');

const login = async () => {
  const { ACTI_EMAIL, ACTI_PASSWORD } = process.env;
  const APIInstance = CoDAPI();
  await APIInstance.login(ACTI_EMAIL, ACTI_PASSWORD);
  const data = await APIInstance.searchPlayer('psn', 'Stilly_slays');
  console.log(data);
};

login();
