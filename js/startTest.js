const questions = [
    {
        question: "А когда с человеком может произойти дрожемент?",
        answers: [
            { text: "Когда он влюбляется", correct: false },
            { text: "Когда он идет шопиться", correct: false },
            { text: "Когда он слышит смешную шутку", correct: false },
            { text: "Когда он боится, пугается", correct: true }
        ],
        explanation: "Лексема «дрожемент» имплицирует состояние крайнего напряжения и страха: «У меня всегда дрожемент в ногах, когда копы подходят»."
    },
    {
        question: "Говорят, Антон заовнил всех. Это еще как понимать?",
        answers: [
            { text: "Как так, заовнил? Ну и хамло. Кто с ним теперь дружить-то будет?", correct: false },
            { text: "Антон очень надоедливый и въедливый человек, всех задолбал", correct: false },
            { text: "Молодец, Антон, всех победил!", correct: true },
            { text: "Нет ничего плохого в том, что Антон тщательно выбирает себе друзей", correct: false }
        ],
        explanation: "Термин «заовнить» заимствован из английского языка, он происходит от слова own и переводится как «победить», «завладеть», «получить»."
    },
    {
        question: "А фразу «заскамить мамонта» как понимать?",
        answers: [
            { text: "Разозлить кого-то из родителей", correct: false },
            { text: "Увлекаться археологией", correct: false },
            { text: "Развести недотепу на деньги", correct: true },
            { text: "Оскорбить пожилого человека", correct: false }
        ],
        explanation: "Заскамить мамонта — значит обмануть или развести на деньги. Почему мамонта? Потому что мошенники часто выбирают в жертвы пожилых людей (древних, как мамонты)."
    },
    {
        question: "Кто такие бефефе?",
        answers: [
            { text: "Вши?", correct: false },
            { text: "Милые котики, такие милые, что бефефе", correct: false },
            { text: "Лучшие друзья", correct: true },
            { text: "Люди, которые не держат слово", correct: false }
        ],
        explanation: "Бефефе — это лучшие друзья. Аббревиатура от английского выражения best friends forever."
    }
];

let currentQuestionIndex = 0;
let score = 0;
let isAnswered = false;

const questionContainer = document.getElementById("question-container");
const questionButton = document.getElementById("question-btn");
const endMessage = document.getElementById("end-message");
const scoreDisplay = document.getElementById("score");

function showQuestion(question) {
    let questionHTML = `
    <div class="question-block toggle">
        <div class="question-text-marker">
        <div class="text">${currentQuestionIndex + 1}. ${question.question}</div>
        <div class="marker hidden"></div>
        </div>
        <div class="allQuestions"></div>
    </div>`;
    questionContainer.insertAdjacentHTML('beforeend', questionHTML);
    const questionBlock = questionContainer.lastElementChild.lastElementChild;

    question.answers.sort(() => Math.random() - 0.5).forEach(answer => {
        const answerBlock = document.createElement("div");
        answerBlock.classList.add("answer-block");
        answerBlock.innerText = answer.text;
        answerBlock.addEventListener("click", () => selectAnswer(answer, answerBlock, question));
        questionBlock.append(answerBlock);
    });

    // Кнопка будет неактивной до выбора ответа
    questionButton.classList.add("disabled");
    questionButton.disabled = true;
    isAnswered = false;
}

function selectAnswer(answer, answerBlock, question) {
    if (isAnswered) return; // Если уже ответили, блокируем дальнейший выбор
    isAnswered = true;

    const questionMarker = questionContainer.lastElementChild.firstElementChild.lastElementChild;

    setTimeout(() => {
        if (answer.correct) {
            answerBlock.classList.add("correct");
            answerBlock.classList.add("selected")
            score++;
            showExplanation(answer, answerBlock, question.explanation);

            // Показываем галочку (правильный ответ)
            questionMarker.classList.remove("hidden");
            questionMarker.classList.add("correct");

            setTimeout(() => {
                answerBlock.classList.add("move-right");
                }, 2200);
            // Если ответ правильный, даем больше времени пользователю, чтобы посмотреть на него
            setTimeout(() => hideAllAnswers(), 3200); // Показываем правильный ответ дольше (3 секунды)

        } else {
            answerBlock.classList.add("wrong");
            questionMarker.classList.remove("hidden");
            questionMarker.classList.add("wrong");

            // Если ответ неправильный, блоки прячутся быстрее
            setTimeout(() => hideAllAnswers(), 1700); // Скрываем быстрее (1.5 секунды)
        }

        // Двигаем все неправильные ответы вправо через 500ms
        setTimeout(() => {
            const allAnswers = document.querySelectorAll(".answer-block");
            allAnswers.forEach(currentAnswer => {
                if (!currentAnswer.classList.contains('correct')) {
                    currentAnswer.classList.add("move-right");
                }
            }, 500);
        }, 500);

        // Делаем кнопку активной для перехода к следующему вопросу
        if (currentQuestionIndex !== questions.length - 1) {
            setTimeout(() => {
                questionButton.classList.remove("disabled");
                questionButton.disabled = false;
            }, 2500); // Через 3.5 секунды даём возможность перейти к следующему вопросу
        }

    }, 500); // Задержка перед показом правильного/неправильного ответа
}

function hideAllAnswers() {
    const allAnswers = document.querySelectorAll(".answer-block");
    allAnswers.forEach(block => {
        block.classList.add("hidden"); // Скрываем все ответы
    });

    // Переход к следующему вопросу или завершение викторины
    if (currentQuestionIndex === questions.length - 1) {
        endQuiz(); // Заканчиваем викторину
    }
}

function showExplanation(answer, answerBlock, explanation) {
    answerBlock.innerHTML = answer.text +'<br>Правильно!<br>' + explanation;
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        // questionButton.classList.add("hidden");
        showQuestion(questions[currentQuestionIndex]);
    } else {
        endQuiz();
    }
}

function endQuiz() {
    endMessage.classList.remove("hidden");
    scoreDisplay.innerText = `Вы ответили правильно на ${score} из ${questions.length} вопросов.`;
    scoreDisplay.classList.remove("hidden");

    // Меняем текст кнопки на "Перезапустить тест"
    questionButton.classList.remove("disabled");
    questionButton.disabled = false;
    questionButton.innerText = "Перезапустить тест";
    questionButton.addEventListener("click", () => location.reload());

    // Делаем каждый вопрос кликабельным для раскрытия правильного ответа
    const questionBlocks = document.querySelectorAll('.question-block');
    questionBlocks.forEach((questionBlock, index) => {
        questionBlock.addEventListener('click', () => toggleAnswer(questionBlock, index));
    });
}

// Раскрывание блоков в конце теста
function toggleAnswer(questionBlock, index) {
    let explanationBlock = questionBlock.querySelector('.explanation-block');
    // Ищем все блоки с объяснениями
    const allExplanationBlocks = document.querySelectorAll('.explanation-block');

    // Закрываем все открытые блоки, кроме текущего
    allExplanationBlocks.forEach(block => {
        if (block !== explanationBlock) {
            block.classList.remove('active');
        }
    });

    // Если блок уже существует, просто переключаем его видимость
    if (explanationBlock) {
        explanationBlock.classList.toggle('active');
    } else {
        // Если блока нет, создаем его и добавляем
        const correctAnswer = questions[index].answers.find(answer => answer.correct);
        const explanationHTML = `
            <div class="explanation-block active">
                <strong>Правильный ответ:</strong> ${correctAnswer.text} <br>
            </div>
        `;
        questionBlock.insertAdjacentHTML('beforeend', explanationHTML);
    }
}

// Перемешиваем вопросы
function shuffleQuestions(array) {
    return array.sort(() => Math.random() - 0.5);

}

// Обработчик собыития для кнопки
questionButton.addEventListener("click", () => {
    if (currentQuestionIndex === 0 && !isAnswered) {
        // Если это первый вопрос, скрываем начальный текст кнопки
        shuffleQuestions(questions);
        showQuestion(questions[currentQuestionIndex]);
    }
    else if (isAnswered) {
        // Переход к следующему вопросу после ответа
        nextQuestion();
    }
});
