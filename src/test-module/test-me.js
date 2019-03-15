// @flow

export class TestMe {
    constructor() {
        console.log('TestMe: constructor');
    }

    sum(first: number, second: number): number {
        return first + second;
    }

    sumUncovered(first: number, second: number): number {
        return first + second;
    }
}
