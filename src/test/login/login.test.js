// @flow

/* global describe, it, xit, before, after, beforeEach, afterEach */

import assert from 'assert';

import type {Browser, Page} from 'puppeteer';
import puppeteer from 'puppeteer';

import {runSystem} from '../../action/run-system';
import {appConst} from '../../const';

import {userLoginData} from './user-data';

const loginConst = {
    selector: {
        login: 'input[name="login"]',
        password: 'input[name="password"]',
        singInButton: 'button[type="submit"]',
    },
    itTimeout: 30e3,
    navigationTimeout: 3e3,
};

describe('Login', async () => {
    // $FlowFixMe
    let browser: Browser = null;

    // $FlowFixMe
    let page: Page = null;

    beforeEach(async () => {
        const system = await runSystem();

        browser = system.browser;
        page = system.page;
    });

    afterEach(async () => {
        await browser.close();
    });

    it('Usual login', async () => {
        await page.goto(appConst.url.login);
        await page.waitForSelector(loginConst.selector.login, {
            timeout: loginConst.navigationTimeout,
        });

        await page.type(loginConst.selector.login, userLoginData.usual.login);
        await page.type(
            loginConst.selector.password,
            userLoginData.usual.password
        );

        await page.click(loginConst.selector.singInButton);

        await page.waitForNavigation({timeout: loginConst.navigationTimeout});
    }).timeout(loginConst.itTimeout);

    it('Login with spec symbols', async () => {
        await page.goto(appConst.url.login);
        await page.waitForSelector(loginConst.selector.login, {
            timeout: loginConst.navigationTimeout,
        });

        await page.type(
            loginConst.selector.login,
            userLoginData.specSymbol.login
        );
        await page.type(
            loginConst.selector.password,
            userLoginData.specSymbol.password
        );

        await page.click(loginConst.selector.singInButton);

        await page.waitForNavigation({timeout: loginConst.navigationTimeout});
    }).timeout(loginConst.itTimeout);

    it('Impossible login with empty login and password', async () => {
        await page.goto(appConst.url.login);
        await page.waitForSelector(loginConst.selector.login, {
            timeout: loginConst.navigationTimeout,
        });

        await page.type(loginConst.selector.login, '');
        await page.type(loginConst.selector.password, '');

        await page.click(loginConst.selector.singInButton);

        await page.waitFor(loginConst.navigationTimeout);

        assert(
            page.url().startsWith(appConst.url.login),
            `page url: ${page.url()}, login url: ${appConst.url.login}`
        );
    }).timeout(loginConst.itTimeout);

    it('Impossible login with wrong login and password', async () => {
        await page.goto(appConst.url.login);
        await page.waitForSelector(loginConst.selector.login, {
            timeout: loginConst.navigationTimeout,
        });

        await page.type(loginConst.selector.login, String(Math.random()));
        await page.type(loginConst.selector.password, String(Math.random()));

        await page.click(loginConst.selector.singInButton);

        await page.waitFor(loginConst.navigationTimeout);

        assert(
            page.url().startsWith(appConst.url.login),
            `page url: ${page.url()}, login url: ${appConst.url.login}`
        );
    }).timeout(loginConst.itTimeout);
});
