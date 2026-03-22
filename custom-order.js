/**
 * Holy Moly Custom Order Page - JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const typeCards = document.querySelectorAll('.hco-type-card');
  const formContainer = document.getElementById('form-container');
  const orderTypeInput = document.getElementById('order-type');
  const formFields = document.querySelectorAll('.hco-form-fields');
  const form = document.getElementById('custom-order-form');
  const successMessage = document.getElementById('success-message');
  
  // Price elements
  const basePriceEl = document.getElementById('base-price');
  const sizePriceEl = document.getElementById('size-price');
  const addonPriceEl = document.getElementById('addon-price');
  const addonLine = document.getElementById('addon-line');
  const totalPriceEl = document.getElementById('total-price');
  
  // Upload elements
  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('file-input');
  const uploadPreview = document.getElementById('upload-preview');
  
  // FAQ elements
  const faqItems = document.querySelectorAll('.hco-faq-item');
  
  // State
  let currentType = null;
  let basePrice = 35;
  
  // Type prices configuration
  const typePrices = {
    photo: 35,
    text: 25,
    pattern: 40,
    creative: 50
  };
  
  // ===== TYPE SELECTION =====
  typeCards.forEach(card => {
    card.addEventListener('click', function() {
      const type = this.dataset.type;
      
      // Update active state
      typeCards.forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      
      // Set current type
      currentType = type;
      orderTypeInput.value = type;
      
      // Update base price
      basePrice = typePrices[type] || 35;
      
      // Show form container
      formContainer.style.display = 'block';
      
      // Show relevant fields
      formFields.forEach(field => field.classList.remove('active'));
      const targetFields = document.getElementById(`fields-${type}`);
      if (targetFields) {
        targetFields.classList.add('active');
      }
      
      // Update price display
      updatePrice();
      
      // Update step indicator
      updateSteps(2);
      
      // Smooth scroll to form
      formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  
  // ===== PRICE CALCULATOR =====
  function updatePrice() {
    if (!currentType) return;
    
    let sizeAdd = 0;
    let addonAdd = 0;
    
    // Get selected size
    const sizeInput = document.querySelector(`input[name="${getSizeFieldName()}"]:checked`);
    if (sizeInput) {
      sizeAdd = parseInt(sizeInput.dataset.price) || 0;
    }
    
    // Get frame/addon price for photo type
    if (currentType === 'photo') {
      const frameInput = document.querySelector('input[name="contact[frame]"]:checked');
      if (frameInput) {
        addonAdd = parseInt(frameInput.dataset.price) || 0;
      }
    }
    
    // Get usage price for pattern type
    if (currentType === 'pattern') {
      const usageInput = document.querySelector('input[name="contact[usage]"]:checked');
      if (usageInput) {
        addonAdd = parseInt(usageInput.dataset.price) || 0;
      }
    }
    
    // Get deadline multiplier
    const deadlineSelect = document.querySelector('select[name="contact[deadline]"]');
    let multiplier = 1;
    if (deadlineSelect) {
      const deadline = deadlineSelect.value;
      if (deadline === 'urgent') multiplier = 1.5;
      if (deadline === 'super-urgent') multiplier = 2;
    }
    
    // Calculate total
    const subtotal = basePrice + sizeAdd + addonAdd;
    const total = Math.round(subtotal * multiplier);
    
    // Update display
    basePriceEl.textContent = `$${basePrice.toFixed(2)}`;
    sizePriceEl.textContent = `+$${sizeAdd.toFixed(2)}`;
    
    if (addonAdd > 0) {
      addonLine.style.display = 'flex';
      addonPriceEl.textContent = `+$${addonAdd.toFixed(2)}`;
    } else {
      addonLine.style.display = 'none';
    }
    
    if (multiplier > 1) {
      totalPriceEl.textContent = `$${total.toFixed(2)} (${multiplier}x 加急)`;
    } else {
      totalPriceEl.textContent = `$${total.toFixed(2)} 起`;
    }
  }
  
  function getSizeFieldName() {
    switch(currentType) {
      case 'photo': return 'contact[size]';
      case 'text': return 'contact[text_size]';
      default: return 'contact[size]';
    }
  }
  
  // Listen for price-changing inputs
  document.addEventListener('change', function(e) {
    if (e.target.matches('input[type="radio"], select')) {
      updatePrice();
    }
  });
  
  // ===== FILE UPLOAD =====
  if (uploadArea && fileInput) {
    uploadArea.addEventListener('click', () => fileInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.style.borderColor = '#FFE600';
      uploadArea.style.background = 'rgba(255,230,0,0.05)';
    });
    
    uploadArea.addEventListener('dragleave', () => {
      uploadArea.style.borderColor = '';
      uploadArea.style.background = '';
    });
    
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.style.borderColor = '';
      uploadArea.style.background = '';
      handleFiles(e.dataTransfer.files);
    });
    
    fileInput.addEventListener('change', (e) => {
      handleFiles(e.target.files);
    });
  }
  
  function handleFiles(files) {
    if (!files.length) return;
    
    uploadArea.classList.add('has-file');
    uploadPreview.innerHTML = '';
    
    Array.from(files).slice(0, 5).forEach((file, index) => {
      if (!file.type.startsWith('image/')) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const item = document.createElement('div');
        item.className = 'hco-upload-preview-item';
        item.innerHTML = `
          <img src="${e.target.result}" alt="Preview ${index + 1}">
          <button type="button" class="hco-upload-preview-remove" data-index="${index}">×</button>
        `;
        uploadPreview.appendChild(item);
      };
      reader.readAsDataURL(file);
    });
  }
  
  // Remove preview
  uploadPreview.addEventListener('click', (e) => {
    if (e.target.classList.contains('hco-upload-preview-remove')) {
      e.target.closest('.hco-upload-preview-item').remove();
      if (!uploadPreview.children.length) {
        uploadArea.classList.remove('has-file');
      }
    }
  });
  
  // ===== FAQ ACCORDION =====
  faqItems.forEach(item => {
    const question = item.querySelector('.hco-faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      
      // Close all
      faqItems.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.hco-faq-question').classList.remove('active');
      });
      
      // Open clicked if wasn't open
      if (!isOpen) {
        item.classList.add('open');
        question.classList.add('active');
      }
    });
  });
  
  // ===== STEP INDICATOR =====
  function updateSteps(step) {
    const steps = document.querySelectorAll('.hco-step');
    steps.forEach((s, index) => {
      s.classList.remove('active', 'completed');
      if (index + 1 < step) {
        s.classList.add('completed');
      } else if (index + 1 === step) {
        s.classList.add('active');
      }
    });
  }
  
  // ===== FORM SUBMISSION =====
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (!currentType) {
        alert('请先选择定制类型');
        return;
      }
      
      // Show loading state
      form.classList.add('hco-submitting');
      
      // Simulate submission (replace with actual AJAX if needed)
      setTimeout(() => {
        form.classList.remove('hco-submitting');
        form.style.display = 'none';
        successMessage.classList.add('show');
        updateSteps(3);
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 1500);
      
      // For actual Shopify contact form submission:
      // form.submit();
    });
  }
  
  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
  
  // ===== INITIALIZE =====
  console.log('🎮 Holy Moly Custom Order Page loaded');
});
