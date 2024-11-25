document.addEventListener('DOMContentLoaded', () => {
  const verseContainer = document.getElementById('verse-container');
  let bibleData = [];
  let currentIndex = 0;
  const totalVerses = 31102;  // Total verses in the Bible
  let isTransitioning = false;  // Flag to check if a transition is in progress

  // Mapping of book numbers to book names (for verse display)
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

    const verse = bibleData[index];
    const bookName = bookNames[verse.field[1] - 1];
    const verseText = `${verse.field[4]} <br> ${bookName} ${verse.field[2]}:${verse.field[3]}`;

    const verseBox = document.createElement('div');
    verseBox.classList.add('box');
    verseBox.innerHTML = verseText;

    verseContainer.innerHTML = '';  // Clear previous verse
    verseContainer.appendChild(verseBox);
  }

  // Swipe handling logic
  let touchStartX = 0;
  let touchEndX = 0;

  verseContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  verseContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  // For mouse swipe on desktop
  verseContainer.addEventListener('mousedown', (e) => {
    touchStartX = e.screenX;
  });

  verseContainer.addEventListener('mouseup', (e) => {
    touchEndX = e.screenX;
    handleSwipe();
  });

  // Swipe detection logic
  function handleSwipe() {
    if (Math.abs(touchEndX - touchStartX) < 100) return;  // Ignore small swipes

    if (touchEndX < touchStartX) {
      // Swipe left, go to the next verse
      if (isTransitioning) return;
      isTransitioning = true;
      swipeLeft();
    } else {
      // Swipe right, go to the previous verse
      if (isTransitioning) return;
      isTransitioning = true;
      swipeRight();
    }
  }

  function swipeLeft() {
    currentIndex = (currentIndex + 1) % bibleData.length;  // Go to next verse
    showVerse(currentIndex);
    isTransitioning = false;
  }

  function swipeRight() {
    currentIndex = (currentIndex - 1 + bibleData.length) % bibleData.length;  // Go to previous verse
    showVerse(currentIndex);
    isTransitioning = false;
  }

  // Click and tap logic (to select a specific verse based on location)
  verseContainer.addEventListener('click', (e) => {
    if (isTransitioning) return; // Prevent transition if in progress

    // Calculate the click position relative to the screen width
    const clickPosition = e.clientX;
    const clickPercentage = clickPosition / window.innerWidth;

    // Calculate the verse index based on click position
    const verseIndex = Math.floor(clickPercentage * totalVerses);

    currentIndex = verseIndex;
    showVerse(currentIndex);  // Show the clicked verse
  });
});
