document.addEventListener('DOMContentLoaded', () => {
  let bibleData = [];
  let currentIndex = 0;

  const verseContainer = document.getElementById('verse-container');
  
  // Array of book names, already defined for the Bible.
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
      verseContainer.innerHTML = 'Error loading verses.';
    });

  // Map click position to verse index and display corresponding verse
  document.addEventListener('click', (event) => {
    const clickPercentage = event.clientX / window.innerWidth; // Calculate click position
    currentIndex = Math.floor(clickPercentage * bibleData.length); // Map click to verse index

    showVerse(); // Show verse based on click position
  });

  function showVerse() {
    if (bibleData.length === 0) return;

    const verse = bibleData[currentIndex];
    const bookIndex = verse.field[1] - 1;  // The book index from the Bible data (adjusted to 0-based)
    const bookName = bookNames[bookIndex];
    const verseText = `${verse.field[4]} <br> ${bookName} ${verse.field[2]}:${verse.field[3]}`;

    // Update the verse container directly without transitions
    verseContainer.innerHTML = ''; // Clear previous verse
    const verseBox = document.createElement('div');
    verseBox.classList.add('box');
    verseBox.innerHTML = verseText;

    verseContainer.appendChild(verseBox);

    // Prepare next index, wrap around if at the end
    currentIndex = (currentIndex + 1) % bibleData.length;

    // Automatically show the next verse after a brief delay (1 second)
    setTimeout(() => {
      showVerse();
    }, 1000); // After 1 second, show the next verse
  }
});
