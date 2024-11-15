class WordSorter {
    constructor() {
        this.wordMap = {};
        this.init();
    }

    init() {
        document.getElementById("parseButton").addEventListener("click", () => this.parseInput());
        this.block1 = document.getElementById("moveBlock");
        this.block2 = document.getElementById("sortedWordsBlock");
        this.clickedWordsContainer = document.getElementById("clickedWords");
        this.draggedElement = null;

        this.block1.addEventListener("dragover", e => e.preventDefault());
        this.block1.addEventListener("drop", e => this.handleDropInBlock1(e));
        this.block2.addEventListener("dragover", e => e.preventDefault());
        this.block2.addEventListener("drop", e => this.handleDropInBlock2(e));
    }

    // Разбиваем слова по дефису, избавляемся от пробелов в начале и конце, сортируем слова, очищаем все блоки
    // от возможных предыдущих элементов и отображаем новые на экран
    parseInput() {
        const inputText = document.getElementById("inputWords").value;
        if (!inputText) return;

        const splitWords = inputText.split("-").map(word => word.trim()).filter(Boolean);
        this.wordMap = this.sortWords(splitWords);

        this.clearBlocks();
        this.displayWords();
    }

    // Сортировка слов и присвоение ключей
    sortWords(words) {
        const sortedWordMap = {};
        let lowerWords = [];
        let upperWords = [];
        let numbers = [];

        // Разделение элементов по группам (числа, слова с нижним и верхним регистрами)
        words.forEach(word => {
            if (!isNaN(word)) numbers.push(word);
            else if (word[0] === word[0].toLowerCase()) lowerWords.push(word);
            else upperWords.push(word);
        });

        // Сортировка элементов
        lowerWords.sort((a, b) => a.localeCompare(b));
        upperWords.sort((a, b) => a.localeCompare(b));
        numbers.sort((a, b) => a - b);

        // Присвоение ключей в новом массиве
        let index = 1;
        lowerWords.forEach(word => sortedWordMap[`a${index++}`] = word);
        index = 1;
        upperWords.forEach(word => sortedWordMap[`b${index++}`] = word);
        index = 1;
        numbers.forEach(num => sortedWordMap[`n${index++}`] = num);

        return sortedWordMap;
    }

    // Отображение слов в блоке sortedWordsBlock с помощью динамического добавления
    displayWords() {
        for (let key in this.wordMap) {
            const wordBox = this.createWordBox(key, this.wordMap[key]);
            this.block2.append(wordBox);
        }
    }

    // Создание word-box, в котором отображается слово и его ключ
    createWordBox(key, value) {
        const box = document.createElement("div");
        box.classList.add("word-box");
        box.textContent = `${key} ${value}`;
        box.draggable = true;

        // Генерируем случайный цвет и сохраняем его в `original-color`, чтобы иметь возможность заново его отобразить
        const originalColor = this.getRandomColor();
        box.style.backgroundColor = originalColor;
        box.setAttribute("original-color", originalColor);

        // сохраняем ссылку на элемент в box, чтоб использовать далее
        box.addEventListener("dragstart", () => this.draggedElement = box);

        return box;
    }

    // Функция обработчика события, когда элемент перетащили в блок 1 (moveBlock)
    handleDropInBlock1(e) {
        e.preventDefault();

        // Получаем размеры блока moveBlock
        const block1Rect = this.block1.getBoundingClientRect();

        // Рассчитываем границы для перетаскиваемого элемента
        const minX = block1Rect.left;
        const minY = block1Rect.top;
        const maxX = block1Rect.right - this.draggedElement.offsetWidth;
        const maxY = block1Rect.bottom - this.draggedElement.offsetHeight;

        // Получаем новые координаты перетаскиваемого элемента
        let newX = e.clientX - this.draggedElement.offsetWidth / 2;
        let newY = e.clientY - this.draggedElement.offsetHeight / 2;

        // Переопределяем новые координаты, чтобы элемент оставался внутри блока 1
        newX = Math.max(minX, Math.min(maxX, newX));
        newY = Math.max(minY, Math.min(maxY, newY));

        // Устанавливаем новое положение для элемента
        this.draggedElement.style.position = "absolute";
        this.draggedElement.style.left = `${newX}px`;
        this.draggedElement.style.top = `${newY}px`;

        // Меняем цвет элемента на фиолетовый
        this.draggedElement.style.backgroundColor = "#8673A1";

        // Динамически обавляем элемент в блок 1
        this.block1.append(this.draggedElement);

        // Позволяем пользовтаелю кликать на элемент
        this.enableClickOnBlock1Word(this.draggedElement);
    }

    // Функция обработчика события, когда элемент перетащили в блок 2 (sortedWordsBlock)
    handleDropInBlock2(e) {
        e.preventDefault();

        let inserted = false;
        // Определяем индекс элемента, на котором мы остановились
        const draggedKey = this.draggedElement.textContent.split(" ")[0]; // Извлекаем ключ текущего элемента

        // Возвращаем позиционирование к относительному для блока 2
        this.draggedElement.style.position = "relative";
        this.draggedElement.style.left = "0";
        this.draggedElement.style.top = "0";

        // Восстанавливаем первоначальный цвет элемента из атрибута `original-color`
        this.draggedElement.style.backgroundColor = this.draggedElement.getAttribute("original-color");

        // Добавляем элемент в нужное место в блоке 2
        // Проходим по текущим дочерним элементам блока блока 2
        for (let child of this.block2.children) {
            const childKey = child.textContent.split(" ")[0];

            // Вставляем перед первым элементом, чей ключ больше, чем `draggedKey`
            if (draggedKey < childKey) {
                this.block2.insertBefore(this.draggedElement, child);
                inserted = true;
                break;
            }
        }

        // Если не нашлось места для вставки, добавляем в конец
        if (!inserted) {
            this.block2.appendChild(this.draggedElement);
        }

        // Исключаем нажатие пользователем на элемент
        this.draggedElement.removeEventListener("click", this.updateClickInfo);
    }

    // Функция добавления обработчика события клика по элементу, когда он находится в блоке 1
    enableClickOnBlock1Word(box) {
        // Проверяем, имеется ли уже обработчик события у элемента по наличию атрибута
        if (!box.hasAttribute("clicked")) {
            box.addEventListener("click", () => {
                // Проверяем, что элемент находится в block1
                if (this.block1.contains(box)) {
                    const [key, value] = box.textContent.split(" ");
                    this.updateClickInfo(key.trim(), value.trim());
                }
            });

            // Устанавливаем флаг, что обработчик добавлен
            box.setAttribute("clicked", "true");
        }
    }

    // Добавление значений элементов в блок clickedWords
    updateClickInfo(key, value) {
        const clickedWordBox = document.createElement("div");

        clickedWordBox.textContent = value;
        clickedWordBox.style.margin = '4px 0';
        clickedWordBox.style.paddingRight = '5px';

        this.clickedWordsContainer.append(clickedWordBox);
    }

    // Определение случайного цвета для блока word-box
    getRandomColor() {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        return `#${randomColor}`;
    }

    // Очищаем все блоки
    clearBlocks() {
        this.block1.innerHTML = ""; // Очищаем block1
        this.block2.innerHTML = ""; // Очищаем block2
        this.clickedWordsContainer.innerHTML = ""; // Очищаем clickedWords
    }
}

// Создаём новый экземпляр класса
new WordSorter();

