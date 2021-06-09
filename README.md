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
import WarzoneAPI from 'warzone-api'

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
<p>Pass in valid login information to this method to gain access to the methods that require authentication</p>

```javascript
api.login('valid activision email', 'valid activision password')
```

<h3>Search Player</h3>
<p>This method can be used to check if a player exists</p>

```javascript
//Available options for the platform argument are battle, psn, or xbl
api.searchPlayer('platform', 'username').then((json) => //do something);
```

<h3>Get Stats</h3>
<p>This method will get all of the specified players stats</p>

```javascript
//Available options for the platform argument are battle, psn, or xbl
api.getStats('platform', 'username').then((json) => //do something);
```

<h3>Get Matches</h3>
<p>This method will get a liist of a players recent matches</p>

```javascript
//Available options for the platform argument are battle, psn, or xbl
api.getMatches('platform', 'username').then((json) => //do something);
```
