const play = document.getElementById('play');
const status = document.getElementById('startupStatus');
async function loadGame() {
  play.disabled = true;
  play.textContent = 'LOADING CITY…';
  status.textContent = 'Preparing your city…';
  try {
    await import('./app.js');
    play.disabled = false;
    play.innerHTML = 'ENTER SYDNEY <span>↗</span>';
    if (status.dataset.compatibility !== 'true') status.textContent = 'City ready. Choose your role and enter.';
  } catch (error) {
    console.error('Sydney startup failed:', error);
    status.textContent = 'The game could not load. Run this project using npm start, then reload the page. If it still fails, check that your host serves the game scripts and Three.js files.';
    play.textContent = 'RELOAD GAME ↻';
    play.disabled = false;
    play.onclick = () => location.reload();
  }
}
loadGame();
