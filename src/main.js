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

    // --- 6. Запуск основных анимаций ---
    initHeroAnimation();
    initScrollAnimations();
    initFormValidation();
    initCookiePopup();

});

// ==========================================
// ФУНКЦИИ АНИМАЦИИ И ЛОГИКИ
// ==========================================

// A. Анимация Hero (Главный экран)
function initHeroAnimation() {
    const heroTitle = document.querySelector('.hero__title');
    if (!heroTitle) return;

    try {
        const textSplit = new SplitType('[data-split]', {
            types: 'words, chars',
            tagName: 'span'
        });
    } catch (e) {
        console.warn('SplitType library missing or error', e);
    }

    const tl = gsap.timeline({
        defaults: { ease: 'power3.out' }
    });

    tl
    .to('.hero__badge', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.1
    })
    .to('.hero__title .char', {
        y: 0,
        opacity: 1,
        stagger: 0.02, 
        duration: 1
    }, '-=0.5')
    .to('.hero__desc .word', {
        y: 0,
        opacity: 1,
        stagger: 0.01,
        duration: 0.8
    }, '-=0.8')
    .to(['.hero__actions', '.hero__stats'], {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 0.8
    }, '-=0.6');

    // Parallax эффект мыши
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

// B. Анимации при скролле (ScrollTrigger)
function initScrollAnimations() {
    
    // 1. Анимация карточек Bento (Методология)
    const cards = gsap.utils.toArray('.reveal-card');
    cards.forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 90%', // Срабатывает раньше
                toggleActions: 'play none none reverse'
            },
            y: 40,
            opacity: 0,
            duration: 0.6,
            delay: 0
        });
    });

    // 2. Анимация списка Инноваций
    const listItems = document.querySelectorAll('.innovation__list li');
    if (listItems.length > 0) {
        gsap.from(listItems, {
            scrollTrigger: {
                trigger: '.innovation__list',
                start: 'top 85%',
            },
            x: -30,
            opacity: 0,
            stagger: 0.1, // Быстрее stagger
            duration: 0.6
        });
    }

    // 3. Анимация Тарифов (Программы) - ИСПРАВЛЕНО
    // Теперь анимируем каждую карточку отдельно, чтобы на мобайле не было "дыр"
    const programs = gsap.utils.toArray('.reveal-program');
    programs.forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card, // Триггер - сама карточка
                start: 'top 95%', // Срабатывает, как только чуть-чуть появляется
                toggleActions: 'play none none reverse'
            },
            y: 30, // Меньше движения
            opacity: 0,
            duration: 0.6, // Быстрее
            ease: 'power2.out'
        });
    });

    // 4. Анимация секции "О нас"
    const aboutVisual = document.querySelector('.reveal-left');
    const aboutContent = document.querySelector('.reveal-right');
    
    if (aboutVisual) {
        gsap.from(aboutVisual, {
            scrollTrigger: {
                trigger: '#about',
                start: 'top 80%',
            },
            x: -50,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
    }
    
    if (aboutContent) {
        gsap.from(aboutContent, {
            scrollTrigger: {
                trigger: '#about',
                start: 'top 80%',
            },
            x: 50,
            opacity: 0,
            duration: 0.8,
            delay: 0.1,
            ease: 'power2.out'
        });
    }

    // 5. Анимация блога
    const blogItems = gsap.utils.toArray('.reveal-item');
    blogItems.forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 90%', // Раньше
            },
            y: 40,
            opacity: 0,
            duration: 0.6
        });
    });
}

// C. Валидация формы и отправка
function initFormValidation() {
    const form = document.getElementById('contactForm');
    const phoneInput = document.getElementById('phone');
    const successMsg = document.getElementById('formSuccess');
    const submitBtn = document.querySelector('.form__btn');
    const captchaLabel = document.getElementById('captchaLabel');
    const captchaInput = document.getElementById('captcha');

    if (!form) return;

    // 1. Строгая маска телефона (Только цифры)
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
            document.getElementById('phoneError').textContent = '';
            phoneInput.classList.remove('error');
        });
    }

    // 2. Генерация Math Captcha
    let num1 = Math.floor(Math.random() * 10) + 1;
    let num2 = Math.floor(Math.random() * 10) + 1;
    let captchaResult = num1 + num2;
    
    if (captchaLabel) {
        captchaLabel.textContent = `Сколько будет ${num1} + ${num2}?`;
    }

    // 3. Обработка отправки
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        
        // Валидация длины телефона
        if (phoneInput.value.length < 7) {
            document.getElementById('phoneError').textContent = 'Минимум 7 цифр';
            phoneInput.classList.add('error');
            isValid = false;
        }

        // Валидация капчи
        if (parseInt(captchaInput.value) !== captchaResult) {
            document.getElementById('captchaError').textContent = 'Неверный ответ';
            captchaInput.classList.add('error');
            isValid = false;
        } else {
            document.getElementById('captchaError').textContent = '';
            captchaInput.classList.remove('error');
        }

        if (isValid) {
            // Имитация отправки
            const btnText = submitBtn.querySelector('span');
            const originalText = btnText.textContent;
            
            btnText.textContent = 'Отправка...';
            submitBtn.disabled = true;

            setTimeout(() => {
                form.reset();
                btnText.textContent = originalText;
                submitBtn.disabled = false;
                
                successMsg.style.display = 'flex';
                
                num1 = Math.floor(Math.random() * 10) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
                captchaResult = num1 + num2;
                captchaLabel.textContent = `Сколько будет ${num1} + ${num2}?`;

                setTimeout(() => {
                    successMsg.style.display = 'none';
                }, 5000);

            }, 1500);
        }
    });
}

// D. Cookie Popup
function initCookiePopup() {
    const cookiePopup = document.getElementById('cookiePopup');
    const cookieAccept = document.getElementById('cookieAccept');

    if (cookiePopup && !localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookiePopup.classList.add('show');
        }, 2000);
    }

    if (cookieAccept) {
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookiePopup.classList.remove('show');
        });
    }
}