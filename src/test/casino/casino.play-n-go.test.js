// @flow

/* global process */

import assert from 'assert';

import {after, before, describe, it} from 'mocha';
import type {Browser, InterceptedRequest, Page} from 'puppeteer';

import {runSystem} from '../../action/run-system';
import {rootUrl} from '../../const';
import {login} from '../../action/login';
import {mainTimeout} from '../../data/timeout';

import {casinoConst} from './casino-const';
import {
    createCasinoPlayNGoGame,
    generateGameOptionList,
    updateCasinoPlayNGoGame,
} from './util/play-n-go';

describe('Casino / Play\'n GO', async function casinoMaintenanceDescribe() {
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

    it('Game table exists', async () => {
        await page.goto(rootUrl + casinoConst.url.playNGo.root, {
            waitUntil: ['networkidle0'],
        });

        await page.waitForSelector('table', {timeout: mainTimeout});

        const tableList = await page.$$('table');

        assert(tableList.length === 1, 'Page should contains one table');
    });

    it('Create game', async () => {
        await page.goto(rootUrl + casinoConst.url.playNGo.create, {
            waitUntil: ['networkidle0'],
        });

        const createGameOptionList = generateGameOptionList(0);

        // eslint-disable-next-line no-loops/no-loops
        for (const gameOption of createGameOptionList) {
            await createCasinoPlayNGoGame(page, gameOption);
        }
    });

    it('Edit game', async () => {
        await page.goto(rootUrl + casinoConst.url.playNGo.create, {
            waitUntil: ['networkidle0'],
        });

        const editGameOptionList = generateGameOptionList(1);

        // eslint-disable-next-line no-loops/no-loops
        for (const gameOption of editGameOptionList) {
            await updateCasinoPlayNGoGame(page, gameOption);
        }
    });
});
