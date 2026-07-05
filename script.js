const passwordInput = document.getElementById("password");
const copyPasswordButton = document.getElementById("copy-password");
const passwordLengthInput = document.getElementById("length");
const numberCheckbox = document.getElementById("Number");
const specialCheckbox = document.getElementById("Special");
const uppercaseCheckbox = document.getElementById("Uppercase");
const lowercaseCheckbox = document.getElementById("Lowercase");
const passwordForm = document.getElementById("password-form");

function getRandomCharacter(characters) {
  return characters[Math.floor(Math.random() * characters.length)];
}

function buildCharacterSet(start, end) {
  return Array.from({ length: end - start + 1 }, (_, index) => String.fromCharCode(start + index));
}

function generatePassword(length, includeNumbers, includeSpecial, includeUppercase, includeLowercase) {
  const lowercaseCharacters = buildCharacterSet(97, 122);
  const uppercaseCharacters = buildCharacterSet(65, 90);
  const numberCharacters = buildCharacterSet(48, 57);
  const specialCharacters = [
    ...buildCharacterSet(33, 47),
    ...buildCharacterSet(58, 64),
    ...buildCharacterSet(91, 96),
    ...buildCharacterSet(123, 126)
  ];

  const characterSets = [];
  if (includeLowercase) characterSets.push(lowercaseCharacters);
  if (includeUppercase) characterSets.push(uppercaseCharacters);
  if (includeNumbers) characterSets.push(numberCharacters);
  if (includeSpecial) characterSets.push(specialCharacters);

  if (characterSets.length === 0) {
    return null;
  }

  if (length < characterSets.length) {
    return "length";
  }

  const passwordCharacters = [];
  characterSets.forEach((set) => {
    passwordCharacters.push(getRandomCharacter(set));
  });

  while (passwordCharacters.length < length) {
    const randomSet = characterSets[Math.floor(Math.random() * characterSets.length)];
    passwordCharacters.push(getRandomCharacter(randomSet));
  }

  for (let i = passwordCharacters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordCharacters[i], passwordCharacters[j]] = [passwordCharacters[j], passwordCharacters[i]];
  }

  return passwordCharacters.join("");
}

copyPasswordButton.addEventListener("click", async function () {
  const passwordText = passwordInput.value;

  if (!passwordText) {
    alert("Please generate a password first.");
    return;
  }

  try {
    await navigator.clipboard.writeText(passwordText);
    passwordInput.value = "";
    copyPasswordButton.textContent = "Copied!";
    setTimeout(() => {
      copyPasswordButton.textContent = "Copy";
    }, 1500);
  } catch (error) {
    alert("Unable to copy password.");
  }
});

passwordForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const length = parseInt(passwordLengthInput.value, 10) || 8;
  const includeNumbers = numberCheckbox.checked;
  const includeSpecial = specialCheckbox.checked;
  const includeUppercase = uppercaseCheckbox.checked;
  const includeLowercase = lowercaseCheckbox.checked;

  const generatedPassword = generatePassword(
    length,
    includeNumbers,
    includeSpecial,
    includeUppercase,
    includeLowercase
  );

  if (generatedPassword === null) {
    alert("Please select at least one character type.");
    return;
  }

  if (generatedPassword === "length") {
    alert("Password length must be at least the number of selected character types.");
    return;
  }

  passwordInput.value = generatedPassword;
});
