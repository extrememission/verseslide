document.addEventListener('DOMContentLoaded', () => { 
  const verseContainer = document.getElementById('verse-container');
  let bibleData = [];
  let currentIndex = 0;

  fetch('data/kjv.json')
    .then(response => response.json())
    .then(data => {
      bibleData = data.resultset.row;
      showVerse();
    })
    .catch(error => {
      console.error('Error fetching Bible data:', error);
      verseContainer.innerHTML = 'Error loading verses. Please try again later.';
    });

  function showVerse() {
    if (bibleData.length === 0) {
      verseContainer.innerHTML = 'No verses found.';
      return;
    }

    // Get the current verse
    const verse = bibleData[currentIndex];
    const verseText = `${verse.field[4]} <br> ${verse.field[1]} ${verse.field[2]}:${verse.field[3]}`;

    // Create the verse box
    const verseBox = document.createElement('div');
    verseBox.classList.add('box');
    verseBox.innerHTML = verseText;

    // Add the verse box to the container with fade-in effect
    verseContainer.innerHTML = ''; // Clear previous verse
    verseContainer.appendChild(verseBox);
    verseContainer.style.opacity = 1; // Trigger fade-in

    // Set the next verse after 3 seconds
    setTimeout(() => {
      verseContainer.style.opacity = 0; // Trigger fade-out

      currentIndex = (currentIndex + 1) % bibleData.length; // Loop through verses

      // Wait for the fade-out to complete before showing the next verse
      setTimeout(showVerse, 1000); // 1 second delay to let fade-out happen before showing next verse
    }, 3000); // 3 seconds per verse
  }
});
