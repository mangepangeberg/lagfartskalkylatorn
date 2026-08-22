/**
 * Lagfart & Pantbrev Reaktiv Beräkningsmotor med Scenarioväljare
 */

document.addEventListener('DOMContentLoaded', () => {
  // Scenario Buttons
  const scenarioBtns = document.querySelectorAll('.scenario-btn');
  const propertyControls = document.getElementById('property-controls');
  const existingPantGroup = document.getElementById('existing-pant-group');
  const brfMessageBox = document.getElementById('brf-message-box');

  // Sliders & Displays
  const priceSlider = document.getElementById('price-slider');
  const loanSlider = document.getElementById('loan-slider');
  const existingPantSlider = document.getElementById('existing-pant-slider');
  
  const priceDisplay = document.getElementById('price-display');
  const loanDisplay = document.getElementById('loan-display');
  const existingPantDisplay = document.getElementById('existing-pant-display');
  
  const lagfartTotalElem = document.getElementById('lagfart-total');
  const lagfartDetailElem = document.getElementById('lagfart-detail');
  const pantbrevTotalElem = document.getElementById('pantbrev-total');
  const pantbrevDetailElem = document.getElementById('pantbrev-detail');
  const grandTotalElem = document.getElementById('grand-total');

  let activeScenario = 'villa'; // 'villa' | 'nybygge' | 'bostadsratt'

  const LAGFART_PERCENT = 0.015;
  const LAGFART_FEE = 825;
  const PANTBREV_PERCENT = 0.02;
  const PANTBREV_FEE = 375;

  const formatter = new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    maximumFractionDigits: 0
  });

  function calculate() {
    if (activeScenario === 'bostadsratt') return;

    const purchasePrice = parseInt(priceSlider.value, 10);
    const loanAmount = parseInt(loanSlider.value, 10);
    
    // Om nybygge: inga befintliga pantbrev (alltid 0)
    const existingPant = activeScenario === 'nybygge' ? 0 : parseInt(existingPantSlider.value, 10);

    // Max loan guard
    loanSlider.max = purchasePrice;
    existingPantSlider.max = purchasePrice;

    // 1. Lagfart
    const lagfartTax = Math.round(purchasePrice * LAGFART_PERCENT);
    const totalLagfart = lagfartTax + LAGFART_FEE;

    // 2. Pantbrev
    const neededPantbrev = Math.max(0, loanAmount - existingPant);
    const pantbrevTax = Math.round(neededPantbrev * PANTBREV_PERCENT);
    const totalPantbrev = neededPantbrev > 0 ? pantbrevTax + PANTBREV_FEE : 0;

    // 3. Totalt
    const grandTotal = totalLagfart + totalPantbrev;

    // 4. Render
    priceDisplay.textContent = formatter.format(purchasePrice);
    loanDisplay.textContent = formatter.format(loanAmount);
    existingPantDisplay.textContent = formatter.format(existingPant);

    lagfartTotalElem.textContent = formatter.format(totalLagfart);
    lagfartDetailElem.textContent = `1,5% skatt (${formatter.format(lagfartTax)}) + 825 kr avgift`;

    pantbrevTotalElem.textContent = formatter.format(totalPantbrev);
    pantbrevDetailElem.textContent = neededPantbrev > 0 
      ? `2% på nya ${formatter.format(neededPantbrev)} + 375 kr avgift`
      : 'Inga nya pantbrev krävs';

    grandTotalElem.textContent = formatter.format(grandTotal);
  }

  // Scenarioväljare klickhantering
  scenarioBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      scenarioBtns.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      activeScenario = btn.dataset.scenario;

      if (activeScenario === 'bostadsratt') {
        propertyControls.style.display = 'none';
        brfMessageBox.style.display = 'flex';
      } else {
        propertyControls.style.display = 'flex';
        brfMessageBox.style.display = 'none';

        if (activeScenario === 'nybygge') {
          existingPantGroup.style.display = 'none';
        } else {
          existingPantGroup.style.display = 'flex';
        }
        calculate();
      }
    });
  });

  // Slider events
  priceSlider.addEventListener('input', calculate);
  loanSlider.addEventListener('input', calculate);
  existingPantSlider.addEventListener('input', calculate);

  calculate();
});