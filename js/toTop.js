// Создаем объект для кнопки "Наверх"
const backToTopButton = {
    button: document.querySelector('.btn-toTop'),

    toggleVisibility() {
        // Проверяем прокрутку и показываем или скрываем кнопку
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;
        this.button.classList.toggle('btn-toTop_hidden', scrollPosition < 100);
    },

    scrollToTop() {
        // Плавная прокрутка страницы вверх
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    },

    init() {
        // Обработчик прокрутки
        window.addEventListener('scroll', this.toggleVisibility.bind(this));

        // Клик по кнопке
        this.button.addEventListener('click', this.scrollToTop);
    }
}

// Инициализация кнопки "Наверх"
backToTopButton.init();
