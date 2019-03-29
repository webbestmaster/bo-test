// @flow

/* global process */

import assert from 'assert';

import {after, before, describe, it} from 'mocha';
import type {Browser, InterceptedRequest, Page} from 'puppeteer';

import {runSystem} from '../../action/run-system';
import {rootUrl} from '../../const';
import {login} from '../../action/login';
import {getSelectValueList} from '../../util/select';
import {providerStaticInfo} from '../../data/provider';
import {mainTimeout} from '../../data/timeout';

import {virtualSportsConst} from './virtual-sports-const';
import {
    createVirtualSportsMaintenance,
    editVirtualSportsMaintenance,
} from './util/maintenance';

describe('Virtual Sports / Maintenance', async function virtualSportsMaintenanceDescribe() {
    // eslint-disable-next-line babel/no-invalid-this
    this.timeout(5 * 60e3);

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
        await page.goto(rootUrl + virtualSportsConst.url.root, {
            waitUntil: ['networkidle0'],
        });

        await page.waitForSelector('table', {timeout: mainTimeout});

        const tableList = await page.$$('table');

        assert(tableList.length === 2, 'Page should contains two table');
    });

    it('Maintenance create', async () => {
        await page.goto(rootUrl + virtualSportsConst.url.create, {
            waitUntil: ['networkidle0'],
        });

        const providerList = await getSelectValueList(page, 'provider');

        // eslint-disable-next-line no-loops/no-loops
        for (const provider of providerList) {
            if (provider.value !== providerStaticInfo.iForium.name) {
                await createVirtualSportsMaintenance(page, provider);
                await editVirtualSportsMaintenance(page, provider);
            }
        }
    });
});
