/**
 * Lagfartskalkylatorn - Reaktiv Beräkningsmotor (100% Clean Utility)
 */

document.addEventListener('DOMContentLoaded', () => {
  const categoryCards = document.querySelectorAll('.category-card');
  const inputsGroup = document.getElementById('inputs-group');
  const existingPantRow = document.getElementById('existing-pant-row');
  const brfCard = document.getElementById('brf-card');

  const priceSlider = document.getElementById('price-slider');
  const loanSlider = document.getElementById('loan-slider');
  const existingPantSlider = document.getElementById('existing-pant-slider');

  const priceInput = document.getElementById('price-input');
  const loanInput = document.getElementById('loan-input');
  const existingPantInput = document.getElementById('existing-pant-input');

  const grandTotal = document.getElementById('grand-total');
  const lagfartVal = document.getElementById('lagfart-val');
  const pantbrevVal = document.getElementById('pantbrev-val');

  let currentScenario = 'villa';

  const LAGFART_PERCENT = 0.015;
  const LAGFART_FEE = 825;
  const PANTBREV_PERCENT = 0.02;
  const PANTBREV_FEE = 375;

  const fmt = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 0 });

  function parseFormattedNumber(val) {
    return parseInt(val.replace(/\s+/g, '').replace(/[^0-9]/g, ''), 10) || 0;
  }

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

    // 4. Uppdatera DOM-fält
    grandTotal.textContent = `${fmt.format(grand)} SEK`;
    lagfartVal.textContent = `${fmt.format(totLagfart)} SEK`;
    pantbrevVal.textContent = `${fmt.format(totPantbrev)} SEK`;

    // 5. Progress Tracks
    updateSliderFill(priceSlider);
    updateSliderFill(loanSlider);
    updateSliderFill(existingPantSlider);
  }

  function setupSync(slider, input) {
    slider.addEventListener('input', () => {
      input.value = fmt.format(slider.value);
      calculate();
    });

    input.addEventListener('focus', () => {
      input.value = parseFormattedNumber(input.value);
      input.select();
    });

    input.addEventListener('blur', () => {
      let val = parseFormattedNumber(input.value);
      val = Math.max(parseInt(slider.min, 10), Math.min(parseInt(slider.max, 10), val));
      slider.value = val;
      input.value = fmt.format(val);
      calculate();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        input.blur();
      }
    });
  }

  setupSync(priceSlider, priceInput);
  setupSync(loanSlider, loanInput);
  setupSync(existingPantSlider, existingPantInput);

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
      } else {
        inputsGroup.style.display = 'flex';
        brfCard.style.display = 'none';

        if (currentScenario === 'nybygge') {
          existingPantRow.style.display = 'none';
        } else {
          existingPantRow.style.display = 'flex';
        }
      }
      calculate();
    });
  });

  priceInput.value = fmt.format(priceSlider.value);
  loanInput.value = fmt.format(loanSlider.value);
  existingPantInput.value = fmt.format(existingPantSlider.value);
  calculate();
});