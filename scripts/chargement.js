// ---------- Page Chargement ----------
// -------------------------------------

// Au chargement du site...
document.addEventListener('DOMContentLoaded', function() {
    const loadLinks = document.querySelectorAll('.loadLink');
    const loadingElement = document.querySelector('#loading');
    const progressElement = document.querySelector('.progress');
    const percentageElement = document.querySelector('#percentage');
    let percentage = 0;

    // Fonction pour vérifier si l'utilisateur est connecté
    function isUserLoggedIn() {
        return localStorage.getItem('userLoggedIn') === 'true';
    }

    // Fonction pour vérifier si des résultats sont enregistrés
    function hasStoredResults() {
        return localStorage.getItem('hasResults') === 'true';
    }

    // Fonction pour gérer la redirection vers chargement.html
    function redirectToChargement() {
        window.location.href = 'chargement.html';
    }

    // Vérifier la connexion de l'utilisateur directement sur chargement.html
    function checkUserLoggedIn() {
        if (!isUserLoggedIn()) {
            window.location.href = 'identification.html';
        }
    }

    // Appeler cette fonction si on est sur la page chargement.html
    if (window.location.pathname.includes('chargement.html')) {
        checkUserLoggedIn();
    }

    // Gestionnaire d'événements pour chaque lien de chargement
    loadLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Empêche le comportement par défaut du lien

            const userLoggedIn = isUserLoggedIn();
            const hasResults = hasStoredResults();

            // Redirection en fonction de l'état de connexion de l'utilisateur
            if (userLoggedIn) {
                // Vérifier si des résultats sont déjà enregistrés
                // if (hasResults) {
                //     if (!confirm("Es-tu sûr(e) de vouloir recommencer? Tes résultats existants seront remplacés.")) {
                //         // Si l'utilisateur annule, ne rien faire
                //         return;
                //     }
                // }
                window.location.href = 'chargement.html';
            } else {
                window.location.href = 'identification.html';
            }
        });
    });

    // Si l'élément "loadingElement" existe (sur la page chargement.html)
    if (loadingElement) {
        // Afficher les éléments de chargement
        loadingElement.classList.remove('hidden');

        // Vérifier la vitesse de connexion
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        let intervalTime = 25; // Valeur par défaut

        if (connection) {
            const effectiveType = connection.effectiveType;
            // Vous pouvez ajuster les seuils de vitesse de connexion comme requis
            if (effectiveType === '4g') {
                intervalTime = 12.5; // Divise par 2 pour simuler un chargement plus rapide en 4G
            }
            // Vous pouvez ajouter d'autres cas selon vos besoins (3g, 2g, etc.)
        }

        const interval = setInterval(() => {
            if (percentage >= 100) {
                percentage = 100;
                progressElement.style.width = '100%';
                percentageElement.textContent = '100%';
                clearInterval(interval);
                // Redirige vers versmetierideal.html après une petite pause pour montrer 100% complet
                setTimeout(() => {
                    window.location.href = 'versmetierideal.html';
                }, 200); // Ajoute un délai de 200ms pour que l'utilisateur voie la barre pleine
            } else {
                percentage += 1;
                progressElement.style.width = percentage + '%';
                percentageElement.textContent = percentage + '%';
            }
        }, intervalTime);
    }
});


// Au chargement du site...
// document.addEventListener('DOMContentLoaded', function() {
//     const loadLinks = document.querySelectorAll('.loadLink');
//     const loadingElement = document.querySelector('#loading');
//     const progressElement = document.querySelector('.progress');
//     const percentageElement = document.querySelector('#percentage');
//     let percentage = 0;

//     // On vérifie si l'utilisateur est connecté ou non
//     let userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';

//     // Vérifier si l'utilisateur a des résultats enregistrés
//     const hasResults = localStorage.getItem('hasResults') === 'true';

//     // Vérifier la connexion de l'utilisateur directement sur chargement.html
//     function checkUserLoggedIn() {
//         if (!userLoggedIn) {
//             window.location.href = 'identification.html';
//         } else if (hasResults) {
//             if (!confirm("Vous avez déjà des résultats enregistrés. Êtes-vous sûr de vouloir refaire le test ? Cela remplacera les résultats existants.")) {
//                 // Si l'utilisateur annule, rediriger vers une page appropriée (par exemple, la page d'accueil)
//                 window.location.href = 'index.html';
//                 return;
//             }
//         }
//     }

//     // Appeler cette fonction si on est sur la page chargement.html
//     if (window.location.pathname.includes('chargement.html')) {
//         checkUserLoggedIn();
//     }

//     // Gestionnaire d'événements pour chaque lien de chargement
//     loadLinks.forEach(function(link) {
//         link.addEventListener('click', function(e) {
//             e.preventDefault(); // Empêche le comportement par défaut du lien

//             // Si l'utilisateur est connecté
//             if (userLoggedIn) {
//                 // Si des résultats sont déjà enregistrés
//                 if (hasResults) {
//                     window.location.href = 'chargement.html';
//                 } 
//             } else {
//                 // Redirection vers la page de connexion
//                 window.location.href = 'identification.html';
//             }
//         });
//     });

//     // Si l'élément "loadingElement" existe (sur la page chargement.html)
//     if (loadingElement) {
//         // Afficher les éléments de chargement
//         loadingElement.classList.remove('hidden');

//         // Vérifier la vitesse de connexion
//         const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
//         let intervalTime = 25; // Valeur par défaut

//         if (connection) {
//             const effectiveType = connection.effectiveType;
//             // Vous pouvez ajuster les seuils de vitesse de connexion comme requis
//             if (effectiveType === '4g') {
//                 intervalTime = 12.5; // Divise par 2 pour simuler un chargement plus rapide en 4G
//             }
//             // Vous pouvez ajouter d'autres cas selon vos besoins (3g, 2g, etc.)
//         }

//         const interval = setInterval(() => {
//             if (percentage >= 100) {
//                 percentage = 100;
//                 progressElement.style.width = '100%';
//                 percentageElement.textContent = '100%';
//                 clearInterval(interval);
//                 // Redirige vers versmetierideal.html après une petite pause pour montrer 100% complet
//                 setTimeout(() => {
//                     window.location.href = 'versmetierideal.html';
//                 }, 200); // Ajoute un délai de 200ms pour que l'utilisateur voie la barre pleine
//             } else {
//                 percentage += 1;
//                 progressElement.style.width = percentage + '%';
//                 percentageElement.textContent = percentage + '%';
//             }
//         }, intervalTime);
//     }
// });