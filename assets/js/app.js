/**
 * Lagfartskalkylatorn - Polestar Clean Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  const categoryCards = document.querySelectorAll('.category-card');
  const scenarioTitle = document.getElementById('scenario-title');
  const scenarioText = document.getElementById('scenario-text');

  const inputsGroup = document.getElementById('inputs-group');
  const taxRow = document.getElementById('tax-row');
  const existingPantRow = document.getElementById('existing-pant-row');
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
  const taxHelpBox = document.getElementById('tax-help-box');
  const taxInfoBtn = document.getElementById('tax-info-btn');

  const barHeroLabel = document.getElementById('bar-hero-label');
  const barHeroSum = document.getElementById('bar-hero-sum');
  const btnOpenSheet = document.getElementById('btn-open-sheet');
  const btnCloseSheet = document.getElementById('btn-close-sheet');
  const sheetOverlay = document.getElementById('sheet-overlay');
  const sheetPanel = document.getElementById('sheet-panel');

  const sheetTotalLabel = document.getElementById('sheet-total-label');
  const sheetTotalSum = document.getElementById('sheet-total-sum');
  const sheetLagfartVal = document.getElementById('sheet-lagfart-val');
  const sheetPantbrevVal = document.getElementById('sheet-pantbrev-val');
  const sheetLagfartDesc = document.getElementById('sheet-lagfart-desc');
  const sheetLagfartFormula = document.getElementById('sheet-lagfart-formula');
  const sheetPantDesc = document.getElementById('sheet-pant-desc');
  const sheetPantFormula = document.getElementById('sheet-pant-formula');

  const faqHeadline = document.getElementById('faq-headline');
  const faqItemsContainer = document.getElementById('faq-items-container');

  let currentScenario = 'villa';

  const LAGFART_PERCENT = 0.015;
  const LAGFART_FEE = 825;
  const PANTBREV_PERCENT = 0.02;
  const PANTBREV_FEE = 375;

  const fmt = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 0 });

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
          a: 'Taxeringsvärdet för föregående år står i mäklarens objektsbeskrivning och köpekontraktet. Du kan även logga in på Skatteverkets e-tjänst för fastighetsuppgifter.'
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
          a: 'Eftersom husbygget och tomten belånas tillsammans behöver du pantbrev för hela byggnadskreditivet och lånebeloppet. Nya pantbrev kostar 2,0% på lånebehovet utöver eventuella befintliga pantbrev.'
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
    if (typeof val === 'number') return val;
    return parseInt(String(val).replace(/\s+/g, '').replace(/[^0-9]/g, ''), 10) || 0;
  }

  function updateSliderFill(slider) {
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const val = parseFloat(slider.value) || 0;
    const percentage = Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
    slider.style.background = `linear-gradient(to right, #EA580C 0%, #EA580C ${percentage}%, #E8E8E8 ${percentage}%, #E8E8E8 100%)`;
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

  function toggleSheet(open) {
    if (open) {
      sheetOverlay.classList.add('is-visible');
      sheetPanel.classList.add('is-visible');
      document.body.style.overflow = 'hidden';
    } else {
      sheetOverlay.classList.remove('is-visible');
      sheetPanel.classList.remove('is-visible');
      document.body.style.overflow = '';
    }
  }

  btnOpenSheet.addEventListener('click', () => toggleSheet(true));
  btnCloseSheet.addEventListener('click', () => toggleSheet(false));
  sheetOverlay.addEventListener('click', () => toggleSheet(false));

  function calculate() {
    if (currentScenario === 'bostadsratt') {
      barHeroLabel.textContent = 'Totalt att betala';
      barHeroSum.textContent = '0 kr';
      btnOpenSheet.style.display = 'none';
      return;
    }

    btnOpenSheet.style.display = 'flex';

    const price = parseFormattedNumber(priceInput.value);
    const taxVal = noTaxCheck.checked ? 0 : parseFormattedNumber(taxInput.value);
    const loan = parseFormattedNumber(loanInput.value);
    const existingPant = parseFormattedNumber(existingPantInput.value);

    // Lagfart
    const effectiveBasis = Math.max(price, taxVal);
    const roundedLagfartBasis = Math.floor(effectiveBasis / 1000) * 1000;
    const lagfartTax = roundedLagfartBasis * LAGFART_PERCENT;
    const totLagfart = lagfartTax + LAGFART_FEE;

    if (noTaxCheck.checked) {
      barHeroLabel.textContent = 'Preliminär kostnad';
      sheetTotalLabel.textContent = 'Preliminär kostnad för lagfart & pantbrev';
      sheetLagfartDesc.textContent = `Eftersom taxeringsvärde saknas baseras lagfarten preliminärt på köpeskillingen (${fmt.format(price)} kr).`;
    } else if (taxVal > price) {
      barHeroLabel.textContent = 'Totalt att betala';
      sheetTotalLabel.textContent = 'Total kostnad för lagfart & pantbrev';
      sheetLagfartDesc.textContent = `Taxeringsvärdet på ${fmt.format(taxVal)} kr är högre än köpeskillingen på ${fmt.format(price)} kr. Därför används taxeringsvärdet som underlag.`;
    } else {
      barHeroLabel.textContent = 'Totalt att betala';
      sheetTotalLabel.textContent = 'Total kostnad för lagfart & pantbrev';
      sheetLagfartDesc.textContent = `Köpeskillingen på ${fmt.format(price)} kr är högre än taxeringsvärdet på ${fmt.format(taxVal)} kr. Därför används köpeskillingen som underlag.`;
    }

    // Pantbrev
    const neededPant = Math.max(0, loan - existingPant);
    const roundedPantBasis = Math.floor(neededPant / 1000) * 1000;
    const pantbrevTax = roundedPantBasis * PANTBREV_PERCENT;
    const totPantbrev = roundedPantBasis > 0 ? pantbrevTax + PANTBREV_FEE : 0;

    if (roundedPantBasis > 0) {
      if (existingPant > 0) {
        sheetPantDesc.textContent = `Du vill låna ${fmt.format(loan)} kr och fastigheten har redan pantbrev på ${fmt.format(existingPant)} kr. Du behöver därför nya pantbrev på ${fmt.format(neededPant)} kr.`;
      } else {
        sheetPantDesc.textContent = `Du vill låna ${fmt.format(loan)} kr och fastigheten saknar tidigare pantbrev. Du behöver pantbrev för hela beloppet.`;
      }
      sheetPantFormula.textContent = `${fmt.format(roundedPantBasis)} kr × 2,0 % + 375 kr = ${fmt.format(totPantbrev)} kr`;
    } else {
      sheetPantDesc.textContent = `Ditt lån på ${fmt.format(loan)} kr täcks helt av befintliga pantbrev på ${fmt.format(existingPant)} kr. Inga nya pantbrev behövs.`;
      sheetPantFormula.textContent = `0 kr i nya pantbrev = 0 kr`;
    }

    const grand = totLagfart + totPantbrev;

    barHeroSum.textContent = `${fmt.format(grand)} kr`;
    sheetTotalSum.textContent = `${fmt.format(grand)} kr`;
    sheetLagfartVal.textContent = `${fmt.format(totLagfart)} kr`;
    sheetPantbrevVal.textContent = `${fmt.format(totPantbrev)} kr`;
    sheetLagfartFormula.textContent = `${fmt.format(roundedLagfartBasis)} kr × 1,5 % + 825 kr = ${fmt.format(totLagfart)} kr`;

    priceSlider.value = Math.min(price, parseInt(priceSlider.max, 10));
    taxSlider.value = Math.min(taxVal, parseInt(taxSlider.max, 10));
    loanSlider.value = Math.min(loan, parseInt(loanSlider.max, 10));
    existingPantSlider.value = Math.min(existingPant, parseInt(existingPantSlider.max, 10));

    updateSliderFill(priceSlider);
    updateSliderFill(taxSlider);
    updateSliderFill(loanSlider);
    updateSliderFill(existingPantSlider);
  }

  function setupTwoWayBinding(slider, input) {
    slider.addEventListener('input', () => {
      input.value = fmt.format(slider.value);
      calculate();
    });

    input.addEventListener('focus', () => {
      const raw = parseFormattedNumber(input.value);
      input.value = raw > 0 ? raw : '';
      input.select();
    });

    input.addEventListener('blur', () => {
      let raw = parseFormattedNumber(input.value);
      input.value = fmt.format(raw);
      slider.value = Math.min(raw, parseInt(slider.max, 10));
      calculate();
    });

    input.addEventListener('input', () => {
      const raw = parseFormattedNumber(input.value);
      slider.value = Math.min(raw, parseInt(slider.max, 10));
      calculate();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') input.blur();
    });
  }

  setupTwoWayBinding(priceSlider, priceInput);
  setupTwoWayBinding(taxSlider, taxInput);
  setupTwoWayBinding(loanSlider, loanInput);
  setupTwoWayBinding(existingPantSlider, existingPantInput);

  taxInfoBtn.addEventListener('click', () => {
    taxHelpBox.style.display = taxHelpBox.style.display === 'none' ? 'block' : 'none';
  });

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
        scenarioText.textContent = 'Vid köp av bostadsrätt betalar du ingen stämpelskatt eller pantbrevskostnad till staten.';
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

  priceInput.value = fmt.format(4000000);
  taxInput.value = fmt.format(3000000);
  loanInput.value = fmt.format(3000000);
  existingPantInput.value = fmt.format(2000000);

  renderFAQ(currentScenario);
  calculate();
});