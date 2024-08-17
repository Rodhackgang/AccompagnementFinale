const accordion = document.getElementsByClassName("content-container");

for (i= 0; i < accordion.length; i++){
    accordion[i].addEventListener("click", function(){
        this.classList.toggle("active");
    })
};

var comments = document.getElementById('comment');
var moreComment = document.getElementById('more-comment');
var quotes = [
    "La formation est très complète et couvre tous les aspects de l'infographie.",
    "Les professeurs sont très compétents et disponibles pour répondre aux questions.",
    "Les travaux pratiques sont très intéressants et permettent de mettre en pratique les connaissances acquises.",
    "Les locaux sont modernes et bien équipés pour les besoins de la formation.",
    "Les stages en entreprise sont très utiles pour acquérir de l'expérience professionnelle.",
    "La formation permet d'acquérir des compétences très recherchées sur le marché du travail.",
    "Les projets de groupe permettent de travailler en équipe et de développer des compétences sociales.",
    "Les supports de cours sont très bien conçus et permettent de suivre les cours facilement.",
    "Les cours sont très variés et permettent de découvrir de nombreux aspects de l'infographie.",
    "Les évaluations sont justes et permettent de mesurer les progrès réalisés au fil de la formation.",
    "Le contenu de la formation est très intéressant et pertinent pour le marché du travail.",
    "Les horaires de cours sont flexibles et permettent de concilier facilement la formation avec d'autres activités.",
    "Les professeurs sont très à l'écoute des besoins des étudiants et s'adaptent à leur rythme d'apprentissage.",
    "La formation est très bien organisée et permet de suivre facilement les différents modules.",
    "Les outils et logiciels utilisés pendant la formation sont très pertinents pour le marché du travail."
  ];
  

moreComment.addEventListener("click", () => {
  var random = Math.floor(Math.random() * quotes.length);
  comments.innerHTML = "“"+ quotes[random]+ "”";
});


