// @flow

import type {Page} from 'puppeteer';

import {appConst} from '../const';
import {userLoginData} from '../test/login/user-data';

export const loginConst = {
    selector: {
        login: 'input[name="login"]',
        password: 'input[name="password"]',
        singInButton: 'button[type="submit"]',
    },
    navigationTimeout: 3e3,
};

export async function login(page: Page) {
    await page.goto(appConst.url.login);
    await page.waitForSelector(loginConst.selector.login, {
        timeout: loginConst.navigationTimeout,
    });

    await page.type(loginConst.selector.login, userLoginData.usual.login);
    await page.type(loginConst.selector.password, userLoginData.usual.password);

    await page.click(loginConst.selector.singInButton);

    await page.waitForNavigation({timeout: loginConst.navigationTimeout});
}
