/**
 * Lagfartskalkylatorn - Reaktiv Beräkningsmotor (Lag 1984:404 Kompatibel)
 */

document.addEventListener('DOMContentLoaded', () => {
  const categoryCards = document.querySelectorAll('.category-card');
  const inputsGroup = document.getElementById('inputs-group');
  const existingPantRow = document.getElementById('existing-pant-row');
  const taxRow = document.getElementById('tax-row');
  const brfCard = document.getElementById('brf-card');
  const priceLabel = document.getElementById('price-label');
  const loanLabel = document.getElementById('loan-label');

  const priceSlider = document.getElementById('price-slider');
  const taxSlider = document.getElementById('tax-slider');
  const loanSlider = document.getElementById('loan-slider');
  const existingPantSlider = document.getElementById('existing-pant-slider');

  const priceInput = document.getElementById('price-input');
  const taxInput = document.getElementById('tax-input');
  const loanInput = document.getElementById('loan-input');
  const existingPantInput = document.getElementById('existing-pant-input');

  const noTaxCheck = document.getElementById('no-tax-check');
  const taxInputContainer = document.getElementById('tax-input-container');
  const noTaxNotice = document.getElementById('no-tax-notice');
  const taxBasisBadge = document.getElementById('tax-basis-badge');

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
    const taxVal = noTaxCheck.checked ? 0 : parseInt(taxSlider.value, 10);
    const loan = parseInt(loanSlider.value, 10);
    const existingPant = currentScenario === 'nybygge' ? 0 : parseInt(existingPantSlider.value, 10);

    // 1. Lagfartsunderlag (Högsta av köpeskilling och taxeringsvärde, avrundat nedåt till fullt 1000-tal)
    const effectiveBasis = Math.max(price, taxVal);
    const roundedLagfartBasis = Math.floor(effectiveBasis / 1000) * 1000;
    const lagfartTax = roundedLagfartBasis * LAGFART_PERCENT;
    const totLagfart = lagfartTax + LAGFART_FEE;

    // UI-badge för vad stämpelskatten styrs av
    if (noTaxCheck.checked) {
      taxBasisBadge.textContent = 'Taxeringsvärde saknas (Värdeintyg)';
      taxBasisBadge.classList.remove('is-tax-driven');
    } else if (taxVal > price) {
      taxBasisBadge.textContent = 'Lagfart baseras på taxeringsvärde!';
      taxBasisBadge.classList.add('is-tax-driven');
    } else {
      taxBasisBadge.textContent = 'Lagfart baseras på köpeskilling';
      taxBasisBadge.classList.remove('is-tax-driven');
    }

    // 2. Pantbrevsunderlag (Lånebehov utöver befintliga pantbrev, avrundat nedåt till fullt 1000-tal)
    const neededPant = Math.max(0, loan - existingPant);
    const roundedPantBasis = Math.floor(neededPant / 1000) * 1000;
    const pantbrevTax = roundedPantBasis * PANTBREV_PERCENT;
    const totPantbrev = roundedPantBasis > 0 ? pantbrevTax + PANTBREV_FEE : 0;

    // 3. Totalt belopp
    const grand = totLagfart + totPantbrev;

    // 4. Uppdatera DOM
    grandTotal.textContent = `${fmt.format(grand)} SEK`;
    lagfartVal.textContent = `${fmt.format(totLagfart)} SEK`;
    pantbrevVal.textContent = `${fmt.format(totPantbrev)} SEK`;

    // 5. Gradient Tracks
    updateSliderFill(priceSlider);
    updateSliderFill(taxSlider);
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
  setupSync(taxSlider, taxInput);
  setupSync(loanSlider, loanInput);
  setupSync(existingPantSlider, existingPantInput);

  // Checkbox för saknat taxeringsvärde
  noTaxCheck.addEventListener('change', () => {
    if (noTaxCheck.checked) {
      taxInputContainer.style.display = 'none';
      noTaxNotice.style.display = 'block';
    } else {
      taxInputContainer.style.display = 'block';
      noTaxNotice.style.display = 'none';
    }
    calculate();
  });

  // Tabb-växling
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
          priceLabel.textContent = 'Tomtpris';
          loanLabel.textContent = 'Totalt Bolån (inkl. husbygge)';
          existingPantRow.style.display = 'none';
        } else {
          priceLabel.textContent = 'Köpeskilling';
          loanLabel.textContent = 'Planerat Bolån';
          existingPantRow.style.display = 'flex';
        }
      }
      calculate();
    });
  });

  // Initiera värden
  priceInput.value = fmt.format(priceSlider.value);
  taxInput.value = fmt.format(taxSlider.value);
  loanInput.value = fmt.format(loanSlider.value);
  existingPantInput.value = fmt.format(existingPantSlider.value);
  calculate();
});