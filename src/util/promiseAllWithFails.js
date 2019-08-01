module.exports =  async function promiseAllWithFails(promiseArray, valueErr) { 
    return await Promise.all(promiseArray.map(promise => promise.catch(err => valueErr ? valueErr : err))); 
  }