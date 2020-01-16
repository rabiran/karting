module.exports = (target, pattern) => {
    let value = 0;

    pattern.forEach((word) => {
      value = value + target.includes(word);
    });

    return (value > 0);
}