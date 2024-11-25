document.addEventListener('DOMContentLoaded', () => {
  const verseContainer = document.getElementById('verse-container');
  let bibleData = [];
  let currentIndex = 0;
  const totalVerses = 31102;  // Total verses in the Bible
  let isTransitioning = false;  // Flag to check if a transition is in progress

  // Mapping of book numbers to book names
  const bookNames = [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
    'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
    '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
    'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
    'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
    'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
    'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
    'Zephaniah', 'Haggai', 'Zechariah', 'Malachi', 'Matthew',
    'Mark', 'Luke', 'John', 'Acts', 'Romans',
    '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians',
    'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy',
    'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter',
    '2 Peter', '1 John', '2 John', '3 John', 'Jude',
    'Revelation'
  ];

  // Fetch Bible data from the local JSON file
  fetch('data/kjv.json')
    .then(response => response.json())
    .then(data => {
      bibleData = data.resultset.row;
      showVerse(currentIndex); // Show the first verse once data is loaded
    })
    .catch(error => {
      console.error('Error fetching Bible data:', error);
      verseContainer.innerHTML = 'Error loading verses. Please try again later.';
    });

  // Function to show the verse based on a specific index
  function showVerse(index) {
    if (bibleData.length === 0) {
      verseContainer.innerHTML = 'No verses found.';
      return;
    }

    // Get the current verse data
    const verse = bibleData[index];

    // Get the book name from the book number (field[1] is the book number)
    const bookName = bookNames[verse.field[1] - 1];  // Adjusting for zero-based index
    const verseText = `${verse.field[4]} <br> ${bookName} ${verse.field[2]}:${verse.field[3]}`;

    // Create a verse box and set its content
    const verseBox = document.createElement('div');
    verseBox.classList.add('box');
    verseBox.innerHTML = verseText;

    // Clear the verse container and add the new verse box
    verseContainer.innerHTML = '';
    verseContainer.appendChild(verseBox);

    // Apply transition for sliding the verse
    verseContainer.style.transition = 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out';
    verseContainer.style.transform = 'translateX(0)'; // Start at the normal position
    verseContainer.style.opacity = '1'; // Make it visible
  }

  // Handle swipe actions (left or right)
  let startX = 0;
  let isSwiping = false;

  verseContainer.addEventListener('mousedown', (e) => {
    if (isTransitioning) return; // Ignore if transition is in progress
    isSwiping = true;
    startX = e.clientX; // Store the starting X position of the swipe
  });

  verseContainer.addEventListener('mousemove', (e) => {
    if (!isSwiping) return;

    // Get the distance moved during swipe
    const diffX = e.clientX - startX;
    verseContainer.style.transform = `translateX(${diffX}px)`; // Move the verse with the drag
  });

  verseContainer.addEventListener('mouseup', (e) => {
    if (!isSwiping) return;

    isSwiping = false;
    const diffX = e.clientX - startX; // Calculate the total movement

    // If the swipe is significant enough, move to the next verse
    if (diffX > 100) {
      swipeRight(); // Swipe Right -> Next verse
    } else if (diffX < -100) {
      swipeLeft(); // Swipe Left -> Previous verse
    } else {
      // If the swipe was small, reset position
      verseContainer.style.transform = 'translateX(0)';
    }
  });

  function swipeLeft() {
    if (isTransitioning) return; // Prevent multiple transitions
    isTransitioning = true;
    verseContainer.style.transition = 'transform 0.5s ease-in-out'; // Set transition for slide

    // Slide the verse out to the left
    verseContainer.style.transform = 'translateX(-100%)';

    // After slide, show the next verse (previous verse in the array)
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % bibleData.length; // Move to next verse
      showVerse(currentIndex);
    }, 500); // Wait for the slide transition to finish
  }

  function swipeRight() {
    if (isTransitioning) return; // Prevent multiple transitions
    isTransitioning = true;
    verseContainer.style.transition = 'transform 0.5s ease-in-out'; // Set transition for slide

    // Slide the verse out to the right
    verseContainer.style.transform = 'translateX(100%)';

    // After slide, show the previous verse (previous verse in the array)
    setTimeout(() => {
      currentIndex = (currentIndex - 1 + bibleData.length) % bibleData.length; // Move to previous verse
      showVerse(currentIndex);
    }, 500); // Wait for the slide transition to finish
  }

  // Register the service worker for PWA functionality
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.log('Service Worker registration failed:', error);
        });
    });
  }
});
