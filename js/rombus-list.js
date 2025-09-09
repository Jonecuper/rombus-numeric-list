// scripts/rombus-list.js

// Вставляем CSS в <head> при первом запуске
let cssInjected = false;

function injectStyles() {
  if (cssInjected) return;
  cssInjected = true;

  const style = document.createElement('style');
  style.id = 'romb-ol-styles';
  style.textContent = `
        .romb-ol {
            list-style: none;
            padding: 0;
            margin: 0;
            counter-reset: step-counter calc(var(--start, 1) - 1);
        }
        .romb-ol > li {
            display: grid;
            grid-template-columns: 60px 1fr;
            gap: 10px;
            align-items: center;
            /* align-items: start; */
            margin-bottom: 2rem;
        }
        .romb-ol .romb-ol__step-icon {
            counter-increment: step-counter;
            position: relative;
            width: 45px;
            height: 45px;
            line-height: 45px;
            text-align: center;
            background: #F0F8FE;
            border-radius: 5px;
            border: #007fbd 1px solid;
            transform: rotate(45deg);
            font-family: var(--font-family-rubik);
            color: #007fbe;
            display: block;
        }
        .romb-ol .romb-ol__step-icon::after {
            content: counter(step-counter);
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            width: 100%;
            text-align: center;
            font-size: 1em;
            line-height: 1;
        }
    `;
  document.head.appendChild(style);
}

// Основная функция
export function initRombusLists() {
  injectStyles(); // Вставляем стили

  document.querySelectorAll('ol.romb-ol').forEach((list) => {
    const start = parseInt(list.dataset.start) || 1;
    list.style.setProperty('--start', start);

    list.querySelectorAll('.romb-ol__step-icon').forEach((icon) => icon.remove());

    list.querySelectorAll('li').forEach((li) => {
      const icon = document.createElement('span');
      icon.className = 'romb-ol__step-icon';
      li.prepend(icon);
    });
  });
}

document.addEventListener('DOMContentLoaded', initRombusLists);
export default initRombusLists;
