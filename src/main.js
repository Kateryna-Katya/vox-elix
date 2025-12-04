document.addEventListener('DOMContentLoaded', () => {
    // 1. Инициализация иконок Lucide
    lucide.createIcons();

    // 2. Lenis Smooth Scroll (Плавный скролл)
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

    // 3. Header Scroll Effect (Изменение фона при скролле)
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 4. Mobile Menu Logic
    const burger = document.querySelector('.header__burger');
    const nav = document.querySelector('.header__nav');
    
    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('active');
            
            // Анимация иконки бургера (простой вариант)
            burger.classList.toggle('is-active');
        });
    }

    // Закрытие меню при клике на ссылку
    const navLinks = document.querySelectorAll('.header__link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            burger.classList.remove('is-active');
        });
    });
});