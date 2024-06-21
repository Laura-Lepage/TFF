// ---------- Identification ----------
// ------------------------------------

// -- Click sur la croix page identification --
document.addEventListener("DOMContentLoaded", function(){
    const identificationCross = document.querySelector(".identificationCross")
    identificationCross.addEventListener("click", function(){
        window.location.href = "index.html"
    })
})

// -- Ajouts des adresses emails + résultats du quiz dans Firebase et Firestore
// Importer les fonctions nécessaires de Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBiXgbkHickHvKv5JVQu02gLd8x8DhQLU4",
    authDomain: "pamelagdigital-11c88.firebaseapp.com",
    projectId: "pamelagdigital-11c88",
    storageBucket: "pamelagdigital-11c88.appspot.com",
    messagingSenderId: "883235524876",
    appId: "1:883235524876:web:4c638ed821fdff46717929"
}

// Initialiser Firebase
const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)

// Fonction pour sauvegarder le prénom de l'utilisateur dans Firestore
async function saveName(userId, firstname){
    try {
        await setDoc(doc(db, "Users", userId), { firstname: firstname }, { merge: true })
        console.log("Prénom enregistré avec succès !")

        // Vérifier l'existence de la collection Inscriptions
        const totalRef = doc(db, 'Inscriptions', 'Total')
        const totalDoc = await getDoc(totalRef)

        if (!totalDoc.exists()){
            // Créer la collection SubscribersTotal avec un compteur initialisé à 1
            await setDoc(totalRef, { Total: 1 })
            console.log("Collection SubscribersTotal créée avec succès !")
        } else {
            // Incrémenter le compteur existant
            await updateDoc(totalRef, {
                Total: totalDoc.data().Total + 1
            })
            console.log("Compteur incrémenté avec succès !")
        }
    } catch (e) {
        console.error("Erreur lors de l'enregistrement du prénom: ", e)
    }
}

// Variables pour la gestion de l'affichage de l'inscription et connexion
let inscriptionPartLink = document.querySelector('#signupLink')
let connexionPartLink = document.querySelector('#loginLink')
let inscriptionDiv = document.querySelector('#signupSection')
let connexionDiv = document.querySelector('#loginSection')

// Écouteur de click pour l'affichage Inscription ou Se connecter
inscriptionPartLink.classList.add('boldLog') // Mettre la connexion en gras automatiquement
inscriptionPartLink.addEventListener('click', function(e){
    e.preventDefault()
    inscriptionDiv.style.display = 'block'
    connexionDiv.style.display = 'none'
    inscriptionPartLink.classList.add('boldLog')
    connexionPartLink.classList.remove('boldLog')
})

// Écouteur de click pour l'affichage de la connexion
connexionPartLink.addEventListener('click', function(e){
    e.preventDefault()
    inscriptionDiv.style.display = 'none'
    connexionDiv.style.display = 'block'
    inscriptionPartLink.classList.remove('boldLog')
    connexionPartLink.classList.add('boldLog')
})

// Écouteur pour la soumission du formulaire d'inscription
document.querySelector('#signupForm').addEventListener('submit', async function(e){
    e.preventDefault()

    let firstname = document.querySelector('#nameSignup').value
    let email = document.querySelector('#signupEmail').value
    let password = document.querySelector('#signupPassword').value
    let confirmPassword = document.querySelector('#signupConfirmPassword').value
    let inscriptionConfirmed = document.querySelector('.inscriptionMsg')

    // Vérifier si les mots de passe correspondent
    if (password !== confirmPassword){
        inscriptionConfirmed.textContent = "Les mots de passe ne correspondent pas !"
        return
    }

    // Vérifier la longueur du mot de passe
    if (password.length < 6){
        inscriptionConfirmed.textContent = 'Le mot de passe doit contenir au moins 6 caractères.'
        return
    }

    try {
        // Créer un nouvel utilisateur avec Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)

        // Inscription réussie
        console.log("Inscription réussie !")
            // inscriptionConfirmed.innerHTML = "Inscription réussie !"
        const user = userCredential.user
        await saveName(user.uid, firstname)
        localStorage.setItem('userLoggedIn', 'true')

        // Redirection après l'inscription
        window.location.href = 'moncompte.html'
    } catch (error) {
        // Gestion des erreurs Firebase
        var errorCode = error.code
        var errorMessage = error.message

        if (errorCode === 'auth/email-already-in-use'){
            inscriptionConfirmed.textContent = 'Tu as déjà un compte !'
        } else {
            inscriptionConfirmed.textContent = errorMessage
        }
    }
})

// Écouteur pour la soumission du formulaire de connexion
document.querySelector('#loginForm').addEventListener('submit', function(e){
    e.preventDefault()

    let email = document.querySelector('#loginEmail').value
    let password = document.querySelector('#loginPassword').value
    let connexionConfirmed = document.querySelector(".connexionMsg")

    // Connexion de l'utilisateur avec Firebase
    signInWithEmailAndPassword(auth, email, password)
        .then(function(userCredential) {
            // Connexion réussie
            console.log("Connexion réussie !")
            localStorage.setItem('userLoggedIn', 'true')
            window.location.href = 'moncompte.html' // Redirection après la connexion
        })
        .catch(function(error) {
            // Gestion des erreurs Firebase
            connexionConfirmed.textContent = "Connexion impossible. Vérifie que ton adresse e-mail et/ou ton mot de passe sont corrects."
        })
})

// Écouteur pour la manipulation des mots de passe visibles/invisibles
document.addEventListener('DOMContentLoaded', function(){
    const togglePasswordIcons = document.querySelectorAll('.togglePassword')
    const passwordInputs = document.querySelectorAll('.signupPasswordeye')

    togglePasswordIcons.forEach(function(icon, index){
        icon.addEventListener('click', function(){
            // Basculer entre le type d'input 'password' et 'text'
            const type = passwordInputs[index].getAttribute('type') === 'password' ? 'text' : 'password'
            passwordInputs[index].setAttribute('type', type)

            // Basculer entre l'icône d'œil ouvert et d'œil barré
            if (type === 'text'){
                this.classList.remove('fa-eye')
                this.classList.add('fa-eye-slash')
            } else {
                this.classList.remove('fa-eye-slash')
                this.classList.add('fa-eye')
            }
        })
    })
})

// Ajouter un écouteur pour le lien "Mot de passe oublié ?"
document.getElementById('forgotPasswordLink').addEventListener('click', function(e) {
    e.preventDefault();
    // Cacher le formulaire de connexion
    document.getElementById('loginForm').style.display = 'none';
    // Afficher le formulaire de récupération de mot de passe
    document.getElementById('resetPasswordForm').style.display = 'block';
  });

// Écouteur pour la soumission du formulaire de réinitialisation de mot de passe
document.getElementById('resetPasswordForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const messageElement = document.getElementById('message');

    sendPasswordResetEmail(auth, email)
      .then(() => {
        messageElement.textContent = 'Un e-mail de réinitialisation de mot de passe a été envoyé !';
      })
      .catch((error) => {
        messageElement.textContent = 'Erreur : ' + error.message;
      });
  });