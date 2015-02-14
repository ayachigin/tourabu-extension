/*global describe, it, expect */

describe('Utility functions', function () {
    'use strict';

    it ('Should be true when a is prefix of b', function () {
        expect('hoge'.isPrefixOf('hogefuga')).toBeTruthy();
        expect('hoge'.isPrefixOf('hoge')).toBeTruthy();
    });

    it ('Should be false when a is not prefix of b', function () {
        expect('oge'.isPrefixOf('hoge')).toBeFalsy();
        expect('o'.isPrefixOf('hoge')).toBeFalsy();
    });

    it ('Should be true when a is substring of b', function () {
        expect('hoge'.isInfixOf('piyo hoge fuga')).toBeTruthy();
        expect('hoge'.isInfixOf('hoge')).toBeTruthy();
        expect('hoge'.isInfixOf('fuga hoge')).toBeTruthy();
    });

    it ('should be false when a is not substring of b', function () {
        expect('fuga'.isInfixOf('hoge piyo moge')).toBeFalsy();
        expect('fuga'.isInfixOf('fu ga')).toBeFalsy();
    });
});
