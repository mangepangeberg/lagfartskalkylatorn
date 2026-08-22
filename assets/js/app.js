/**
 * Lagfartskalkylatorn - Reaktiv Beräkningsmotor & Off-Canvas Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  // Drawer DOM Referenser
  const drawerToggle = document.getElementById('drawer-toggle');
  const drawerClose = document.getElementById('drawer-close');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerPanel = document.getElementById('drawer-panel');
  const drawerLinks = document.querySelectorAll('[data-close-drawer]');

  // Kalkylator DOM Referenser
  const categoryCards = document.querySelectorAll('.category-card');
  const inputsGroup = document.getElementById('inputs-group');
  const existingPantCard = document.getElementById('existing-pant-card');
  const brfCard = document.getElementById('brf-card');
  const neededPantRow = document.getElementById('needed-pant-row');

  const priceSlider = document.getElementById('price-slider');
  const loanSlider = document.getElementById('loan-slider');
  const existingPantSlider = document.getElementById('existing-pant-slider');

  const priceVal = document.getElementById('price-val');
  const loanVal = document.getElementById('loan-val');
  const existingPantVal = document.getElementById('existing-pant-val');

  const grandTotal = document.getElementById('grand-total');
  const lagfartVal = document.getElementById('lagfart-val');
  const pantbrevVal = document.getElementById('pantbrev-val');
  const neededPantVal = document.getElementById('needed-pant-val');

  let currentScenario = 'villa';

  const LAGFART_PERCENT = 0.015;
  const LAGFART_FEE = 825;
  const PANTBREV_PERCENT = 0.02;
  const PANTBREV_FEE = 375;

  const fmt = new Intl.NumberFormat('sv-SE', {
    maximumFractionDigits: 0
  });

  // --- Drawer Hantering ---
  function openDrawer() {
    drawerPanel.classList.add('is-open');
    drawerBackdrop.classList.add('is-open');
    drawerToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawerPanel.classList.remove('is-open');
    drawerBackdrop.classList.remove('is-open');
    drawerToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  drawerToggle.addEventListener('click', openDrawer);
  drawerClose.addEventListener('click', closeDrawer);
  drawerBackdrop.addEventListener('click', closeDrawer);
  drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawerPanel.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  // --- Kalkylator Progress Bar & Logic ---
  function updateSliderFill(slider) {
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const val = parseFloat(slider.value) || 0;
    const percentage = ((val - min) / (max - min)) * 100;
    slider.style.background = `linear-gradient(to right, #0066FF 0%, #0066FF ${percentage}%, #EAEFF5 ${percentage}%, #EAEFF5 100%)`;
  }

  function calculate() {
    if (currentScenario === 'bostadsratt') {
      grandTotal.textContent = '0 SEK';
      lagfartVal.textContent = '0 SEK';
      pantbrevVal.textContent = '0 SEK';
      neededPantVal.textContent = 'Inga';
      return;
    }

    const price = parseInt(priceSlider.value, 10);
    const loan = parseInt(loanSlider.value, 10);
    const existingPant = currentScenario === 'nybygge' ? 0 : parseInt(existingPantSlider.value, 10);

    loanSlider.max = price;
    existingPantSlider.max = price;

    // 1. Lagfart
    const lagfartTax = Math.round(price * LAGFART_PERCENT);
    const totLagfart = lagfartTax + LAGFART_FEE;

    // 2. Pantbrev
    const neededPant = Math.max(0, loan - existingPant);
    const pantbrevTax = Math.round(neededPant * PANTBREV_PERCENT);
    const totPantbrev = neededPant > 0 ? pantbrevTax + PANTBREV_FEE : 0;

    // 3. Totalt
    const grand = totLagfart + totPantbrev;

    // 4. DOM Värden
    priceVal.textContent = fmt.format(price);
    loanVal.textContent = fmt.format(loan);
    existingPantVal.textContent = fmt.format(existingPant);

    grandTotal.textContent = `${fmt.format(grand)} SEK`;
    lagfartVal.textContent = `${fmt.format(totLagfart)} SEK`;
    pantbrevVal.textContent = `${fmt.format(totPantbrev)} SEK`;
    neededPantVal.textContent = `${fmt.format(neededPant)} SEK`;

    // 5. Uppdatera sliders spårfärg
    updateSliderFill(priceSlider);
    updateSliderFill(loanSlider);
    updateSliderFill(existingPantSlider);
  }

  // Scenarioväljare (Kortikoner)
  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      categoryCards.forEach(c => {
        c.classList.remove('is-active');
        c.setAttribute('aria-selected', 'false');
      });
      card.classList.add('is-active');
      card.setAttribute('aria-selected', 'true');

      currentScenario = card.dataset.scenario;

      if (currentScenario === 'bostadsratt') {
        inputsGroup.style.display = 'none';
        brfCard.style.display = 'flex';
        neededPantRow.style.display = 'none';
      } else {
        inputsGroup.style.display = 'flex';
        brfCard.style.display = 'none';
        neededPantRow.style.display = 'flex';

        if (currentScenario === 'nybygge') {
          existingPantCard.style.display = 'none';
        } else {
          existingPantCard.style.display = 'flex';
        }
      }
      calculate();
    });
  });

  priceSlider.addEventListener('input', calculate);
  loanSlider.addEventListener('input', calculate);
  existingPantSlider.addEventListener('input', calculate);

  calculate();
});