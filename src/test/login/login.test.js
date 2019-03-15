// @flow

/* global describe, it, beforeEach */

import assert from 'assert';

import {TestMe} from '../../test-module/test-me';
import {runSystem} from '../../action/run-system';
import {appConst} from '../../const';

import {userLoginDataList} from './user-list';

const loginConst = {
    selector: {
        login: 'input[name="login"]',
        password: 'input[name="password"]',
        singInButton: 'button[type="submit"]',
    },
    itTimeout: 5e3,
};

describe('Login', () => {
    it('Login simple login', async () => {
        const {page} = await runSystem();

        await page.goto(appConst.url.login);

        await page.type(loginConst.selector.login, userLoginDataList[0].login);
        await page.type(
            loginConst.selector.password,
            userLoginDataList[0].password
        );

        await page.click(loginConst.selector.singInButton);

        await page.waitForNavigation();

        console.log('!!!!!');

        // assert(testMe.sum(1, 2) === 3, '1 + 2 === 3');
        //
        // assert.deepStrictEqual({obj: 1}, {obj: 1}, '{obj: 1}, {obj: 1}');
    }).timeout(loginConst.itTimeout);
});
