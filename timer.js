// === Конфигурация таймера по возрасту (в минутах) ===
let timer;

// Загружается при переходе на любую страницу
window.addEventListener('load', () => {
    const age = parseInt(localStorage.getItem('userAge'));
    if (!age) {
        askAge();
        return;
    }

    const duration = getDurationByAge(age);
    if (duration === null) return; // 18+ — без ограничений

    const lastStart = parseInt(localStorage.getItem('lastStart'));
    const now = Date.now();

    // Если не было старта — установить и запустить
    if (!lastStart || isNaN(lastStart)) {
        startNewSession(duration);
    } else {
        const elapsed = now - lastStart;

        if (elapsed >= duration) {
            showBreakNotification(() => startNewSession(duration));
        } else {
            startTimer(duration - elapsed, duration);
        }
    }
});

// Запрос возраста
function askAge() {
    const input = prompt("Пожалуйста, укажите ваш возраст:");
    const age = parseInt(input);
    if (age > 0 && age < 120) {
        localStorage.setItem('userAge', age);
        localStorage.removeItem('lastStart'); // сброс предыдущего таймера
        location.reload(); // перезагрузка для запуска таймера
    } else {
        alert("Введите корректное число.");
        askAge();
    }
}

// Получение длительности по возрасту
function getDurationByAge(age) {
    if (age <= 7) return 15 * 60 * 1000;      // 6–7 лет
    if (age <= 9) return 20 * 60 * 1000;      // 8–9 лет
    if (age <= 11) return 25 * 60 * 1000;     // 10–11 лет
    if (age <= 13) return 30 * 60 * 1000;     // 12–13 лет
    if (age <= 15) return 35 * 60 * 1000;     // 14–15 лет
    if (age <= 17) return 40 * 60 * 1000;     // 16–17 лет
    return null;  // 18+ — без ограничений
}

// Запуск новой сессии (таймера)
function startNewSession(duration) {
    if (!duration) return;
    const now = Date.now();
    localStorage.setItem('lastStart', now.toString());
    startTimer(duration, duration);
}

// Запуск таймера
function startTimer(remaining, fullDuration) {
    clearTimeout(timer);

    timer = setTimeout(() => {
        showBreakNotification(() => startNewSession(fullDuration));
    }, remaining);
}

// Перерыв: нельзя закрыть 30 секунд
function showBreakNotification(callback) {
    const overlay = document.createElement('div');
    overlay.style = `
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        z-index: 9999;
        text-align: center;
        padding: 20px;
    `;
    overlay.textContent = "⏳ Пора сделать перерыв! Отдохните 30 секунд.";

    document.body.appendChild(overlay);

    setTimeout(() => {
        document.body.removeChild(overlay);
        if (typeof callback === 'function') callback();
    }, 30000); // 30 секунд перерыв
}