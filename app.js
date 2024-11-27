document.addEventListener('DOMContentLoaded', () => {
  const verseContainer = document.getElementById('verse-container');
  let bibleData = [];
  let currentIndex = 0;
  const totalVerses = 31102;  // Total verses in the Bible
  let isTransitioning = false;  // Flag to check if a transition is in progress

  // Mapping of book abbreviations
  const bookAbbreviations = [
    'Ge', 'Ex', 'Le', 'Nu', 'De', 'Jo', 'Ju', 'Ru', '1 Sa', '2 Sa',
    '1 Ki', '2 Ki', '1 Ch', '2 Ch', 'Ez', 'Ne', 'Es', 'Jo', 'Ps', 'Pr',
    'Ec', 'So', 'Is', 'Je', 'La', 'Ez', 'Da', 'Ho', 'Jo', 'Am', 'Ob',
    'Jo', 'Mi', 'Na', 'Ha', 'Ze', 'Ha', 'Ze', 'Ma', 'Ma', 'Lu', 'Jo',
    'Ac', 'Ro', '1 Co', '2 Co', 'Ga', 'Ep', 'Ph', 'Co', '1 Th', '2 Th',
    '1 Ti', '2 Ti', 'Ti', 'Ph', 'He', 'Ja', '1 Pe', '2 Pe', '1 Jo',
    '2 Jo', '3 Jo', 'Ju', 'Re'
  ];

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

  // Request notification permission and show notification
  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification("Navigation Tips", {
          body: "Swipe left or right to change verses. Click to jump to a specific section.",
        });
      }
    });
  }

  // Fetch Bible data from the local JSON file
  fetch('data/kjv.json')
    .then(response => response.json())
    .then(data => {
      bibleData = data.resultset.row;
      showBookGrid();  // Show the grid of book abbreviations when data is loaded
    })
    .catch(error => {
      console.error('Error fetching Bible data:', error);
      verseContainer.innerHTML = "Error loading verses. Please try again later.";
    });

  // Function to show the book grid
  function showBookGrid() {
    verseContainer.innerHTML = '';  // Clear previous content

    // Create the grid container
    const gridContainer = document.createElement('div');
    gridContainer.classList.add('grid-container');
    verseContainer.appendChild(gridContainer);

    // Determine the number of columns based on orientation
    const isPortrait = window.innerHeight > window.innerWidth;
    const columns = isPortrait ? 6 : 11;
    gridContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

    // Create the book abbreviation buttons
    bookAbbreviations.forEach((abbr, index) => {
      const bookButton = document.createElement('button');
      bookButton.textContent = abbr;
      bookButton.classList.add('book-button');
      bookButton.addEventListener('click', () => loadChapters(index));
      gridContainer.appendChild(bookButton);
    });
  }

  // Function to load the chapters for a selected book
  function loadChapters(bookIndex) {
    verseContainer.innerHTML = '';  // Clear previous content

    // Get the number of chapters for the selected book
    const bookName = bookNames[bookIndex];
    const chapters = getChaptersForBook(bookName);  // Assume this function gives you the chapters data

    // Create the grid container for chapters
    const gridContainer = document.createElement('div');
    gridContainer.classList.add('grid-container');
    verseContainer.appendChild(gridContainer);

    // Determine the number of columns based on orientation
    const isPortrait = window.innerHeight > window.innerWidth;
    const columns = isPortrait ? 6 : 11;
    gridContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

    // Create chapter buttons
    chapters.forEach(chapter => {
      const chapterButton = document.createElement('button');
      chapterButton.textContent = chapter;
      chapterButton.classList.add('chapter-button');
      chapterButton.addEventListener('click', () => loadChapterContent(bookName, chapter));
      gridContainer.appendChild(chapterButton);
    });
  }

  // Dummy function to get chapters for a book (replace with actual data)
  function getChaptersForBook(bookName) {
    // Replace with real data or logic to fetch chapters for each book
    return Array.from({ length: 10 }, (_, i) => i + 1);  // Example: 10 chapters per book
  }

  // Function to load the chapter content (verses) for the selected chapter
  function loadChapterContent(bookName, chapter) {
    verseContainer.innerHTML = `Loading verses from ${bookName} Chapter ${chapter}...`;

    // Fetch the verses for the selected book and chapter
    const chapterVerses = bibleData.filter(verse => verse.field[1] === bookNames.indexOf(bookName) + 1 && verse.field[2] === chapter);

    // Show the first verse as an example
    showVerse(chapterVerses[0].field[0]);
  }

  // Function to show a verse (similar to your original `showVerse` function)
  function showVerse(index) {
    if (bibleData.length === 0) {
      verseContainer.innerHTML = "No verses found.";
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
});
