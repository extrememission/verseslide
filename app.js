// app.js
document.addEventListener('DOMContentLoaded', () => { 
  const booksContainer = document.getElementById('books');
  const searchInput = document.getElementById('search');
  const resultCount = document.getElementById('result-count');
  const bibleData = [];

  const bookNames = {
    1: 'Genesis', 2: 'Exodus', 3: 'Leviticus', 4: 'Numbers', 5: 'Deuteronomy',
    6: 'Joshua', 7: 'Judges', 8: 'Ruth', 9: '1 Samuel', 10: '2 Samuel',
    11: '1 Kings', 12: '2 Kings', 13: '1 Chronicles', 14: '2 Chronicles',
    15: 'Ezra', 16: 'Nehemiah', 17: 'Esther', 18: 'Job', 19: 'Psalms',
    20: 'Proverbs', 21: 'Ecclesiastes', 22: 'Song of Solomon', 23: 'Isaiah',
    24: 'Jeremiah', 25: 'Lamentations', 26: 'Ezekiel', 27: 'Daniel', 28: 'Hosea',
    29: 'Joel', 30: 'Amos', 31: 'Obadiah', 32: 'Jonah', 33: 'Micah',
    34: 'Nahum', 35: 'Habakkuk', 36: 'Zephaniah', 37: 'Haggai', 38: 'Zechariah',
    39: 'Malachi', 40: 'Matthew', 41: 'Mark', 42: 'Luke', 43: 'John',
    44: 'Acts', 45: 'Romans', 46: '1 Corinthians', 47: '2 Corinthians',
    48: 'Galatians', 49: 'Ephesians', 50: 'Philippians', 51: 'Colossians',
    52: '1 Thessalonians', 53: '2 Thessalonians', 54: '1 Timothy',
    55: '2 Timothy', 56: 'Titus', 57: 'Philemon', 58: 'Hebrews', 59: 'James',
    60: '1 Peter', 61: '2 Peter', 62: '1 John', 63: '2 John', 64: '3 John',
    65: 'Jude', 66: 'Revelation'
  };

  displayBooks();

  fetch('data/kjv.json')
    .then(response => response.json())
    .then(data => {
      bibleData.push(...data.resultset.row);
      searchInput.addEventListener('input', debounce(searchHandler, 500));
    })
    .catch(error => {
      console.error('Error fetching Bible data:', error);
      resultCount.textContent = 'Error loading data. Please try again later.';
    });

  function displayBooks() {
    booksContainer.innerHTML = '';
    for (const bookId in bookNames) {
      const bookName = bookNames[bookId];
      const bookBox = createBoxElement(bookName);
      bookBox.classList.add('book-box');
      bookBox.dataset.bookId = bookId;
      bookBox.addEventListener('click', () => toggleChapters(bookId));
      addTouchListeners(bookBox);
      booksContainer.appendChild(bookBox);
    }
  }

  function addTouchListeners(element) {
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });
    element.addEventListener('click', handleClick, { passive: false });

    element.addEventListener('dblclick', (e) => {
      if (e.target.classList.contains('verse-box')) {
        const verseText = e.target.innerText;
        const parts = verseText.split(/\n\n|\n(?!\d)/); 
        const text = parts.slice(0, -1).join('\n'); 
        const reference = parts.slice(-1)[0]; 
        const formattedText = `${text}\n— ${reference.trim()}`;
        navigator.clipboard.writeText(formattedText)
          .then(() => alert('Verse copied to clipboard!'))
          .catch(err => console.error('Error copying verse:', err));
      }
    });
  }

  function toggleChapters(bookId) {
    booksContainer.innerHTML = '';
    const chapters = getChaptersByBookId(bookId);
    chapters.forEach(chapter => {
      const chapterBox = createBoxElement(`${bookNames[bookId]} ${chapter}`);
      chapterBox.classList.add('chapter-box');
      addTouchListeners(chapterBox);
      chapterBox.dataset.chapter = chapter;
      chapterBox.dataset.bookId = bookId;
      chapterBox.addEventListener('click', () => toggleVerses(bookId, chapter));
      booksContainer.appendChild(chapterBox);
    });
  }

  function getChaptersByBookId(bookId) {
    const chapters = new Set();
    bibleData.forEach(verse => {
      if (verse.field[1] === parseInt(bookId)) {
        chapters.add(verse.field[2]);
      }
    });
    return Array.from(chapters).sort((a, b) => a - b);
  }

  function toggleVerses(bookId, chapter) {
    booksContainer.innerHTML = '';
    const verses = getVersesByBookAndChapter(bookId, chapter);
    verses.forEach(verse => {
      const verseNumber = verse.field[3];
      const verseText = `${verse.field[4]}<br>${bookNames[bookId]} ${chapter}:${verseNumber}`;
      const verseBox = createBoxElement(verseText);
      verseBox.classList.add('verse-box');
      verseBox.dataset.verse = verseNumber;
      verseBox.dataset.bookId = bookId;
      verseBox.dataset.chapter = chapter;
      booksContainer.appendChild(verseBox);
    });
    cycleVerses(0); // Start the cycle of verses
  }

  function getVersesByBookAndChapter(bookId, chapter) {
    return bibleData.filter(verse => verse.field[1] === parseInt(bookId) && verse.field[2] === parseInt(chapter));
  }

  let verseCycleIndex = 0;
  let verseCycleTimeout;

  function cycleVerses(index) {
    const verseBoxes = document.querySelectorAll('.verse-box');
    if (verseBoxes.length > 0) {
      // Fade out the current verse
      const currentVerse = verseBoxes[verseCycleIndex];
      currentVerse.classList.add('fade-out');
      
      setTimeout(() => {
        // Hide the current verse after fade-out
        currentVerse.style.display = 'none';
        
        // Move to the next verse
        verseCycleIndex = (verseCycleIndex + 1) % verseBoxes.length;
        const nextVerse = verseBoxes[verseCycleIndex];
        
        // Show the next verse and fade it in
        nextVerse.style.display = 'flex';
        nextVerse.classList.add('fade-in');
        
        setTimeout(() => {
          nextVerse.classList.remove('fade-in');
        }, 1000); // Wait for the fade-in to complete

        verseCycleTimeout = setTimeout(() => cycleVerses(verseCycleIndex), 3000); // Next verse after 3 seconds
      }, 1000); // Fade-out duration
    }
  }

  function createBoxElement(text) {
    const box = document.createElement('div');
    box.className = 'box';
    box.innerHTML = text;
    return box;
  }

  function debounce(func, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  }
});
