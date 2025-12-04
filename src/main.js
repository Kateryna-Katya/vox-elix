document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Инициализация иконок (Lucide) ---
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- 2. Регистрация плагинов GSAP ---
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // --- 3. Плавный скролл (Lenis) ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // --- 4. Логика Хедера (Sticky Effect) ---
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 5. Мобильное меню ---
    const burger = document.querySelector('.header__burger');
    const nav = document.querySelector('.header__nav');
    const navLinks = document.querySelectorAll('.header__link');
    const body = document.body;

    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('active');
            burger.classList.toggle('is-active'); 
            
            // Блокируем скролл страницы при открытом меню
            if (nav.classList.contains('active')) {
                lenis.stop();
                body.style.overflow = 'hidden';
            } else {
                lenis.start();
                body.style.overflow = '';
            }
        });
    }

    // Закрытие меню при клике на ссылку
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            burger.classList.remove('is-active');
            lenis.start();
            body.style.overflow = '';
        });
    });

    // --- 6. Анимация Hero-секции (GSAP Creative) ---
    initHeroAnimation();

});

// Функция анимации Hero
function initHeroAnimation() {
    const heroTitle = document.querySelector('.hero__title');
    if (!heroTitle) return;

    // 1. Разбиваем текст
    // Используем try-catch на случай, если SplitType не загрузился
    try {
        const textSplit = new SplitType('[data-split]', {
            types: 'words, chars',
            tagName: 'span'
        });
    } catch (e) {
        console.warn('SplitType not loaded', e);
    }

    // 2. Таймлайн
    const tl = gsap.timeline({
        defaults: { ease: 'power3.out' }
    });

    // 3. Сценарий анимации
    tl
    // Бейдж
    .to('.hero__badge', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.1
    })
    // Заголовок (буквы)
    .to('.hero__title .char', {
        y: 0,
        opacity: 1,
        stagger: 0.02, 
        duration: 1
    }, '-=0.5')
    // Описание (слова)
    .to('.hero__desc .word', {
        y: 0,
        opacity: 1,
        stagger: 0.01,
        duration: 0.8
    }, '-=0.8')
    // Кнопки и статистика
    .to(['.hero__actions', '.hero__stats'], {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 0.8
        // ClearProps УДАЛЕН, чтобы элементы не исчезали
    }, '-=0.6');

    // 4. Parallax эффект мыши
    const glow1 = document.querySelector('.hero__glow--1');
    const glow2 = document.querySelector('.hero__glow--2');

    if (glow1 && glow2) {
        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.pageX) / 25;
            const y = (window.innerHeight / 2 - e.pageY) / 25;

            gsap.to(glow1, { x: x, y: y, duration: 2, ease: 'power2.out' });
            gsap.to(glow2, { x: -x, y: -y, duration: 2.5, ease: 'power2.out' });
        });
    }
}