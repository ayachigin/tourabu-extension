/*global TourabuEx, describe, it, expect */

describe('Utility functions', function () {
    'use strict';
    var u = TourabuEx.util;
    
    it ('Should be true when a is prefix of b', function () {
        
        expect(u.isPrefixOf('hoge', 'hogefuga')).toBeTruthy();
        expect(u.isPrefixOf('hoge', 'hoge')).toBeTruthy();
    });

    it ('Should be false when a is not prefix of b', function () {
        expect(u.isPrefixOf('oge', 'hoge')).toBeFalsy();
        expect(u.isPrefixOf('e', 'hoge')).toBeFalsy();
    });

    it ('Should be true when a is substring of b', function () {
        expect(u.isInfixOf('hoge', 'piyo hoge fuga')).toBeTruthy();
        expect(u.isInfixOf('hoge', 'hoge')).toBeTruthy();
        expect(u.isInfixOf('hoge', 'fuga hoge')).toBeTruthy();
    });

    it ('should be false when a is not substring of b', function () {
        expect(u.isInfixOf('pico', 'hoge piyo moge')).toBeFalsy();
        expect(u.isInfixOf('fuga', 'fu ga')).toBeFalsy();
    });
});
