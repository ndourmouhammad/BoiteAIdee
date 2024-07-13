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

            save.innerText = "Enregistrement en cours...";

            // Affichage pour vérification
            console.log(libelle, categorie, message);

            const user = await authenticateUser();

            if (user) {
                try {
                    const { data, error } = await database
                        .from("idees")
                        .insert([{ libelle, categorie, message }]);

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
            getIdee();
        });

        const getIdee = async () => {
            try {
                console.log("getIdee function started");
                const tbody = document.getElementById("tbody");
                const loading = document.getElementById("loading");
                let tr = "";

                loading.innerHTML = "Loading...";
                console.log("Fetching data from database");
                const res = await database.from("idees").select("*");
                console.log("Data fetched", res);

                if (res.error) {
                    console.error("Error fetching data:", res.error);
                    loading.innerHTML = "Error loading data";
                    return;
                }

                if (res.data.length === 0) {
                    console.log("No data available");
                    loading.innerHTML = "No data available";
                    return;
                }

                for (var i in res.data) {
                    tr += `<tr>
                        <td>${res.data[i].libelle}</td>
                        <td>${res.data[i].categorie}</td>
                        <td>${res.data[i].message}</td>
                        <td><button onclick='deleteIdea(${res.data[i].id})' class="btn btn-danger">Supprimer</button></td>
                    </tr>`;
                }
                tbody.innerHTML = tr;
                loading.innerHTML = "";
            } catch (error) {
                console.error("Error in getIdee function", error);
                loading.innerHTML = "Error loading data";
            }
        };

        const deleteIdea = async (id) => {
            try {
                console.log(`Attempting to delete idea with ID: ${id}`);
                const { data, error } = await database.from("idees").delete().eq("id", id);

                if (error) {
                    console.error("Error deleting idea:", error);
                    alert("Erreur lors de la suppression");
                    return;
                }

                alert("Supprimée avec succès");
                getIdee();
            } catch (error) {
                console.error("Error in deleteIdea function", error);
            }
        };

        window.deleteIdea = deleteIdea;
        document.addEventListener("DOMContentLoaded", getIdee);
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
