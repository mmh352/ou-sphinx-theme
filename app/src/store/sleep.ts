/**
 * Asynchronously sleep for delay milliseconds.
 *
 * @param delay The sleep delay in milliseconds
 * @returns A Promise that resolves after the given timeout
 */
 export async function sleep(delay: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}
