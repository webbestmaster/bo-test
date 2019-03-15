// @flow

declare module 'puppeteer' {
    declare type PuppeteerHTMLElementType = {};

    declare type PageScreenshotOptionsType = {
        path: string,
    };

    declare class InterceptedRequest {
        resourceType(): string,
        abort(): mixed,
        continue(): mixed,
    }

    declare class Page {
        goto(url: string): Promise<mixed>,
        screenshot(options: PageScreenshotOptionsType): Promise<mixed>,
        click(cssSelector: string): Promise<mixed>,
        type(cssSelector: string, text: string): Promise<mixed>,
        $(cssSelector: string): Promise<PuppeteerHTMLElementType | null>,
        evaluate<T>(funcOrStringFunc: ((() => T) | string)): Promise<T>,
        url(): string,
        waitFor(timeoutInMs: number): Promise<mixed>,
        setViewport(size: {width: number, height: number}): Promise<mixed>,
        setRequestInterception(isEnable: boolean): Promise<mixed>,
        on<T>(eventName: string, callback: (context: T)=> mixed): mixed,
    }

    declare class Browser {
        newPage(): Promise<Page>,
        close(): Promise<mixed>,
    }

    declare type LaunchOptionsType = {
        headless?: boolean,
        slowMo?: number,

        /*
        * `--window-size=${width},${height}`,
        * `--window-position=${leftPosition},${topPosition}`,
        * '--disable-infobars',
        * '--allow-insecure-localhost',
        * '--disable-gpu',
        * */
        args?: Array<string>, // example ['--window-size=384,480', '--disable-infobars']
    }

    declare function launch(launchOptions: LaunchOptionsType): Browser;
}
