document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('ideaForm');
    const libelleInput = document.getElementById('libelle');
    const categorieInput = document.getElementById('categorie');
    const messageInput = document.getElementById('message');
    const ideasContainer = document.getElementById('ideasContainer');
    const flashmessage = document.getElementById('flashmessage');
  
    // Load ideas from local storage
    let ideas = JSON.parse(localStorage.getItem('ideas')) || [];
  
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      const libelle = libelleInput.value.trim();
      const categorie = categorieInput.value;
      const message = messageInput.value.trim();
  
      clearErrors();
  
      if (validateForm(libelle, categorie, message)) {
        const idea = {
          libelle: libelle,
          categorie: categorie,
          message: message,
          approved: false
        };
  
        ideas.push(idea);
        localStorage.setItem('ideas', JSON.stringify(ideas)); // Save to local storage
        displayIdeas();
        form.reset();
        showFormMessage('Idée ajoutée avec succès !', 'success');
      } else {
        flashmessage.textContent = 'Veuillez corriger les erreurs et réessayer.';
        flashmessage.style.color = 'red';
        form.style.display = "none";
                
        setTimeout(() => {
          flashmessage.textContent = '';
          form.style.display = "block";
        }, 2000);
      }
    });
  
    function validateForm(libelle, categorie, message) {
        let isValid = true;
        const libelleRegex = /^[\p{L}\p{M}\s]{3,50}$/u; // Entre 3 et 50 caractères, incluant les lettres avec accents
        const messageRegex = /^[\p{L}\p{M}\p{P}\p{N}\s]{3,500}$/u; // Entre 3 et 500 caractères, incluant lettres, chiffres, ponctuation, espaces
        const validCategories = ['politique', 'sport', 'sante', 'education']; // Les catégories valides
      
        if (!libelleRegex.test(libelle)) {
            showError('libelleError', 'Le libellé doit contenir entre 3 et 50 chaînes de caractères.');
            isValid = false;
        }
      
        if (!validCategories.includes(categorie)) {
            showError('categorieError', 'Veuillez choisir une catégorie valide.');
            isValid = false;
        }
      
        if (!messageRegex.test(message)) {
            showError('messageError', 'Le message doit contenir entre 3 et 500 chaînes de caractères.');
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
  
    function displayIdeas() {
      ideasContainer.innerHTML = '';
  
      ideas.forEach((idea, index) => {
        const ideaDiv = document.createElement('div');
        ideaDiv.className = 'idea';
        
        ideaDiv.innerHTML = `
          <h2>${idea.libelle}</h2>
          <p><strong>Catégorie:</strong> ${idea.categorie}</p>
          <p>${idea.message}</p>
          <div class="idea-actions">
            <button onclick="toggleApproval(${index})">${idea.approved ? 'Désapprouver' : 'Approuver'}</button>
            <button onclick="deleteIdea(${index})">Supprimer</button>
          </div>
        `;
  
        ideasContainer.appendChild(ideaDiv);
      });
    }
  
    window.toggleApproval = function(index) {
      ideas[index].approved = !ideas[index].approved;
      localStorage.setItem('ideas', JSON.stringify(ideas)); // Update local storage
      displayIdeas();
    };
  
    window.deleteIdea = function(index) {
      ideas.splice(index, 1);
      localStorage.setItem('ideas', JSON.stringify(ideas)); // Update local storage
      displayIdeas();
    };

    // Initial display of ideas
    displayIdeas();
});
