// @flow

import type {Browser, InterceptedRequest, Page} from 'puppeteer';

import {rootUrl} from '../../../const';
import {casinoConst} from '../casino-const';
import {setCalendar} from '../../../util/calendar';
import {setSelect} from '../../../util/select';
import {buttonCreate} from '../../../util/selector';
import {loginConst} from '../../../action/login';

export async function createCasinoMaintenance(page: Page, provider: string) {
    const dateObj = new Date();

    const date = dateObj.getDate() - 2;
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();

    await page.goto(rootUrl + casinoConst.url.create);

    await setCalendar(page, {
        selector: 'dateFrom',
        date,
        hours,
        minutes,
    });

    await setCalendar(page, {
        selector: 'dateTo',
        date,
        hours,
        minutes: minutes + 5,
    });

    await setSelect(page, {
        selector: 'provider',
        value: provider,
    });

    await page.click(buttonCreate);

    await page.waitForNavigation({timeout: loginConst.navigationTimeout});
}