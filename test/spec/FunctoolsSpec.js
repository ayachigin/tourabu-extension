/*global describe, it, Functools, expect */
'use strict';

(function () {
    var throwError = function (){
        throw new Error('AIEEEEEEEE');
    };

    var Maybe = Functools.Maybe;
    
    describe('Maybe a', function () {
        describe ('Data', function () {
            it('has a value if argument is not null or undefined', function () {
                expect((new Maybe(1)).isJust()).toEqual(true);
            });

            it('not has a value if argument is null or undefined', function () {
                expect((new Maybe(null)).isJust()).toEqual(false);
                expect((new Maybe(undefined)).isNothing()).toEqual(true);
            });
        });

        describe('Functor', function () {
            it ('should possible to apply a function to the inner value', function () {
                expect((new Maybe(1)).fmap(function (v) {
                    return v * 2;
                }).fromMaybe(null)).toEqual(2);

                expect((new Maybe(1)).maybe('', function (n) {
                    return '' + n;
                })).toEqual('1');

                expect((new Maybe(1)).fromMaybe(0)).toEqual(1);
            });

            it ('should be Nothing if apply a function to Nothing', function (){
                expect((new Maybe(null)).fmap(throwError).isNothing()).toBeTruthy();

                expect((new Maybe(undefined)).fmap(throwError).isNothing()).toBeTruthy();

                expect((new Maybe(null)).maybe('a', throwError)).toEqual('a');

                expect((new Maybe(undefined)).fromMaybe('a')).toEqual('a');
            });

            it ('Functor Maybe', function () {
                expect((new Maybe(1)).fmap(function (n) {
                    return n * 2;
                }).isJust()).toBeTruthy();

                expect (new Maybe(null).fmap(function (n) {
                    return n * 2;
                }).isJust()).toBeFalsy();
            });
        });

        describe('Applicative Maybe', function() {
            it('can bind a function', function () {
                function evenDouble (n) { return n%2 === 0? Maybe.pure(n*2): Maybe.Nothing();}
                Maybe.pure(1)
                    .bind(function (n) {
                        return Maybe.pure(n * 2);
                    })
                    .bind(function (n) {
                        expect(n).toEqual(2);
                    });

                Maybe.pure(2)
                    .bind(evenDouble)
                    .bind(function (n) {
                        expect(n).toEqual(4);
                    });

                Maybe.pure(1)
                    .bind(evenDouble)
                    .bind(function (n) {
                        return Maybe.pure(expect(n.isNothing()).toBeTruthy());
                    });
            });
        });

        describe('Monad Maybe', function() {
            it('puts it in a minimal context', function () {
                expect(Maybe.pure(1).fromMaybe(null)).toEqual(1);
            });
            
            it('can bind a function', function () {
                function evenDouble (n) { return n%2 === 0? Maybe.pure(n*2): Maybe.Nothing();}
                Maybe.pure(1)
                    .bind(function (n) {
                        return Maybe.pure(n * 2);
                    })
                    .bind(function (n) {
                        expect(n).toEqual(2);
                    });

                Maybe.pure(2)
                    .bind(evenDouble)
                    .bind(function (n) {
                        expect(n).toEqual(4);
                    });

                Maybe.pure(1)
                    .bind(evenDouble)
                    .bind(function (n) {
                        return Maybe.pure(expect(n.isNothing()).toBeTruthy());
                    });
            });
        });
    });
})();
