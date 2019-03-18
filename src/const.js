// @flow

import {Page} from 'puppeteer';

const rootUrl = 'http://localhost:8181';

export const appConst = {
    window: {
        size: {
            width: 1200,
            height: 900,
        },
    },
    url: {
        root: rootUrl,
        login: `${rootUrl}/login`,
    },
};
