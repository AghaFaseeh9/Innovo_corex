// Sample vocabulary data
const vocabulary = {
    english: {
        beginner: [
            { word: 'Hello', translation: 'Merhaba' },
            { word: 'Goodbye', translation: 'Hoşça kal' },
            { word: 'Thank you', translation: 'Teşekkür ederim' },
            { word: 'Please', translation: 'Lütfen' },
            { word: 'Good morning', translation: 'Günaydın' }
        ],
        intermediate: [
            { word: 'Good night', translation: 'İyi geceler' },
            { word: 'How are you?', translation: 'Nasılsın?' },
            { word: 'I love you', translation: 'Seni seviyorum' },
            { word: 'Welcome', translation: 'Hoş geldiniz' },
            { word: 'Good luck', translation: 'İyi şanslar' }
        ],
        advanced: [
            { word: 'Congratulations', translation: 'Tebrikler' },
            { word: 'See you later', translation: 'Görüşürüz' },
            { word: 'Have a nice day', translation: 'İyi günler' },
            { word: 'Nice to meet you', translation: 'Tanıştığıma memnun oldum' },
            { word: 'Take care', translation: 'Kendine iyi bak' }
        ]
    },
    turkish: {
        beginner: [
            { word: 'Merhaba', translation: 'Hello' },
            { word: 'Hoşça kal', translation: 'Goodbye' },
            { word: 'Teşekkür ederim', translation: 'Thank you' },
            { word: 'Lütfen', translation: 'Please' },
            { word: 'Günaydın', translation: 'Good morning' }
        ],
        intermediate: [
            { word: 'İyi geceler', translation: 'Good night' },
            { word: 'Nasılsın?', translation: 'How are you?' },
            { word: 'Seni seviyorum', translation: 'I love you' },
            { word: 'Hoş geldiniz', translation: 'Welcome' },
            { word: 'İyi şanslar', translation: 'Good luck' }
        ],
        advanced: [
            { word: 'Tebrikler', translation: 'Congratulations' },
            { word: 'Görüşürüz', translation: 'See you later' },
            { word: 'İyi günler', translation: 'Have a nice day' },
            { word: 'Tanıştığıma memnun oldum', translation: 'Nice to meet you' },
            { word: 'Kendine iyi bak', translation: 'Take care' }
        ]
    },
    german: {
        beginner: [
            { word: 'Hallo', translation: 'Hello' },
            { word: 'Auf Wiedersehen', translation: 'Goodbye' },
            { word: 'Danke', translation: 'Thank you' },
            { word: 'Bitte', translation: 'Please' },
            { word: 'Guten Morgen', translation: 'Good morning' }
        ],
        intermediate: [
            { word: 'Gute Nacht', translation: 'Good night' },
            { word: 'Wie geht es dir?', translation: 'How are you?' },
            { word: 'Ich liebe dich', translation: 'I love you' },
            { word: 'Willkommen', translation: 'Welcome' },
            { word: 'Viel Glück', translation: 'Good luck' }
        ],
        advanced: [
            { word: 'Herzlichen Glückwunsch', translation: 'Congratulations' },
            { word: 'Bis später', translation: 'See you later' },
            { word: 'Einen schönen Tag', translation: 'Have a nice day' },
            { word: 'Freut mich', translation: 'Nice to meet you' },
            { word: 'Pass auf dich auf', translation: 'Take care' }
        ]
    }
};

// DOM Elements
const flashcard = document.getElementById('flashcard');
const wordElement = document.getElementById('word');
const translationElement = document.getElementById('translation');
const currentCardElement = document.getElementById('current-card');
const totalCardsElement = document.getElementById('total-cards');
const languageSelect = document.getElementById('language-select');
const difficultySelect = document.getElementById('difficulty-select');
const flipButton = document.getElementById('flip-card');
const nextButton = document.getElementById('next-card');
const shuffleButton = document.getElementById('shuffle-cards');
const resetButton = document.getElementById('reset');
const themeToggle = document.getElementById('theme-toggle');
const addCardBtn = document.getElementById('add-card-btn');
const addCardModal = document.getElementById('add-card-modal');
const addCardForm = document.getElementById('add-card-form');
const cancelAddBtn = document.getElementById('cancel-add');
const customLanguageSelect = document.getElementById('custom-language');
const customDifficultySelect = document.getElementById('custom-difficulty');
const customWordInput = document.getElementById('custom-word');
const customTranslationInput = document.getElementById('custom-translation');
const helpBtn = document.getElementById('help-btn');
const helpModal = document.getElementById('help-modal');
const closeHelpBtn = document.getElementById('close-help');

// State
let currentLanguage = localStorage.getItem('language') || 'english';
let currentDifficulty = localStorage.getItem('difficulty') || 'beginner';
let currentIndex = 0;
let cards = [...vocabulary[currentLanguage][currentDifficulty]];
let isFlipped = false;
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Load custom cards from localStorage
function loadCustomCards() {
    const savedCards = localStorage.getItem('customCards');
    if (savedCards) {
        const customCards = JSON.parse(savedCards);
        Object.keys(customCards).forEach(lang => {
            Object.keys(customCards[lang]).forEach(diff => {
                vocabulary[lang][diff] = [...vocabulary[lang][diff], ...customCards[lang][diff]];
            });
        });
    }
}

// Save custom cards to localStorage
function saveCustomCards() {
    const customCards = {};
    Object.keys(vocabulary).forEach(lang => {
        customCards[lang] = {};
        Object.keys(vocabulary[lang]).forEach(diff => {
            customCards[lang][diff] = vocabulary[lang][diff].slice(5); // Skip the first 5 default cards
        });
    });
    localStorage.setItem('customCards', JSON.stringify(customCards));
}

// Add custom card
function addCustomCard(word, translation, language, difficulty) {
    const newCard = { word, translation };
    vocabulary[language][difficulty].push(newCard);
    if (language === currentLanguage && difficulty === currentDifficulty) {
        cards.push(newCard);
    }
    saveCustomCards();
    updateProgress();
}

// Show/hide add card modal
function toggleAddCardModal(show) {
    addCardModal.classList.toggle('hidden', !show);
    addCardModal.classList.toggle('flex', show);
    if (show) {
        // Set default values in modal
        customLanguageSelect.value = currentLanguage;
        customDifficultySelect.value = currentDifficulty;
        customWordInput.value = '';
        customTranslationInput.value = '';
    }
}

// Show/hide help modal
function toggleHelpModal(show) {
    helpModal.classList.toggle('hidden', !show);
    helpModal.classList.toggle('flex', show);
}

// Add event listeners
function addEventListeners() {
    // Help button
    helpBtn.addEventListener('click', () => toggleHelpModal(true));
    closeHelpBtn.addEventListener('click', () => toggleHelpModal(false));
    helpModal.addEventListener('click', (e) => {
        if (e.target.id === 'help-modal') {
            toggleHelpModal(false);
        }
    });

    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Add card button
    addCardBtn.addEventListener('click', () => toggleAddCardModal(true));
    
    // Close modal on cancel
    cancelAddBtn.addEventListener('click', () => toggleAddCardModal(false));
    
    // Close modal on outside click
    addCardModal.addEventListener('click', (e) => {
        if (e.target.id === 'add-card-modal') {
            toggleAddCardModal(false);
        }
    });

    // Add card form
    addCardForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const word = customWordInput.value.trim();
        const translation = customTranslationInput.value.trim();
        const language = customLanguageSelect.value;
        const difficulty = customDifficultySelect.value;
        
        if (word && translation) {
            addCustomCard(word, translation, language, difficulty);
            toggleAddCardModal(false);
            addCardForm.reset();
            showNotification('Card added successfully!');
        }
    });

    // Flip card on click
    flashcard.addEventListener('click', () => {
        isFlipped = !isFlipped;
        flashcard.style.transform = `rotateY(${isFlipped ? '180deg' : '0deg'})`;
    });

    // Flip button
    flipButton.addEventListener('click', () => {
        isFlipped = !isFlipped;
        flashcard.style.transform = `rotateY(${isFlipped ? '180deg' : '0deg'})`;
    });

    // Next button
    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % cards.length;
        updateCard();
        updateProgress();
    });

    // Shuffle button
    shuffleButton.addEventListener('click', () => {
        cards = [...cards].sort(() => Math.random() - 0.5);
        currentIndex = 0;
        updateCard();
        updateProgress();
    });

    // Reset button
    resetButton.addEventListener('click', () => {
        currentIndex = 0;
        cards = [...vocabulary[currentLanguage][currentDifficulty]];
        updateCard();
        updateProgress();
    });

    // Language select
    languageSelect.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        cards = [...vocabulary[currentLanguage][currentDifficulty]];
        currentIndex = 0;
        updateCard();
        updateProgress();
    });

    // Difficulty select
    difficultySelect.addEventListener('change', (e) => {
        currentDifficulty = e.target.value;
        cards = [...vocabulary[currentLanguage][currentDifficulty]];
        currentIndex = 0;
        updateCard();
        updateProgress();
    });

    // Enhanced keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Ignore keyboard shortcuts when typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        switch(e.key.toLowerCase()) {
            case ' ':
                e.preventDefault();
                isFlipped = !isFlipped;
                flashcard.style.transform = `rotateY(${isFlipped ? '180deg' : '0deg'})`;
                break;
            case 'arrowright':
                currentIndex = (currentIndex + 1) % cards.length;
                updateCard();
                updateProgress();
                break;
            case 'arrowleft':
                currentIndex = (currentIndex - 1 + cards.length) % cards.length;
                updateCard();
                updateProgress();
                break;
            case 't':
                toggleTheme();
                break;
            case 'h':
                toggleHelpModal(true);
                break;
            case 'escape':
                if (!helpModal.classList.contains('hidden')) {
                    toggleHelpModal(false);
                }
                if (!addCardModal.classList.contains('hidden')) {
                    toggleAddCardModal(false);
                }
                break;
        }
    });
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-y-0 opacity-100';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateY(100%)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Initialize
function initialize() {
    loadCustomCards();
    
    // Set initial theme based on localStorage or system preference
    if (localStorage.getItem('darkMode') === null) {
        isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        localStorage.setItem('darkMode', isDarkMode);
    }
    
    // Apply initial theme
    applyTheme();
    
    // Set initial language and difficulty
    languageSelect.value = currentLanguage;
    difficultySelect.value = currentDifficulty;
    
    // Update cards based on current settings
    cards = [...vocabulary[currentLanguage][currentDifficulty]];
    updateCard();
    updateProgress();
    addEventListeners();
}

// Apply theme function
function applyTheme() {
    document.documentElement.classList.toggle('dark', isDarkMode);
}

// Toggle theme function
function toggleTheme() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', isDarkMode);
    applyTheme();
}

// Update card content
function updateCard() {
    const card = cards[currentIndex];
    wordElement.textContent = card.word;
    translationElement.textContent = card.translation;
    flashcard.style.transform = 'rotateY(0deg)';
    isFlipped = false;
}

// Update progress display
function updateProgress() {
    currentCardElement.textContent = currentIndex + 1;
    totalCardsElement.textContent = cards.length;
}

// Initialize the app
initialize();
