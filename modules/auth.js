export function initAuth() {
  const authBtn = document.getElementById("auth-btn");
  const modal = document.getElementById("login-modal");
  const closeBtn = document.getElementById("close-modal");
  const userNameSpan = document.getElementById("user-name");

  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const loginBlock = document.getElementById("login-block");
  const registerBlock = document.getElementById("register-block");
  const goToRegister = document.getElementById("go-to-register");
  const goToLogin = document.getElementById("go-to-login");

  // === 1. ФУНКЦИЯ ПОКАЗА ОШИБОК (Красный) ===
  function showTextError(inputElement, errorElementId, message) {
    const errorSpan = document.getElementById(errorElementId);
    
    if (errorSpan) {
      errorSpan.textContent = message;
      errorSpan.style.color = "#e74c3c"; // Красный цвет
    }
    
    inputElement.style.borderColor = "#e74c3c"; 

    setTimeout(() => {
      if (errorSpan) errorSpan.textContent = "";
      inputElement.style.borderColor = "#f0f0f0"; 
    }, 3000);
  }

  // === 2. ФУНКЦИЯ ПОКАЗА УСПЕХА (Зеленый) ===
  // Используем те же спаны, но красим в зеленый
  function showSuccessMessage(errorElementId, message) {
    const errorSpan = document.getElementById(errorElementId);
    if (errorSpan) {
      errorSpan.textContent = message;
      errorSpan.style.color = "#27ae60"; // Зеленый цвет
      
      // Держим сообщение подольше (5 секунд), чтобы успели прочитать
      setTimeout(() => {
        errorSpan.textContent = "";
      }, 5000);
    }
  }

  function checkAuth() {
    const storedUser = localStorage.getItem("user");
    if (storedUser && userNameSpan) {
      userNameSpan.textContent = storedUser;
      if (authBtn) {
        authBtn.style.color = "green"; 
        authBtn.onclick = function (e) {
          e.preventDefault();
          if (confirm("Выйти из аккаунта?")) {
            localStorage.removeItem("user");
            location.reload();
          }
        };
      }
    } else {
      if (userNameSpan) userNameSpan.textContent = "";
      if (authBtn) {
        authBtn.style.color = "black";
        authBtn.onclick = function (e) {
          e.preventDefault();
          if (modal) modal.classList.add("open");
        };
      }
    }
  }

  if (modal && closeBtn) {
    closeBtn.addEventListener("click", () => modal.classList.remove("open"));
    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("open");
    });

    if (goToRegister && goToLogin) {
      goToRegister.addEventListener("click", (e) => {
        e.preventDefault();
        loginBlock.style.display = "none";
        registerBlock.style.display = "block";
        document.querySelectorAll(".error-text").forEach(el => el.textContent = "");
      });
      goToLogin.addEventListener("click", (e) => {
        e.preventDefault();
        registerBlock.style.display = "none";
        loginBlock.style.display = "block";
        document.querySelectorAll(".error-text").forEach(el => el.textContent = "");
      });
    }
  }

  // === ЛОГИКА РЕГИСТРАЦИИ (БЕЗ ALERT) ===
  if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const usernameInput = document.getElementById("reg-input");
      const passwordInput = document.getElementById("reg-password");
      
      const username = usernameInput.value.trim();
      const password = passwordInput.value;

      let isValid = true;
      if (username.length < 3) {
        showTextError(usernameInput, "error-reg-name", "Минимум 3 символа");
        isValid = false;
      }
      if (password.length < 6) {
        showTextError(passwordInput, "error-reg-pass", "Минимум 6 символов");
        isValid = false;
      }
      if (!isValid) return;

      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const data = await response.json();

        if (data.success) {
          // УСПЕХ:
          // 1. Очищаем форму
          registerForm.reset();
          // 2. Переключаемся на блок входа
          registerBlock.style.display = "none";
          loginBlock.style.display = "block";
          
          // 3. Пишем зеленое сообщение над полем логина
          showSuccessMessage("error-login-name", "Аккаунт создан! Теперь войдите.");
          
          // (Опционально) Можно сразу подставить логин в поле входа для удобства
          document.getElementById("login-input").value = username;

        } else {
          showTextError(usernameInput, "error-reg-name", data.message);
        }
      } catch (error) {
        console.error("Ошибка:", error);
        showTextError(usernameInput, "error-reg-name", "Ошибка сервера");
      }
    });
  }

  // === ЛОГИКА ВХОДА (БЕЗ ALERT) ===
  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const usernameInput = document.getElementById("login-input");
      const passwordInput = document.getElementById("login-password");

      const username = usernameInput.value.trim();
      const password = passwordInput.value;

      let isValid = true;
      if (!username) {
        showTextError(usernameInput, "error-login-name", "Введите логин");
        isValid = false;
      }
      if (!password) {
        showTextError(passwordInput, "error-login-pass", "Введите пароль");
        isValid = false;
      }
      if (!isValid) return;

      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const data = await response.json();

        if (data.success) {
          // УСПЕХ:
          localStorage.setItem("user", data.username);
          checkAuth();
          
          // Просто закрываем окно. Имя пользователя обновится в шапке.
          modal.classList.remove("open");
          loginForm.reset();
          
        } else {
          // Ошибка (неверный пароль и т.д.)
          showTextError(passwordInput, "error-login-pass", data.message);
        }
      } catch (error) {
        console.error("Ошибка:", error);
        showTextError(usernameInput, "error-login-name", "Ошибка сервера");
      }
    });
  }

  checkAuth();
}