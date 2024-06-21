//Click sur la croix
document.addEventListener("DOMContentLoaded", function() {
    const moncompteCross = document.querySelector(".moncompteCross")
    moncompteCross.addEventListener("click", function() {
        window.location.href = "index.html";
    });
});


// Importer les fonctionnalités Firestore nécessaires
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBiXgbkHickHvKv5JVQu02gLd8x8DhQLU4",
    authDomain: "pamelagdigital-11c88.firebaseapp.com",
    projectId: "pamelagdigital-11c88",
    storageBucket: "pamelagdigital-11c88.appspot.com",
    messagingSenderId: "883235524876",
    appId: "1:883235524876:web:4c638ed821fdff46717929"
}

// Initialisez votre application Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialisez Firestore
const db = getFirestore(firebaseApp);

// Obtenez une référence à l'objet d'authentification
const auth = getAuth(firebaseApp);

// Fonction pour récupérer le prénom de l'utilisateur
async function getFirstName(userId) {
    try {
        const userDoc = await getDoc(doc(db, "Users", userId));
        if (userDoc.exists()) {
            return userDoc.data().firstname;
        } else {
            console.log("Aucun document trouvé pour l'utilisateur.");
            return null;
        }
    } catch (e) {
        console.error("Erreur lors de la récupération du prénom: ", e);
        return null;
    }
}

// Fonction pour récupérer et afficher les résultats de l'utilisateur
async function afficherResultatsUtilisateur(userId) {
    const docRef = doc(db, "Users", userId, "Questionnaire", "Dernier résultat");
    const docSnap = await getDoc(docRef);
    const helloPart = document.querySelector(".helloPart");

    if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Récupérer le prénom de l'utilisateur
        const firstName = await getFirstName(userId);

        // Mettre à jour le contenu de la div avec le prénom et les résultats récupérés
        helloPart.innerHTML = `
            <div class="greet">Salut <span>${firstName ? firstName : ''}</span> !</div>
            <div class="pundergreet">Ci-dessous, les résultats du questionnaire qui sont enregistrés sur ton compte</div>
            <div class="resultCompte">
                <p>Tu devrais envisager une carrière en tant que</p>
                <p class="resultProfil">${data.result}</p>
                <div class="scrollCompte">
                    <p class="explanation">${data.explanation}</p>
                    <p>${data.possibilities.map(p => `${p}<br>`).join('')}</p>
                    <p class="conclusion">${data.conclusion}</p>
                </div>
                <p class="resultCompteBold">Je t'invite à réserver une session gratuite de 30 minutes pour en discuter ensemble.</p>
            </div>
            <a href="prendreunrendezvous.html" class="btnCompte">Réserve ton coaching</a>
        `;

        // Stocker un indicateur dans localStorage pour indiquer que l'utilisateur a des résultats
        localStorage.setItem('hasResults', 'true');
    } else {
        // Récupérer le prénom de l'utilisateur pour afficher le message de bienvenue
        const firstName = await getFirstName(userId);

        // Afficher un message indiquant qu'il n'y a pas encore de résultats
        helloPart.innerHTML = `
            <div class="greet">Salut <span>${firstName ? firstName : ''}</span> !</div>
            <div>Je te souhaite la bienvenue sur ton compte</div>
            <div class="resultCompte">
                <p>Il semble que tu n'aies pas encore répondu au questionnaire. Aucun résultat n'a été trouvé sur ton compte.</p>
                <p>Si tu souhaites découvrir les opportunités qui t'attendent dans le monde du numérique, je t'invite à cliquer sur le bouton ci-dessous.</p>
            </div>
            <a href="chargement.html" class="loadLink btnCompte">Vers ton métier numérique idéal</a>
        `;

        // Supprimer l'indicateur de localStorage s'il existe
        localStorage.removeItem('hasResults');
        
    }
}

// Utilisez cette fonction pour afficher les résultats de l'utilisateur après qu'il se soit connecté
onAuthStateChanged(auth, (user) => {
    if (user) {
        afficherResultatsUtilisateur(user.uid);
    } else {
        console.log("Utilisateur non connecté. Résultats non affichés.");
    }
});





