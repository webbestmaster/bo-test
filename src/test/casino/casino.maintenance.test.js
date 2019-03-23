// @flow

/* global process */

import assert from 'assert';

import {describe, it, xit, before, after, beforeEach, afterEach} from 'mocha';
import type {Browser, Page, InterceptedRequest} from 'puppeteer';

import {runSystem} from '../../action/run-system';
import {appConst, rootUrl} from '../../const';
import {login, loginConst} from '../../action/login';
import {errorSnackbar} from '../../util/selector';
import {repeat} from '../../util/repeat';

import {calendarSelect} from '../../util/calendar';

import {casinoConst} from './casino-const';

// import {userLoginData} from './user-data';

const loginApiUrl = rootUrl + '/security/login';

describe('Casino / Maintenance', async function casinoMaintenanceDescribe() {
    // eslint-disable-next-line babel/no-invalid-this
    this.timeout(30000e3);

    let browser = process.mockBrowser;

    let page = process.mockPage;

    before(async () => {
        const system = await runSystem();

        browser = system.browser;
        page = system.page;

        await login(page);
    });

    after(async () => {
        await browser.close();
    });

    it('Both table exists', async () => {
        await page.goto(rootUrl + casinoConst.url.root);

        await page.waitForSelector('table', {timeout: 3e3});

        const tableList = await page.$$('table');

        assert(tableList.length === 2, 'Page should contains two table');
    });

    xit('Maintenance create', async () => {
        await page.goto(rootUrl + casinoConst.url.create);

        await page.waitForSelector('form', {timeout: 3e3});

        await page.click('input[name="dateFrom"] + div');

        await page.waitForSelector(calendarSelect.prevButton);
        await page.click(calendarSelect.prevButton);
        await page.click(calendarSelect.prevButton);
        await page.click('[role="presentation"]:nth-child(7)');

        await page.waitFor(60000e3);
    });
});
