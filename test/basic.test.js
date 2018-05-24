/* globals describe, it, beforeEach, afterEach */

const {monfy, monfyToArray} = require('../monfy');
const should = require("should");


describe("basic suffix", () => {

    it("Override default value and remove key with suffix", () => {
        let config = {
            a: 20,
            a__dev: 40
        };
        let result = monfy(config, 'dev');
        result.should.not.have.property('a_dev');
        result.should.have.property('a').eql(40);

        config.should.have.property('a__dev');
    });

    it("Override default value and remove key with suffix NEGATION", () => {

        let config = {
            a: 20,
            a__dev$: 40
        };
        let result = monfy(config, 'not_dev');
        result.should.not.have.property('a_dev$');
        result.should.have.property('a').eql(40);
    });

    it("Override object ", () => {

        let config = {
            x: 1,
            y: {
                a: 2,
                b: 3
            },
            y__dev: {
                a: 4,
                b: 5
            }
        };

        let result = monfy(config, 'dev');

        result.should.not.have.property('y__dev');
        result.should.have.property('y');
        result.should.have.propertyByPath('y', 'a').eql(4);
        result.should.have.propertyByPath('y', 'b').eql(5);

        config.should.have.property('y__dev');
        config.should.have.property('y');
    });


    it("Deep search", () => {

        let config = {
            x: 1,
            y: {
                a: 2,
                b: 3,
                y2: {
                    z: 3,
                    z__dev: 4
                }
            }
        };

        let result = monfy(config, 'dev');
        result.should.have.property('y');
        result.should.have.propertyByPath('y', 'y2');
        result.should.have.propertyByPath('y', 'y2', 'z').eql(4);
    });

    it("Deep search #2", () => {

        let config = {
            x: 1,
            y: {
                a: 2,
                b: 3,
                y2: {
                    z: 30,
                    z__dev: 4
                }
            }
        };

        let result = monfy(config);
        result.should.have.property('y');
        result.should.have.propertyByPath('y', 'y2');
        result.should.have.propertyByPath('y', 'y2', 'z').eql(30);
    });


    it("Get default values and remove property with suffix", () => {

        let config = {
            default: true,
            default__dev: false
        };

        let result = monfy(config);
        result.should.not.have.property('default__dev');
        result.should.have.property('default').eql(true);
    });


    it("Get default values and remove property with suffix NEGATION", () => {

        let config = {
            default__dev$: false
        };
        let result = monfy(config);
        result.should.not.have.property('default__dev$');
        result.should.have.property('default').eql(false);
    });
});


describe("MONFY_TAG in object", () => {

    it("Keep object with MONFY_TAG in object and remove MONFY_TAG", () => {
        let config = {
            minify: {
                __: 'dev',
                super_option: true,
            }
        };

        let result = monfy(config, 'dev');
        result.should.have.property('minify');
        result.should.not.have.propertyByPath('minify', '__');
        result.should.have.propertyByPath('minify', 'super_option').eql(true);
    });

    it("Keep/remove object and remove MONFY_TAG NEGATION", () => {
        let config = {
            minify: {
                __: 'dev$',
                super_option: true,
            }
        };

        let result = monfy(config, 'dev');
        result.should.not.have.property('minify');

        let result2 = monfy(config, 'not_dev');
        result2.should.have.property('minify');
        result2.should.not.have.propertyByPath('minify', '__');
        result2.should.have.propertyByPath('minify', 'super_option').eql(true);
    });

    it("Remove all object", () => {
        let config = {
            minify: {
                __: 'dev',
                super_option: true,
            }
        };

        let result = monfy(config, 'not_dev');
        result.should.not.have.property('minify');
    });
});
