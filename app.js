document.addEventListener('DOMContentLoaded', () => {
  const verseContainer = document.getElementById('verse-container');
  let bibleData = [];
  let currentIndex = 0;

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
      showVerse(); // Show the first verse once data is loaded
    })
    .catch(error => {
      console.error('Error fetching Bible data:', error);
      verseContainer.innerHTML = 'Error loading verses. Please try again later.';
    });

  // Function to show the next verse with fade-in and fade-out effect
  function showVerse() {
    if (bibleData.length === 0) {
      verseContainer.innerHTML = 'No verses found.';
      return;
    }

    // Get the current verse data
    const verse = bibleData[currentIndex];

    // Get the book name from the book number (field[1] is the book number)
    const bookName = bookNames[verse.field[1] - 1];  // Adjusting for zero-based index
    const verseText = `${verse.field[4]} <br> ${bookName} ${verse.field[2]}:${verse.field[3]}`;

    // Create a verse box and set its content
    const verseBox = document.createElement('div');
    verseBox.classList.add('box');
    verseBox.innerHTML = verseText;

    // Add the verse box to the container with fade-in effect
    verseContainer.innerHTML = ''; // Clear previous verse
    verseContainer.appendChild(verseBox);
    verseContainer.style.opacity = 1; // Trigger fade-in

    // After 3 seconds, trigger fade-out and set the next verse
    setTimeout(() => {
      verseContainer.style.opacity = 0; // Trigger fade-out

      // Move to the next verse (loop back to the start when reaching the end)
      currentIndex = (currentIndex + 1) % bibleData.length;

      // Wait for the fade-out to complete before showing the next verse
      setTimeout(showVerse, 1000); // 1-second delay to let fade-out happen before showing the next verse
    }, 3000); // 3 seconds per verse
  }

  // Function to handle touch events
  function handleTouch(event) {
    const screenWidth = window.innerWidth;  // Get screen width
    const touchX = event.changedTouches[0].clientX;  // Get the touch position
    const touchPercentage = touchX / screenWidth;  // Calculate touch percentage across screen width

    // Calculate the verse index based on touch position
    let verseIndex;

    if (touchPercentage < 0.5) {
      // User touched on the left side (beginning of the Bible)
      verseIndex = Math.floor(touchPercentage * bibleData.length);
    } else {
      // User touched on the right side (end of the Bible)
      verseIndex = Math.floor((1 - touchPercentage) * bibleData.length);
    }

    // Ensure the verse index is within bounds and loops back around
    verseIndex = (verseIndex + bibleData.length) % bibleData.length;

    // Update currentIndex and show the selected verse
    currentIndex = verseIndex;
    showVerse();
  }

  // Register touch event listener
  document.body.addEventListener('touchend', handleTouch);

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
