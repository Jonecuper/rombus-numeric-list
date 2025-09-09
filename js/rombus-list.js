// rombus-list.js

class RombusList extends HTMLElement {
    static get observedAttributes() {
        return ['start', 'bg-color', 'text-color', 'border-color', 'border', 'font-weight' ];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.observeListChanges();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    getAttributeOrFallback(attr, fallback) {
        const value = this.getAttribute(attr);
        return value !== null ? value.trim() : fallback;
    }

    render() {
        const start = parseInt(this.getAttribute('start')) || 1;
        const bgColor = this.getAttributeOrFallback('bg-color', '#F0F8FE');
        const textColor = this.getAttributeOrFallback('text-color', '#007fbe');
        const borderColor = this.getAttributeOrFallback('border-color', '#007fbd');
        const hasBorder = this.getAttributeOrFallback('border', 'true') === 'true';
        const fontWeight = this.getAttributeOrFallback('font-weight', '300');

        // Очищаем shadow DOM
        this.shadowRoot.innerHTML = '';

        // Встраиваем стили
        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                font-family: var(--font-family, 'Segoe UI', sans-serif);
                line-height: 1.5;
            }

            ol {
                list-style: none;
                padding: 0;
                margin: 0;
                counter-reset: step-counter calc(${start} - 1);
            }

            ol > li {
                display: grid;
                grid-template-columns: 60px 1fr;
                gap: 10px;
                align-items: center;
                margin-bottom: 2rem;
            }

            .romb-ol__step-icon {
                counter-increment: step-counter;
                position: relative;
                width: 45px;
                height: 45px;
                line-height: 45px;
                text-align: center;
                background: ${bgColor};
                border-radius: 5px;
                ${hasBorder ? `border: 1px solid ${borderColor};` : 'border: none;'}
                transform: rotate(45deg);
                color: ${textColor};
                font-family: 'Rubik', 'Segoe UI', sans-serif;
                font-weight: ${fontWeight};
                display: block;
            }

            .romb-ol__step-icon::after {
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
        this.shadowRoot.appendChild(style);

        // Создаём <ol>
        const ol = document.createElement('ol');

        // Копируем <li> из light DOM
        this.childNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'li') {
                const li = document.createElement('li');

                const icon = document.createElement('span');
                icon.className = 'romb-ol__step-icon';
                li.appendChild(icon);

                // Клонируем содержимое <li>
                Array.from(node.childNodes).forEach(child => {
                    li.appendChild(child.cloneNode(true));
                });

                ol.appendChild(li);
            }
        });

        this.shadowRoot.appendChild(ol);
    }

    observeListChanges() {
        const observer = new MutationObserver(() => {
            this.render();
        });

        observer.observe(this, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }
}

// Регистрируем элемент
customElements.define('rombus-list', RombusList);