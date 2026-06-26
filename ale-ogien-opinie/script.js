const params = new URLSearchParams(window.location.search);
const waiter = params.get('kelner') || params.get('waiter') || 'kelner';
const waiterName = document.getElementById('waiterName');
const stars = document.querySelectorAll('#stars button');
const googleBox = document.getElementById('googleBox');
const feedbackBox = document.getElementById('feedbackBox');
const sendFeedback = document.getElementById('sendFeedback');
const comment = document.getElementById('comment');
const sentInfo = document.getElementById('sentInfo');
let selectedRating = null;

waiterName.textContent = waiter;

function setStars(rating){
  stars.forEach(btn => btn.classList.toggle('active', Number(btn.dataset.rating) <= rating));
}

async function saveRating(rating, text = ''){
  const payload = {
    date: new Date().toISOString(),
    waiter,
    rating,
    comment: text,
    page: window.location.href,
    userAgent: navigator.userAgent
  };

  if (!APPS_SCRIPT_URL) {
    console.log('Brak APPS_SCRIPT_URL. Dane testowe:', payload);
    return;
  }

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error('Błąd zapisu:', err);
  }
}

stars.forEach(btn => {
  btn.addEventListener('click', async () => {
    selectedRating = Number(btn.dataset.rating);
    setStars(selectedRating);
    feedbackBox.classList.add('hidden');
    googleBox.classList.add('hidden');

    if (selectedRating === 5) {
      googleBox.classList.remove('hidden');
      await saveRating(5, 'Przejście do Google');
      setTimeout(() => {
        window.location.href = GOOGLE_REVIEW_URL;
      }, 2000);
    } else {
      feedbackBox.classList.remove('hidden');
    }
  });
});

sendFeedback.addEventListener('click', async () => {
  if (!selectedRating) return;
  await saveRating(selectedRating, comment.value.trim());
  sentInfo.classList.remove('hidden');
  sendFeedback.disabled = true;
  sendFeedback.textContent = 'Wysłano';
});
