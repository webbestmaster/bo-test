// @flow

/* global process */

import assert from 'assert';

import {afterEach, beforeEach, describe, it} from 'mocha';
import type {Browser, InterceptedRequest, Page} from 'puppeteer';

import {runSystem} from '../../action/run-system';
import {appConst, rootUrl} from '../../const';
import {loginConst} from '../../action/login';
import {errorSnackbar} from '../../util/selector';
import {repeat} from '../../util/repeat';

import {userLoginData} from './user-data';

const loginApiUrl = rootUrl + '/security/login';

describe('Login', async function login() {
    // eslint-disable-next-line babel/no-invalid-this
    this.timeout(30e3);

    let browser = process.mockBrowser;

    let page = process.mockPage;

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
    });

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
    });

    it('Several click to login button', async () => {
        await page.setRequestInterception(true);

        let loginRequestCount = 0;

        page.on<InterceptedRequest>(
            'request',
            (interceptedRequest: InterceptedRequest) => {
                if (interceptedRequest.url() === loginApiUrl) {
                    loginRequestCount += 1;
                }
                interceptedRequest.continue();
            }
        );

        await page.goto(appConst.url.login);
        await page.waitForSelector(loginConst.selector.login, {
            timeout: loginConst.navigationTimeout,
        });

        await page.type(loginConst.selector.login, userLoginData.usual.login);
        await page.type(
            loginConst.selector.password,
            userLoginData.usual.password
        );

        await repeat(async () => {
            await page.click(loginConst.selector.singInButton);
        }, 100);

        await page.waitForNavigation({timeout: loginConst.navigationTimeout});

        assert(loginRequestCount === 1, 'Login request should be once');
    });

    it('Impossible login with empty login and password', async () => {
        await page.goto(appConst.url.login);
        await page.waitForSelector(loginConst.selector.login, {
            timeout: loginConst.navigationTimeout,
        });

        await page.type(loginConst.selector.login, '');
        await page.type(loginConst.selector.password, '');

        await page.click(loginConst.selector.singInButton);

        await page.waitForSelector(errorSnackbar, {
            timeout: loginConst.navigationTimeout,
        });
    });

    it('Impossible login with wrong login and password', async () => {
        await page.goto(appConst.url.login);
        await page.waitForSelector(loginConst.selector.login, {
            timeout: loginConst.navigationTimeout,
        });

        await page.type(loginConst.selector.login, String(Math.random()));
        await page.type(loginConst.selector.password, String(Math.random()));

        await page.click(loginConst.selector.singInButton);

        await page.waitForSelector(errorSnackbar, {
            timeout: loginConst.navigationTimeout,
        });
    });
});
