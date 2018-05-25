/* globals describe, it, beforeEach, afterEach */

const {monfy, monfyToArray} = require('../monfy');
const should = require("should");


describe("MONFY_TAG in array", () => {


    it("Keep object in array", () => {
        let config = [
            {
                name: 'loader1',
                a: 1
            }, {
                __: 'dev',
                name: 'loader2',
                b: 2
            }
        ];

        let result = monfy(config, 'dev');
        result.length.should.be.eql(2);
        result[1].should.not.have.property('__');
        result[1].should.have.property('name').eql('loader2');

        config.should.be.Array();
        config.length.should.be.eql(2);
        config[1].should.have.property('__');
    });


    it("Remove object from array", () => {
        let config = [
            {
                name: 'loader1',
                a: 1
            }, {
                __: 'dev',
                name: 'loader2',
                b: 2
            }
        ];

        let result = monfy(config, 'not_dev');
        result.length.should.be.eql(1);
        result[0].should.have.property('name').eql('loader1');

        config.should.be.Array();
        config.length.should.be.eql(2);
        config[1].should.have.property('__');
    });

    it("Remove object from nested array ", () => {
        let config = {
            array: [
                {
                    name: 'loader1',
                    a: 1
                }, {
                    __: 'dev',
                    name: 'loader2',
                    b: 2
                }
            ]
        };

        let result = monfy(config, 'not_dev');
        result.array.length.should.be.eql(1);
        result.array[0].should.have.property('name').eql('loader1');

        config.should.have.property('array');
        config.array.should.be.Array();
        config.array.length.should.be.eql(2);
        config.array[1].should.have.property('__');
        config.array[1].should.have.property('name').eql('loader2');
    });

    it("Keep object from nested array #deep", () => {
        let config = {
            a1:{
                a2:{
                    a3:{
                        a4: [
                            {
                                name: 'loader1'
                            },{
                                __: 'dev',
                                name: "loader2"
                            }
                        ]
                    }
                }
            }
        };

        let result = monfy(config, 'dev');
        result.should.have.propertyByPath('a1', 'a2', 'a3', 'a4');
        result.a1.a2.a3.a4.should.be.Array();
        result.a1.a2.a3.a4.length.should.be.eql(2);
    });

    it("Keep object from nested array #deep", () => {
        let config = {
            a1:{
                a2:{
                    a3:{
                        a4: [
                            {
                                name: 'loader1'
                            },{
                                __: 'dev',
                                name: "loader2"
                            }
                        ]
                    }
                }
            }
        };

        let result = monfy(config, 'not_dev');
        result.should.have.propertyByPath('a1', 'a2', 'a3', 'a4');
        result.a1.a2.a3.a4.should.be.Array();
        result.a1.a2.a3.a4.length.should.be.eql(1);
    });


    it("Remove/keep object from nested array NEGATION", () => {
        let config = {
            array: [
                {
                    name: 'loader1',
                    a: 1
                }, {
                    __: 'dev$',
                    name: 'loader2',
                    b: 2
                }
            ]
        };

        let result = monfy(config, 'not_dev');
        result.array.should.be.Array();
        result.array.length.should.be.eql(2);
        result.array[1].should.have.property('name').eql('loader2');


        let result2 = monfy(config, 'dev');
        result2.array.length.should.be.eql(1);
        result2.array[0].should.have.property('name').eql('loader1');

        config.should.have.property('array');
        config.array.should.be.Array();
        config.array.length.should.be.eql(2);
        config.array[1].should.have.property('__');
        config.array[1].should.have.property('name').eql('loader2');
    });


    it("Override property object in array #! 1", () => {
        let config = {
            array: [
                {
                    name: 'loader1',
                    a: 1,
                    a__dev: 3
                }
            ]
        };

        let result = monfy(config, 'dev');
        result.should.have.property('array');
        result.array[0].should.have.property('a').eql(3);
        result.array[0].should.not.have.property('a__dev');
    });



    it("Override property object in array #! 2", () => {
        let config = {
            array: [
                {
                    name: 'loader1',
                    a: 1,
                    options: {
                        x: 4,
                        x__dev: 5
                    }
                }
            ]
        };

        let result = monfy(config, 'dev');
        result.should.have.property('array');
        result.array.should.be.Array();
        result.array.length.should.be.eql(1);
        result.array[0].should.have.property('options');
        result.array[0].options.should.have.property('x').eql(5);
        result.array[0].options.should.not.have.property('x__dev');
    });

    it("Override property object in array #! 3", () => {
        let config = [
            {
                name: 'loader1',
                a: 1,
                options: {
                    x: 4,
                    x__dev: 5
                }
            }
        ];

        let result = monfy(config, 'dev');
        result.should.be.Array();
        result.length.should.be.eql(1);
        result[0].should.have.property('options');
        result[0].options.should.have.property('x').eql(5);
        result[0].options.should.not.have.property('x__dev');
    });
});
