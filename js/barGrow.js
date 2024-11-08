document.addEventListener("DOMContentLoaded", function() {
    // Ждем загрузки страницы, а затем меняем ширину
    document.querySelectorAll('.progress-bar').forEach((bar) => {
        const width = bar.style.width; // Получаем целевую ширину из style
        bar.style.width = "0"; // Начинаем с нуля
        setTimeout(() => {
            bar.style.width = width; // Устанавливаем целевую ширину с анимацией
        }, 100); // Задержка перед началом анимации
    });
});
