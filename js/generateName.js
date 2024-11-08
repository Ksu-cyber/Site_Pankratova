function generateName() {
    const names = ["Патрик", "Персик", "Пинки", "Мила", "Агата", "Шнаппи", "Барон", "Джекки", "Зиги", "Бакс", "Чарли", "Лаки", "Ральф", "Рокси", "Грейс", "Оливка"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    document.getElementById("nameDisplay").textContent = randomName;
}