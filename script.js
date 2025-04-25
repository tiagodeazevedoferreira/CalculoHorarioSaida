document.addEventListener('DOMContentLoaded', () => {
  const entryTime = document.getElementById('entryTime');
  const lunchStart = document.getElementById('lunchStart');
  const lunchEnd = document.getElementById('lunchEnd');
  const exitTime = document.getElementById('exitTime');

  // Carregar valores salvos do localStorage
  entryTime.value = localStorage.getItem('entryTime') || '';
  lunchStart.value = localStorage.getItem('lunchStart') || '';
  lunchEnd.value = localStorage.getItem('lunchEnd') || '';
  calculateExitTime();

  function calculateExitTime() {
    const entry = entryTime.value;
    const lunchS = lunchStart.value;
    const lunchE = lunchEnd.value;

    if (!entry || !lunchS || !lunchE) {
      exitTime.textContent = '--:--';
      return;
    }

    // Convert time strings to minutes
    const toMinutes = (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const entryMin = toMinutes(entry);
    const lunchStartMin = toMinutes(lunchS);
    const lunchEndMin = toMinutes(lunchE);

    // Validate time sequence
    if (lunchStartMin <= entryMin || lunchEndMin <= lunchStartMin) {
      exitTime.textContent = 'Erro';
      return;
    }

    // Calculate morning work minutes
    const morningWork = lunchStartMin - entryMin;
    // Total work minutes required: 8h48 = 528 minutes
    const totalWork = 528;
    // Remaining work minutes after lunch
    const remainingWork = totalWork - morningWork;
    // Exit time in minutes
    const exitMin = lunchEndMin + remainingWork;

    // Convert back to HH:MM
    const formatTime = (minutes) => {
      const hrs = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    exitTime.textContent = formatTime(exitMin);
  }

  // Salvar valores no localStorage e recalcular
  entryTime.addEventListener('input', () => {
    localStorage.setItem('entryTime', entryTime.value);
    calculateExitTime();
  });
  lunchStart.addEventListener('input', () => {
    localStorage.setItem('lunchStart', lunchStart.value);
    calculateExitTime();
  });
  lunchEnd.addEventListener('input', () => {
    localStorage.setItem('lunchEnd', lunchEnd.value);
    calculateExitTime();
  });

  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('Service Worker Registered'))
      .catch(err => console.error('Service Worker Error:', err));
  }
});