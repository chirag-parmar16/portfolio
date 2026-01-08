/**
 * Chirag Parmar - Agency Landing Page (V12)
 */

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

    // --- Boot Sequence ---
    // --- Boot Sequence ---
    const loader = document.getElementById('terminalLoader');

    function initLoader() {
        gsap.registerPlugin(TextPlugin);

        // 1. System Data
        const now = new Date();
        document.getElementById('loadDate').textContent = now.toLocaleDateString();
        document.getElementById('loadTime').textContent = now.toLocaleTimeString();
        document.getElementById('loadRes').textContent = `${window.screen.width}x${window.screen.height}`;
        document.getElementById('loadLang').textContent = navigator.language;

        // Browser Detect
        const agent = navigator.userAgent;
        let browser = "Unknown";
        if (agent.indexOf("Chrome") > -1) browser = "Chrome";
        else if (agent.indexOf("Safari") > -1) browser = "Safari";
        else if (agent.indexOf("Firefox") > -1) browser = "Firefox";
        document.getElementById('loadBrowser').textContent = browser;

        // --- Scramble Effects ---
        // Decrypting the headers
        gsap.to("#headerTitle", {
            duration: 2,
            text: { value: "$ CONSOLE SETUP", scrambleText: { chars: "upperCase", speed: 0.3 } }
        });
        gsap.to("#headerRight", {
            duration: 2,
            text: { value: "$ PARSING DATA", scrambleText: { chars: "binary", speed: 0.3 } }
        });

        // 2. Sequence Logs
        const seqContainer = document.querySelector('.sequence-logs');
        const tasks = ["Configure network interfaces", "Configure link aggregation", "Configure VLAN interface", "Configure default route", "Reboot", "Shut Down"];

        // 3. Animation Timeline
        const tl = gsap.timeline({
            onComplete: () => {
                gsap.to(loader, { yPercent: -100, duration: 1, ease: "power4.inOut", delay: 0.5 });
                initSite();
            }
        });

        // Initial Logs
        tl.from(".col-left .log-group:first-child .log-line", { opacity: 0, x: -20, duration: 0.5, stagger: 0.1 });
        tl.from(".col-right .log-line", { opacity: 0, x: 20, duration: 0.5, stagger: 0.1 }, "<");

        // Sequence Tasks
        tasks.forEach((task, i) => {
            const div = document.createElement('div');
            div.className = 'log-line';
            div.innerHTML = `> ${String(i + 1).padStart(3, '0')} &nbsp;&nbsp; ${task}`;
            div.style.opacity = 0;
            seqContainer.appendChild(div);
            tl.to(div, { opacity: 1, duration: 0.1 }, ">0.1");
        });

        // --- Wavy Text ---
        // Split welcome text for wave animation
        const welcomeTitle = document.querySelector('.final-msg .log-title');
        // Simple manual split to avoid Splitting.js dependency
        const chars = welcomeTitle.innerText.split("").map(char => `<span style="display:inline-block">${char === " " ? "&nbsp;" : char}</span>`).join("");
        welcomeTitle.innerHTML = chars;

        tl.from(".final-msg", { opacity: 0, duration: 0.1 });
        tl.from(".final-msg .log-title span", {
            y: 10, opacity: 0, duration: 0.5, stagger: 0.05, ease: "back.out"
        });

        // Continuous Wave
        gsap.to(".final-msg .log-title span", {
            y: -5, duration: 0.5, stagger: { each: 0.05, repeat: -1, yoyo: true }, ease: "sine.inOut"
        });

        // Counter Animation
        const countObj = { val: 0 };
        tl.to(countObj, {
            val: 100, duration: 1.5, ease: "none",
            onUpdate: () => document.getElementById('loadCount').textContent = Math.floor(countObj.val)
        }, "<");
    }

    initLoader();

    // --- Animations ---
    function initSite() {
        // Mobile Navigation Toggle
        const mobileToggle = document.querySelector('.mobile-toggle');
        const navRight = document.querySelector('.nav-right');
        const navLinks = document.querySelectorAll('.nav-link');

        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                navRight.classList.toggle('active');
                mobileToggle.classList.toggle('active');
            });

            // Smooth Scroll
            gsap.registerPlugin(ScrollToPlugin);

            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();

                    const targetId = link.getAttribute('href');
                    if (targetId === '#') return;

                    // Close mobile menu first
                    navRight.classList.remove('active');
                    mobileToggle.classList.remove('active');

                    gsap.to(window, {
                        duration: 1.5,
                        scrollTo: { y: targetId, offsetY: 80 },
                        ease: "power3.inOut"
                    });
                });
            });
        }

        // Hero Parallax
        // Hero Parallax (Desktop Only)
        if (window.matchMedia("(min-width: 901px)").matches) {
            gsap.to('.hero-title', {
                scrollTrigger: {
                    trigger: '.hero-section',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                },
                y: 100, opacity: 0.5
            });
        }

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
                    if (num) num.textContent = visibleCount < 10 ? '0' + visibleCount : visibleCount;

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

            // Scroll to start of projects to avoid "merging" or layout jumps
            gsap.to(window, { duration: 0.5, scrollTo: { y: "#section-heading", offsetY: 80 } });
        });
    });

    // Trigger initial click on active tab (Full Stack) to set correct numbering/view
    const activeBtn = document.querySelector('.tab-btn.active');
    if (activeBtn) activeBtn.click();

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

    // --- Identity Hero Animation ---
    const roles = [
        "Full Stack Developer",
        "Logic-Driven Developer",
        "BCA Student"
    ];

    let roleTl = gsap.timeline({ repeat: -1 });
    roles.forEach(role => {
        roleTl.to("#dynamicRole", { duration: 1, text: role, ease: "none" })
            .to({}, { duration: 2 }) // Wait
            .to("#dynamicRole", { duration: 0.5, text: "", ease: "none" });
    });

    // --- Cursor Trail & Click Effect ---
    // Only on Desktop
    if (!window.matchMedia("(max-width: 900px)").matches) {
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

            // Outline follows with slight lag
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });
    }

    // Click Ripple
    window.addEventListener('click', (e) => {
        if (window.matchMedia("(max-width: 900px)").matches) return;

        const ripple = document.createElement('div');
        ripple.classList.add('click-ripple');
        document.body.appendChild(ripple);

        const size = 100;
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - size / 2}px`;
        ripple.style.top = `${e.clientY - size / 2}px`;

        gsap.to(ripple, {
            scale: 2, opacity: 0, duration: 0.6, onComplete: () => ripple.remove()
        });
    });

});
