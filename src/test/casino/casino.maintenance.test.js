// @flow

/* global process */

import assert from 'assert';

import {after, before, describe, it} from 'mocha';
import type {Browser, InterceptedRequest, Page} from 'puppeteer';

import {runSystem} from '../../action/run-system';
import {rootUrl} from '../../const';
import {login} from '../../action/login';
import {getSelectValueList, setSelect} from '../../util/select';
import {providerStaticInfo} from '../../data/provider';

import {mainTimeout} from '../../data/timeout';

import type {SelectOptionType} from '../../util/select';

import {casinoConst} from './casino-const';
import {
    createCasinoMaintenance,
    createCasinoMaintenanceIForium,
} from './util/maintenance';

describe('Casino / Maintenance', async function casinoMaintenanceDescribe() {
    // eslint-disable-next-line babel/no-invalid-this
    this.timeout(15 * 60e3);

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
        await page.goto(rootUrl + casinoConst.url.root, {
            waitUntil: ['networkidle0'],
        });

        await page.waitForSelector('table', {timeout: mainTimeout});

        const tableList = await page.$$('table');

        assert(tableList.length === 2, 'Page should contains two table');
    });

    it('Maintenance create (except IFORIUM)', async () => {
        await page.goto(rootUrl + casinoConst.url.create, {
            waitUntil: ['networkidle0'],
        });

        const providerList = await getSelectValueList(page, 'provider');

        // eslint-disable-next-line no-loops/no-loops
        for (const provider of providerList) {
            if (provider.value !== providerStaticInfo.iForium.name) {
                await createCasinoMaintenance(page, provider);
            }
        }
    });

    it('Maintenance create (IFORIUM only)', async () => {
        await page.goto(rootUrl + casinoConst.url.create, {
            waitUntil: ['networkidle0'],
        });

        const hasIForium = (await getSelectValueList(page, 'provider')).some(
            (providerData: SelectOptionType): boolean =>
                providerData.value === providerStaticInfo.iForium.name
        );

        if (!hasIForium) {
            console.log('IFORIUM not available');
            return;
        }

        await setSelect(page, {
            selector: 'provider',
            value: providerStaticInfo.iForium.name,
        });

        const subProviderList = await getSelectValueList(
            page,
            providerStaticInfo.iForium.subProviderKey
        );

        await page.goto(rootUrl + casinoConst.url.root);

        // eslint-disable-next-line no-loops/no-loops
        for (const subProvider of subProviderList) {
            await createCasinoMaintenanceIForium(page, subProvider);
        }
    });
});
