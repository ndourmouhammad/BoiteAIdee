const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzaHZmYmlpZHVzemJjcHptamZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA4MDk1MzUsImV4cCI6MjAzNjM4NTUzNX0.u5vyuxvSL9JjFLsHphtIFmpoFeKuq6gxToL-WNuIMyQ";
const url = "https://ushvfbiiduszbcpzmjfe.supabase.co";

const database = supabase.createClient(url, key);

async function authenticateUser() {
    const { data, error } = await database.auth.signInWithPassword({
      email: "ndourmouhammad15@gmail.com",
      password: "Mouhammad@2024",
    });
  
    if (error) {
      console.error("Erreur lors de l'authentification:", error);
      return null;
    } else {
      console.log("Utilisateur authentifié:", data.user);
      return data.user;
    }
}

const save = document.querySelector("#save");
save.addEventListener("click", async (e) => {
    e.preventDefault();
    let libelle = document.querySelector("#libelle").value;
    let categorie = document.querySelector("#categorie").value;
    let message = document.querySelector("#message").value;
    let statut = null; // Defaut value

    // Clear previous errors
    clearErrors();

    if (validateForm(libelle, categorie, message)) {
        const user = await authenticateUser();
  
        if (user) {
            try {
                const insertObject = { libelle, categorie, message, statut };
                const { data, error } = await database.from("idees").insert([insertObject]);

                if (error) {
                    throw error;
                }

                alert("Idée ajoutée avec succès");
            } catch (error) {
                console.error("Erreur lors de l'ajout de l'idée:", error);
            }
        }

        save.innerText = "Ajouter une idée";
        document.getElementById("ideaForm").reset();
        getIdeas();
    } else {
        showFormMessage('Veuillez corriger les erreurs et réessayer.', 'error');
        document.getElementById('ideaForm').style.display = "none";
        setTimeout(() => {
            document.getElementById('ideaForm').style.display = "block";
        }, 2000);
    }
});

// Validation function
function validateForm(libelle, categorie, message) {
    let isValid = true;
    const libelleRegex = /^[\p{L}\p{M}\s]{3,50}$/u; // Between 3 and 50 characters, including letters with accents
    const messageRegex = /^[\p{L}\p{M}\p{P}\p{N}\s]{3,255}$/u; // Between 3 and 255 characters, including letters, numbers, punctuation, spaces
    const validCategories = ['politique', 'sport', 'sante', 'education']; // Valid categories

    if (!libelleRegex.test(libelle)) {
        showError('libelleError', 'Le libellé doit contenir entre 3 et 50 chaînes de caractères.');
        isValid = false;
    }

    if (!validCategories.includes(categorie)) {
        showError('categorieError', 'Veuillez choisir une catégorie valide.');
        isValid = false;
    }

    if (!messageRegex.test(message)) {
        showError('messageError', 'Le message doit contenir entre 3 et 255 chaînes de caractères.');
        isValid = false;
    }

    return isValid;
}

function clearErrors() {
    document.getElementById('libelleError').textContent = '';
    document.getElementById('categorieError').textContent = '';
    document.getElementById('messageError').textContent = '';
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    setTimeout(() => {
        errorElement.textContent = '';
    }, 4000);
}

function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    setTimeout(() => {
        formMessage.textContent = '';
    }, 2000);
}

// Fetch ideas from the database
const getIdeas = async () => {
    try {
        const { data, error } = await database.from('idees').select('*');

        if (error) {
            throw error;
        }

        console.log("Idées récupérées avec succès:", data);
        displayIdeas(data); // Call the function to display ideas
    } catch (error) {
        console.error("Erreur lors de la récupération des idées:", error.message);
        alert("Erreur lors de la récupération des idées");
    }
};

// Display ideas on the interface
function displayIdeas(ideas) {
    const ideasContainer = document.getElementById("ideasContainer");
    ideasContainer.innerHTML = ""; // Clear previous content

    ideas.forEach((idea, index) => {
        const truncatedMessage = idea.message.length > 255 ? `${idea.message.substr(0, 255)}...` : idea.message;

        if (index % 3 === 0) {
            const row = document.createElement("div");
            row.className = "row";
            ideasContainer.appendChild(row);
        }

        const row = ideasContainer.lastChild;

        const ideaCard = document.createElement("div");
        ideaCard.className = "col-md-4 col-sm-4 mb-5";

        const card = document.createElement("div");
        card.className = "card";

        if (idea.statut === true) {
            card.classList.add("approved");
        } else if (idea.statut === false) {
            card.classList.add("not-approved");
        }

        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${idea.libelle}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${idea.categorie}</h6>
                <p class="card-text">${truncatedMessage}</p>
                <div class="buttons">
                    ${idea.statut === null ? `
                        <button class="btn approve-btn" onclick="toggleApproval('${idea.id}', true)">
                            <img src="img/approved.svg" alt="Approuver">
                        </button>
                        <button class="btn disapprove-btn" onclick="toggleApproval('${idea.id}', false)">
                            <img src="img/not-approved.svg" alt="Désapprouver">
                        </button>
                    ` : ''}
                    <button class="btn delete-btn" onclick="deleteIdea('${idea.id}')">
                        <img src="img/trashs.svg" alt="Supprimer">
                    </button>
                </div>
            </div>
        `;

        ideaCard.appendChild(card);
        row.appendChild(ideaCard);
    });
}

// Toggle approval status of an idea
async function toggleApproval(ideaId, approved) {
    try {
        const statut = approved;
        const { data, error } = await database
            .from('idees')
            .update({ statut })
            .eq('id', ideaId);

        if (error) {
            throw error;
        }

        console.log(`Idée ${ideaId} ${approved ? 'approuvée' : 'désapprouvée'} avec succès:`, data);
        getIdeas(); // Refresh the list of ideas after modification
    } catch (error) {
        console.error(`Erreur lors de l'${approved ? 'approbation' : 'désapprobation'} de l'idée ${ideaId}:`, error.message);
        alert(`Erreur lors de l'${approved ? 'approbation' : 'désapprobation'} de l'idée`);
    }
}

// Delete an idea
async function deleteIdea(ideaId) {
    try {
        const { data, error } = await database.from('idees').delete().eq('id', ideaId);

        if (error) {
            throw error;
        }

        console.log("Idée supprimée avec succès:", data);
        alert("Idée supprimée avec succès");

        getIdeas(); // Refresh the list of ideas after deletion
    } catch (error) {
        console.error("Erreur lors de la suppression de l'idée:", error.message);
        alert("Erreur lors de la suppression de l'idée");
    }
}

document.addEventListener("DOMContentLoaded", getIdeas); // Initial call to fetch ideas on page load

// Real-time validation for the message field
document.querySelector("#message").addEventListener("input", (e) => {
    const maxLength = 255;
    const messageField = e.target;
    const messageLength = messageField.value.length;

    if (messageLength > maxLength) {
        messageField.value = messageField.value.substring(0, maxLength);
        document.getElementById('messageWarning').textContent = 'test'
    }
});
