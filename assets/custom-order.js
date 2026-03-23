/**
 * Holy Moly Custom Order Page - JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
  const typeCards = document.querySelectorAll('.hco-type-card');
  const formContainer = document.getElementById('form-container');
  const orderTypeInput = document.getElementById('order-type');
  const formFields = document.querySelectorAll('.hco-form-fields');
  const form = document.getElementById('custom-order-form');
  const successMessage = document.getElementById('success-message');
  
  const basePriceEl = document.getElementById('base-price');
  const sizePriceEl = document.getElementById('size-price');
  const addonPriceEl = document.getElementById('addon-price');
  const addonLine = document.getElementById('addon-line');
  const totalPriceEl = document.getElementById('total-price');
  
  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('file-input');
  const uploadPreview = document.getElementById('upload-preview');
  
  const faqItems = document.querySelectorAll('.hco-faq-item');
  
  let currentType = null;
  let basePrice = 35;
  
  const typePrices = {
    photo: 35,
    text: 25,
    pattern: 40,
    creative: 50
  };
  
  // Type Selection
  typeCards.forEach(card => {
    card.addEventListener('click', function() {
      const type = this.dataset.type;
      
      typeCards.forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      
      currentType = type;
      orderTypeInput.value = type;
      
      basePrice = typePrices[type] || 35;
      
      formContainer.style.display = 'block';
      
      formFields.forEach(field => field.classList.remove('active'));
      const targetFields = document.getElementById(`fields-${type}`);
      if (targetFields) {
        targetFields.classList.add('active');
      }
      
      updatePrice();
      updateSteps(2);
      
      formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  
  function updatePrice() {
    if (!currentType) return;
    
    let sizeAdd = 0;
    let addonAdd = 0;
    
    const sizeInput = document.querySelector(`input[name="${getSizeFieldName()}"]:checked`);
    if (sizeInput) {
      sizeAdd = parseInt(sizeInput.dataset.price) || 0;
    }
    
    if (currentType === 'photo') {
      const frameInput = document.querySelector('input[name="contact[frame]"]:checked');
      if (frameInput) {
        addonAdd = parseInt(frameInput.dataset.price) || 0;
      }
    }
    
    if (currentType === 'pattern') {
      const usageInput = document.querySelector('input[name="contact[usage]"]:checked');
      if (usageInput) {
        addonAdd = parseInt(usageInput.dataset.price) || 0;
      }
    }
    
    const deadlineSelect = document.querySelector('select[name="contact[deadline]"]');
    let multiplier = 1;
    if (deadlineSelect) {
      const deadline = deadlineSelect.value;
      if (deadline === 'urgent') multiplier = 1.5;
      if (deadline === 'super-urgent') multiplier = 2;
    }
    
    const subtotal = basePrice + sizeAdd + addonAdd;
    const total = Math.round(subtotal * multiplier);
    
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
  
  document.addEventListener('change', function(e) {
    if (e.target.matches('input[type="radio"], select')) {
      updatePrice();
    }
  });
  
  // File Upload
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
  
  uploadPreview.addEventListener('click', (e) => {
    if (e.target.classList.contains('hco-upload-preview-remove')) {
      e.target.closest('.hco-upload-preview-item').remove();
      if (!uploadPreview.children.length) {
        uploadArea.classList.remove('has-file');
      }
    }
  });
  
  // FAQ Accordion
  faqItems.forEach(item => {
    const question = item.querySelector('.hco-faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      
      faqItems.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.hco-faq-question').classList.remove('active');
      });
      
      if (!isOpen) {
        item.classList.add('open');
        question.classList.add('active');
      }
    });
  });
  
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
  
  // Form Submission
  if (form) {
    form.addEventListener('submit', function(e) {
      if (!currentType) {
        e.preventDefault();
        alert('请先选择定制类型');
        return;
      }
      
      // Check if files are selected
      const files = fileInput.files;
      if (files.length > 0) {
        e.preventDefault();
        // Files need to be uploaded separately - for now, show a message
        alert('⚠️ 注意：参考图片无法通过表单直接上传。请在提交后，将图片发送到我们的邮箱 hello@holymoly.com，并注明你的定制需求。');
        
        // Continue with form submission without files
        form.classList.add('hco-submitting');
        
        // Clear file input before submitting
        fileInput.value = '';
        
        // Submit form programmatically
        setTimeout(() => {
          form.submit();
        }, 500);
        return;
      }
      
      // Normal form submission (no files)
      form.classList.add('hco-submitting');
      
      // Form will submit naturally to /contact
      // Success page will be shown by Shopify
    });
  }
  
  // Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
  
  console.log('🎮 Holy Moly Custom Order Page loaded');
});
