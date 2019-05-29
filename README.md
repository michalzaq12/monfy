# __ monfy

[![npm version](https://badge.fury.io/js/monfy.svg)](https://badge.fury.io/js/monfy)
[![Build Status](https://travis-ci.org/michalzaq12/monfy.svg?branch=master)](https://travis-ci.org/michalzaq12/monfy)
[![Coverage Status](https://coveralls.io/repos/github/michalzaq12/monfy/badge.svg)](https://coveralls.io/github/michalzaq12/monfy)
[![Dependency Status](https://david-dm.org/michalzaq12/monfy.svg)](https://david-dm.org/michalzaq12/monfy)

> Multi configurations for different deployment environments 
(development, qa, staging, production, etc.) in simple object.


## Installation

```bash
npm install --save-dev monfy
```


## Quick Start

Base monfy tag: `__{suffix}`

Negation tag: `__{suffix}$`

```javascript
const monfy = require('monfy');
//OR
const {monfy, monfyToArray} = require('monfy');
    
    
let baseConfig = {
    a: 20,
    a__dev: 50
};
    
    
let config = monfy(baseConfig, 'dev');
console.log(config);
//output -> {a: 50}
    
let config2 = monfy(baseConfig);
console.log(config2);
//output -> {a: 20}
```


## API

### monfy(config, [suffix])

Return new `object|array` which override base config.
(It keeps references to base config nested object whenever it`s possible)

#### config

Type: `object|array`

Object with config

#### suffix

Type: `string`

Name of suffix which distinguishes different configurations


### monfyToArray(config, [suffix])

Similar to `monfy`; returns array from object values (without keys)



## monfy tags

- **with key suffix**

    Example:
    ```javascript
      {
          propertyA: 20,
          propertyA__dev: 50
      }
    ```
    Override `propertyA` to `50` if `monfy` called with suffix eq `dev`
        
        
- **with key suffix with negation operator `$`**

    Example:
    ```javascript
      {
          propertyB__dev$: true
      }
    ```   
    Only set `propertyB` to `true` to  if `monfy` called with suffix not eq `dev`
    
    or override `propertyB` if already exists
    
- **as key in nested object** 

    Example:
    ```javascript
      {
          loaders: [{
            name: 'loader1'
          },
          {  
            __: 'dev',
            name: 'loader2'
          }]
      }
    ``` 
    
    Keep object `{name: 'loader2'}` in array only when suffix eq `dev`;
    else remove
    
- **as key in nested object with negation operator `$`**

    Example:
    ```javascript
      {
          loaders: [{
            name: 'loader1'
          },
          {  
            __: 'dev$',
            name: 'loader2'
          }]
      }
    ``` 
    Keep object `{name: 'loader2'}` in array only when suffix not eq `dev`;
    else remove
    
    
## Real-world examples 

- [webpack-merge vs monfy](https://gist.github.com/michalzaq12e270f7b920d55cc07d382c731b0adb4b)

- [webpack configuration](https://github.com/michalzaq12/team-management-app/blob/master/build/webpack.conf.js)

- [database connection configuration](https://gist.github.com/michalzaq12/05b55fd0daf91df12dc3717bd00f846e)