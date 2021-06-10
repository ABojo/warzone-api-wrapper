# WarzoneAPI
A JS wrapper for the CoD Warzone API


<h1>Installation</h1>

```
npm install warzone-api
```

<h1>How to use</h1>

<ol>
  <li>Create an instance</li>  
  <li>Call the login method with valid activision login information</li>  
  <li>Make requests for whatever data you'd like</li>  
</ol>

```javascript
const WarzoneAPI = require('warzone-api')

const api = WarzoneAPI();

//Using async await 
const getPlayerStats = async (platform, username) => {
  await api.login('valid activision email', 'valid activision password');
  const response = await api.getStats(platform, username);
  
  return response;
}

//Promise chaining
api.login('valid activision email', 'valid activision password')
.then(() => {
  return api.getStats('psn', 'Bojo704')
}).then((response) => {
  console.log(response)
});
```

<h1>Methods</h1>

<h3>Login</h3>
<img src='https://img.shields.io/badge/No%20Auth%20Needed-%3CCOLOR%3E.svg'>
<p>Pass in valid login information to this method to gain access to the methods that require authentication</p>

```javascript
api.login('valid activision email', 'valid activision password').then(() => //do something);
```

<h3>Get Match Details</h3>
<img src='https://img.shields.io/badge/No%20Auth%20Needed-%3CCOLOR%3E.svg'>
<p>This method will return a json object containing all details about the requested match</p>

```javascript
api.getMatchDetails('match id').then((json) => //do something);
```

<h3>Search Player</h3>
<img src='https://img.shields.io/badge/Auth%20Required-red.svg'>
<p>This method will return a json object containing details about whether the requested players exists</p>

```javascript
//Available options for the platform argument are battle, psn, or xbl
api.searchPlayer('platform', 'username').then((json) => //do something);
```

<h3>Get Stats</h3>
<img src='https://img.shields.io/badge/Auth%20Required-red.svg'>
<p>This method will return a json object containing the requested players stats</p>

```javascript
//Available options for the platform argument are battle, psn, or xbl
api.getStats('platform', 'username').then((json) => //do something);
```

<h3>Get Matches</h3>
<img src='https://img.shields.io/badge/Auth%20Required-red.svg'>
<p>This method will return a json object containing the requested players recent matches</p>

```javascript
//Available options for the platform argument are battle, psn, or xbl
api.getMatches('platform', 'username').then((json) => //do something);
```

