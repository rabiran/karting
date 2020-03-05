const trycatch = require('./trycatch');

async function tryArgs(func, ...args) {

    let lastErr = new Error('tryAgs function did not get any arguments');

    for (const argument of args) {
        let { result, err } = await trycatch(func, argument);

        lastErr = err;

        if (err) {
            continue;
        }

        if (result) {
            return { result, argument };
        }

        break;
    }

    return { lastErr };
}

module.exports = tryArgs;
