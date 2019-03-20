// @flow

export async function repeat(
    callback: () => mixed,
    count: number
): Promise<Array<mixed>> {
    const array = new Array(count).fill(null);

    return Promise.all(array.map(callback));
}
