'use strict';
module TourabuEx.Functools {
    function id<a>(v: a): a {
        return v;
    }

    function _<a, b, c>(f1: (v: a) => b, f2: (v: b) => c): (a) => c {
        return function (a) {
            return f2(f1(a));
        }
    }

    function join<a>(v: Monad<Monad<a>>): Monad<a> {
        return v.bind(id);
    } 

    interface Functor<a> {
        fmap<b>(f: (v: a) => b): Functor<b>;
    }

    interface Monad<a> extends Functor<a> {
        pure(v: a): Monad<a>;
        bind<b>(f: (v: a) => Monad<b>): Monad<b>;
        then<b>(m: Monad<b>): Monad<b>;
        fail(msg: string): Monad<a>;
    }

    export class Maybe<a> implements Monad<a> {

        private hasValue: boolean;
        private value: a;

        constructor(v: a) {
            if (v !== undefined &&
                v !== null) {
                this.hasValue = true;
                this.value = v;
            } else {
                this.hasValue = false;
            }
        }

        static Nothing<a>() {
            return new Maybe<a>(null);
        }

        isJust() {
            return this.hasValue;
        }

        isNothing() {
            return !this.isJust();
        }

        maybe<b>(v: b, f: (w: a) => b): b {
            return this.isJust() ? f(this.value) : v;
        }

        fromMaybe(v: a): a {
            return this.isJust() ? this.value : v;
        }

        // instance Functor Maybe
        fmap<b>(f: (v: a) => b) {
            return this.isJust() ? new Maybe(f(this.value)) : this;
        }

        // instance Monad Maybe
        static pure<a>(v: a) {
            return new Maybe<a>(v);
        }

        pure(v: a) {
            return Maybe.pure(v);
        }

        bind<b>(f: (v: a) => Monad<b>): Monad<b> {
            if (this.isJust()) {
                return f(this.value);
            } else {
                return Maybe.Nothing();
            }
        }

        then<b>(m: Monad<b>): Monad<b> {
            return m;
        }

        fail(msg: string): Monad<a> {
            return Maybe.Nothing();
        }
    }

    export function range(s: number, e: number): number[] {
        var ls = [], i;
        for (i = s; i <= e; i++) {
            ls[ls.length] = i;
        }
        return ls;
    }

    export interface Tuple<T, U> {
        fst: T;
        snd: U;
    }

    export function zip<T, U>(ls1: T[], ls2: U[]): Tuple<T, U>[] {
        var xs = [], i, l = Math.max(ls1.length, ls2.length);

        for (i = 0; i < l; i++) {
            if (ls1[i] !== undefined && ls2[i] !== undefined) {
                xs[xs.length] = {
                    fst: ls1[i], snd: ls2[i]
                };
            } else {
                break;
            }
        }

        return xs;
    }
} 