document.addEventListener('DOMContentLoaded', () => {
  /* ==================== 1. MENÚ MÓVIL ACCESIBLE ==================== */
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');

  const closeMenu = () => {
    if (!mainNav || !menuToggle) return;
    mainNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');
  };

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute(
        'aria-label',
        isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
      );
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mainNav.classList.contains('is-open')) {
        closeMenu();
        menuToggle.focus();
      }
    });
  }

  /* ==================== 2. FILTRO DE PROYECTOS ==================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const selectedFilter = button.dataset.filter;

      filterButtons.forEach((btn) => {
        const isCurrent = btn === button;
        btn.classList.toggle('is-active', isCurrent);
        btn.setAttribute('aria-pressed', String(isCurrent));
      });

      projectCards.forEach((card) => {
        const category = card.dataset.category;
        const shouldShow = selectedFilter === 'all' || category === selectedFilter;
        card.classList.toggle('is-hidden', !shouldShow);
      });
    });
  });

  /* ==================== 3. VALIDACIÓN DEL FORMULARIO ==================== */
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  const fields = {
    nombre: {
      input: document.getElementById('nombre'),
      error: document.getElementById('error-nombre'),
      validate: (value) => {
        if (!value) return 'Por favor, ingresa tu nombre completo.';
        if (value.length < 3) return 'El nombre debe tener al menos 3 caracteres.';
        return '';
      }
    },
    correo: {
      input: document.getElementById('correo'),
      error: document.getElementById('error-correo'),
      validate: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!value) return 'Por favor, ingresa tu correo electrónico.';
        if (!emailRegex.test(value)) return 'Ingresa un correo electrónico válido (ej. nombre@empresa.com).';
        return '';
      }
    },
    asunto: {
      input: document.getElementById('asunto'),
      error: document.getElementById('error-asunto'),
      validate: (value) => {
        if (!value) return 'Indica la empresa o el asunto del mensaje.';
        if (value.length < 3) return 'El asunto debe tener al menos 3 caracteres.';
        return '';
      }
    },
    mensaje: {
      input: document.getElementById('mensaje'),
      error: document.getElementById('error-mensaje'),
      validate: (value) => {
        if (!value) return 'Por favor, escribe un mensaje.';
        if (value.length < 10) return 'El mensaje debe contener al menos 10 caracteres.';
        return '';
      }
    }
  };

  const setFieldError = (fieldObj, message) => {
    const hasError = Boolean(message);
    fieldObj.error.textContent = message;
    fieldObj.input.classList.toggle('input-error', hasError);
    fieldObj.input.setAttribute('aria-invalid', String(hasError));
  };

  const validateSingleField = (fieldObj) => {
    const value = fieldObj.input.value.trim();
    const errorMessage = fieldObj.validate(value);
    setFieldError(fieldObj, errorMessage);
    return !errorMessage;
  };

  if (contactForm && formFeedback) {
    Object.values(fields).forEach((fieldObj) => {
      fieldObj.input.addEventListener('input', () => {
        if (fieldObj.input.classList.contains('input-error')) {
          validateSingleField(fieldObj);
        }
        if (formFeedback.classList.contains('is-error')) {
          formFeedback.className = 'form-feedback';
          formFeedback.textContent = '';
        }
      });
    });

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      let isFormValid = true;
      let firstInvalidInput = null;

      Object.values(fields).forEach((fieldObj) => {
        const isValid = validateSingleField(fieldObj);
        if (!isValid) {
          isFormValid = false;
          if (!firstInvalidInput) {
            firstInvalidInput = fieldObj.input;
          }
        }
      });

      if (!isFormValid) {
        formFeedback.className = 'form-feedback is-error';
        formFeedback.textContent = 'Revisa los campos marcados en rojo antes de enviar tu mensaje.';
        firstInvalidInput.focus();
        return;
      }

      const senderName = fields.nombre.input.value.trim();
      formFeedback.className = 'form-feedback is-success';
      formFeedback.textContent = `¡Gracias, ${senderName}! Tu mensaje fue validado y enviado correctamente. Te responderé pronto.`;

      contactForm.reset();
      Object.values(fields).forEach((fieldObj) => setFieldError(fieldObj, ''));
    });
  }
});