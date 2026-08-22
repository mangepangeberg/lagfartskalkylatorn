/**
 * Lagfartskalkylatorn - Reaktiv Beräkningsmotor (UX V2 Edition)
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Referenser
  const categoryCards = document.querySelectorAll('.category-card');
  const scenarioTitle = document.getElementById('scenario-title');
  const scenarioText = document.getElementById('scenario-text');

  const inputsGroup = document.getElementById('inputs-group');
  const taxRow = document.getElementById('tax-row');
  const existingPantRow = document.getElementById('existing-pant-row');
  const brfCard = document.getElementById('brf-card');
  const stickyResultBar = document.getElementById('sticky-result-bar');

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
  const taxHelpBox = document.getElementById('tax-help-box');
  const taxInfoBtn = document.getElementById('tax-info-btn');
  const taxBasisBadge = document.getElementById('tax-basis-badge');

  const grandTotalLabel = document.getElementById('grand-total-label');
  const grandTotal = document.getElementById('grand-total');
  const lagfartVal = document.getElementById('lagfart-val');
  const pantbrevVal = document.getElementById('pantbrev-val');

  const pillsSummaryRow = document.getElementById('pills-summary-row');
  const calcBreakdownWrap = document.getElementById('calc-breakdown-wrap');
  const breakdownLagfartMath = document.getElementById('breakdown-lagfart-math');
  const breakdownLagfartRes = document.getElementById('breakdown-lagfart-res');
  const breakdownPantMath = document.getElementById('breakdown-pant-math');
  const breakdownPantRes = document.getElementById('breakdown-pant-res');
  const calculationBasisNote = document.getElementById('calculation-basis-note');

  const faqHeadline = document.getElementById('faq-headline');
  const faqItemsContainer = document.getElementById('faq-items-container');

  let currentScenario = 'villa';

  const LAGFART_PERCENT = 0.015;
  const LAGFART_FEE = 825;
  const PANTBREV_PERCENT = 0.02;
  const PANTBREV_FEE = 375;

  const fmt = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 0 });

  // Kontextuella FAQ-databaser
  const FAQ_DATA = {
    villa: {
      title: 'Vanliga frågor om Villa & Fastighet',
      items: [
        {
          q: 'Hur beräknas lagfarten för en villa?',
          a: 'Lagfarten (stämpelskatten) är 1,5% på det högsta beloppet av köpeskillingen och föregående års taxeringsvärde, avrundat nedåt till helt tusental kronor. Dessutom tillkommer Lantmäteriets fasta expeditionsavgift på 825 kr.'
        },
        {
          q: 'Hur fungerar pantbrev vid fastighetsköp?',
          a: 'Pantbrev är bankens säkerhet för lånet. Du betalar endast för nya pantbrev om ditt bolån överstiger de pantbrev som säljaren redan tagit ut i fastigheten. Kostnaden är 2,0% på det nya beloppet plus 375 kr i expeditionsavgift per ny inteckning.'
        },
        {
          q: 'Var hittar jag fastighetens taxeringsvärde?',
          a: 'Taxeringsvärdet för föregående år står i mäklarens objektsbeskrivning och köpekontraktet. Du kan även logga in på Skatteverkets e-tjänst för fastighetsdeklaration.'
        }
      ]
    },
    nybygge: {
      title: 'Vanliga frågor om Tomt & Nybygge',
      items: [
        {
          q: 'Betalar jag lagfart på husets entreprenadkostnad?',
          a: 'Nej. När du köper en tomt beräknas lagfarten enbart på själva fastighetsförvärvet (tomtpriset eller tomtens taxeringsvärde), inte på entreprenadkontraktet för husbygget.'
        },
        {
          q: 'Hur beräknas pantbrev vid nybygge?',
          a: 'Eftersom husbygget och tomten belånas tillsammans behöver du pantbrev för hela byggnadskreditivet/lånebeloppet. Nya pantbrev kostar 2,0% på lånebehovet utöver eventuella befintliga pantbrev.'
        },
        {
          q: 'Vad gäller om tomten är nybildad och saknar taxeringsvärde?',
          a: 'För nybildade tomter fastställer Lantmäteriet jämförelsevärdet genom ett särskilt värdeintyg från mäklare eller värderingsman.'
        }
      ]
    },
    bostadsratt: {
      title: 'Vanliga frågor om Bostadsrätt',
      items: [
        {
          q: 'Varför betalar man ingen lagfart för bostadsrätt?',
          a: 'Vid köp av bostadsrätt köper du inte fast egendom, utan en andel i bostadsrättsföreningen med tillhörande nyttjanderätt. Därför betalas ingen stämpelskatt till Lantmäteriet.'
        },
        {
          q: 'Varför tas inga pantbrev ut?',
          a: 'Eftersom föreningen äger fastigheten kan inte privatpersoner ta ut pantbrev. Banken tar istället pant i din bostadsrättsandel direkt via föreningens lägenhetsregister.'
        },
        {
          q: 'Vad är överlåtelse- och pantsättningsavgift?',
          a: 'Det är administrativa avgifter som föreningen har rätt att ta ut enligt sina stadgar för att registrera ägarbytet och pantsättningen i lägenhetsregistret.'
        }
      ]
    }
  };

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

  function renderFAQ(scenario) {
    const data = FAQ_DATA[scenario];
    faqHeadline.textContent = data.title;
    faqItemsContainer.innerHTML = '';

    data.items.forEach((item, index) => {
      const details = document.createElement('details');
      details.className = 'faq-item';
      if (index === 0) details.open = true;

      const summary = document.createElement('summary');
      summary.innerHTML = `${item.q} <span>+</span>`;

      const body = document.createElement('div');
      body.className = 'faq-body';
      body.textContent = item.a;

      details.appendChild(summary);
      details.appendChild(body);
      faqItemsContainer.appendChild(details);
    });
  }

  function calculate() {
    // 1. Bostadsrättslogik
    if (currentScenario === 'bostadsratt') {
      grandTotalLabel.textContent = 'Kostnad till Lantmäteriet';
      grandTotal.textContent = '0 kr';
      pillsSummaryRow.style.display = 'none';
      calcBreakdownWrap.style.display = 'none';
      calculationBasisNote.textContent = 'Bostadsrätter är befriade från stämpelskatt och inskrivningsavgifter.';
      return;
    }

    pillsSummaryRow.style.display = 'flex';
    calcBreakdownWrap.style.display = 'block';

    const price = parseInt(priceSlider.value, 10);
    const taxVal = noTaxCheck.checked ? 0 : parseInt(taxSlider.value, 10);
    const loan = parseInt(loanSlider.value, 10);
    const existingPant = parseInt(existingPantSlider.value, 10);

    // 2. Lagfartsunderlag (Högsta av köpeskilling och taxeringsvärde, avrundat nedåt till fullt 1 000-tal)
    const effectiveBasis = Math.max(price, taxVal);
    const roundedLagfartBasis = Math.floor(effectiveBasis / 1000) * 1000;
    const lagfartTax = roundedLagfartBasis * LAGFART_PERCENT;
    const totLagfart = lagfartTax + LAGFART_FEE;

    // Statusetikett
    if (noTaxCheck.checked) {
      taxBasisBadge.textContent = 'Preliminärt: Baseras på köpeskilling';
      taxBasisBadge.classList.remove('is-tax-driven');
      grandTotalLabel.textContent = 'Preliminär kostnad';
    } else if (taxVal > price) {
      taxBasisBadge.textContent = `Lagfart beräknas på ${fmt.format(taxVal)} kr (taxeringsvärdet är högst)`;
      taxBasisBadge.classList.add('is-tax-driven');
      grandTotalLabel.textContent = 'Totalt att betala';
    } else {
      taxBasisBadge.textContent = `Lagfart beräknas på ${fmt.format(price)} kr (köpeskillingen är högst)`;
      taxBasisBadge.classList.remove('is-tax-driven');
      grandTotalLabel.textContent = 'Totalt att betala';
    }

    // 3. Pantbrevsunderlag (Lånebehov utöver befintliga pantbrev, avrundat nedåt till fullt 1 000-tal)
    const neededPant = Math.max(0, loan - existingPant);
    const roundedPantBasis = Math.floor(neededPant / 1000) * 1000;
    const pantbrevTax = roundedPantBasis * PANTBREV_PERCENT;
    const totPantbrev = roundedPantBasis > 0 ? pantbrevTax + PANTBREV_FEE : 0;

    // 4. Totalt
    const grand = totLagfart + totPantbrev;

    // 5. DOM Uppdatering
    grandTotal.textContent = `${fmt.format(grand)} kr`;
    lagfartVal.textContent = `${fmt.format(totLagfart)} kr`;
    pantbrevVal.textContent = `${fmt.format(totPantbrev)} kr`;

    // 6. Så räknade vi (Breakdown)
    breakdownLagfartMath.textContent = `${fmt.format(roundedLagfartBasis)} kr × 1,5 % + 825 kr`;
    breakdownLagfartRes.textContent = `= ${fmt.format(totLagfart)} kr`;

    if (roundedPantBasis > 0) {
      breakdownPantMath.textContent = `${fmt.format(roundedPantBasis)} kr × 2,0 % + 375 kr`;
      breakdownPantRes.textContent = `= ${fmt.format(totPantbrev)} kr`;
    } else {
      breakdownPantMath.textContent = `0 kr i nya pantbrev`;
      breakdownPantRes.textContent = `= 0 kr`;
    }

    calculationBasisNote.textContent = 'Beräknat på högsta värdet (avrundat till fullt 1 000-tal). 1 ny inteckning (375 kr).';

    // 7. Track fills
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

  // Hjälpknapp för taxeringsvärde
  taxInfoBtn.addEventListener('click', () => {
    taxHelpBox.style.display = taxHelpBox.style.display === 'none' ? 'block' : 'none';
  });

  // Checkbox för saknat taxeringsvärde
  noTaxCheck.addEventListener('change', () => {
    if (noTaxCheck.checked) {
      taxInputContainer.style.display = 'none';
      noTaxNotice.style.display = 'block';
      taxHelpBox.style.display = 'none';
    } else {
      taxInputContainer.style.display = 'block';
      noTaxNotice.style.display = 'none';
    }
    calculate();
  });

  // Scenario-växling
  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      categoryCards.forEach(c => {
        c.classList.remove('is-active');
        c.setAttribute('aria-selected', 'false');
      });
      card.classList.add('is-active');
      card.setAttribute('aria-selected', 'true');

      currentScenario = card.dataset.scenario;
      renderFAQ(currentScenario);

      if (currentScenario === 'bostadsratt') {
        scenarioTitle.textContent = 'Köper du bostadsrätt?';
        scenarioText.textContent = 'Vid köp av bostadsrätt betalar du ingen lagfart eller pantbrevskostnad till staten.';
        inputsGroup.style.display = 'none';
        brfCard.style.display = 'flex';
      } else {
        inputsGroup.style.display = 'flex';
        brfCard.style.display = 'none';

        if (currentScenario === 'nybygge') {
          scenarioTitle.textContent = 'Köper du tomt och ska bygga hus?';
          scenarioText.textContent = 'Lagfarten beräknas på tomtköpet medan pantbreven beräknas på det totala lånebehovet.';
          priceLabel.textContent = 'Tomtpris';
          loanLabel.textContent = 'Totalt lån för tomt och husbygge';
        } else {
          scenarioTitle.textContent = 'Köper du villa, fritidshus eller fastighet?';
          scenarioText.textContent = 'Räkna ut lagfart och eventuella nya pantbrev utifrån köpeskilling och taxeringsvärde.';
          priceLabel.textContent = 'Köpeskilling';
          loanLabel.textContent = 'Hur mycket ska du låna?';
        }
      }
      calculate();
    });
  });

  // Init
  priceInput.value = fmt.format(priceSlider.value);
  taxInput.value = fmt.format(taxSlider.value);
  loanInput.value = fmt.format(loanSlider.value);
  existingPantInput.value = fmt.format(existingPantSlider.value);
  renderFAQ(currentScenario);
  calculate();
});