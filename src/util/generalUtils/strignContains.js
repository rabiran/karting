module.exports = (target, pattern) => {
    let value = 0;

    pattern.forEach(function(word){
      value = value + target.includes(word);
    });
    
    return (value > 0);
}