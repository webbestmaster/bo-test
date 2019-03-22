// @flow

import assert from 'assert';

import {describe, it, xit, before, after, beforeEach, afterEach} from 'mocha';
import type {Browser, Page, InterceptedRequest} from 'puppeteer';

import {runSystem} from '../../action/run-system';
import {appConst, rootUrl} from '../../const';
import {login, loginConst} from '../../action/login';
import {errorSnackbar} from '../../util/selector';
import {repeat} from '../../util/repeat';

// import {userLoginData} from './user-data';

const loginApiUrl = rootUrl + '/security/login';

describe.only('Casino / Maintenance', async function casinoMaintenanceDescribe() {
    // eslint-disable-next-line babel/no-invalid-this
    this.timeout(30e3);

    // $FlowFixMe
    let browser: Browser = null;

    // $FlowFixMe
    let page: Page = null;

    before(async () => {
        const system = await runSystem();

        browser = system.browser;
        page = system.page;

        await login(page);
    });

    after(async () => {
        await browser.close();
    });

    it('check both table exists', async () => {
        console.log('!!!!!!!!!!!');
    });
});
