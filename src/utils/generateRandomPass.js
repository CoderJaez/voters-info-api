function generateRandomPass(length) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomCharacters = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomCharacters += charset.charAt(randomIndex);
  }

  return randomCharacters;
}

module.exports = generateRandomPass;
