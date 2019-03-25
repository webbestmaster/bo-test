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

import {setCalendar} from '../../util/calendar';

import {getSelectValueList, setSelect} from '../../util/select';

import {providerStaticInfo} from '../../util/provider';

import {casinoConst} from './casino-const';
import {
    createCasinoMaintenance,
    createCasinoMaintenanceIForium,
} from './util/maintenance';

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

    it('Maintenance create (except IFORIUM)', async () => {
        await page.goto(rootUrl + casinoConst.url.create);

        await page.waitFor(3e3);

        const providerList = (await getSelectValueList(
            page,
            'provider'
        )).filter(
            (providerName: string): boolean =>
                Boolean(
                    providerName &&
                        providerName !== providerStaticInfo.iForium.name
                )
        );

        // eslint-disable-next-line no-loops/no-loops
        for (
            let providerIndex = 0;
            providerIndex < providerList.length;
            providerIndex += 1
        ) {
            await createCasinoMaintenance(page, providerList[providerIndex]);
        }

        await page.waitFor(60000e3);
    });

    it('Maintenance create (IFORIUM only)', async () => {
        await page.goto(rootUrl + casinoConst.url.create);

        await page.waitFor(3e3);

        const hasIForium = (await getSelectValueList(page, 'provider')).some(
            (providerName: string): boolean =>
                providerName === providerStaticInfo.iForium.name
        );

        if (!hasIForium) {
            console.log('IFORIUM not available');
            return;
        }

        await setSelect(page, {
            selector: 'provider',
            value: providerStaticInfo.iForium.name,
        });

        const subProviderList = (await getSelectValueList(
            page,
            providerStaticInfo.iForium.subProviderKey
        )).filter((providerName: string): boolean => Boolean(providerName));

        await page.goto(rootUrl + casinoConst.url.root);

        // eslint-disable-next-line no-loops/no-loops
        for (
            let providerIndex = 0;
            providerIndex < subProviderList.length;
            providerIndex += 1
        ) {
            await createCasinoMaintenanceIForium(
                page,
                subProviderList[providerIndex]
            );
        }
    });
});
