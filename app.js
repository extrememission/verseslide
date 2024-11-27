document.addEventListener('DOMContentLoaded', () => {
  const booksContainer = document.getElementById('books');
  const searchInput = document.getElementById('search');
  const bibleData = [];
  const loadingMessage = document.getElementById('loading-message');
  const gridContainer = document.getElementById('grid-container'); // Assuming this is where the grid is displayed

  // Book abbreviations as mentioned
  const bookAbbreviations = {
    1: 'Ge', 2: 'Ex', 3: 'Le', 4: 'Nu', 5: 'De',
    6: 'Jo', 7: 'Ju', 8: 'Ru', 9: '1Sa', 10: '2Sa',
    11: '1Ki', 12: '2Ki', 13: '1Ch', 14: '2Ch',
    15: 'Ez', 16: 'Ne', 17: 'Es', 18: 'Job', 19: 'Ps',
    20: 'Pr', 21: 'Ec', 22: 'So', 23: 'Is', 24: 'Je',
    25: 'La', 26: 'Eze', 27: 'Da', 28: 'Ho', 29: 'Jo',
    30: 'Am', 31: 'Ob', 32: 'Jon', 33: 'Mi', 34: 'Na',
    35: 'Hab', 36: 'Zep', 37: 'Hag', 38: 'Zec', 39: 'Mal',
    40: 'Mt', 41: 'Mk', 42: 'Lu', 43: 'Jo', 44: 'Ac',
    45: 'Ro', 46: '1Co', 47: '2Co', 48: 'Ga', 49: 'Ep',
    50: 'Php', 51: 'Col', 52: '1Th', 53: '2Th', 54: '1Ti',
    55: '2Ti', 56: 'Tit', 57: 'Phm', 58: 'Heb', 59: 'Ja',
    60: '1Pe', 61: '2Pe', 62: '1Jo', 63: '2Jo', 64: '3Jo',
    65: 'Jude', 66: 'Re'
  };

  // Display books immediately
  displayBooks();

  // Fetch Bible data
  fetch('data/kjv.json')
    .then(response => response.json())
    .then(data => {
      bibleData.push(...data.resultset.row);
      loadingMessage.classList.add('hidden');

      searchInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
          searchHandler();
        }
      });
    })
    .catch(error => {
      console.error('Error fetching Bible data:', error);
      loadingMessage.textContent = 'Error loading data. Please try again later.';
    });

  function displayBooks() {
    booksContainer.innerHTML = '';
    for (const bookId in bookAbbreviations) {
      const bookAbbr = bookAbbreviations[bookId];
      const bookBox = createBoxElement(bookAbbr);
      bookBox.classList.add('book-box');
      bookBox.dataset.bookId = bookId;
      bookBox.addEventListener('click', () => toggleChapters(bookId));

      booksContainer.appendChild(bookBox);
    }
  }

  function createBoxElement(text) {
    const box = document.createElement('div');
    box.className = 'box';
    box.innerHTML = text;
    return box;
  }

  function toggleChapters(bookId) {
    booksContainer.innerHTML = '';
    const chapters = getChaptersByBookId(bookId);
    chapters.forEach(chapter => {
      const chapterBox = createBoxElement(`${bookAbbreviations[bookId]} ${chapter}`);
      chapterBox.classList.add('chapter-box');
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
      const verseText = `${formatVerseText(verse.field[4])}<br>${bookAbbreviations[bookId]} ${chapter}:${verse.field[3]}`;
      const verseBox = createBoxElement(verseText);
      verseBox.classList.add('verse-box');
      verseBox.dataset.verse = verse.field[3];
      verseBox.dataset.bookId = bookId;
      verseBox.dataset.chapter = chapter;

      booksContainer.appendChild(verseBox);
    });
  }

  function getVersesByBookAndChapter(bookId, chapter) {
    return bibleData
      .filter(verse => verse.field[1] === parseInt(bookId) && verse.field[2] === chapter)
      .sort((a, b) => a.field[3] - b.field[3]);
  }

  function formatVerseText(text) {
    const punctuationRegex = /([.,:;!?])/g;
    return text.replace(punctuationRegex, '<br>$1');
  }

  // Handle grid layout for portrait vs landscape
  function adjustGridLayout() {
    const isPortrait = window.innerHeight > window.innerWidth;
    if (isPortrait) {
      gridContainer.style.gridTemplateColumns = 'repeat(6, 1fr)';
    } else {
      gridContainer.style.gridTemplateColumns = 'repeat(11, 1fr)';
    }
  }

  // Adjust the grid layout on resize
  window.addEventListener('resize', adjustGridLayout);
  adjustGridLayout();  // Call once on load

  function searchHandler() {
    const searchTerm = searchInput.value.toLowerCase();

    if (!searchTerm) return;
    loadingMessage.classList.remove('hidden');
    booksContainer.innerHTML = '';
    setTimeout(() => {
      const results = bibleData.filter(verse => verse.field[4].toLowerCase().includes(searchTerm));
      const highlightTerm = new RegExp(`(${searchTerm})`, 'gi');

      alert(`Found ${results.length} results for "${searchTerm}"`);

      results.forEach(result => {
        const bookId = result.field[1];
        const bookName = bookAbbreviations[bookId];
        const chapter = result.field[2];
        const verseNumber = result.field[3];
        const verseText = formatVerseText(result.field[4]).replace(highlightTerm, '<span class="highlight">$1</span>');
        const fullText = `${verseText}<br>${bookName} ${chapter}:${verseNumber}`;
        const resultBox = createBoxElement(fullText);
        resultBox.classList.add('result-box');
        resultBox.addEventListener('click', () => {
          toggleChapters(bookId);
          toggleVerses(bookId, chapter, verseNumber);
        });
        booksContainer.appendChild(resultBox);
      });
      loadingMessage.classList.add('hidden');
    }, 500);
  }
});
