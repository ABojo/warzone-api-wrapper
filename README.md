# WarzoneAPI
A JS wrapper for the CoD Warzone API


<h1>Installation</h1>

```
npm install warzone-api
```

<h1>How to use</h1>

To access data from the Warzone API you must first login with a valid activision email and password to get the required session tokens. 
After a successful login you will then be authorized to make requests to the Warzone API.

```javascript
import WarzoneAPI from 'warzone-api'

const api = WarzoneAPI();

//Using async await 
const getPlayerStats = async (platform, username) => {
  await api.login('valid activision email', 'valid activision password');
  const response = await api.getStats(platform, username);
  
  return response;
}

//Chaining promises
api.login('valid activision email', 'valid activision password').then(() => {
  return api.getStats('psn', 'Bojo704')
}).then((response) => {
  console.log(response)
});
```

