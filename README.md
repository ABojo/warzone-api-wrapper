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
<p>A list of methods available on instances of the WarzoneAPI() function</p>

<h2>Login</h2>
<p><b>This method must be called before you request any data!</b> Session tokens will be returned and stored on the instance to authenticate future requests</p>

```javascript
api.login('valid activision email', 'valid activision password')
```




