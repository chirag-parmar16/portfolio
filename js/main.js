/**
 * Chirag Parmar - Agency Landing Page (V12)
 */

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

    // --- Boot Sequence ---
    const loader = document.getElementById('terminalLoader');
    const text = document.getElementById('terminalText');
    const message = "Initializing_Digital_Reality...";
    let i = 0;

    function typeWriter() {
        if(i < message.length) {
            text.innerHTML += message.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        } else {
             gsap.to(loader, {
                yPercent: -100, duration: 1, ease: "power4.inOut", delay: 0.5
             });
             initSite();
        }
    }
    setTimeout(typeWriter, 500);

    // --- Animations ---
    function initSite() {
        
        // Hero Parallax
        gsap.to('.hero-title', {
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            },
            y: 100, opacity: 0.5
        });

        // Project Reveals
        gsap.utils.toArray('.project-feature').forEach(proj => {
            gsap.from(proj, {
                scrollTrigger: {
                    trigger: proj,
                    start: 'top 80%'
                },
                y: 50, opacity: 0, duration: 1, ease: 'power3.out'
            });
        });

        // About Reveal
        gsap.from('.about-grid', {
            scrollTrigger: {
                trigger: '.about-section',
                start: 'top 75%'
            },
            y: 30, opacity: 0, duration: 0.8
        });

    }

    // --- Project Filtering ---
    const filterBtns = document.querySelectorAll('.tab-btn');
    const projects = document.querySelectorAll('.project-feature');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            let visibleCount = 0;
            projects.forEach(project => {
                if (filterValue === 'all' || project.getAttribute('data-category') === filterValue) {
                    project.style.display = 'flex';
                    // Update number
                    visibleCount++;
                    const num = project.querySelector('.p-num');
                    if(num) num.textContent = visibleCount < 10 ? '0' + visibleCount : visibleCount;
                    
                    // Enforce Alternating Layout (Zig-Zag)
                    if (visibleCount % 2 === 0) {
                        project.classList.add('reverse');
                    } else {
                        project.classList.remove('reverse');
                    }

                    // Re-trigger GSAP animation or reset opacity for smoother feel
                    gsap.fromTo(project, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
                } else {
                    project.style.display = 'none';
                }
            });
            
            // Re-refresh ScrollTrigger if needed, but display changes might handle it.
            ScrollTrigger.refresh();
        });
    });

    // Trigger initial click on active tab (Full Stack) to set correct numbering/view
    const activeBtn = document.querySelector('.tab-btn.active');
    if(activeBtn) activeBtn.click();

    // --- Hover Tilt for Mockups ---
    const features = document.querySelectorAll('.project-feature');
    features.forEach(feature => {
        const mockup = feature.querySelector('.mockup-window');
        
        feature.addEventListener('mousemove', (e) => {
            // Disabled on mobile/touch
            if (window.matchMedia("(max-width: 900px)").matches) return;

            const rect = feature.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            gsap.to(mockup, {
                rotationY: x * 10,
                rotationX: -y * 10,
                duration: 0.5
            });
        });

        feature.addEventListener('mouseleave', () => {
             // Reset to default css transform (handled by class, but let's clear inline style)
             // On mobile we don't reset because we don't tilt
             if (window.matchMedia("(max-width: 900px)").matches) return;

             gsap.to(mockup, {
                rotationY: feature.classList.contains('reverse') ? 10 : -10,
                rotationX: 5,
                duration: 0.5
             });
        });
    });

    // --- Cursor Trail & Click Effect ---
    // Create Elements
    const cursorDot = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    const cursorOutline = document.createElement('div');
    cursorOutline.classList.add('cursor-outline');
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with slight lag (via CSS transition/animation or GSAP)
        // Using animate for smooth trailing
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Click Ripple
    window.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.classList.add('click-ripple');
        document.body.appendChild(ripple);
        
        const size = 100;
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - size/2}px`;
        ripple.style.top = `${e.clientY - size/2}px`;

        gsap.to(ripple, {
            scale: 2, opacity: 0, duration: 0.6, onComplete: () => ripple.remove()
        });
    });

});
