
const USERS = [
  { email: 'teste@gmail.com', password: '123456' },
  { email: '', password: '' },
];


const form        = document.getElementById('loginForm');
const emailInput  = document.getElementById('email');
const pwdInput    = document.getElementById('password');
const emailError  = document.getElementById('emailError');
const pwdError    = document.getElementById('passwordError');
const toggleBtn   = document.getElementById('togglePwd');
const submitBtn   = document.getElementById('submitBtn');
const btnText     = document.getElementById('btnText');
const btnLoader   = document.getElementById('btnLoader');
const alertBox    = document.getElementById('alert');
const rememberBox = document.getElementById('remember');


//  Lembrar sessão

window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('rememberedEmail');
  if (saved) {
    emailInput.value = saved;
    rememberBox.checked = true;
  }
});

//  Mostrar/ocultar senha

toggleBtn.addEventListener('click', () => {
  const isHidden = pwdInput.type === 'password';
  pwdInput.type = isHidden ? 'text' : 'password';
  toggleBtn.setAttribute('aria-label', isHidden ? 'Ocultar senha' : 'Mostrar senha');

  const icon = document.getElementById('eyeIcon');
  icon.innerHTML = isHidden
    ? `<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`
    : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
});

//  Validações

function validateEmail(value) {
  if (!value.trim()) return 'O e-mail é obrigatório.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Digite um e-mail válido.';
  return '';
}

function validatePassword(value) {
  if (!value) return 'A senha é obrigatória.';
  if (value.length < 6) return 'A senha deve ter ao menos 6 caracteres.';
  return '';
}

function setFieldError(input, errorEl, msg) {
  errorEl.textContent = msg;
  input.classList.toggle('invalid', !!msg);
}

emailInput.addEventListener('input', () => {
  setFieldError(emailInput, emailError, validateEmail(emailInput.value));
});

pwdInput.addEventListener('input', () => {
  setFieldError(pwdInput, pwdError, validatePassword(pwdInput.value));
});


function showAlert(msg, type = 'error') {
  alertBox.textContent = msg;
  alertBox.className = `alert ${type}`;
  alertBox.classList.remove('hidden');
}

function hideAlert() {
  alertBox.classList.add('hidden');
}




function fakeLogin(email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = USERS.find(u => u.email === email && u.password === password);
      user ? resolve(user) : reject(new Error('E-mail ou senha incorretos.'));
    }, 1200);
  });
}


form.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideAlert();

  const emailVal = emailInput.value.trim();
  const pwdVal   = pwdInput.value;

  const eErr = validateEmail(emailVal);
  const pErr = validatePassword(pwdVal);

  setFieldError(emailInput, emailError, eErr);
  setFieldError(pwdInput,   pwdError,   pErr);

  if (eErr || pErr) return;

  // Loading state
  submitBtn.disabled = true;
  btnText.classList.add('hidden');
  btnLoader.classList.remove('hidden');

  try {
    await fakeLogin(emailVal, pwdVal);

    
    if (rememberBox.checked) {
      localStorage.setItem('rememberedEmail', emailVal);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    showAlert('✓ Login realizado com sucesso! Redirecionando…', 'success');

    setTimeout(() => {
      alert(`Bem-vindo, ${emailVal}!\n\nEste é um projeto de demonstração.`);
    }, 1000);

  } catch (err) {
    showAlert(err.message, 'error');
  } finally {
    submitBtn.disabled = false;
    btnText.classList.remove('hidden');
    btnLoader.classList.add('hidden');
  }
});
