# __ monfy

> Multi configuration for different deployment environments 
(development, qa, staging, production, etc.) in simple object.


## Quick Start

```bash
    npm install --save-dev monfy
```


## Usage

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
    
    
## Examples 

### 1.
   
```javascript
    let config = {
        a:{
            a2: true
        },
        a__dev:{
            b1: [1,2,3]
        },
        c: {
            c1:{
                c2:{
                    c3: 'tak',
                    c3__test$: 'nie'
                }
            }
        }
    }
```

```javascript
    console.log(monfy(config));
```

Output:

```javascript
    {
        a: {
            a2: true
        },
        c: {
            c1:{
                c2:{
                    c3: 'nie'
                }
            }
        }
    }
```


### 2.
   
```javascript
    let config = [
        {
            plugin: 'plugin1',
            options: {}
        },
        {
            __: 'dev',
            plugin: 'plugin2',
            options: {}   
        }]
```

```javascript
    console.log(monfy(config, 'dev'));
```

Output:

```javascript
    [
        {
            plugin: 'plugin1',
            options: {},
        },
        {
            plugin: 'plugin2',
            options: {}
        }
    ]
```