document.getElementById('startButton').addEventListener('click', () => {
    clearResults();
    let formulaCount = document.getElementById('formulaCount').value;
    let currentFormula = 1;

    // Начинаем с ввода переменных для первой формулы
    processFormula(currentFormula, formulaCount);
});

function clearResults() {
    document.getElementById('formulasContainer').innerHTML = '';
}
function processFormula(formulaNumber, totalFormulas) {
    // Запрашиваем ввод переменных для текущей формулы
    let a = parseFloat(prompt(`Введите значение переменной a для формулы ${formulaNumber}:`));
    let b = parseFloat(prompt(`Введите значение переменной b для формулы ${formulaNumber}:`));
    let c = parseFloat(prompt(`Введите значение переменной c для формулы ${formulaNumber}:`));

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
        alert('Пожалуйста, введите корректные числовые значения для всех переменных!');
        return;
    }

    // Отображаем результат расчета и картинку формулы
    displayFormulaResult(formulaNumber, a, b, c);

    // Спрашиваем, продолжаем ли дальше
    if (formulaNumber < totalFormulas) {
        setTimeout(() => {
            let continueCalculation = confirm('Продолжаем дальше?');
            if (continueCalculation) {
                // Если продолжаем и есть еще формулы, переходим к следующей
                processFormula(formulaNumber + 1, totalFormulas);
            } else {
                alert('Вычисления завершены.');
            }
        }, 500);
    } else {
        alert('Вычисления завершены.');
    }
}

function displayFormulaResult(formulaNumber, a, b, c) {
    // Рассчитываем результат в зависимости от формулы
    let result;
    if (formulaNumber === 1) {
        // Формула 1: (pi * sqrt(a^2)) / (b^2 * c)
        result = (Math.PI * Math.sqrt(a ** 2)) / (b ** 2 * c);
    } else if (formulaNumber === 2) {
        // Формула 2: (a + sqrt(b))^2 / c^3
        result = (a + Math.sqrt(b)) ** 2 / (c ** 3);
    } else if (formulaNumber === 3) {
        // Формула 3: sqrt(a + b + sqrt(c)) / (pi * b)
        result = Math.sqrt(a + b + Math.sqrt(c)) / (Math.PI * b);
    }

    // Проверка на успешность вычислений
    let success = !isNaN(result) && isFinite(result);

    document.getElementById('formulasContainer').innerHTML += `
            <h2>Формула ${formulaNumber}</h2>
            <div class="formula-image-container">
                <img class="formula-image" src="../images/formula${formulaNumber}.jpg" alt="Формула ${formulaNumber}">
            </div>
            <p>Результат: ${success ? result.toFixed(2) : '-'}</p>
            <img src="../images/${success ? 'smile.png' : 'sad.png'}" alt="${success ? 'Улыбка' : 'Грусть'}">
        `;
}