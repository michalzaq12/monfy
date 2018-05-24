#!/usr/bin/env node

const assert = require("assert");

const MONFY_TAG = '__';
const MONFY_NEGATION = '$';


module.exports = monfy;

/**
 *
 * @param {object} object
 * @param {string} [env]
 */
function monfy(object, env){
    assert.equal(typeof object, 'object', 'monfy: first argument should be a object');
    if(env !== undefined){
        assert.equal(typeof env, 'string', 'monfy: env should be a string');
    }

    return createNewConfig(object, env);
}

function objectToArray(obj){
    return Object.keys(obj).map(function(key) {
        return obj[key];
    });
}


/**
 *
 * @param {object} object
 * @param {string} [env]
 */
monfy.monfyToArray = (object, env) => {
    let result = monfy(object, env);
    return objectToArray(result);
};

monfy.monfy = monfy;


/**
 *
 * @param {array} keyChain
 * @param {object} object
 * @return {*}
 */
function getProperty(keyChain, object) {
    let parent = object;
    for(let key of keyChain){
        parent = parent[key];
    }
    return parent;
}



/**
 *
 * @param {array} keyChainToArray
 * @param object
 * @param index - index of element in array to remove
 * @return {array} - new array (based object is unchanged)
 */
function removeObjectFromArray(keyChainToArray, object, index) {
    let keyChainCopy = keyChainToArray.slice();
    let arrayKey = keyChainCopy.pop();
    let parent = getProperty(keyChainCopy, object);

    let copy = Array.from(parent[arrayKey]);
    copy.splice(index, 1);
    parent[arrayKey] = copy;
}


const MONFY_SUFFIX = new RegExp(MONFY_TAG + '.*');

function removeProperty (keyChain, object, overrideDefault = false){
    let lastKey = keyChain.pop();
    let property = getProperty(keyChain, object);

    if(overrideDefault){
        let defaultKey = lastKey.replace(MONFY_SUFFIX, '');
        property[defaultKey] = property[lastKey];
    }

    if(Array.isArray(property)){
        //Remove object from array
        removeObjectFromArray(keyChain, object, lastKey);
    }else{
        //Keep object in array - remove only MONFY_TAG
        let parentParent = getProperty(keyChain.slice(0, keyChain.length - 3), object);
        let parent = getProperty(keyChain.slice(0, keyChain.length - 2), object);
        let propertyKey = keyChain[keyChain.length - 1];

        if(Array.isArray(parentParent)){
            let arrayKey = keyChain[keyChain.length - 2];
            let propertyKey = keyChain[keyChain.length - 1];
            //first copy all references and remove object which include MONFY_TAG
            parent[arrayKey] = parent[arrayKey].slice().splice(propertyKey, 1);
            //second copy primitives from object which include MONFY_TAG
            let copy = Object.assign({}, property);
            //remove MONFY_TAG
            delete copy[lastKey];
            //add new copied object (object without MONFY_TAG) to array
            parent[arrayKey][propertyKey] = copy;
        }else{
            //if primitives
            if(propertyKey === undefined) return delete property[lastKey];

            //else first copy object and then remove only MONFY_TAG
            let copy = Object.assign({}, property);
            delete copy[lastKey];

            parent[propertyKey] = copy;
        }
    }

}






function processProperty(suffix, key, keyChain, result){
    if(key === MONFY_TAG){
        let value = getProperty(keyChain, result);
        if(value === suffix){
            //only remove MONFY_TAG
            removeProperty(keyChain, result);
        }else if(value.endsWith(MONFY_NEGATION) && (!value.slice(0,-1).endsWith(suffix) || suffix === '')){
            //only remove MONFY_TAG
            removeProperty(keyChain, result);
        }else{
            //remove all object which include MONFY_TAG
            let parentKey = keyChain.slice(0, -1);
            removeProperty(parentKey, result);
        }
    } else {
        if(suffix !== '' && key.endsWith(suffix)){
            //override default value
            removeProperty(keyChain, result, true);
        }else if(key.endsWith(MONFY_NEGATION) && (!key.slice(0,-1).endsWith(suffix) || suffix === '')){
            //override default value
            removeProperty(keyChain, result, true);
        } else{
            //only remove value
            removeProperty(keyChain, result);
        }
    }
}



function createNewConfig(obj, suffix = ''){
    let isArray = Array.isArray(obj);
    const result = Object.assign({}, obj);

    function loop(el, root){
        root = root || [];
        Object.keys(el).forEach(key => {
            let keyChain = [...root, key];
            if(key.includes(MONFY_TAG)) processProperty(suffix, key, keyChain, result);
            if(typeof el[key] === 'object') loop(el[key], keyChain)
        });
    }

    loop(result);
    return isArray ? objectToArray(result) : result;
}