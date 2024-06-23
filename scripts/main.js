// ---------- HomePage ----------
// ------------------------------

// -- Click sur BurgerMenu --
let burgerMenu = document.querySelector('.burgerMenu')
let menuDown = document.querySelector('.menuDown')

if (burgerMenu){
  burgerMenu.addEventListener('click', function(){
    this.classList.toggle('burgerMenuActive')
    menuDown.classList.toggle('menuDownActive')
  })
} else {
  console.error("L'élément burgerMenu n'a pas été trouvé dans le DOM.")
}

// -- Menu disparait au Scroll --
let navBox = document.querySelector('.navBox')
let lastScrollay = 0

function menuScroll(){
  let dejaScrollay = Math.max(window.scrollY, 0)
  if (dejaScrollay > lastScrollay){
    navBox.classList.add('slideMenu') 
  } else {
    navBox.classList.remove('slideMenu')
  }
  lastScrollay = dejaScrollay
}
window.addEventListener('scroll', menuScroll)

// -- Bulle aubergine qui bouge verticalement --
window.addEventListener('scroll', function(){
  const aubergineCircle = document.querySelector('.aubergineCircle')
  const scrollY = window.scrollY

  // Calculer la nouvelle position verticale en fonction du scroll
  const newPosition = `${50 + (scrollY * 0.05)}%` // Ajuste le coefficient selon la vitesse souhaitée

  // Modifier la position verticale de la bulle
  aubergineCircle.style.top = newPosition
})

// -- Animation sur Approche et les étoiles dans Témoignages --
const elements = {
  approche: document.querySelectorAll(".approcheHide"),
  temoignageBox: document.querySelectorAll(".temoignageHidden"),
}

function easyscroll(elementsList, className){
  elementsList.forEach((element, index) => {
    if (window.scrollY + window.innerHeight > element.offsetTop + element.offsetHeight / 2){
      setTimeout(() => {
        element.classList.add(className)
      }, index * 300)
    }
  })
}

function handleScroll() {
  easyscroll(elements.approche, "approcheShow")
  easyscroll(elements.temoignageBox, "temoignageShow")

  const firstTemoignageBox = elements.temoignageBox[0]
  const temoignageShowFinished = firstTemoignageBox.classList.contains('temoignageShow')

  if (temoignageShowFinished) {
    startAnimationOnScroll()
  }
}

handleScroll()
window.addEventListener("scroll", handleScroll)

function startAnimationOnScroll(){
  const starsContainers = document.querySelectorAll('.stars')
  let animationTriggered = false

  function animateStarsIfVisible(){
    if (!animationTriggered){
      starsContainers.forEach((container, containerIndex) => {
        const stars = container.querySelectorAll('.fa-star')
        const starsToAnimate = (containerIndex === 1) ? 4 : stars.length

        const containerTop = container.getBoundingClientRect().top
        const isVisible = containerTop < window.innerHeight

        if (isVisible){
          stars.forEach((star, index) => {
            if (index < starsToAnimate){
              setTimeout(() => {
                star.classList.add('aubergine')
              }, index * 600)
            }
          })
          animationTriggered = true
        }
      })
    }
  }

  function handleScrollForStars() {
    animateStarsIfVisible()
  }

  window.addEventListener("scroll", handleScrollForStars)
}

// -- Gestion des boutons Se connecter et Accède à ton compte avec Firesbase
// Importez les fonctionnalités nécessaires depuis le SDK Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"

// Votre configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBiXgbkHickHvKv5JVQu02gLd8x8DhQLU4",
  authDomain: "pamelagdigital-11c88.firebaseapp.com",
  projectId: "pamelagdigital-11c88",
  storageBucket: "pamelagdigital-11c88.appspot.com",
  messagingSenderId: "883235524876",
  appId: "1:883235524876:web:4c638ed821fdff46717929"
}

// Initialisez votre application Firebase
const firebaseApp = initializeApp(firebaseConfig)

// Obtenez une référence à l'objet d'authentification
const auth = getAuth(firebaseApp)

document.addEventListener('DOMContentLoaded', function(){
  let connectLinks = document.querySelectorAll('.logConnexion')
  let accountLinks = document.querySelectorAll(".logMonCompte")

  // Vérifie si l'utilisateur est connecté
  let userLoggedIn = localStorage.getItem('userLoggedIn') === 'true'

  // Met à jour le texte des liens en fonction de l'état de connexion
  updateLinkText()

  // Ajoute un gestionnaire d'événements de clic à chaque lien "Connexion"
  connectLinks.forEach(function(connectLink){
      connectLink.addEventListener('click', function(e){
          e.preventDefault()

          // Vérifie si l'utilisateur est connecté
          if (userLoggedIn){
              // Déconnexion de l'utilisateur
              localStorage.removeItem('userLoggedIn') // Supprimer la clé de connexion
              userLoggedIn = false // Mettre à jour l'état de connexion
              updateLinkText() // Mettre à jour le texte des liens de connexion
              window.location.href = 'index.html' // Redirection vers la page d'accueil
          } else {
              // Redirigez l'utilisateur vers la page de connexion
              window.location.href = 'identification.html'
          }
      })
  })

  // Fonction pour mettre à jour le texte des liens de connexion et l'affichage des liens de compte en fonction de l'état de connexion
  function updateLinkText() {
    let connectLinks = document.querySelectorAll('.logConnexion')
    let userLoggedIn = localStorage.getItem('userLoggedIn') === 'true'
    let accountLinks = document.querySelectorAll(".logMonCompte")

    connectLinks.forEach(function(connectLink){
        if (userLoggedIn){
            // Change le texte des liens si l'utilisateur est connecté
            connectLink.innerHTML = '<i class="fa-regular fa-user"></i> Se déconnecter'
        } else {
            connectLink.innerHTML = '<i class="fa-regular fa-user"></i> Se connecter' // Change le texte des liens si l'utilisateur est déconnecté
        }
    })

    accountLinks.forEach(function(accountLink){
        if (userLoggedIn){
            accountLink.style.display = "block"
        } else {
            accountLink.style.display = "none"
        }
    })
  }
})

// -- Cookies --
document.addEventListener('DOMContentLoaded', function(){
  const cookie = document.querySelector(".cookie")
  const accept = document.querySelector(".accept")
  const refuse = document.querySelector(".refuse")

  // Vérifiez si l'élément cookie existe
  if (!cookie){
    console.error("L'élément avec la classe .cookie n'a pas été trouvé dans le DOM.")
    return
  }

  // Afficher le pop-up
  cookie.classList.add("cookieShow")

  // Vérifiez si les boutons existent
  if (!accept){
    console.error("L'élément avec la classe .accept n'a pas été trouvé dans le DOM.")
    return
  }
  if (!refuse){
    console.error("L'élément avec la classe .refuse n'a pas été trouvé dans le DOM.")
    return
  }

  // Gérer l'événement du bouton Accepter
  accept.addEventListener('click', function(){
    // Définir le cookie de consentement
    Cookies.set('consent', 'true')
    console.log('Consentement accepté')
    cookie.style.display = 'none'
  })

  // Gérer l'événement du bouton Refuser
  refuse.addEventListener('click', function(){
    Cookies.set('consent', 'false')
    console.log('Consentement refusé')
    cookie.style.display = 'none'
  })

  // Vérifier si l'utilisateur a déjà donné son consentement
  const consent = Cookies.get('consent')
  if (consent === 'true' || consent === 'false'){
    cookie.style.display = 'none'
  }
})

const emailIcon = document.querySelector('.emailIcon');

// Écoutez les clics sur le lien emailIcon
emailIcon.addEventListener('click', function(event) {
    event.preventDefault();

    // Sélectionnez le parent .slideform
    const slideform = document.querySelector('.slideform');

    // Toggle de la classe slideFormback sur .slideform
    slideform.classList.toggle('slideformback');
});

const sendEmailLink = document.getElementById('sendEmail');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    sendEmailLink.addEventListener('click', (event) => {
        event.preventDefault();

        const subject = `Message de ${encodeURIComponent(nameInput.value)}`;
        const body = `${encodeURIComponent(messageInput.value)}%0A%0AEnvoyé%20par%20${encodeURIComponent(emailInput.value)}`;

        const email = `mailto:coach@example.com?subject=${subject}&body=${body}`;

        sendEmailLink.setAttribute('href', email);

        // Ouvrir le client de messagerie de l'utilisateur
        window.open(email, '_blank');
    });

    tippy('.emailIcon', {
      content: `Tu peux m'envoyer un e-mail ici !`,
      animation: 'scale-extreme',
      theme: 'light',
  })




















