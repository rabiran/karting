async function filterAsync(data, asyncFilter) {
    // Take a copy of the array, it might mutate by the time we've finished
    const dataCopy = Array.from(data);
    // Transform all the elements into an array of promises using the predicate
    // as the promise
    const result = await Promise.all(dataCopy.map((element, index) => asyncFilter(element, index, data)))
    // Use the result of the promises to call the underlying sync filter function
    return data.filter((element, index) => {
        return result[index];
    });
}

module.exports = filterAsync;
