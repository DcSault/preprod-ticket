# Fichier EJS (index.ejs)

```ejs
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Système de Connexion Avancé</title>
    <link rel="stylesheet" href="/css/style.css">
    <!-- Importation de Font Awesome pour les icônes -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="texture-bg">
    <!-- Effets de particules pour l'arrière-plan -->
    <div class="circuit-pattern"></div>
    <% for(let i = 0; i < 8; i++) { %>
        <div class="particle" style="
            top: <%= Math.random() * 100 %>%; 
            left: <%= Math.random() * 100 %>%; 
            width: <%= Math.random() * 100 + 50 %>px; 
            height: <%= Math.random() * 100 + 50 %>px; 
            animation-delay: <%= Math.random() * 5 %>s;
            animation-duration: <%= Math.random() * 10 + 10 %>s;
        "></div>
    <% } %>

    <div class="page-fade-in min-h-screen flex flex-col items-center justify-center p-4">
        <div class="card-container neumorph glow-effect bg-white dark:bg-gray-800 p-8 rounded-xl max-w-md w-full shadow-lg form-slide-up">
            <!-- En-tête avec Logo -->
            <div class="text-center mb-8">
                <h1 class="logo-text text-3xl font-bold">TechConnect</h1>
                <div class="typing-effect mt-2 text-gray-600 dark:text-gray-300">Bienvenue sur votre portail</div>
            </div>
            
            <!-- Formulaire de connexion -->
            <form action="/login" method="POST" id="loginForm" class="space-y-6">
                <% if(locals.errorMessage) { %>
                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span class="block sm:inline"><%= errorMessage %></span>
                    </div>
                <% } %>
                
                <div class="relative">
                    <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <i class="fas fa-user text-primary mr-2"></i>Nom d'utilisateur
                    </label>
                    <div class="relative">
                        <input 
                            type="text" 
                            id="username" 
                            name="username" 
                            class="input-focus-effect w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            placeholder="Entrez votre nom d'utilisateur" 
                            required
                            list="usernamesList"
                            autocomplete="off"
                        >
                        <div class="input-border-effect absolute bottom-0 left-0 h-0.5 w-full bg-gray-200 dark:bg-gray-600">
                            <div class="absolute inset-0 bg-primary transform scale-x-0 origin-left transition-transform duration-300"></div>
                        </div>
                        <!-- Datalist pour suggestion d'autocomplétion -->
                        <datalist id="usernamesList">
                            <% if(locals.recentUsers) { %>
                                <% recentUsers.forEach(user => { %>
                                    <option value="<%= user %>">
                                <% }); %>
                            <% } %>
                        </datalist>
                    </div>
                    <div id="autocomplete-container" class="relative">
                        <div id="autocomplete-list" class="autocomplete-list"></div>
                    </div>
                </div>
                
                <div class="relative">
                    <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <i class="fas fa-lock text-primary mr-2"></i>Mot de passe
                    </label>
                    <div class="relative">
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            class="input-focus-effect w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            placeholder="Entrez votre mot de passe" 
                            required
                        >
                        <button 
                            type="button" 
                            class="absolute inset-y-0 right-0 pr-3 flex items-center" 
                            id="togglePassword"
                        >
                            <i class="fas fa-eye text-gray-400 hover:text-primary transition-colors duration-200"></i>
                        </button>
                        <div class="input-border-effect absolute bottom-0 left-0 h-0.5 w-full bg-gray-200 dark:bg-gray-600">
                            <div class="absolute inset-0 bg-primary transform scale-x-0 origin-left transition-transform duration-300"></div>
                        </div>
                    </div>
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input 
                            id="remember-me" 
                            name="remember-me" 
                            type="checkbox" 
                            class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        >
                        <label for="remember-me" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            Se souvenir de moi
                        </label>
                    </div>
                    <div>
                        <a href="/forgot-password" class="link-hover-effect text-sm text-primary hover:text-primary-dark">
                            Mot de passe oublié?
                        </a>
                    </div>
                </div>
                
                <div>
                    <button 
                        type="submit" 
                        class="btn-3d w-full py-2 px-4 bg-primary hover:bg-primary-dark text-white rounded-lg transition-all duration-200 font-semibold"
                    >
                        <i class="fas fa-sign-in-alt mr-2"></i>Se connecter
                    </button>
                </div>
                
                <!-- Séparateur -->
                <div class="relative flex items-center justify-center mt-6">
                    <div class="border-t border-gray-300 dark:border-gray-600 w-full"></div>
                    <div class="absolute bg-white dark:bg-gray-800 px-3 text-sm text-gray-500 dark:text-gray-400">
                        ou continuer avec
                    </div>
                </div>
                
                <!-- Boutons de connexion sociale -->
                <div class="flex justify-center space-x-4 mt-6">
                    <a href="/auth/google" class="svg-container flex items-center justify-center p-2 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                        <svg class="svg-icon h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                        </svg>
                    </a>
                    <a href="/auth/facebook" class="svg-container flex items-center justify-center p-2 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                        <svg class="svg-icon h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                    </a>
                    <a href="/auth/github" class="svg-container flex items-center justify-center p-2 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                        <svg class="svg-icon h-6 w-6 text-gray-800 dark:text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"/>
                        </svg>
                    </a>
                </div>
                
                <!-- Lien d'inscription -->
                <div class="text-center mt-6">
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        Vous n'avez pas de compte? 
                        <a href="/register" class="link-hover-effect text-primary font-medium hover:text-primary-dark">
                            S'inscrire
                        </a>
                    </p>
                </div>
            </form>
        </div>
        
        <!-- Bouton de changement de thème (clair/sombre) -->
        <button id="themeToggle" class="mt-6 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary animate-pulse">
            <i class="fas fa-sun text-yellow-500 dark:hidden"></i>
            <i class="fas fa-moon text-blue-300 hidden dark:block"></i>
        </button>
        
        <!-- Pied de page -->
        <div class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>&copy; <%= new Date().getFullYear() %> TechConnect. Tous droits réservés.</p>
            <div class="mt-2 flex justify-center space-x-4">
                <a href="/privacy" class="link-hover-effect hover:text-gray-700 dark:hover:text-gray-300">Confidentialité</a>
                <a href="/terms" class="link-hover-effect hover:text-gray-700 dark:hover:text-gray-300">Conditions</a>
                <a href="/contact" class="link-hover-effect hover:text-gray-700 dark:hover:text-gray-300">Contact</a>
            </div>
        </div>
    </div>

    <script>
        // Script pour le thème clair/sombre
        document.addEventListener('DOMContentLoaded', () => {
            const themeToggle = document.getElementById('themeToggle');
            const body = document.documentElement;
            
            // Vérifiez les préférences utilisateur ou le stockage local
            const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const savedTheme = localStorage.getItem('theme');
            
            if (savedTheme === 'dark' || (!savedTheme && darkModeMediaQuery.matches)) {
                body.classList.add('dark');
            }
            
            themeToggle.addEventListener('click', () => {
                body.classList.toggle('dark');
                const theme = body.classList.contains('dark') ? 'dark' : 'light';
                localStorage.setItem('theme', theme);
            });
            
            // Script pour afficher/masquer le mot de passe
            const togglePassword = document.getElementById('togglePassword');
            const passwordInput = document.getElementById('password');
            
            togglePassword.addEventListener('click', () => {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                // Change l'icône
                const icon = togglePassword.querySelector('i');
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            });
            
            // Auto-complétion personnalisée
            const usernameInput = document.getElementById('username');
            const autocompleteList = document.getElementById('autocomplete-list');
            const users = Array.from(document.querySelectorAll('#usernamesList option')).map(option => option.value);
            
            usernameInput.addEventListener('input', function() {
                const inputVal = this.value.toLowerCase();
                
                // Effacer la liste actuelle
                autocompleteList.innerHTML = '';
                
                if (inputVal.length < 1) {
                    autocompleteList.classList.remove('show');
                    return;
                }
                
                // Filtrer les suggestions
                const suggestions = users.filter(user => 
                    user.toLowerCase().includes(inputVal)
                );
                
                if (suggestions.length > 0) {
                    autocompleteList.classList.add('show');
                    
                    suggestions.forEach(suggestion => {
                        const item = document.createElement('div');
                        item.className = 'autocomplete-item';
                        
                        // Mettre en surbrillance le texte correspondant
                        const regex = new RegExp(`(${inputVal})`, 'gi');
                        const highlightedText = suggestion.replace(regex, '<strong>$1</strong>');
                        
                        item.innerHTML = highlightedText;
                        
                        item.addEventListener('click', function() {
                            usernameInput.value = suggestion;
                            autocompleteList.classList.remove('show');
                        });
                        
                        autocompleteList.appendChild(item);
                    });
                } else {
                    autocompleteList.classList.remove('show');
                }
            });
            
            // Fermer l'autocomplétion quand on clique ailleurs
            document.addEventListener('click', function(e) {
                if (e.target !== usernameInput && e.target !== autocompleteList) {
                    autocompleteList.classList.remove('show');
                }
            });
            
            // Animation des particules
            const particles = document.querySelectorAll('.particle');
            particles.forEach(particle => {
                // Animation différente pour chaque particule
                const randomDelay = Math.random() * 5;
                const randomDuration = Math.random() * 10 + 10;
                
                particle.style.animationDelay = `${randomDelay}s`;
                particle.style.animationDuration = `${randomDuration}s`;
            });
            
            // Validation du formulaire
            const loginForm = document.getElementById('loginForm');
            loginForm.addEventListener('submit', function(e) {
                const username = usernameInput.value.trim();
                const password = passwordInput.value.trim();
                
                if (username === '' || password === '') {
                    e.preventDefault();
                    alert('Veuillez remplir tous les champs');
                }
            });
        });
    </script>
</body>
</html>
``` 