// ---------- Questionnaire ----------
// -----------------------------------

// -- Click sur la croix --
document.addEventListener("DOMContentLoaded", function(){
    const versmetieridealCross = document.querySelector(".versmetieridealCross")
    versmetieridealCross.addEventListener("click", function(){
        window.location.href = "index.html"
    })
})


// -- Vérification Identification et stockage des résultats Firebase et Firestore --
// Importez les fonctionnalités nécessaires depuis le SDK Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"
import { getFirestore, doc, setDoc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

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

// Initialisez Firestore
const db = getFirestore(firebaseApp)

// Fonction pour sauvegarder les résultats du questionnaire
async function saveQuestionnaireResults(userId, results){
    try {
        await setDoc(doc(db, "Users", userId, "Questionnaire", "Dernier résultat"), results)
        console.log("Résultats enregistrés avec succès !")
    } catch (e) {
        console.error("Erreur lors de l'enregistrement des résultats: ", e)
    }
}

async function getUserQuestionnaireResults(userId){
    const docRef = doc(db, "Users", userId, "Questionnaire", "Dernier résultat")
    const docSnap = await getDoc(docRef)
  
    if (docSnap.exists()){
        console.log("Résultats du questionnaire:", docSnap.data())
    } else {
        console.log("Aucun résultat de questionnaire trouvé pour cet utilisateur.")
    }
}

// Questionnaire
let currentQuestionId = "question1"
let questionnaireBox = document.querySelector(".questionnaireBox")
let quizElement = document.querySelector('.quiz')
let resultElement = document.querySelector('.result')
let resultTextElement = document.querySelector('.resultText')
let resultProfilElement = document.querySelector('.resultProfil')
let resultExplanationElement = document.querySelector('.resultExplanation')
let resultPossibilitiesElement = document.querySelector('.resultPossibilities')
let resultConclusionElement = document.querySelector('.resultConclusion')
let resultInvitation = document.querySelector('.invitation')
let backButton = document.querySelector('.back')
let questions = []
let questionHistory = [] // Tableau pour suivre l'historique des questions

fetch('scripts/questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data
        loadQuestion(currentQuestionId)
    })

function loadQuestion(questionId) {
    const question = questions.find(q => q.id === questionId)
    if (question){
        quizElement.innerHTML = 
        `
            <div class="questionBox question active" id="${question.id}">
                <p>${question.text}</p>
                <button class="btnyes">Oui</button>
                <button>Non</button>
            </div>
        `

        // Ajouter des gestionnaires d'événements aux boutons après leur création
        const yesButton = document.querySelector('.btnyes')
        const noButton = yesButton.nextElementSibling
        
        yesButton.addEventListener('click', () => handleAnswer(question.id, 'yes'))
        noButton.addEventListener('click', () => handleAnswer(question.id, 'no'))

        // Afficher ou masquer le bouton "Back"
        if (questionHistory.length > 0) {
            backButton.style.display = 'block'
        } else {
            backButton.style.display = 'none'
        }
    } else {
        endQuiz("Tes réponses n'ont pas permis de déterminer votre profil. Je t'invite à réserver une session gratuite de 30 minutes pour en discuter ensemble.")
    }
}

function handleAnswer(questionId, answer){
    const question = questions.find(q => q.id === questionId)
    const nextId = question[answer]

    if (nextId === 'result') {
        showResult(question.result, question.explanation, question.possibilities, question.conclusion)
    } else if (nextId === 'endQuizNo') {
        endQuiz("Oups ! Le domaine IT n'est peut-être pas fait pour toi. Je t'invite à réserver une session gratuite de 30 minutes pour explorer d'autres voies ensemble.")
    } else if (nextId.startsWith('endQuiz')) {
        eval(nextId)
    } else {
        questionHistory.push(questionId) // Ajouter l'identifiant de la question actuelle à l'historique
        currentQuestionId = nextId
        loadQuestion(currentQuestionId)
    }
}

function goBack(){
    if (questionHistory.length > 0) {
        currentQuestionId = questionHistory.pop() // Récupérer la dernière question de l'historique
        loadQuestion(currentQuestionId)
    }
}

// Ajout de l'événement de clic pour le bouton "Retour"
backButton.addEventListener('click', goBack)

async function showResult(result, explanation, possibilities, conclusion){
    if (result === undefined || result === null){
        result = "Profil Indéterminé"
    }

    questionnaireBox.style.display = 'none'
    resultElement.style.display = 'block'
    resultTextElement.innerText = 'Vous devriez envisager une carrière en tant que'
    resultProfilElement.innerText = result
    resultExplanationElement.innerText = explanation

    // Affiche les possibilités sur des lignes distinctes
    let possibilitiesHtml = possibilities.map(possibility => `<li>${possibility}</li>`).join('')
    resultPossibilitiesElement.innerHTML = 
    `
    <ul>${possibilitiesHtml}</ul>
    `

    resultConclusionElement.innerText = conclusion

    resultInvitation.innerText = `Je t'invite à réserver une session gratuite de 30 minutes pour en discuter ensemble.`

    // Vérifiez si l'utilisateur est connecté, puis enregistrez les résultats
    onAuthStateChanged(auth, async (user) => {
        if (user){
            const userDocRef = doc(db, "Users", user.uid, "Questionnaire", "hasRated")
            const userDoc = await getDoc(userDocRef)

            // Sauvegarder les résultats du questionnaire
            const results = {
                result: result,
                explanation: explanation,
                possibilities: possibilities,
                conclusion: conclusion
            }
            await saveQuestionnaireResults(user.uid, results)
            await getUserQuestionnaireResults(user.uid)

            // Vérifiez si l'utilisateur a déjà évalué
            if (userDoc.exists() && userDoc.data().hasRated) {
                console.log("L'utilisateur a déjà évalué.")
            } else {
                // Ajouter des gestionnaires d'événements pour les boutons "thumb up" et "thumb down"
                const thumbUpButton = document.querySelector('#thumb-up')
                const thumbDownButton = document.querySelector('#thumb-down')

                if (thumbUpButton && thumbDownButton) {
                    thumbUpButton.addEventListener('click', () => handleRating('up', user.uid))
                    thumbDownButton.addEventListener('click', () => handleRating('down', user.uid))
                }

                // Afficher le conteneur de notation une fois que le résultat est affiché
                document.querySelector('#rating-container').style.display = 'block'
            }
        } else {
            console.log("Utilisateur non connecté. Résultats non enregistrés.")
        }
    })
}

async function handleRating(type, userId) {
    const ratingDocRef = doc(db, "Evaluations", "Questionnaire")
    const userDocRef = doc(db, "Users", userId, "Questionnaire", "hasRated")

    const ratingDoc = await getDoc(ratingDocRef)

    if (ratingDoc.exists()) {
        await updateDoc(ratingDocRef, {
            [type]: increment(1)
        })
    } else {
        await setDoc(ratingDocRef, {
            up: type === 'up' ? 1 : 0,
            down: type === 'down' ? 1 : 0
        })
    }

    // Mettre à jour l'état de l'évaluation pour l'utilisateur
    await setDoc(userDocRef, {
        hasRated: true
    })

    // Masquer le conteneur de notation
    document.querySelector('#rating-container').style.display = 'none'
}

function endQuiz(message){
    questionnaireBox.style.display = 'none'
    resultElement.style.display = 'block'
    resultTextElement.innerText = message
    resultProfilElement.style.display = ''
}

window.restartQuiz = function restartQuiz(){
    currentQuestionId = 'question1' // Réinitialise l'identifiant de la question actuelle
    questionnaireBox.style.display = 'block'
    resultElement.style.display = 'none'
    resultTextElement.innerText = ''
    resultProfilElement.innerText = ''
    resultExplanationElement.innerText = ''
    resultPossibilitiesElement.innerHTML = ''
    resultConclusionElement.innerText = ''
    questionHistory = [] // Réinitialise l'historique des questions
    loadQuestion(currentQuestionId)
}

window.onload = function(){
    onAuthStateChanged(auth, async (user) => {
        if (user){
            const userDocRef = doc(db, "Users", user.uid)
            const userDoc = await getDoc(userDocRef)

            // Vérifiez si l'utilisateur a déjà évalué
            const hasRatedDocRef = doc(db, "Users", user.uid, "Questionnaire", "hasRated")
            const hasRatedDoc = await getDoc(hasRatedDocRef)
            if (hasRatedDoc.exists() && hasRatedDoc.data().hasRated) {
                console.log("L'utilisateur a déjà évalué.")
            }
        } else {
            console.log("Utilisateur non connecté.")
        }
    })
}

tippy('.restartBtn', {
    content: `Attention ! Si tu as obtenu un réultat auparavant, celui-ci sera remplacé !`,
    animation: 'scale-extreme',
    theme: 'light',
})
tippy('#rating-container', {
    content: `L'évaluation de ton expérience ne peut être réalisée qu'une seule fois !`,
    animation: 'scale-extreme',
    theme: 'light',
})




// // Importez les fonctionnalités nécessaires depuis le SDK Firebase
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
// import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
// import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// // Votre configuration Firebase
// const firebaseConfig = {
//     apiKey: "AIzaSyBiXgbkHickHvKv5JVQu02gLd8x8DhQLU4",
//     authDomain: "pamelagdigital-11c88.firebaseapp.com",
//     projectId: "pamelagdigital-11c88",
//     storageBucket: "pamelagdigital-11c88.appspot.com",
//     messagingSenderId: "883235524876",
//     appId: "1:883235524876:web:4c638ed821fdff46717929"
// };

// // Initialisez votre application Firebase
// const firebaseApp = initializeApp(firebaseConfig);

// // Obtenez une référence à l'objet d'authentification
// const auth = getAuth(firebaseApp);

// // Initialisez Firestore
// const db = getFirestore(firebaseApp);

// // Fonction pour sauvegarder les résultats du questionnaire
// async function saveQuestionnaireResults(userId, results) {
//     try {
//         await setDoc(doc(db, "users", userId, "questionnaires", "latest"), results);
//         console.log("Résultats enregistrés avec succès !");
//     } catch (e) {
//         console.error("Erreur lors de l'enregistrement des résultats: ", e);
//     }
// }

// async function getUserQuestionnaireResults(userId) {
//     const docRef = doc(db, "users", userId, "questionnaires", "latest");
//     const docSnap = await getDoc(docRef);
  
//     if (docSnap.exists()) {
//       console.log("Résultats du questionnaire:", docSnap.data());
//     } else {
//       console.log("Aucun résultat de questionnaire trouvé pour cet utilisateur.");
//     }
//   }
  
// // Questionnaire
// let currentQuestionId = "question1";
// let questionnaireBox = document.querySelector(".questionnaireBox");
// let quizElement = document.querySelector('.quiz');
// let resultElement = document.querySelector('.result');
// let resultTextElement = document.querySelector('.resultText');
// let resultProfilElement = document.querySelector('.resultProfil');
// let resultExplanationElement = document.querySelector('.resultExplanation');
// let resultPossibilitiesElement = document.querySelector('.resultPossibilities');
// let resultConclusionElement = document.querySelector('.resultConclusion');
// let backButton = document.querySelector('.back');
// let questions = [];
// let questionHistory = []; // Tableau pour suivre l'historique des questions

// fetch('scripts/questions.json')
//     .then(response => response.json())
//     .then(data => {
//         questions = data;
//         loadQuestion(currentQuestionId);
//     });

// function loadQuestion(questionId) {
//     const question = questions.find(q => q.id === questionId);
//     if (question) {
//         quizElement.innerHTML = 
//         `
//             <div class="questionBox question active" id="${question.id}">
//                 <p>${question.text}</p>
//                 <button class="btnyes">Oui</button>
//                 <button>Non</button>
//             </div>
//         `;

//         // Ajouter des gestionnaires d'événements aux boutons après leur création
//         const yesButton = document.querySelector('.btnyes');
//         const noButton = yesButton.nextElementSibling;
        
//         yesButton.addEventListener('click', () => handleAnswer(question.id, 'yes'));
//         noButton.addEventListener('click', () => handleAnswer(question.id, 'no'));

//         // Afficher ou masquer le bouton "Back"
//         if (questionHistory.length > 0) {
//             backButton.style.display = 'block';
//         } else {
//             backButton.style.display = 'none';
//         }
//     } else {
//         endQuiz("Vos réponses n'ont pas permises de déterminer votre profil");
//     }
// }

// function handleAnswer(questionId, answer) {
//     const question = questions.find(q => q.id === questionId);
//     const nextId = question[answer];

//     if (nextId === 'result') {
//         showResult(question.result, question.explanation, question.possibilities, question.conclusion);
//     } else if (nextId === 'endQuizNo') {
//         endQuiz("Oups ! Le domaine IT n'est peut-être pas fait pour toi. Je t'invite à réserver une session gratuite de 30 minutes pour explorer d'autres voies ensemble.");
//     } else if (nextId.startsWith('endQuiz')) {
//         eval(nextId);
//     } else {
//         questionHistory.push(questionId); // Ajouter l'identifiant de la question actuelle à l'historique
//         currentQuestionId = nextId;
//         loadQuestion(currentQuestionId);
//     }
// }

// function goBack() {
//     if (questionHistory.length > 0) {
//         currentQuestionId = questionHistory.pop(); // Récupérer la dernière question de l'historique
//         loadQuestion(currentQuestionId);
//     }
// }

// // Ajout de l'événement de clic pour le bouton "Retour"
// backButton.addEventListener('click', goBack);

// async function showResult(result, explanation, possibilities, conclusion) {
//     if (result === undefined || result === null) {
//         result = "profil indéterminé";
//     }

//     questionnaireBox.style.display = 'none';
//     resultElement.style.display = 'block';
//     resultTextElement.innerText = 'Vous devriez envisager une carrière en tant que';
//     resultProfilElement.innerText = result;
//     resultExplanationElement.innerText = explanation;

//     // Affiche les possibilités sur des lignes distinctes
//     let possibilitiesHtml = possibilities.map(possibility => `<li>${possibility}</li>`).join('');
//     resultPossibilitiesElement.innerHTML = 
//     `
//     <ul>${possibilitiesHtml}</ul>
//     `;

//     resultConclusionElement.innerText = conclusion;

//     // Vérifiez si l'utilisateur est connecté, puis enregistrez les résultats
//     onAuthStateChanged(auth, (user) => {
//         if (user) {
//             const results = {
//                 result: result,
//                 explanation: explanation,
//                 possibilities: possibilities,
//                 conclusion: conclusion
//             };
//             saveQuestionnaireResults(user.uid, results);
//             getUserQuestionnaireResults(user.uid);
//         } else {
//             console.log("Utilisateur non connecté. Résultats non enregistrés.");
//         }
//     });

//     // Afficher le conteneur de notation une fois que le résultat est affiché
//     document.getElementById('rating-container').style.display = 'block';
// }

// function endQuiz(message) {
//     questionnaireBox.style.display = 'none';
//     resultElement.style.display = 'block';
//     resultTextElement.innerText = message;
//     resultExplanationElement.innerText = '';
// }

// window.restartQuiz = function restartQuiz() {
//     currentQuestionId = 'question1'; // Réinitialise l'identifiant de la question actuelle
//     questionnaireBox.style.display = 'block';
//     resultElement.style.display = 'none';
//     resultTextElement.innerText = '';
//     resultProfilElement.innerText = '';
//     resultExplanationElement.innerText = '';
//     resultPossibilitiesElement.innerHTML = '';
//     resultConclusionElement.innerText = '';
//     questionHistory = []; // Réinitialise l'historique des questions
//     loadQuestion(currentQuestionId);
// }









