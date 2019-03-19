// @flow

import assert from 'assert';

import {describe, it} from 'mocha';

import {TestMe} from '../test-module/test-me';

describe('describe: check sum', () => {
    it('it: check sum', () => {
        const testMe = new TestMe();

        assert(testMe.sum(1, 2) === 3, '1 + 2 === 3');

        assert.deepStrictEqual({obj: 1}, {obj: 1}, '{obj: 1}, {obj: 1}');
    });
});
