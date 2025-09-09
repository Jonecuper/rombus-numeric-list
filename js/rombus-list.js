// Уникальный ID, чтобы не подключать CSS дважды
const CSS_ID = 'romb-ol-styles';
// const CSS_PATH = './../css/rombus-list.css'; // путь к CSS
// Получаем путь к текущему JS-файлу
const currentDir = new URL('.', import.meta.url).pathname;

// Формируем путь к CSS относительно текущего файла
// Например: /project/js/ -> /project/css/
const CSS_PATH = currentDir.replace(/js\/?$/, 'css/') + 'rombus-list.css';

async function loadCSS() {
    // Проверяем, не загружен ли уже CSS
    if (document.head.querySelector(`#${CSS_ID}`)) {
        return;
    }

    // Создаём <link>
    const link = document.createElement('link');
    link.id = CSS_ID;
    link.rel = 'stylesheet';
    link.href = CSS_PATH;

    // Добавляем в <head>
    document.head.appendChild(link);

    // Ждём, пока CSS загрузится
    await new Promise((resolve, reject) => {
        link.onload = resolve;
        link.onerror = () => reject(new Error(`Не удалось загрузить ${CSS_PATH}`));
    });
}

// Основная функция инициализации
export async function initRombusLists() {
    await loadCSS(); // Сначала загружаем стили

    document.querySelectorAll('ol.romb-ol').forEach(list => {
        const start = parseInt(list.dataset.start) || 1;
        list.style.setProperty('--start', start);

        // Удаляем старые иконки
        list.querySelectorAll('.romb-ol__step-icon').forEach(icon => icon.remove());

        // Добавляем ромб в каждый <li>
        list.querySelectorAll('li').forEach(li => {
            const icon = document.createElement('span');
            icon.className = 'romb-ol__step-icon';
            li.prepend(icon);
        });
    });
}

// Запускаем после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    initRombusLists().catch(console.error);
});

export default initRombusLists;