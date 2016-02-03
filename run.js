import axios from 'axios';
import dotenv from 'dotenv';
import open from 'open';
import qs from 'qs';

dotenv.config();

let apiKey = process.env.api_key;
let baseUrl = 'https://api.digitalriver.com';
let redirectUri = process.env.redirect_uri;
let accessToken = process.env.access_token;

let resFunction = (res) => {
  console.log(res.data);
};

if (!accessToken) {
  axios
    // get limited access token
    .get(baseUrl + '/v1/shoppers/token', {
      params: {
        apiKey: apiKey
      },
      headers: {
        accept: 'application/json'
      }
    })
    // get full access token
    .then((res) => {
      accessToken = res.data.access_token;
      console.log(`Limited access token : ${accessToken}`);
      let authorizeUrl = baseUrl + '/oauth20/authorize?' + qs.stringify({
        redirect_uri: redirectUri,
        client_id: apiKey,
        response_type: 'token',
        dr_limited_token: accessToken
      });
      open(authorizeUrl);
    })
    .catch(resFunction)
} else {
  axios
    .get(baseUrl + '/v1/shoppers/me/orders', {
      headers: {
        Authorization: `bearer ${accessToken}`,
        accept: 'application/json'
      }
    })
    .then(resFunction)
    .catch(resFunction);
}
