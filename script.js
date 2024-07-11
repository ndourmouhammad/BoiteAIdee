const form = document.getElementById("myForm");
const success = document.getElementById("submitSuccess");
const submitBtn = document.getElementById("submitBtn");
const fields = ["libelle", "categorie", "message"];
const divs = ["libelleDiv", "categorieDiv", "messageDiv"];

form.addEventListener("input", function (event) {
  if (event.target.tagName === "INPUT" || event.target.tagName === "SELECT" || event.target.tagName === "TEXTAREA") {
    validateField(event.target);
  }
});

form.addEventListener("submit", function (event) {
  event.preventDefault();

  clearErrors();
  clearSuccessMessage();

  let isValid = true;

  fields.forEach((field) => {
    const value = document.getElementById(field).value.trim();
    if (!validateAndShowNext(field, value)) {
      isValid = false;
    }
  });

  if (isValid) {
    form.style.display = "none";
    success.innerHTML =
      "Inscription réussie ! Votre inscription a été validée avec succès. Merci pour votre participation !";
    saveData(); // Appeler la fonction pour sauvegarder les données
  }
});

function validateField(input) {
  const fieldName = input.name;
  const value = input.value.trim();

  if (validateAndShowNext(fieldName, value)) {
    enableSubmitButtonIfValid();
  } else {
    disableSubmitButton();
  }
}

function validateAndShowNext(fieldName, value) {
  let isValid = false;

  switch (fieldName) {
    case "libelle":
      isValid = isValidName(value);
      if (!isValid) {
        showError("libelleError", "Le champ doit contenir entre 3 et 15 lettres.");
        hideFollowingFields(fieldName);
      } else {
        clearError("libelleError");
        showNextField(fieldName);
      }
      break;
    case "categorie":
      isValid = value !== "Choisir une catégorie";
      if (!isValid) {
        showError("categorieError", "Veuillez choisir une catégorie.");
        hideFollowingFields(fieldName);
      } else {
        clearError("categorieError");
        showNextField(fieldName);
      }
      break;
    case "message":
      isValid = isValidMessage(value);
      if (!isValid) {
        showError("messageError", "Le message doit contenir entre 3 et 500 caractères.");
        hideFollowingFields(fieldName);
      } else {
        clearError("messageError");
        showNextField(fieldName);
      }
      break;
    
  }

  return isValid;
}

function showNextField(currentField) {
  const currentIndex = fields.indexOf(currentField);
  if (currentIndex >= 0 && currentIndex < fields.length - 1) {
    const nextFieldDiv = document.getElementById(`${fields[currentIndex + 1]}Div`);
    nextFieldDiv.classList.remove("hidden");
  }
}

function hideFollowingFields(currentField) {
  const currentIndex = fields.indexOf(currentField);
  for (let i = currentIndex + 1; i < fields.length; i++) {
    document.getElementById(`${fields[i]}Div`).classList.add("hidden");
  }
}

function enableSubmitButtonIfValid() {
  let allValid = true;
  fields.forEach((field) => {
    const value = document.getElementById(field).value.trim();
    if (!validateAndShowNext(field, value)) {
      allValid = false;
    }
  });

  if (allValid) {
    submitBtn.disabled = false;
  }
}

function disableSubmitButton() {
  submitBtn.disabled = true;
}

function isValidName(name) {
    const regex = /^[a-zA-ZÀ-ÿ\s]{3,50}$/;
  return regex.test(name);
}

function isValidMessage(message) {
  const regex = /^.{3,500}$/;
  return regex.test(message);
}



function showError(elementId, message) {
  document.getElementById(elementId).textContent = message;
}

function clearError(elementId) {
  document.getElementById(elementId).textContent = "";
}

function clearErrors() {
  fields.forEach((field) => {
    clearError(`${field}Error`);
  });
}

function clearSuccessMessage() {
  success.textContent = "";
}

// Fonction pour sauvegarder les données dans localStorage
function saveData() {
  const libelle = document.getElementById("libelle").value;
  const categorie = document.getElementById("categorie").value;
  const message = document.getElementById("message").value;
  

  localStorage.setItem("libelle", libelle);
  localStorage.setItem("categorie", categorie);
  localStorage.setItem("message", message);
  

  // Récupérer les données existantes
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Ajouter les nouvelles données
  users.push({
    libelle: libelle,
    categorie: categorie,
    message: message,
  });

  // Sauvegarder les données mises à jour dans localStorage
  localStorage.setItem("users", JSON.stringify(users));
}
