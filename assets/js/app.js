/**
 * Lagfartskalkylatorn - Reaktiv Beräkningsmotor med Clipboard, URL Params & 10 SEO/GEO FAQ
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

  const btnCopyCalc = document.getElementById('btn-copy-calc');
  const copyBtnText = document.getElementById('copy-btn-text');

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
        },
        {
          q: 'Vem betalar stämpelskatten till Lantmäteriet?',
          a: 'Det är alltid köparen av fastigheten som är skyldig att betala stämpelskatt för både lagfart och nya pantbrev enligt svensk lag (1984:404).'
        },
        {
          q: 'Vad händer om taxeringsvärdet är högre än köpeskillingen?',
          a: 'Enligt fastighetstaxeringslagen och stämpelskattelagen används det belopp som är högst av köpeskillingen och föregående års taxeringsvärde som beräkningsunderlag.'
        },
        {
          q: 'Kan man återanvända gamla pantbrev?',
          a: 'Ja! Om säljaren har befintliga pantbrev i fastigheten som inte är belånade upp till maxbeloppet kan dessa återanvändas, vilket sparar dig 2,0% i stämpelskatt på det täckta beloppet.'
        },
        {
          q: 'Hur lång tid tar det att få lagfarten beviljad?',
          a: 'Inskrivningsmyndigheten (Lantmäteriet) handlägger ansökningar om lagfart. Handläggningstiderna varierar beroende på arbetsbelastning, men brukar ta mellan ett par veckor upp till några månader.'
        },
        {
          q: 'Måste jag betala pantbrev om jag köper kontant?',
          a: 'Nej. Om du köper fastigheten helt utan bolån behöver du varken ta ut nya pantbrev eller betala pantbrevsskatt (2,0%). Du betalar endast stämpelskatt för lagfarten (1,5%).'
        },
        {
          q: 'Vad är skillnaden mellan lagfart och pantbrev?',
          a: 'Lagfart är beviset på att du äger fastigheten. Pantbrev är ett skriftligt bevis (inteckning) på att banken har säkerhet i fastigheten för ett lån.'
        },
        {
          q: 'Tillkommer det några andra avgifter till Lantmäteriet?',
          a: 'Ja, utöver stämpelskatten tillkommer en fast expeditionsavgift på 825 kr för lagfart samt 375 kr per utfärdat pantbrev.'
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
        },
        {
          q: 'Hur fungerar byggnadskreditiv och pantbrev?',
          a: 'Banken betalar ut pengar i takt med att huset byggs via ett byggnadskreditiv. Pantbreven måste finnas på plats innan banken kan betala ut lånet till entreprenören.'
        },
        {
          q: 'Ingår stämpelskatt i totalpriset från husleverantören?',
          a: 'Oftast inte. Husleverantörernas kalkylblad exkluderar i regel lagfart och pantbrev eftersom dessa avgifter betalas direkt till staten via Lantmäteriet.'
        },
        {
          q: 'När betalas stämpelskatten vid nybygge?',
          a: 'Lagfarten för tomten söks och betalas strax efter att du har tillträtt tomten. Pantbreven tas ut i etapper i takt med att byggkreditivet utökas.'
        },
        {
          q: 'Kan man stycka av mark utan att betala ny lagfart?',
          a: 'Nej, avstyckning och nybildning av fastigheter medför att en ny fastighet skapas, vilket kräver egen lagfart.'
        },
        {
          q: 'Hur undviker man dubbla kostnader vid nyköp?',
          a: 'Genom att köpa en fastighet där tomten säljs separat från entreprenaden är det endast tomtpriset som utgör underlag för lagfartsskatt.'
        },
        {
          q: 'Vilken lag styr avgifter vid nybyggnation?',
          a: 'Stämpelskatten regleras av Lag (1984:404) om stämpelskatt vid inskrivningsmyndigheter.'
        },
        {
          q: 'Vem skickar in ansökan om lagfart för nybygge?',
          a: 'Köparen (eller banken/mäklaren på uppdrag av köparen) skickar in ansökan till Lantmäteriet så fort fastighetsaffären är genomförd.'
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
        },
        {
          q: 'Vem betalar överlåtelseavgiften?',
          a: 'Enligt bostadsrättslagen får föreningens stadgar ange om överlåtelseavgiften (maximalt 2,5 % av prisbasbeloppet) betalas av säljare eller köpare. Vanligtvis betalas den av köparen.'
        },
        {
          q: 'Vad kostar en pantsättningsavgift?',
          a: 'Pantsättningsavgiften uppgår till maximalt 1 % av prisbasbeloppet per pantnotering och tas ut av föreningen för att registrera bankens pant.'
        },
        {
          q: 'Behöver man mäklare vid bostadsrättsköp?',
          a: 'Det är frivilligt, men vanligast är att affären förmedlas av en fastighetsmäklare. Samma regler för handpenning och kontrakt gäller som vid fastighetsköp.'
        },
        {
          q: 'Gäller köplagen eller jordabalken för bostadsrätt?',
          a: 'Köp av bostadsrätt regleras av köplagen (och bostadsrättslagen), till skillnad från fastigheter (villor) som styrs av jordabalken.'
        },
        {
          q: 'Kan föreningen neka ett medlemskap vid köp?',
          a: 'Ja, bostadsrättsföreningen måste godkänna köparen som medlem i föreningen innan överlåtelsen kan gå igenom.'
        },
        {
          q: 'Finns det dolda kostnader vid bostadsrättsköp?',
          a: 'Utöver köpeskillingen tillkommer eventuella avgifter till föreningen, pantbrev existerar som sagt inte men avgifter för bolån tas ut av banken.'
        },
        {
          q: 'Hur påverkar prisbasbeloppet avgifterna 2026?',
          a: 'Prisbasbeloppet styr taket för föreningens maximala överlåtelse- och pantsättningsavgifter, vilka justeras årligen.'
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
      summary.innerHTML = `${item.q} <span aria-hidden="true">+</span>`;

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
      sheetPanel.setAttribute('aria-hidden', 'false');
      btnOpenSheet.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      sheetOverlay.classList.remove('is-visible');
      sheetPanel.classList.remove('is-visible');
      sheetPanel.setAttribute('aria-hidden', 'true');
      btnOpenSheet.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  btnOpenSheet.addEventListener('click', () => toggleSheet(true));
  btnCloseSheet.addEventListener('click', () => toggleSheet(false));
  sheetOverlay.addEventListener('click', () => toggleSheet(false));

  function syncURLParams() {
    const params = new URLSearchParams();
    params.set('typ', currentScenario);
    
    if (currentScenario !== 'bostadsratt') {
      params.set('pris', parseFormattedNumber(priceInput.value));
      if (noTaxCheck.checked) {
        params.set('saknar_tax', '1');
      } else {
        params.set('tax', parseFormattedNumber(taxInput.value));
      }
      params.set('lan', parseFormattedNumber(loanInput.value));
      if (currentScenario === 'villa') {
        params.set('pant', parseFormattedNumber(existingPantInput.value));
      }
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }

  function calculate() {
    if (currentScenario === 'bostadsratt') {
      barHeroLabel.textContent = 'Totalt att betala';
      barHeroSum.textContent = '0 kr';
      btnOpenSheet.style.display = 'none';
      syncURLParams();
      return;
    }

    btnOpenSheet.style.display = 'flex';

    const price = parseFormattedNumber(priceInput.value);
    const taxVal = noTaxCheck.checked ? 0 : parseFormattedNumber(taxInput.value);
    const loan = parseFormattedNumber(loanInput.value);
    const existingPant = parseFormattedNumber(existingPantInput.value);

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

    syncURLParams();
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
    const isHidden = taxHelpBox.style.display === 'none';
    taxHelpBox.style.display = isHidden ? 'block' : 'none';
    taxInfoBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
  });

  noTaxCheck.addEventListener('change', () => {
    if (noTaxCheck.checked) {
      taxInputContainer.style.display = 'none';
      noTaxNotice.style.display = 'block';
      taxHelpBox.style.display = 'none';
      taxInfoBtn.setAttribute('aria-expanded', 'false');
    } else {
      taxInputContainer.style.display = 'block';
      noTaxNotice.style.display = 'none';
    }
    calculate();
  });

  function setScenario(scenario) {
    categoryCards.forEach(c => {
      c.classList.remove('is-active');
      c.setAttribute('aria-selected', 'false');
    });

    const activeCard = document.querySelector(`[data-scenario="${scenario}"]`);
    if (activeCard) {
      activeCard.classList.add('is-active');
      activeCard.setAttribute('aria-selected', 'true');
    }

    currentScenario = scenario;
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
  }

  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      setScenario(card.dataset.scenario);
    });
  });

  btnCopyCalc.addEventListener('click', () => {
    const price = parseFormattedNumber(priceInput.value);
    const taxVal = noTaxCheck.checked ? 0 : parseFormattedNumber(taxInput.value);
    const loan = parseFormattedNumber(loanInput.value);
    const existingPant = parseFormattedNumber(existingPantInput.value);

    const summaryText = `Uträkning från Lagfartskalkylatorn.se:
----------------------------------
${currentScenario === 'nybygge' ? 'Tomtpris' : 'Köpeskilling'}: ${fmt.format(price)} kr
${noTaxCheck.checked ? 'Taxeringsvärde: Saknas (preliminär beräkning)' : `Taxeringsvärde: ${fmt.format(taxVal)} kr`}
Bolån: ${fmt.format(loan)} kr
Befintliga pantbrev: ${fmt.format(existingPant)} kr

RESULTAT:
- Lagfart: ${sheetLagfartVal.textContent}
- Nya pantbrev: ${sheetPantbrevVal.textContent}
----------------------------------
TOTALT: ${sheetTotalSum.textContent}

Länk till uträkningen: ${window.location.href}`;

    navigator.clipboard.writeText(summaryText).then(() => {
      btnCopyCalc.classList.add('is-copied');
      copyBtnText.textContent = 'Kopierad!';
      setTimeout(() => {
        btnCopyCalc.classList.remove('is-copied');
        copyBtnText.textContent = 'Kopiera uträkning';
      }, 2000);
    }).catch(() => {
      copyBtnText.textContent = 'Kunde inte kopiera';
    });
  });

  function initFromURL() {
    const params = new URLSearchParams(window.location.search);
    const urlScenario = params.get('typ');
    const urlPris = params.get('pris');
    const urlTax = params.get('tax');
    const urlSaknarTax = params.get('saknar_tax');
    const urlLan = params.get('lan');
    const urlPant = params.get('pant');

    priceInput.value = fmt.format(urlPris ? parseFormattedNumber(urlPris) : 4000000);
    taxInput.value = fmt.format(urlTax ? parseFormattedNumber(urlTax) : 3000000);
    loanInput.value = fmt.format(urlLan ? parseFormattedNumber(urlLan) : 3000000);
    existingPantInput.value = fmt.format(urlPant ? parseFormattedNumber(urlPant) : 2000000);

    if (urlSaknarTax === '1') {
      noTaxCheck.checked = true;
      taxInputContainer.style.display = 'none';
      noTaxNotice.style.display = 'block';
    }

    if (urlScenario && ['villa', 'nybygge', 'bostadsratt'].includes(urlScenario)) {
      setScenario(urlScenario);
    } else {
      setScenario('villa');
    }
  }

  initFromURL();
});

/* --- Formspree Feedback Hantering --- */
document.addEventListener('DOMContentLoaded', () => {
  const voteBtns = document.querySelectorAll('.feedback-vote-btn');
  const inputContainer = document.getElementById('feedback-input-container');
  const voteInput = document.getElementById('feedback-vote-input');
  const feedbackForm = document.getElementById('feedback-form');
  const successMsg = document.getElementById('feedback-success-msg');

  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mbgrergp';

  voteBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      voteBtns.forEach(b => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      const voteValue = btn.getAttribute('data-vote');
      voteInput.value = voteValue;
      inputContainer.style.display = 'block';
    });
  });

  if (feedbackForm) {
    feedbackForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(feedbackForm);

      try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          feedbackForm.querySelector('.feedback-btns-row').style.display = 'none';
          inputContainer.style.display = 'none';
          successMsg.style.display = 'block';
        } else {
          alert('Något gick fel vid skickandet. Försök igen senare.');
        }
      } catch (err) {
        console.error('Formspree error:', err);
        alert('Kunde inte nå servern. Kontrollera din anslutning.');
      }
    });
  }
});