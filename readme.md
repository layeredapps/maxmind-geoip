# Documentation for Maxmind GeoIP module

#### Shortcuts

- [Documentation website](https://layeredapps.github.io)
- [Module documentation](https://layeredapps.github.io/maxmind-geoip-module)
- [API documentation](https://layeredapps.github.io/maxmind-geoip-api)

#### Index

- [Introduction](#introduction)
- [Import this module](#import-this-module)
- [Provided server, content and proxy handlers](#provided-server-content-and-proxy-handlers)
- [Access the API](#access-the-api)
- [Github repository](https://github.com/layeredapps/maxmind-geoip)
- [NPM package](https://npmjs.org/layeredapps/maxmind-geoip)

# Introduction

Dashboard bundles everything a web app needs, all the "boilerplate" like signing in and changing passwords, into a parallel server so you can write a much smaller web app.

[MaxMind](https://www.maxmind.com/en/home) provide a database that converts IP addresses to countries and this module adds API routes for identifying the country by IP and a server handler that will automatically attach a Country object to each HttpRequest using their database.  There is much more data in the MaxMind database than is exposed via the API, pull requests are welcome to add more routes to access it. 

## Import this module

Install the module with NPM:

    $ npm install @layeredapps/maxmind-geoip

Edit your `package.json` to activate the module:

    "dashboard": {
      "modules": [
        "@layeredapps/maxmind-geoip"
      ]
    }

# Provided server, content and proxy handlers

This module comes with some convenience scripts you can add to your `package.json`:

| Type     | Script path                                            | Description                                               |
|----------|--------------------------------------------------------|-----------------------------------------------------------|
| proxy    | @layeredapps/maxmind-geoip/src/proxy/x-country.js      | Include the Maxmind Country object in `x-country` header  |
| server   | @layeredapps/maxmind-geoip/src/server/bind-country.js  | The MaxMind Country object will be bound to `req.country` |

## Access the API

Dashboard and official modules are completely API-driven and you can access the same APIs on behalf of the user making requests.  You perform `GET`, `POST`, `PATCH`, and `DELETE` HTTP requests against the API endpoints to fetch or modify data.  This example fetches the user's country information using NodeJS, you can do this with any language:

    const country = await proxy(`/api/user/geoip/country?ip=1.2.3.4`, accountid, sessionid)

    const proxy = util.promisify((path, accountid, sessionid, callback) => {
        const requestOptions = {
            host: 'dashboard.example.com',
            path: path,
            port: '443',
            method: 'GET',
            headers: {
                'x-application-server': 'application.example.com',
                'x-application-server-token': process.env.APPLICATION_SERVER_TOKEN
            }
        }
        if (accountid) {
            requestOptions.headers['x-accountid'] = accountid
            requestOptions.headers['x-sessionid'] = sessionid
        }
        const proxyRequest = require('https').request(requestOptions, (proxyResponse) => {
            let body = ''
            proxyResponse.on('data', (chunk) => {
                body += chunk
            })
            return proxyResponse.on('end', () => {
                return callback(null, JSON.parse(body))
            })
        })
        proxyRequest.on('error', (error) => {
            return callback(error)
        })
        return proxyRequest.end()
      })
    }


