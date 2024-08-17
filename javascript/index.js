

const popupInfo = document.querySelector('.popup-info');
const exitBtn = document.querySelector('.exit-btn');
const main = document.querySelector('.main');
const continueBtn = document.querySelector('.continue-btn');
const quizSection = document.querySelector('.quiz-section');
const leftGameBtn = document.querySelector('.left-game');


const hamburgerToggler = document.querySelector(".hamburger");
const navLinksContainer = document.querySelector(".navlinks-container");
const navLinks = document.querySelectorAll(".Navlink");
var screenWidth = window.innerWidth;

const toggleNav = () => {
    const isOpen = navLinksContainer.classList.contains("open");

    if (isOpen) {
        navLinksContainer.style.transform = "translate(-100%)";
    } else {
        navLinksContainer.style.transform = "translate(0)";
    }

    hamburgerToggler.classList.toggle("open");
    const ariaToggle = hamburgerToggler.getAttribute("aria-expanded") === "true" ? "false" : "true";
    hamburgerToggler.setAttribute("aria-expanded", ariaToggle);
    navLinksContainer.classList.toggle("open");
};

hamburgerToggler.addEventListener("click", toggleNav);

if ('serviceWorker' in navigator && 'PushManager' in window) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('../service-worker.js')
            .then(function(registration) {
                console.log('Service Worker enregistré avec succès:', registration);

                // Demander la permission pour les notifications
                Notification.requestPermission().then(function(permission) {
                    if (permission === 'granted') {
                        console.log('Permission pour les notifications accordée.');
                        // Configurez les notifications push ici
                    } else {
                        console.log('Permission pour les notifications refusée.');
                    }
                });
            })
            .catch(function(error) {
                console.error('Échec de l\'enregistrement du Service Worker:', error);
            });
    });
}
const checkAndNotify = () => {
    // Envoi de notification locale si le navigateur le permet
    if (Notification.permission === 'granted') {
        new Notification('Nouveauté sur Accompagnement Finale', {
            body: 'Il y a une nouveauté sur le site Accompagnement Finale ! Revenez vite pour découvrir les dernières informations en cliquant ici.',
            icon: './assets/Icon.png'
        });
    }
};
setInterval(checkAndNotify, 3600000);
// Fermer le menu après avoir cliqué sur un lien
navLinks.forEach(link => {
    if (screenWidth < 900) {
        link.addEventListener("click", () => {
            navLinksContainer.classList.remove("open");
            navLinksContainer.style.transform = "translate(-100%)";
            hamburgerToggler.classList.remove("open");
            hamburgerToggler.setAttribute("aria-expanded", "false");
        });
    }

});
// Adapation de la taille de l'ecran lors du changement de largeur Width
new ResizeObserver(entries => {
    if (entries[0].contentRect.width <= 900) {
        navLinksContainer.style.transition = "transform 0.3s ease-out";
    } else {
        navLinksContainer.style.transition = "none";
    }
}).observe(document.body);

document.addEventListener("click", (event) => {
    const isClickInsideNav = navLinksContainer.contains(event.target);
    const isClickOnHamburger = hamburgerToggler.contains(event.target);

    if (!isClickInsideNav && !isClickOnHamburger) {
        navLinksContainer.classList.remove("open");
        navLinksContainer.style.transform = "translate(-100%)";
        hamburgerToggler.classList.remove("open");
        hamburgerToggler.setAttribute("aria-expanded", "false");
    }
});
document.addEventListener('DOMContentLoaded', async () => {
    const cardsSection = document.getElementById('cardsSection');
    const quizTitle = document.getElementById('quiz-title');
    const quizCategory = document.getElementById('quiz-category');
    const quizScore = document.getElementById('quiz-score');
    const questionText = document.getElementById('question-text');
    const optionList = document.getElementById('option-list');
    const questionTotal = document.getElementById('question-total');
    const nextBtn = document.getElementById('next-btn');
    const validateBtn = document.getElementById('validate-btn');

    let currentQuestionIndex = 0;
    let currentCategory = {};
    let score = 0;
    let selectedOptions = [];
    let isPremium = false; // Utiliser isPremium au lieu de isVip
    let hasAccount = false;
    let storedToken = localStorage.getItem("token");

    if (storedToken) {
        try {
            const userResponse = await fetch('https://burbaapi-production.up.railway.app/api/user', {
                headers: {
                    'Authorization': 'Bearer ' + storedToken
                }
            });
            const userData = await userResponse.json();

            if (userResponse.ok) {
                hasAccount = true;
                if (userData.user.isPremium) { // Vérifier isPremium au lieu de isVip
                    isPremium = true; // Mettre à jour isPremium
                }
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des données utilisateur:', error);
        }
    }

    // Fonction pour charger les catégories depuis l'API
    function fetchCategories() {
        fetch('https://bougmabook-production-36c9.up.railway.app/api/categories')
            .then(response => response.json())
            .then(categories => {
                categories.forEach(category => {
                    const cardDiv = document.createElement('div');
                    cardDiv.classList.add('card');

                    const cardTitle = document.createElement('h2');
                    cardTitle.textContent = category.title;
                    cardDiv.appendChild(cardTitle);

                    const cardDescription = document.createElement('p');
                    cardDescription.textContent = category.description;
                    cardDiv.appendChild(cardDescription);

                    const playButton = document.createElement('button');
                    playButton.classList.add('play-btn');

                    if (hasAccount) {
                        if (isPremium) { // Vérifier isPremium pour le bouton "Jouer"
                            playButton.textContent = 'Jouer';
                            playButton.addEventListener('click', () => {
                                currentCategory = category;
                                loadQuiz();
                                popupInfo.classList.add('active');
                                main.classList.add('active');
                            });
                        } else {
                            playButton.textContent = 'Payer maintenant';
                            playButton.addEventListener('click', () => {
                                window.location.href = './Paiement.html';
                            });
                            
                        }
                    } else {
                        playButton.textContent = 'Inscription';
                        playButton.addEventListener('click', () => {
                            window.location.href = './Inscription.html';
                        });
                    }

                    cardDiv.appendChild(playButton);
                    cardsSection.appendChild(cardDiv);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Fonction pour charger le quiz de la catégorie sélectionnée
    function loadQuiz() {
        quizTitle.textContent = `Accompagnement ${currentCategory.title}`;
        quizCategory.textContent = `Accompagnement ${currentCategory.title}`;
        score = 0;
        currentQuestionIndex = 0;
        selectedOptions = [];
        loadQuestion();
    }

    // Fonction pour charger une question
    function loadQuestion() {
        const question = currentCategory.questions[currentQuestionIndex];
        questionText.textContent = question.text;
        optionList.innerHTML = '';
        selectedOptions = [];
        question.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.classList.add('option');
            optionDiv.innerHTML = `<span>${String.fromCharCode(65 + index)}. ${option.text}</span>`;
            optionDiv.setAttribute('data-id', option._id);
            optionDiv.addEventListener('click', () => toggleOption(optionDiv, option));
            optionList.appendChild(optionDiv);
        });
        updateScore();
    }

    // Fonction pour sélectionner ou désélectionner une option
    function toggleOption(optionDiv, option) {
        optionDiv.classList.toggle('selected');
        const optionId = option._id;
        if (selectedOptions.includes(optionId)) {
            selectedOptions = selectedOptions.filter(id => id !== optionId);
        } else {
            selectedOptions.push(optionId);
        }
    }

    // Fonction pour valider les réponses
    function validateAnswers() {
        const question = currentCategory.questions[currentQuestionIndex];
        const options = question.options;
        let correctAnswers = 0;

        options.forEach(option => {
            const optionDiv = optionList.querySelector(`[data-id="${option._id}"]`);
            if (option.isCorrect) {
                optionDiv.classList.add('correct');
                if (selectedOptions.includes(option._id)) {
                    correctAnswers++;
                }
            } else if (selectedOptions.includes(option._id)) {
                optionDiv.classList.add('incorrect');
            }
        });

        // Incrémenter le score uniquement si toutes les bonnes réponses sont sélectionnées
        if (correctAnswers === question.options.filter(opt => opt.isCorrect).length) {
            score++;
        }
    }

    // Fonction pour mettre à jour le score
    function updateScore() {
        quizScore.textContent = `Score: ${score}/${currentCategory.questions.length}`;
        questionTotal.textContent = `${currentQuestionIndex + 1} sur ${currentCategory.questions.length} Questions`;
    }

    // Écouter le clic sur le bouton "Valider"
    validateBtn.addEventListener('click', () => {
        validateAnswers();
        nextBtn.disabled = false;
    });

    // Écouter le clic sur le bouton "Suivant"
    nextBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < currentCategory.questions.length) {
            loadQuestion();
        } else {
            alert('Quiz terminé!');
            quizSection.classList.remove('active');
            main.classList.remove('active');
        }
        nextBtn.disabled = true;
    });

    // Gérer les boutons de popup
    exitBtn.onclick = () => {
        popupInfo.classList.remove('active');
        main.classList.remove('active');
    };

    continueBtn.onclick = () => {
        quizSection.classList.add('active');
        popupInfo.classList.remove('active');
        main.classList.remove('active');
    };

    leftGameBtn.onclick = () => {
        quizSection.classList.remove('active');
        main.classList.remove('active');
        popupInfo.classList.remove('active');
    };

    // Appeler la fonction pour charger les catégories
    fetchCategories();
});




//<![CDATA[

!function(){
	function t(t){

		var n=t.getContext("2d"),e=0,i=0,o=[],d=function(){
			this.x=this.y=this.dx=this.dy=0,this.reset()
		};

		function a(){
			e=window.innerWidth,i=window.innerHeight,t.width=e,t.height=i,function(t){
				if(t!=o.length){
					o=[];for(var n=0;n<t;n++)o.push(new d)
				}
			}(e*i/1e4)
		}

		d.prototype.reset=function(){
			this.y=Math.random()*i,this.x=Math.random()*e,this.dx=1*Math.random()-.5,this.dy=.5*Math.random()+.5
		},a(),function t(){
				n.clearRect(0,0,e,i),n.fillStyle="rgba(255,255,255,.1)",o.forEach(function(t){
					t.y+=t.dy,t.x+=t.dx,t.y>i&&(t.y=0),t.x>e&&(t.reset(),t.y=0),n.beginPath(),n.arc(t.x,t.y,5,0,2*Math.PI,!1),n.fill()
				}),window.requestAnimationFrame(t)
		}(),window.addEventListener("resize",a)
	}

	var n;
	n=function(){
		t(document.getElementById("coding"))
	},"loading"!=document.readyState?n():document.addEventListener("DOMContentLoaded",n)
}();

//]]>
