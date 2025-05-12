document.addEventListener('DOMContentLoaded', function() {
    // Contador de relación
    const startDate = new Date('2024-11-11T20:30:00');
    
    function updateCounter() {
        const now = new Date();
        const diff = now - startDate;
        
        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
        const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30.44));
        const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('years').textContent = years;
        document.getElementById('months').textContent = months;
        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    setInterval(updateCounter, 1000);
    updateCounter();

    // Scroll suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Corazones al hacer click
    document.addEventListener('click', function(e) {
        if (e.target.closest('button, a')) return;
        createHeart(e.clientX, e.clientY);
    });
    
    function createHeart(x, y) {
        const heart = document.createElement('div');
        heart.className = 'heart-animation';
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 2000);
    }

    // Tooltip functionality
    const tooltip = document.getElementById('tooltip');
    let tooltipTimeout;

    function showTooltip(event, text) {
        clearTimeout(tooltipTimeout);
        
        tooltip.textContent = text;
        tooltip.style.left = `${event.clientX + 20}px`;
        tooltip.style.top = `${event.clientY - 20}px`;
        tooltip.style.opacity = '1';
        
        document.addEventListener('mousemove', moveTooltip);
        
        tooltipTimeout = setTimeout(() => {
            tooltip.style.opacity = '0';
            document.removeEventListener('mousemove', moveTooltip);
        }, 3000);
    }
    
    function moveTooltip(event) {
        tooltip.style.left = `${event.clientX + 20}px`;
        tooltip.style.top = `${event.clientY - 20}px`;
    }
    
    document.querySelectorAll('.hobby-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            const dato = icon.getAttribute('data-dato');
            showTooltip(e, dato);
        });
    });
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.hobby-icon')) {
            tooltip.style.opacity = '0';
            clearTimeout(tooltipTimeout);
            document.removeEventListener('mousemove', moveTooltip);
        }
    });

    // Control del flipbook
    const flipbookIframe = document.getElementById('flipbookIframe');
    if (flipbookIframe) {
        flipbookIframe.addEventListener('load', function() {
            try {
                const navControl = (direction) => {
                    flipbookIframe.contentWindow.postMessage(`flipbook:${direction}Page`, '*');
                    animateSunflower(`.${direction}-btn .mini-sunflower`);
                };
                
                document.getElementById('prevBtn').addEventListener('click', () => navControl('prev'));
                document.getElementById('nextBtn').addEventListener('click', () => navControl('next'));
                
                window.addEventListener('message', (event) => {
                    if (event.data === 'flipbook:pageChanged') {
                        animateSunflower('.flipbook-nav .mini-sunflower');
                    }
                });
            } catch (e) {
                console.error("Flipbook error:", e);
            }
        });
    }
});