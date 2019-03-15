// @flow

/* global describe, it, xit, before, after, beforeEach, afterEach */

import assert from 'assert';

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
    before(() => {
        console.log('before');
    });

    beforeEach(() => {
        console.log('beforeEach');
    });

    afterEach(() => {
        console.log('afterEach');
    });

    after(() => {
        console.log('after');
    });

    it('Simple login', async () => {
        const {page, browser} = await runSystem();

        try {
            await page.goto(appConst.url.login);

            await page.type(
                loginConst.selector.login,
                userLoginDataList[0].login
            );
            await page.type(
                loginConst.selector.password,
                userLoginDataList[0].password
            );
        } finally {
            browser.close();
        }
    }).timeout(loginConst.itTimeout);
});
