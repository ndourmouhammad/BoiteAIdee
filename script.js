const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzaHZmYmlpZHVzemJjcHptamZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA4MDk1MzUsImV4cCI6MjAzNjM4NTUzNX0.u5vyuxvSL9JjFLsHphtIFmpoFeKuq6gxToL-WNuIMyQ";
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
    let statut = document.querySelector("#statut").value;
  
    save.innerText = "Enregistrement en cours...";
  
    // Affichage pour vérification
    console.log(libelle, categorie, message, statut);
  
    const user = await authenticateUser();
  
    if (user) {
      try {
        // Construction de l'objet à insérer
        const insertObject = { libelle, categorie, message, statut };
  
        // Ajout du champ statut si sa valeur n'est pas null
      if (statut !== "") {
        insertObject.statut = statut === null; // Convertir la chaîne "true"/"false" en boolean
      }
  
        // Insertion dans la base de données Supabase
        const { data, error } = await database
          .from("idees")
          .insert([insertObject]);
  
        if (error) {
          throw error;
        }
  
        alert("Idée ajoutée avec succès:", data);
      } catch (error) {
        console.error("Erreur lors de l'ajout de l'idée:", error);
      }
    }
  
    save.innerText = "Ajouter une idée";
    document.getElementById("ideaForm").reset();
    getIdeas();
  });
  


// Fonction pour récupérer les idées depuis database
const getIdeas = async () => {
    try {
        const { data, error } = await database.from('idees').select('*');

        if (error) {
            throw error;
        }

        console.log("Idées récupérées avec succès:", data);
        displayIdeas(data); // Appel de la fonction pour afficher les idées
    } catch (error) {
        console.error("Erreur lors de la récupération des idées:", error.message);
        alert("Erreur lors de la récupération des idées");
    }
};

/*
      ideasContainer.innerHTML = '';

      ideas.forEach((idea, index) => {
          const truncatedMessage = idea.message.length > 255 ? `${idea.message.substr(0, 255)}...` : idea.message;

          const ideaCard = document.createElement('div');
          ideaCard.className = `col-md-4 col-sm-4 mb-5`;

          // Déterminer la classe pour la carte en fonction de approved
          let cardClass = 'card';
          if (idea.approved === true) {
              cardClass += ' approved';
          } else if (idea.approved === false) {
              cardClass += ' not-approved';
          }

          ideaCard.innerHTML = `
              <div class="${cardClass}">
                  <div class="card-body">
                      <h5 class="card-title">${idea.libelle}</h5>
                      <h6 class="card-subtitle mb-2 text-muted">${idea.categorie}</h6>
                      <p class="card-text">${truncatedMessage}</p>
                      <div class="boutons">
                          ${idea.approved === null ? `
                              <button class="btn approve-btn" onclick="toggleApproval(${index}, true)">
                                  <img src="img/approved.svg" alt="Approuver">
                              </button>
                              <button class="btn disapprove-btn" onclick="toggleApproval(${index}, false)">
                                  <img src="img/not-approved.svg" alt="Désapprouver">
                              </button>
                          ` : ''}
                          <button class="btn delete-btn" onclick="deleteIdea(${index})">
                              <img src="img/trashs.svg" alt="Supprimer">
                          </button>
                      </div>
                  </div>
              </div>
          `;
          ideasContainer.appendChild(ideaCard);
      });
  }
*/

// Fonction pour afficher les idées dans l'interface
function displayIdeas(ideas) {
    const ideasContainer = document.getElementById("ideasContainer");
    ideasContainer.innerHTML = ""; // Efface le contenu précédent

    ideas.forEach((idea, index) => {
        const truncatedMessage = idea.message.length > 255 ? `${idea.message.substr(0, 255)}...` : idea.message;

        // Création d'une nouvelle ligne toutes les 3 idées pour respecter le système de grille de Bootstrap 3
        if (index % 3 === 0) {
            const row = document.createElement("div");
            row.className = "row";
            ideasContainer.appendChild(row);
        }

        const row = ideasContainer.lastChild; // Récupération de la dernière ligne ajoutée

        const ideaCard = document.createElement("div");
        ideaCard.className = "col-md-4 col-sm-4 mb-5";

        const card = document.createElement("div");
        card.className = "card";

        // Déterminez la classe en fonction de l'état d'approbation
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
                    ${
                        
                             `
                                <button class="btn approve-btn" onclick="toggleApproval('${idea.id}', true)">
                                    <img src="img/approved.svg" alt="Image illustrant une idée">
                                </button>
                                <button class="btn disapprove-btn" onclick="toggleApproval('${idea.id}', false)">
                                    <img src="img/not-approved.svg" alt="Image illustrant une idée">
                                </button>
                            `
                            
                    }
                    <button class="btn delete-btn" onclick="deleteIdea('${idea.id}')">
                        <img src="img/trashs.svg" alt="Image illustrant une idée">
                    </button>
                </div>
            </div>
        `;

        ideaCard.appendChild(card);
        row.appendChild(ideaCard); // Ajout de la carte à la ligne actuelle
    });
}

// Fonction pour basculer l'état d'approbation d'une idée
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
        getIdeas(); // Rafraîchir la liste des idées après modification
    } catch (error) {
        console.error(`Erreur lors de l'${approved ? 'approbation' : 'désapprobation'} de l'idée ${ideaId}:`, error.message);
        alert(`Erreur lors de l'${approved ? 'approbation' : 'désapprobation'} de l'idée`);
    }
}



// Fonction pour supprimer une idée
async function deleteIdea(ideaId) {
    try {
        const { data, error } = await database.from('idees').delete().eq('id', ideaId);

        if (error) {
            throw error;
        }

        console.log("Idée supprimée avec succès:", data);
        alert("Idée supprimée avec succès");

        getIdeas(); // Rafraîchir la liste des idées après suppression
    } catch (error) {
        console.error("Erreur lors de la suppression de l'idée:", error.message);
        alert("Erreur lors de la suppression de l'idée");
    }
}

document.addEventListener("DOMContentLoaded", getIdeas); // Appel initial pour récupérer les idées au chargement de la page

// document.addEventListener('DOMContentLoaded', function() {
//   const form = document.getElementById('ideaForm');
//   const libelleInput = document.getElementById('libelle');
//   const categorieInput = document.getElementById('categorie');
//   const messageInput = document.getElementById('message');
//   const messageWarning = document.getElementById('messageWarning');
//   const ideasContainer = document.getElementById('ideasContainer');
//   const flashmessage = document.getElementById('flashmessage');

//   // Load ideas from local storage
//   let ideas = JSON.parse(localStorage.getItem('ideas')) || [];

//   form.addEventListener('submit', function(event) {
//       event.preventDefault();
//       const libelle = libelleInput.value.trim();
//       const categorie = categorieInput.value;
//       const message = messageInput.value.trim();

//       clearErrors();

//       if (validateForm(libelle, categorie, message)) {
//           const idea = {
//               libelle: libelle,
//               categorie: categorie,
//               message: message,
//               approved: null
//           };

//           ideas.push(idea);
//           localStorage.setItem('ideas', JSON.stringify(ideas));
//           displayIdeas();
//           form.reset();
//           showFormMessage('Idée ajoutée avec succès !', 'success');
//       } else {
//           flashmessage.textContent = 'Veuillez corriger les erreurs et réessayer.';
//           flashmessage.style.color = 'red';
//           flashmessage.style.textAlign = 'center';
//           flashmessage.style.fontSize = '24px';
//           form.style.display = "none";

//           setTimeout(() => {
//               flashmessage.textContent = '';
//               form.style.display = "block";
//           }, 2000);
//       }
//   });

//   function validateForm(libelle, categorie, message) {
//       let isValid = true;
//       const libelleRegex = /^[\p{L}\p{M}\s]{3,50}$/u; // Entre 3 et 50 caractères, incluant les lettres avec accents
//       const messageRegex = /^[\p{L}\p{M}\p{P}\p{N}\s]{3,255}$/u; // Entre 3 et 500 caractères, incluant lettres, chiffres, ponctuation, espaces
//       const validCategories = ['politique', 'sport', 'sante', 'education']; // Les catégories valides

//       if (!libelleRegex.test(libelle)) {
//           showError('libelleError', 'Le libellé doit contenir entre 3 et 50 chaînes de caractères.');
//           isValid = false;
//       }

//       if (!validCategories.includes(categorie)) {
//           showError('categorieError', 'Veuillez choisir une catégorie valide.');
//           isValid = false;
//       }

//       if (!messageRegex.test(message)) {
//           showError('messageError', 'Le message doit contenir entre 3 et 255 chaînes de caractères.');
//           isValid = false;
//       }

//       return isValid;
//   }

//   function clearErrors() {
//       document.getElementById('libelleError').textContent = '';
//       document.getElementById('categorieError').textContent = '';
//       document.getElementById('messageError').textContent = '';
//   }

//   function showError(elementId, message) {
//       const errorElement = document.getElementById(elementId);
//       errorElement.textContent = message;
//       setTimeout(() => {
//           errorElement.textContent = '';
//       }, 4000);
//   }

//   function showFormMessage(message, type) {
//       const formMessage = document.getElementById('formMessage');
//       formMessage.textContent = message;
//       formMessage.className = `form-message ${type}`;
//       setTimeout(() => {
//           formMessage.textContent = '';
//       }, 2000);
//   }

//   function displayIdeas() {
//       ideasContainer.innerHTML = '';

//       ideas.forEach((idea, index) => {
//           const truncatedMessage = idea.message.length > 255 ? `${idea.message.substr(0, 255)}...` : idea.message;

//           const ideaCard = document.createElement('div');
//           ideaCard.className = `col-md-4 col-sm-4 mb-5`;

//           // Déterminer la classe pour la carte en fonction de approved
//           let cardClass = 'card';
//           if (idea.approved === true) {
//               cardClass += ' approved';
//           } else if (idea.approved === false) {
//               cardClass += ' not-approved';
//           }

//           ideaCard.innerHTML = `
//               <div class="${cardClass}">
//                   <div class="card-body">
//                       <h5 class="card-title">${idea.libelle}</h5>
//                       <h6 class="card-subtitle mb-2 text-muted">${idea.categorie}</h6>
//                       <p class="card-text">${truncatedMessage}</p>
//                       <div class="boutons">
//                           ${idea.approved === null ? `
//                               <button class="btn approve-btn" onclick="toggleApproval(${index}, true)">
//                                   <img src="img/approved.svg" alt="Approuver">
//                               </button>
//                               <button class="btn disapprove-btn" onclick="toggleApproval(${index}, false)">
//                                   <img src="img/not-approved.svg" alt="Désapprouver">
//                               </button>
//                           ` : ''}
//                           <button class="btn delete-btn" onclick="deleteIdea(${index})">
//                               <img src="img/trashs.svg" alt="Supprimer">
//                           </button>
//                       </div>
//                   </div>
//               </div>
//           `;
//           ideasContainer.appendChild(ideaCard);
//       });
//   }

//   function toggleApproval(index, approve) {
//       ideas[index].approved = approve;
//       localStorage.setItem('ideas', JSON.stringify(ideas)); // Mettre à jour le local storage
//       displayIdeas(); // Rafraîchir l'affichage des idées après modification
//   }

//   function deleteIdea(index) {
//       ideas.splice(index, 1);
//       localStorage.setItem('ideas', JSON.stringify(ideas)); // Mettre à jour le local storage
//       displayIdeas(); // Rafraîchir l'affichage des idées après suppression
//   }

//   window.toggleApproval = function(index, approve) {
//       ideas[index].approved = approve;
//       localStorage.setItem('ideas', JSON.stringify(ideas)); // Update local storage
//       displayIdeas();
//   };

//   window.deleteIdea = function(index) {
//       ideas.splice(index, 1);
//       localStorage.setItem('ideas', JSON.stringify(ideas)); // Update local storage
//       displayIdeas();
//   };

//   // Initial display of ideas
//   displayIdeas();
//   // Add input event listener to enforce character limit on textarea
//   messageInput.addEventListener('input', () => {
//       if (messageInput.value.length > 255) {
//           messageInput.value = messageInput.value.substr(0, 255);
//           messageWarning.style.display = 'block';
//       } else {
//           messageWarning.style.display = 'none';
//       }
//   });
// });
