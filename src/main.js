document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    gsap.registerPlugin(ScrollTrigger);

    // --- 1. МОБИЛЬНОЕ МЕНЮ ---
    const burger = document.querySelector('#burger-menu');
    const mobileMenu = document.querySelector('#mobile-menu');
    const header = document.querySelector('#header');
    const menuLinks = document.querySelectorAll('.mobile-menu__link');

    const toggleMenu = () => {
        const isOpen = mobileMenu.classList.toggle('active');
        header.classList.toggle('menu-open');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    if (burger) burger.addEventListener('click', toggleMenu);
    menuLinks.forEach(link => link.addEventListener('click', toggleMenu));

    // --- 2. HERO АНИМАЦИЯ (С ФИКСОМ РАЗРЫВА СЛОВ) ---
    const heroTitle = document.querySelector('.hero__title');
    if (heroTitle) {
        // Указываем и words, и chars для правильной структуры CSS
        const split = new SplitType(heroTitle, { types: 'words, chars' });
        
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
        
        tl.to('.hero__badge', { opacity: 1, y: 0, duration: 0.8 })
          .from(split.chars, { 
                opacity: 0, 
                y: 50, 
                stagger: 0.02, 
                duration: 0.8 
          }, '-=0.4')
          .to('.hero__text, .hero__btns', { 
                opacity: 1, 
                y: 0, 
                duration: 0.8, 
                stagger: 0.2 
          }, '-=0.6');
    }

    // --- 3. ЛОГИКА REVEAL ДЛЯ ВСЕХ ЭЛЕМЕНТОВ ---
    const setupReveal = () => {
        const elements = document.querySelectorAll('.reveal-each');
        elements.forEach((el) => {
            gsap.fromTo(el, 
                { opacity: 0, y: 40 }, 
                {
                    opacity: 1, y: 0, duration: 1,
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                    }
                }
            );
        });
    };
    setupReveal();

    // --- 4. ВАЛИДАЦИЯ ТЕЛЕФОНА ---
    const phoneInput = document.querySelector('#phone-input');
    phoneInput?.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^\d+]/g, '');
    });

    // --- 5. КАПЧА И ОТПРАВКА ФОРМЫ ---
    const form = document.querySelector('#main-form');
    if (form) {
        const n1 = Math.floor(Math.random() * 10);
        const n2 = Math.floor(Math.random() * 5);
        const sum = n1 + n2;
        const captchaLabel = document.querySelector('#captcha-label');
        if (captchaLabel) captchaLabel.innerText = `Решите пример: ${n1} + ${n2} = ?`;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const captchaVal = document.querySelector('#captcha-input').value;
            const success = document.querySelector('#form-success');
            const error = document.querySelector('#form-error');

            if (parseInt(captchaVal) === sum) {
                success.style.display = 'block';
                error.style.display = 'none';
                form.reset();
                form.style.opacity = '0.5';
                form.style.pointerEvents = 'none';
            } else {
                error.style.display = 'block';
                success.style.display = 'none';
                gsap.to('#captcha-input', { x: 10, repeat: 3, yoyo: true, duration: 0.1 });
            }
        });
    }

    // --- 6. COOKIE POPUP ---
    const cookiePopup = document.querySelector('#cookie-popup');
    if (cookiePopup && !localStorage.getItem('yield_cookies_accepted')) {
        setTimeout(() => cookiePopup.classList.add('show'), 2000);
    }
    document.querySelector('#accept-cookies')?.addEventListener('click', () => {
        localStorage.setItem('yield_cookies_accepted', 'true');
        cookiePopup.classList.remove('show');
    });

    // --- 7. СЧЕТЧИКИ (С КОРРЕКТНЫМ ПЕРЕБОРОМ) ---
    document.querySelectorAll('.stat-item__num').forEach(counter => {
        const target = +counter.getAttribute('data-count');
        ScrollTrigger.create({
            trigger: counter,
            start: 'top 92%',
            onEnter: () => {
                let count = 0;
                const update = () => {
                    if (count < target) {
                        count += target / 60;
                        counter.innerText = Math.ceil(count);
                        requestAnimationFrame(update);
                    } else counter.innerText = target;
                };
                update();
            },
            once: true
        });
    });

    // --- 8. ХЕДЕР ПРИ СКРОЛЛЕ ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '10px 0';
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
        } else {
            header.style.padding = '0';
            header.style.background = 'var(--glass)';
            header.style.boxShadow = 'none';
        }
    });
});