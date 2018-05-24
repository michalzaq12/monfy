/* globals describe, it, beforeEach, afterEach */

const {monfy, monfyToArray} = require('../monfy');
const should = require("should");



describe("reuse", () => {

    it("Override values and remove keys with suffix #primitives", () => {
        let config = {
            a: 20,
            a__dev: 40,
            a__test: 60,
            a__prod: 100
        };

        let result = monfy(config);
        result.should.have.property('a').eql(20);

        let result_dev = monfy(config, 'dev');
        result_dev.should.have.property('a').eql(40);

        let result_test = monfy(config, 'test');
        result_test.should.have.property('a').eql(60);

        let result_prod = monfy(config, 'prod');
        result_prod.should.have.property('a').eql(100);

        config.should.not.only.have.key('a');
    });


});
