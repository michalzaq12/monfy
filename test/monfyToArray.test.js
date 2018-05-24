/* globals describe, it, beforeEach, afterEach */

const {monfy, monfyToArray} = require('../monfy');
const should = require("should");



describe("monfyToArray", () => {

    it("should create array from object values", () =>{
        let config = {
            a: 'plugin1',
            b__dev: 'plugin2'
        };

        let result = monfyToArray(config, 'dev');
        result.should.be.Array();
        result.should.containEql('plugin1');
        result.should.containEql('plugin2');

        config.should.have.property('a');
        config.should.have.property('b__dev');
    });


});
