/**
 * BENSON WEALTH ORACLE
 * Celestial Fortune Calculator
 * With particle effects and smooth animations
 */

(function() {
  'use strict';

  // ============================================================
  // Configuration
  // ============================================================
  const CONFIG = {
    targetAge: 65,
    minAge: 16,
    maxAge: 64,
    minAmount: 10,
    maxAmount: 2000,
    amountStep: 5,
    animationDuration: 600,
    returnRates: {
      low: 0.10,
      normal: 0.12,
      high: 0.14
    },
    scenarioLabels: {
      low: 'Conservative Growth',
      normal: 'Balanced Growth',
      high: 'Aggressive Growth'
    },
    particles: {
      count: 12,
      colors: ['gold', 'mint', 'coral']
    }
  };

  const state = {
    age: 25,
    weeklyAmount: 50,
    scenario: 'normal',
    selectedTimeframe: 'long',
    timeframes: { short: 30, medium: 45, long: 65 }
  };

  const elements = {};

  // ============================================================
  // Initialize DOM Elements
  // ============================================================
  function initElements() {
    elements.pageSetup = document.getElementById('page-setup');
    elements.pageResults = document.getElementById('page-results');
    elements.pageForm = document.getElementById('page-form');
    elements.pageComparison = document.getElementById('page-comparison');
    elements.ageInput = document.getElementById('age-input');
    elements.amountInput = document.getElementById('amount-input');
    elements.btnGo = document.getElementById('btn-go');
    elements.btnBack = document.getElementById('btn-back');
    elements.btnShowHow = document.getElementById('btn-show-how');
    elements.btnBackForm = document.getElementById('btn-back-form');
    elements.displayAmount = document.getElementById('display-amount');
    elements.amountSlider = document.getElementById('amount-slider');
    elements.sliderTrack = document.getElementById('slider-track');
    elements.sliderGlow = document.getElementById('slider-glow');
    elements.valueMain = document.getElementById('value-main');
    elements.ageShort = document.getElementById('age-short');
    elements.ageMedium = document.getElementById('age-medium');
    elements.ageLong = document.getElementById('age-long');
    elements.targetAgeDisplay = document.getElementById('target-age-display');
    elements.timeframeButtons = document.querySelectorAll('.timeframe-btn');
    elements.riskButtons = document.querySelectorAll('.risk-btn');
    elements.calcTrigger = document.getElementById('calc-trigger');
    elements.calcExplainer = document.querySelector('.calc-explainer');
    elements.calcWeekly = document.getElementById('calc-weekly');
    elements.calcAge = document.getElementById('calc-age');
    elements.calcTargetAge = document.getElementById('calc-target-age');
    elements.growthBadge = document.getElementById('growth-badge');
    elements.userFirstName = document.getElementById('user-first-name');
    elements.goalAmount = document.getElementById('goal-amount');
    elements.setupCard = document.getElementById('setup-card');
    elements.welcomeBadge = document.getElementById('welcome-badge');
    elements.amountHint = document.getElementById('amount-hint');
    elements.particlesContainer = document.getElementById('particles');
    elements.stepOrbs = document.querySelectorAll('.step-orb');

    // Wealth Journey elements
    elements.wealthJourney = document.getElementById('wealth-journey');
    elements.journeyGoalAmount = document.getElementById('journey-goal-amount');
    elements.startAgeDisplay = document.getElementById('start-age-display');
    elements.goalAgeDisplay = document.getElementById('goal-age-display');
    elements.milestoneButtons = document.querySelectorAll('.milestone-btn');
  }

  // ============================================================
  // Floating Particles System
  // ============================================================
  function createParticles() {
    const container = elements.particlesContainer;
    if (!container) return;

    for (let i = 0; i < CONFIG.particles.count; i++) {
      const particle = document.createElement('div');
      const colorType = CONFIG.particles.colors[Math.floor(Math.random() * CONFIG.particles.colors.length)];
      particle.className = `particle particle--${colorType}`;

      const size = 8 + Math.random() * 20;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const duration = 15 + Math.random() * 20;
      const delay = Math.random() * -20;
      const driftX = 20 + Math.random() * 40;
      const driftY = 30 + Math.random() * 50;
      const opacity = 0.3 + Math.random() * 0.4;

      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        top: ${top}%;
        --duration: ${duration}s;
        --delay: ${delay}s;
        --drift-x: ${driftX}px;
        --drift-y: ${driftY}px;
        --opacity: ${opacity};
      `;

      container.appendChild(particle);
    }
  }

  // ============================================================
  // Value Particles (sparkles around the main number)
  // ============================================================
  function createValueParticle(container) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      background: radial-gradient(circle, rgba(45, 147, 108, 0.8) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      animation: value-particle 1s ease-out forwards;
    `;

    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 60;
    const endX = Math.cos(angle) * distance;
    const endY = Math.sin(angle) * distance;

    particle.style.setProperty('--end-x', `${endX}px`);
    particle.style.setProperty('--end-y', `${endY}px`);

    container.appendChild(particle);
    setTimeout(() => particle.remove(), 1000);
  }

  function burstValueParticles() {
    const container = document.getElementById('value-particles');
    if (!container) return;

    for (let i = 0; i < 8; i++) {
      setTimeout(() => createValueParticle(container), i * 50);
    }
  }

  // Add particle animation keyframes dynamically
  function addParticleStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes value-particle {
        0% {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
        100% {
          opacity: 0;
          transform: translate(calc(-50% + var(--end-x)), calc(-50% + var(--end-y))) scale(0);
        }
      }
    `;
    document.head.appendChild(style);
  }

  // ============================================================
  // Calculations
  // ============================================================
  function calculateProjection(weeklyAmount, years, scenario = 'normal') {
    const annualReturn = CONFIG.returnRates[scenario];
    const weeklyReturn = Math.pow(1 + annualReturn, 1/52) - 1;
    const totalWeeks = years * 52;
    const fv = weeklyAmount * ((Math.pow(1 + weeklyReturn, totalWeeks) - 1) / weeklyReturn);
    return Math.round(fv);
  }

  function calculateTimeframes(age) {
    const longAge = age >= 57 ? age + 8 : CONFIG.targetAge;
    const yearsToTarget = longAge - age;
    const shortYears = Math.max(3, Math.round(yearsToTarget * 0.25));
    const shortAge = age + shortYears;
    const mediumYears = Math.round(yearsToTarget * 0.55);
    const mediumAge = age + mediumYears;
    return { short: shortAge, medium: mediumAge, long: longAge };
  }

  // ============================================================
  // Formatting
  // ============================================================
  function formatNumber(num) {
    return num.toLocaleString('en-US');
  }

  function formatCurrency(num) {
    return '$' + formatNumber(num);
  }

  // ============================================================
  // Smooth Number Animation
  // ============================================================
  function animateValue(element, endValue, duration = CONFIG.animationDuration) {
    const startValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
    if (startValue === endValue) return;

    const startTime = performance.now();
    const diff = endValue - startValue;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth easing
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(startValue + diff * eased);
      element.textContent = formatNumber(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        burstValueParticles();
      }
    }

    requestAnimationFrame(update);
  }

  // ============================================================
  // UI Updates
  // ============================================================
  function updateProjection() {
    const targetAge = state.timeframes[state.selectedTimeframe];
    const years = targetAge - state.age;
    const value = calculateProjection(state.weeklyAmount, years, state.scenario);

    animateValue(elements.valueMain, value);

    if (elements.targetAgeDisplay) {
      elements.targetAgeDisplay.textContent = targetAge;
    }

    // Update explainer panel
    if (elements.calcWeekly) elements.calcWeekly.textContent = formatCurrency(state.weeklyAmount);
    if (elements.calcAge) elements.calcAge.textContent = state.age;
    if (elements.calcTargetAge) elements.calcTargetAge.textContent = targetAge;

    // Update growth badge
    if (elements.growthBadge) {
      const growthText = elements.growthBadge.querySelector('.growth-text');
      if (growthText) {
        growthText.textContent = CONFIG.scenarioLabels[state.scenario];
      }
    }

    // Update Wealth Journey visualization
    updateWealthJourney(value, targetAge, years);
  }

  // ============================================================
  // Wealth Journey Visualization
  // ============================================================
  function updateWealthJourney(goalValue, targetAge, years) {
    if (!elements.wealthJourney) return;

    // Update journey goal amount
    if (elements.journeyGoalAmount) {
      animateJourneyValue(elements.journeyGoalAmount, goalValue);
    }

    // Update start age display
    if (elements.startAgeDisplay) {
      elements.startAgeDisplay.textContent = state.age;
    }

    // Update goal age display
    if (elements.goalAgeDisplay) {
      elements.goalAgeDisplay.textContent = targetAge;
    }
  }

  function animateJourneyValue(element, endValue) {
    const startValue = parseInt(element.textContent.replace(/[$,]/g, '')) || 0;
    if (startValue === endValue) return;

    const duration = 600;
    const startTime = performance.now();
    const diff = endValue - startValue;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(startValue + diff * eased);
      element.textContent = formatCurrency(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  function triggerJourneyAnimation() {
    if (!elements.wealthJourney) return;

    // Reset and re-trigger animation
    elements.wealthJourney.classList.remove('animate');
    elements.wealthJourney.classList.add('animate-reset');

    // Force reflow
    void elements.wealthJourney.offsetWidth;

    // Re-apply animation
    elements.wealthJourney.classList.remove('animate-reset');
    elements.wealthJourney.classList.add('animate');
  }

  function updateTimeframeDisplay() {
    elements.ageShort.textContent = state.timeframes.short;
    elements.ageMedium.textContent = state.timeframes.medium;
    elements.ageLong.textContent = state.timeframes.long;
  }

  function updateAmountDisplay() {
    elements.displayAmount.textContent = formatNumber(state.weeklyAmount);
  }

  function updateSliderTrack() {
    const min = parseInt(elements.amountSlider.min);
    const max = parseInt(elements.amountSlider.max);
    const val = parseInt(elements.amountSlider.value);
    const percentage = ((val - min) / (max - min)) * 100;
    elements.sliderTrack.style.width = percentage + '%';
    if (elements.sliderGlow) {
      elements.sliderGlow.style.width = percentage + '%';
    }
  }

  function setTimeframe(timeframe) {
    state.selectedTimeframe = timeframe;

    // Update legacy timeframe buttons
    elements.timeframeButtons.forEach(btn => {
      const isActive = btn.dataset.timeframe === timeframe;
      btn.classList.toggle('timeframe-btn--active', isActive);
    });

    // Update milestone buttons
    elements.milestoneButtons.forEach(btn => {
      const isActive = btn.dataset.timeframe === timeframe;
      btn.classList.toggle('milestone-btn--active', isActive);
    });

    // Move the goal bubble to match the selected timeframe position
    moveGoalBubble(timeframe);

    updateProjection();
  }

  function moveGoalBubble(timeframe) {
    const goalBubble = document.getElementById('end-bubble');
    const endDot = document.getElementById('journey-end-dot');

    // Move the goal bubble
    if (goalBubble) {
      goalBubble.classList.remove('position-short', 'position-medium', 'position-long');
      goalBubble.classList.add(`position-${timeframe}`);
    }

    // Move the end dot on the SVG
    if (endDot) {
      endDot.classList.remove('position-short', 'position-medium', 'position-long');
      endDot.classList.add(`position-${timeframe}`);
    }
  }

  function setScenario(scenario) {
    state.scenario = scenario;

    elements.riskButtons.forEach(btn => {
      const isActive = btn.dataset.scenario === scenario;
      btn.classList.toggle('risk-btn--active', isActive);
    });

    updateProjection();
  }

  function setAmount(amount) {
    state.weeklyAmount = Math.max(CONFIG.minAmount, Math.min(CONFIG.maxAmount, amount));
    elements.amountSlider.value = state.weeklyAmount;
    updateAmountDisplay();
    updateSliderTrack();
    updateProjection();
  }

  // ============================================================
  // Page Navigation with Transitions
  // ============================================================
  function showResults() {
    let age = parseInt(elements.ageInput.value, 10);
    let amount = parseInt(elements.amountInput.value, 10);

    const ageField = elements.ageInput.closest('.input-field');
    const amountField = elements.amountInput.closest('.input-field');

    // Validate age
    if (isNaN(age) || elements.ageInput.value === '') {
      elements.ageInput.focus();
      ageField.classList.add('error');
      setTimeout(() => ageField.classList.remove('error'), 600);
      return;
    }

    // Validate amount
    if (isNaN(amount) || elements.amountInput.value === '') {
      elements.amountInput.focus();
      amountField.classList.add('error');
      setTimeout(() => amountField.classList.remove('error'), 600);
      return;
    }

    // Check minimum
    if (amount < CONFIG.minAmount) {
      elements.amountInput.focus();
      amountField.classList.add('error');
      elements.amountHint.classList.add('visible');
      setTimeout(() => {
        amountField.classList.remove('error');
        elements.amountHint.classList.remove('visible');
      }, 2500);
      return;
    }
    elements.amountHint.classList.remove('visible');

    // Clamp values
    if (age < CONFIG.minAge) age = CONFIG.minAge;
    if (age > CONFIG.maxAge) age = CONFIG.maxAge;
    if (amount < CONFIG.minAmount) amount = CONFIG.minAmount;
    if (amount > CONFIG.maxAmount) amount = CONFIG.maxAmount;

    state.age = age;
    state.weeklyAmount = amount;
    state.timeframes = calculateTimeframes(age);
    state.selectedTimeframe = 'long';

    // Update display
    updateAmountDisplay();
    elements.amountSlider.value = amount;
    updateSliderTrack();
    updateTimeframeDisplay();

    // Reset timeframe selection
    elements.timeframeButtons.forEach(btn => {
      btn.classList.toggle('timeframe-btn--active', btn.dataset.timeframe === 'long');
    });

    // Transition pages
    elements.pageSetup.classList.add('hidden');
    elements.pageResults.classList.add('active');

    // Trigger the journey animation after page transition starts
    setTimeout(() => {
      triggerJourneyAnimation();
      updateProjection();
    }, 400);
  }

  function showSetup() {
    elements.pageResults.classList.remove('active');
    setTimeout(() => {
      elements.pageSetup.classList.remove('hidden');
      elements.ageInput.focus();
    }, 100);
  }

  // ============================================================
  // Multi-step Form
  // ============================================================
  let currentFormStep = 1;

  function showForm() {
    elements.pageResults.classList.remove('active');
    setTimeout(() => {
      elements.pageForm.classList.add('active');
      currentFormStep = 1;
      updateFormStep(1);
      setTimeout(() => document.getElementById('first-name').focus(), 400);
    }, 100);
  }

  function hideForm() {
    elements.pageForm.classList.remove('active');
    setTimeout(() => {
      elements.pageResults.classList.add('active');
      currentFormStep = 1;
      updateFormStep(1);
    }, 100);
  }

  function updateFormStep(step) {
    document.getElementById('current-step').textContent = step;

    // Update step orbs
    elements.stepOrbs.forEach((orb, index) => {
      orb.classList.remove('step-orb--active', 'step-orb--completed');
      if (index + 1 === step) {
        orb.classList.add('step-orb--active');
      } else if (index + 1 < step) {
        orb.classList.add('step-orb--completed');
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

    const stepEl = document.getElementById(`step-${step}`);
    const input = stepEl.querySelector('input');
    if (input) {
      setTimeout(() => input.focus(), 400);
    }
  }

  function validateAndNextStep(currentStep) {
    let input, value;

    if (currentStep === 1) {
      input = document.getElementById('first-name');
      value = input.value.trim();
      if (!value) {
        input.classList.add('input-error');
        setTimeout(() => input.classList.remove('input-error'), 600);
        input.focus();
        return;
      }
      goToStep(2);
    } else if (currentStep === 2) {
      input = document.getElementById('last-name');
      value = input.value.trim();
      if (!value) {
        input.classList.add('input-error');
        setTimeout(() => input.classList.remove('input-error'), 600);
        input.focus();
        return;
      }
      goToStep(3);
    } else if (currentStep === 3) {
      input = document.getElementById('phone');
      value = input.value.trim();
      if (!value) {
        input.classList.add('input-error');
        setTimeout(() => input.classList.remove('input-error'), 600);
        input.focus();
        return;
      }
      const firstName = document.getElementById('first-name').value.trim();
      const lastName = document.getElementById('last-name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      state.userData = { firstName, lastName, phone };
      showComparison(firstName);
    }
  }

  function showComparison(firstName) {
    const targetAge = state.age >= 57 ? state.age + 8 : CONFIG.targetAge;
    const years = targetAge - state.age;
    const value = calculateProjection(state.weeklyAmount, years, state.scenario);

    const userFirstNameEl = document.getElementById('user-first-name');
    const goalAmountEl = document.getElementById('goal-amount');

    if (userFirstNameEl) userFirstNameEl.textContent = firstName;

    // Reset the goal amount for animation
    if (goalAmountEl) goalAmountEl.textContent = '0';

    elements.pageForm.classList.remove('active');
    setTimeout(() => {
      elements.pageComparison.classList.add('active');

      // Animate the final amount with dramatic counting
      setTimeout(() => {
        animateFinalAmount(goalAmountEl, value);
        burstAmountParticles();
      }, 800);
    }, 100);
  }

  // Animated counting for final amount with easing
  function animateFinalAmount(element, endValue) {
    if (!element) return;

    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Dramatic ease-out with overshoot
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(endValue * eased);
      element.textContent = formatNumber(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        // Final shimmer burst
        setTimeout(burstAmountParticles, 200);
      }
    }

    requestAnimationFrame(update);
  }

  // Create golden particles around the final amount
  function burstAmountParticles() {
    const container = document.getElementById('amount-particles');
    if (!container) return;

    const colors = ['#FFD700', '#2D936C', '#4ECDC4', '#FFCDB2'];

    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = 4 + Math.random() * 6;
      const angle = (i / 12) * Math.PI * 2;
      const distance = 60 + Math.random() * 40;
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance;

      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        box-shadow: 0 0 ${size}px ${color};
        animation: particle-burst 0.8s ease-out forwards;
        --end-x: ${endX}px;
        --end-y: ${endY}px;
      `;

      container.appendChild(particle);
      setTimeout(() => particle.remove(), 1000);
    }
  }

  // ============================================================
  // Event Listeners
  // ============================================================
  function setupEventListeners() {
    // Main button
    elements.btnGo.addEventListener('click', showResults);

    // Enter key navigation
    elements.ageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') elements.amountInput.focus();
    });
    elements.amountInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') showResults();
    });

    // Back button
    elements.btnBack.addEventListener('click', showSetup);

    // Amount slider with smooth updates
    elements.amountSlider.addEventListener('input', (e) => {
      setAmount(parseInt(e.target.value, 10));
    });

    // Timeframe buttons (legacy)
    elements.timeframeButtons.forEach(btn => {
      btn.addEventListener('click', () => setTimeframe(btn.dataset.timeframe));
    });

    // Milestone buttons (new integrated timeframe selectors)
    elements.milestoneButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const timeframe = btn.dataset.timeframe;
        setTimeframe(timeframe);
        // Update active state on milestone buttons
        elements.milestoneButtons.forEach(b => b.classList.remove('milestone-btn--active'));
        btn.classList.add('milestone-btn--active');
      });
    });

    // Calc explainer toggle
    if (elements.calcTrigger && elements.calcExplainer) {
      elements.calcTrigger.addEventListener('click', () => {
        elements.calcExplainer.classList.toggle('open');
      });
    }

    // Risk buttons
    elements.riskButtons.forEach(btn => {
      btn.addEventListener('click', () => setScenario(btn.dataset.scenario));
    });

    // Form navigation
    elements.btnShowHow.addEventListener('click', showForm);
    elements.btnBackForm.addEventListener('click', hideForm);

    // Form step buttons
    document.getElementById('btn-step-1').addEventListener('click', () => validateAndNextStep(1));
    document.getElementById('btn-step-2').addEventListener('click', () => validateAndNextStep(2));
    document.getElementById('btn-step-3').addEventListener('click', () => validateAndNextStep(3));

    // Enter key for form steps
    document.getElementById('first-name').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); validateAndNextStep(1); }
    });
    document.getElementById('last-name').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); validateAndNextStep(2); }
    });
    document.getElementById('phone').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); validateAndNextStep(3); }
    });

    // Phone formatting
    document.getElementById('phone').addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
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

    // Button hover particle effect
    elements.btnGo.addEventListener('mouseenter', createButtonParticles);
  }

  // ============================================================
  // Button Particle Effect
  // ============================================================
  function createButtonParticles() {
    const btnParticles = elements.btnGo.querySelector('.btn-particles');
    if (!btnParticles) return;

    for (let i = 0; i < 6; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        bottom: 0;
        animation: btn-particle-rise 0.8s ease-out forwards;
        animation-delay: ${i * 0.05}s;
      `;
      btnParticles.appendChild(particle);
      setTimeout(() => particle.remove(), 1000);
    }
  }

  // Add button particle animation
  function addButtonParticleStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes btn-particle-rise {
        0% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        100% {
          opacity: 0;
          transform: translateY(-30px) scale(0);
        }
      }
    `;
    document.head.appendChild(style);
  }

  // ============================================================
  // Typewriter Effect
  // ============================================================
  function typewriterEffect() {
    const textElement = document.getElementById('typewriter-text');
    const cursorElement = document.querySelector('.typewriter-cursor');
    const setupCard = document.getElementById('setup-card');

    const fullText = "What could your fortune be?";
    const highlightWord = 'fortune';
    let currentIndex = 0;

    function typeNextChar() {
      if (currentIndex < fullText.length) {
        const wordStart = fullText.indexOf(highlightWord);
        const wordEnd = wordStart + highlightWord.length;

        let displayHTML = '';
        for (let i = 0; i <= currentIndex; i++) {
          if (i === wordStart) {
            displayHTML += '<span class="highlight">';
          }
          displayHTML += fullText[i];
          if (i === wordEnd - 1) {
            displayHTML += '</span>';
          }
        }

        textElement.innerHTML = displayHTML;
        currentIndex++;

        const baseSpeed = 55;
        const variance = Math.random() * 35;
        const pauseChars = [' ', '?', ','];
        const nextChar = fullText[currentIndex];
        const delay = pauseChars.includes(nextChar) ? baseSpeed + 100 + variance : baseSpeed + variance;

        setTimeout(typeNextChar, delay);
      } else {
        // Typing complete
        setTimeout(() => {
          cursorElement.classList.add('hidden');

          // Show setup card with animation
          setTimeout(() => {
            setupCard.classList.add('visible');
            setTimeout(() => elements.ageInput.focus(), 500);
          }, 300);
        }, 500);
      }
    }

    setTimeout(typeNextChar, 800);
  }

  // ============================================================
  // Testimonial Carousel
  // ============================================================
  let testimonialIndex = 0;
  let testimonialInterval = null;

  function initTestimonialCarousel() {
    const carousel = document.getElementById('testimonial-carousel');
    const dots = document.getElementById('testimonial-dots');
    if (!carousel || !dots) return;

    const cards = carousel.querySelectorAll('.testimonial-card');
    const dotElements = dots.querySelectorAll('.dot');

    if (cards.length === 0) return;

    // Set first card as active
    cards[0].classList.add('active');

    // Auto-rotate every 4 seconds
    testimonialInterval = setInterval(() => {
      showTestimonial((testimonialIndex + 1) % cards.length);
    }, 4000);

    // Click handlers for dots
    dotElements.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showTestimonial(index);
        // Reset interval on manual navigation
        clearInterval(testimonialInterval);
        testimonialInterval = setInterval(() => {
          showTestimonial((testimonialIndex + 1) % cards.length);
        }, 4000);
      });
    });

    // Touch/swipe support
    let touchStartX = 0;
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Swipe left - next
          showTestimonial((testimonialIndex + 1) % cards.length);
        } else {
          // Swipe right - prev
          showTestimonial((testimonialIndex - 1 + cards.length) % cards.length);
        }
        // Reset interval on swipe
        clearInterval(testimonialInterval);
        testimonialInterval = setInterval(() => {
          showTestimonial((testimonialIndex + 1) % cards.length);
        }, 4000);
      }
    }, { passive: true });
  }

  function showTestimonial(index) {
    const carousel = document.getElementById('testimonial-carousel');
    const dots = document.getElementById('testimonial-dots');
    if (!carousel || !dots) return;

    const cards = carousel.querySelectorAll('.testimonial-card');
    const dotElements = dots.querySelectorAll('.dot');

    // Simply switch active class - CSS handles display and animation
    cards.forEach((card, i) => {
      card.classList.toggle('active', i === index);
    });

    // Update dots
    dotElements.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    testimonialIndex = index;
  }

  // ============================================================
  // Initialization
  // ============================================================
  function init() {
    initElements();

    // Clear inputs
    elements.ageInput.value = '';
    elements.amountInput.value = '';

    // Initialize slider
    updateSliderTrack();

    // Add dynamic styles
    addParticleStyles();
    addButtonParticleStyles();

    // Create floating particles
    createParticles();

    // Setup events
    setupEventListeners();

    // Initialize testimonial carousel
    initTestimonialCarousel();

    // Start typewriter
    typewriterEffect();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
