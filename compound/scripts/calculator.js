/**
 * COMPOUND — How Much Can You Make?
 * Single value with slider amount and clickable age targets
 */

(function() {
  'use strict';

  const CONFIG = {
    targetAge: 65,
    minAge: 16,
    maxAge: 64,
    minAmount: 10,
    maxAmount: 2000,
    amountStep: 5,
    animationDuration: 400,
    returnRates: {
      low: 0.10,
      normal: 0.12,
      high: 0.14
    }
  };

  const state = {
    age: 25,
    weeklyAmount: 25,
    scenario: 'normal',
    selectedTimeframe: 'long',
    timeframes: { short: 30, medium: 45, long: 65 }
  };

  const elements = {
    pageSetup: document.getElementById('page-setup'),
    pageResults: document.getElementById('page-results'),
    pageForm: document.getElementById('page-form'),
    pageComparison: document.getElementById('page-comparison'),
    ageInput: document.getElementById('age-input'),
    amountInput: document.getElementById('amount-input'),
    btnGo: document.getElementById('btn-go'),
    btnBack: document.getElementById('btn-back'),
    btnShowHow: document.getElementById('btn-show-how'),
    btnBackForm: document.getElementById('btn-back-form'),
    displayAge: document.getElementById('display-age'),
    displayAmount: document.getElementById('display-amount'),
    amountSlider: document.getElementById('amount-slider'),
    valueMain: document.getElementById('value-main'),
    ageShort: document.getElementById('age-short'),
    ageMedium: document.getElementById('age-medium'),
    ageLong: document.getElementById('age-long'),
    timeframeButtons: document.querySelectorAll('.timeframe-btn'),
    scenarioButtons: document.querySelectorAll('.scenario-btn'),
    totalContributed: document.getElementById('total-contributed'),
    totalFinal: document.getElementById('total-final'),
    // Comparison page elements
    userFirstName: document.getElementById('user-first-name'),
    goalAmount: document.getElementById('goal-amount'),
    hardReturn: document.getElementById('hard-return')
  };

  // ==========================================================================
  // Calculation (Weekly Compounding)
  // ==========================================================================
  function calculateProjection(weeklyAmount, years, scenario = 'normal') {
    const annualReturn = CONFIG.returnRates[scenario];
    const weeklyReturn = Math.pow(1 + annualReturn, 1/52) - 1;
    const totalWeeks = years * 52;
    const fv = weeklyAmount * ((Math.pow(1 + weeklyReturn, totalWeeks) - 1) / weeklyReturn);
    return Math.round(fv);
  }

  // ==========================================================================
  // Dynamic Timeframes - Calculate target ages based on user's age
  // ==========================================================================
  function calculateTimeframes(age) {
    const yearsUntil65 = CONFIG.targetAge - age;

    // Short: user's age + ~25% of time to 65, rounded to nice number
    const shortYears = Math.max(3, Math.round(yearsUntil65 * 0.25));
    const shortAge = age + shortYears;

    // Medium: user's age + ~55% of time to 65
    const mediumYears = Math.round(yearsUntil65 * 0.55);
    const mediumAge = age + mediumYears;

    // Long: always 65
    const longAge = CONFIG.targetAge;

    return { short: shortAge, medium: mediumAge, long: longAge };
  }

  // ==========================================================================
  // Formatting
  // ==========================================================================
  function formatNumber(num) {
    return num.toLocaleString('en-US');
  }

  function formatCurrency(num) {
    return '$' + formatNumber(num);
  }

  // ==========================================================================
  // Animation
  // ==========================================================================
  function animateValue(element, endValue, duration = CONFIG.animationDuration) {
    const startValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
    if (startValue === endValue) return;

    const startTime = performance.now();
    element.classList.add('updating');

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (endValue - startValue) * eased);
      element.textContent = formatNumber(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.classList.remove('updating');
      }
    }

    requestAnimationFrame(update);
  }

  // ==========================================================================
  // UI Updates
  // ==========================================================================
  function updateProjection() {
    const targetAge = state.timeframes[state.selectedTimeframe];
    const years = targetAge - state.age;
    const value = calculateProjection(state.weeklyAmount, years, state.scenario);

    animateValue(elements.valueMain, value);

    // Update footer insight
    const totalContributed = state.weeklyAmount * 52 * years;
    elements.totalContributed.textContent = formatCurrency(totalContributed);
    elements.totalFinal.textContent = formatCurrency(value);
  }

  function updateTimeframeDisplay() {
    elements.ageShort.textContent = state.timeframes.short;
    elements.ageMedium.textContent = state.timeframes.medium;
    elements.ageLong.textContent = state.timeframes.long;
  }

  function updateAmountDisplay() {
    elements.displayAmount.textContent = formatNumber(state.weeklyAmount);
  }

  function setTimeframe(timeframe) {
    state.selectedTimeframe = timeframe;

    elements.timeframeButtons.forEach(btn => {
      const isActive = btn.dataset.timeframe === timeframe;
      btn.classList.toggle('timeframe-btn--active', isActive);
    });

    updateProjection();
  }

  function setScenario(scenario) {
    state.scenario = scenario;

    elements.scenarioButtons.forEach(btn => {
      const isActive = btn.dataset.scenario === scenario;
      btn.classList.toggle('scenario-btn--active', isActive);
    });

    updateProjection();
  }

  function setAmount(amount) {
    state.weeklyAmount = Math.max(CONFIG.minAmount, Math.min(CONFIG.maxAmount, amount));
    elements.amountSlider.value = state.weeklyAmount;
    updateAmountDisplay();
    updateProjection();
  }

  // ==========================================================================
  // Page Navigation
  // ==========================================================================
  function showResults() {
    // Validate inputs - require user to enter values
    let age = parseInt(elements.ageInput.value, 10);
    let amount = parseInt(elements.amountInput.value, 10);

    // Check if inputs are empty or invalid
    if (isNaN(age) || elements.ageInput.value === '') {
      elements.ageInput.focus();
      elements.ageInput.classList.add('input-error');
      setTimeout(() => elements.ageInput.classList.remove('input-error'), 500);
      return;
    }

    if (isNaN(amount) || elements.amountInput.value === '') {
      elements.amountInput.focus();
      elements.amountInput.classList.add('input-error');
      setTimeout(() => elements.amountInput.classList.remove('input-error'), 500);
      return;
    }

    // Check minimum amount
    const errorText = document.getElementById('amount-error');
    if (amount < CONFIG.minAmount) {
      elements.amountInput.focus();
      elements.amountInput.classList.add('input-error');
      errorText.classList.add('visible');
      setTimeout(() => {
        elements.amountInput.classList.remove('input-error');
        errorText.classList.remove('visible');
      }, 2000);
      return;
    }
    errorText.classList.remove('visible');

    // Clamp to valid ranges
    if (age < CONFIG.minAge) age = CONFIG.minAge;
    if (age > CONFIG.maxAge) age = CONFIG.maxAge;
    if (amount < CONFIG.minAmount) amount = CONFIG.minAmount;
    if (amount > CONFIG.maxAmount) amount = CONFIG.maxAmount;

    state.age = age;
    state.weeklyAmount = amount;
    state.timeframes = calculateTimeframes(age);
    state.selectedTimeframe = 'long'; // Default to max (age 65)

    // Update header display
    elements.displayAge.textContent = age;
    updateAmountDisplay();

    // Configure amount slider
    elements.amountSlider.value = amount;

    // Update timeframe buttons with calculated ages
    updateTimeframeDisplay();

    // Reset timeframe selection to long
    elements.timeframeButtons.forEach(btn => {
      btn.classList.toggle('timeframe-btn--active', btn.dataset.timeframe === 'long');
    });

    // Show results page
    elements.pageSetup.classList.add('hidden');
    elements.pageResults.classList.add('active');

    // Calculate with slight delay for animation
    setTimeout(updateProjection, 300);
  }

  function showSetup() {
    elements.pageResults.classList.remove('active');
    elements.pageSetup.classList.remove('hidden');
    elements.ageInput.focus();
  }

  // Multi-step form state
  let currentFormStep = 1;

  function showForm() {
    elements.pageResults.classList.remove('active');
    elements.pageForm.classList.add('active');
    currentFormStep = 1;
    updateFormStep(1);
    setTimeout(() => document.getElementById('first-name').focus(), 300);
  }

  function hideForm() {
    elements.pageForm.classList.remove('active');
    elements.pageResults.classList.add('active');
    // Reset form steps
    currentFormStep = 1;
    updateFormStep(1);
  }

  function updateFormStep(step) {
    // Update step indicator
    document.getElementById('current-step').textContent = step;

    // Update dots
    document.querySelectorAll('.step-dot').forEach((dot, index) => {
      dot.classList.remove('step-dot--active', 'step-dot--completed');
      if (index + 1 === step) {
        dot.classList.add('step-dot--active');
      } else if (index + 1 < step) {
        dot.classList.add('step-dot--completed');
      }
    });

    // Show/hide steps
    document.querySelectorAll('.form-step').forEach((stepEl, index) => {
      stepEl.classList.remove('form-step--active');
      if (index + 1 === step) {
        stepEl.classList.add('form-step--active');
      }
    });
  }

  function goToStep(step) {
    currentFormStep = step;
    updateFormStep(step);

    // Focus the input in the new step
    const stepEl = document.getElementById(`step-${step}`);
    const input = stepEl.querySelector('input');
    if (input) {
      setTimeout(() => input.focus(), 300);
    }
  }

  function validateAndNextStep(currentStep) {
    let input, value;

    if (currentStep === 1) {
      input = document.getElementById('first-name');
      value = input.value.trim();
      if (!value) {
        input.classList.add('input-error');
        setTimeout(() => input.classList.remove('input-error'), 500);
        input.focus();
        return;
      }
      goToStep(2);
    } else if (currentStep === 2) {
      input = document.getElementById('last-name');
      value = input.value.trim();
      if (!value) {
        input.classList.add('input-error');
        setTimeout(() => input.classList.remove('input-error'), 500);
        input.focus();
        return;
      }
      goToStep(3);
    } else if (currentStep === 3) {
      input = document.getElementById('phone');
      value = input.value.trim();
      if (!value) {
        input.classList.add('input-error');
        setTimeout(() => input.classList.remove('input-error'), 500);
        input.focus();
        return;
      }
      // All steps complete - store data and show comparison
      const firstName = document.getElementById('first-name').value.trim();
      const lastName = document.getElementById('last-name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      state.userData = { firstName, lastName, phone };
      showComparison(firstName);
    }
  }

  function showComparison(firstName) {
    // Always calculate for age 65 (retirement)
    const targetAge = CONFIG.targetAge;
    const years = targetAge - state.age;
    const value = calculateProjection(state.weeklyAmount, years, state.scenario);
    const returnRate = Math.round(CONFIG.returnRates[state.scenario] * 100);

    // Update comparison page with personalized data
    const userFirstNameEl = document.getElementById('user-first-name');
    const goalAmountEl = document.getElementById('goal-amount');
    const hardReturnEl = document.getElementById('hard-return');

    if (userFirstNameEl) userFirstNameEl.textContent = firstName;
    if (goalAmountEl) goalAmountEl.textContent = formatCurrency(value);
    if (hardReturnEl) hardReturnEl.textContent = returnRate + '%';

    // Show comparison page
    elements.pageForm.classList.remove('active');
    elements.pageComparison.classList.add('active');

    // Start the social proof count-up animation
    setTimeout(() => animateSocialCount(), 500);
  }

  function animateSocialCount() {
    const countEl = document.getElementById('social-count');
    if (!countEl) return;

    const targetCount = 47000;
    const duration = 2500; // 2.5 seconds
    const startTime = performance.now();
    const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

    function updateCount(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentCount = Math.round(easedProgress * targetCount);

      countEl.textContent = formatNumber(currentCount) + '+';

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    }

    requestAnimationFrame(updateCount);
  }

  // ==========================================================================
  // Event Listeners
  // ==========================================================================
  function setupEventListeners() {
    // Go button
    elements.btnGo.addEventListener('click', showResults);

    // Enter key on inputs
    elements.ageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') elements.amountInput.focus();
    });
    elements.amountInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') showResults();
    });

    // Dynamic resize for amount input
    function resizeAmountInput() {
      const value = elements.amountInput.value || elements.amountInput.placeholder;
      const charCount = value.length;
      // Base width + extra per character beyond 2
      const baseWidth = 5.5; // rem
      const extraWidth = Math.max(0, charCount - 2) * 0.9; // rem per extra char
      elements.amountInput.style.width = (baseWidth + extraWidth) + 'rem';
    }

    elements.amountInput.addEventListener('input', resizeAmountInput);
    resizeAmountInput(); // Initial size

    // Back button
    elements.btnBack.addEventListener('click', showSetup);

    // Amount slider
    elements.amountSlider.addEventListener('input', (e) => {
      setAmount(parseInt(e.target.value, 10));
    });

    // Timeframe buttons
    elements.timeframeButtons.forEach(btn => {
      btn.addEventListener('click', () => setTimeframe(btn.dataset.timeframe));
    });

    // Scenario buttons
    elements.scenarioButtons.forEach(btn => {
      btn.addEventListener('click', () => setScenario(btn.dataset.scenario));
    });

    // Show How CTA → Form
    elements.btnShowHow.addEventListener('click', showForm);

    // Back from form → Results
    elements.btnBackForm.addEventListener('click', hideForm);

    // Multi-step form buttons
    document.getElementById('btn-step-1').addEventListener('click', () => validateAndNextStep(1));
    document.getElementById('btn-step-2').addEventListener('click', () => validateAndNextStep(2));
    document.getElementById('btn-step-3').addEventListener('click', () => validateAndNextStep(3));

    // Enter key advances to next step
    document.getElementById('first-name').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); validateAndNextStep(1); }
    });
    document.getElementById('last-name').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); validateAndNextStep(2); }
    });
    document.getElementById('phone').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); validateAndNextStep(3); }
    });

    // Phone number auto-formatting
    document.getElementById('phone').addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
      if (value.length > 10) value = value.slice(0, 10);

      let formatted = '';
      if (value.length > 0) {
        formatted = '(' + value.slice(0, 3);
      }
      if (value.length >= 3) {
        formatted += ') ' + value.slice(3, 6);
      }
      if (value.length >= 6) {
        formatted += '-' + value.slice(6, 10);
      }

      e.target.value = formatted;
    });

    // Path option reveal toggles
    document.querySelectorAll('.path-option').forEach(option => {
      option.addEventListener('click', (e) => {
        // Don't collapse when clicking the CTA link
        if (e.target.closest('.path-option-cta')) return;
        option.classList.toggle('expanded');
      });
    });
  }

  // ==========================================================================
  // Wealth Visualization - Immersive Particle System
  // ==========================================================================
  function createWealthVisualization() {
    const canvas = document.getElementById('wealth-canvas');
    if (!canvas) return;

    // Create floating bokeh orbs
    const orbCount = 12;
    const orbTypes = ['--primary', '--secondary', '--gold', '--primary', '--primary', '--secondary'];

    for (let i = 0; i < orbCount; i++) {
      const orb = document.createElement('div');
      const type = orbTypes[Math.floor(Math.random() * orbTypes.length)];
      orb.className = `wealth-orb wealth-orb${type}`;

      const size = 60 + Math.random() * 140;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const duration = 15 + Math.random() * 20;
      const delay = Math.random() * -20;
      const driftX = 20 + Math.random() * 60;
      const driftY = 30 + Math.random() * 80;
      const opacity = 0.3 + Math.random() * 0.4;

      orb.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        top: ${top}%;
        --drift-duration: ${duration}s;
        --drift-delay: ${delay}s;
        --drift-x: ${driftX}px;
        --drift-y: ${driftY}px;
        --orb-opacity: ${opacity};
      `;

      canvas.appendChild(orb);
    }

  }

  // ==========================================================================
  // Typewriter Effect
  // ==========================================================================
  function typewriterEffect() {
    const textElement = document.getElementById('typewriter-text');
    const cursorElement = document.querySelector('.typewriter-cursor');
    const questionElement = document.getElementById('main-question');
    const inputsElement = document.getElementById('setup-inputs');
    const footerElement = document.getElementById('footer-setup');

    const fullText = "How rich could you be?";
    const highlightWord = 'rich';
    let currentIndex = 0;

    function typeNextChar() {
      if (currentIndex < fullText.length) {
        // Check if we need to apply highlight to "money"
        const moneyStart = fullText.indexOf(highlightWord);
        const moneyEnd = moneyStart + highlightWord.length;

        let displayHTML = '';
        for (let i = 0; i <= currentIndex; i++) {
          if (i === moneyStart) {
            displayHTML += '<span class="highlight">';
          }
          displayHTML += fullText[i];
          if (i === moneyEnd - 1) {
            displayHTML += '</span>';
          }
        }

        textElement.innerHTML = displayHTML;
        currentIndex++;

        // Variable typing speed for natural feel
        const baseSpeed = 45;
        const variance = Math.random() * 25;
        const pauseChars = [',', '?', ' '];
        const nextChar = fullText[currentIndex];
        const delay = pauseChars.includes(nextChar) ? baseSpeed + 60 + variance : baseSpeed + variance;

        setTimeout(typeNextChar, delay);
      } else {
        // Typing complete - trigger transition
        setTimeout(() => {
          cursorElement.classList.add('hidden');
          questionElement.classList.add('compact');

          // Show inputs
          setTimeout(() => {
            inputsElement.classList.add('visible');

            // Show button and footer
            setTimeout(() => {
              elements.btnGo.classList.add('visible');
              footerElement.classList.add('visible');
              setTimeout(() => elements.ageInput.focus(), 300);
            }, 400);
          }, 300);
        }, 500);
      }
    }

    // Start typing after a brief pause
    setTimeout(typeNextChar, 600);
  }

  // ==========================================================================
  // Init
  // ==========================================================================
  function init() {
    // Leave inputs empty - user must enter their own values
    elements.ageInput.value = '';
    elements.amountInput.value = '';
    setupEventListeners();
    createWealthVisualization();
    typewriterEffect();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
