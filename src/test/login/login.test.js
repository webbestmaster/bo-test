// @flow

/* global describe, it, xit, before, after, beforeEach, afterEach */

import assert from 'assert';

import type {Browser, Page} from 'puppeteer';
import puppeteer from 'puppeteer';

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

describe('Login', async () => {
    // $FlowFixMe
    let browser: Browser = null;

    // $FlowFixMe
    let page: Page = null;

    before(() => {
        console.log('before');
    });

    beforeEach(async () => {
        const system = await runSystem();

        browser = system.browser;
        page = system.page;

        console.log('beforeEach');
    });

    afterEach(async () => {
        await browser.close();

        console.log('afterEach');
    });

    after(() => {
        console.log('after');
    });

    it('Simple login', async () => {
        await page.goto(appConst.url.login);

        await page.type(loginConst.selector.login, userLoginDataList[0].login);
        await page.type(
            loginConst.selector.password,
            userLoginDataList[0].password
        );
    }).timeout(loginConst.itTimeout);
});
