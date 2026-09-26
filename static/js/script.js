document.addEventListener('DOMContentLoaded', () => {
    const recipientInput = document.getElementById('recipient-input');
    const senderInput = document.getElementById('sender-input');
    const messageInput = document.getElementById('message-input');
    const fontSelect = document.getElementById('font-select');
    const charCounter = document.getElementById('char-counter');
    const btnResetPreset = document.getElementById('btn-reset-preset');

    const cardContainer = document.getElementById('live-card-container');
    const cardHindiHeading = document.getElementById('card-hindi-heading');
    const cardEnglishHeading = document.getElementById('card-english-heading');
    const cardRecipientLine = document.getElementById('card-recipient-line');
    const cardMessageBody = document.getElementById('card-message-body');
    const cardSenderLine = document.getElementById('card-sender-line');

    const toggleDiyaGlow = document.getElementById('toggle-diya-glow');
    const toggleParticles = document.getElementById('toggle-particles');
    const toggleShimmer = document.getElementById('toggle-shimmer');

    const btnDownloadClient = document.getElementById('btn-download-client');
    const btnDownloadServer = document.getElementById('btn-download-server');
    const btnShareWhatsapp = document.getElementById('btn-share-whatsapp');
    const btnCopyMessage = document.getElementById('btn-copy-message');

    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    const DEFAULT_MESSAGE = "On this auspicious Vijayadashami, may the light of goodness shine brightly in your life, bringing peace to your heart, happiness to your home, and prosperity to your journey. May every challenge turn into an opportunity and every new beginning bring success. Wishing you and your loved ones a beautiful and blessed Dussehra!";

    let activeTemplate = 'royal_gold';
    let particlesEnabled = true;

    function updateLiveCard() {
        const recipient = recipientInput.value.trim() || 'Dear Family & Friends';
        const sender = senderInput.value.trim() || 'Dan Babi';
        const message = messageInput.value.trim() || DEFAULT_MESSAGE;
        const fontStyle = fontSelect.value;

        charCounter.textContent = `${messageInput.value.length} / 250`;

        cardRecipientLine.textContent = `To: ${recipient}`;
        cardMessageBody.textContent = message;
        cardSenderLine.textContent = `— With Warm Regards, ${sender}`;

        cardContainer.className = `greeting-card-surface template-${activeTemplate} font-${fontStyle}`;

        const diyas = cardContainer.querySelectorAll('.diya-element');
        diyas.forEach(diya => {
            if (toggleDiyaGlow.checked) {
                diya.classList.add('glow-effect');
            } else {
                diya.classList.remove('glow-effect');
            }
        });

        if (toggleShimmer.checked) {
            cardHindiHeading.classList.add('shimmer-effect');
        } else {
            cardHindiHeading.classList.remove('shimmer-effect');
        }
    }

    recipientInput.addEventListener('input', updateLiveCard);
    senderInput.addEventListener('input', updateLiveCard);
    messageInput.addEventListener('input', updateLiveCard);
    fontSelect.addEventListener('change', updateLiveCard);
    toggleDiyaGlow.addEventListener('change', updateLiveCard);
    toggleShimmer.addEventListener('change', updateLiveCard);
    
    toggleParticles.addEventListener('change', () => {
        particlesEnabled = toggleParticles.checked;
        const cardCanvas = document.getElementById('card-particle-canvas');
        if (cardCanvas) {
            cardCanvas.style.display = particlesEnabled ? 'block' : 'none';
        }
    });

    btnResetPreset.addEventListener('click', () => {
        recipientInput.value = 'Dear Family & Friends';
        senderInput.value = 'Dan Babi';
        messageInput.value = DEFAULT_MESSAGE;
        updateLiveCard();
        showToast('Reset to default Dussehra blessing! 🪔', 'fa-solid fa-rotate-left');
    });

    const templateOptions = document.querySelectorAll('.template-option');

    templateOptions.forEach(option => {
        option.addEventListener('click', () => {
            templateOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            const radio = option.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;

            activeTemplate = option.getAttribute('data-template');
            updateLiveCard();
        });
    });

    const btnApplyTemplates = document.querySelectorAll('.btn-apply-template');
    btnApplyTemplates.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const selectedTmpl = btn.getAttribute('data-template');
            activeTemplate = selectedTmpl;

            templateOptions.forEach(opt => {
                const isMatch = opt.getAttribute('data-template') === selectedTmpl;
                opt.classList.toggle('active', isMatch);
                const radio = opt.querySelector('input[type="radio"]');
                if (radio) radio.checked = isMatch;
            });

            updateLiveCard();
            showToast(`Applied Template: ${selectedTmpl.replace('_', ' ').toUpperCase()} ✨`, 'fa-solid fa-wand-magic-sparkles');

            document.getElementById('generator').scrollIntoView({ behavior: 'smooth' });
        });
    });

    btnDownloadClient.addEventListener('click', async () => {
        const originalText = btnDownloadClient.innerHTML;
        btnDownloadClient.disabled = true;
        btnDownloadClient.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Rendering HD Card...';

        try {
            await renderAndDownloadCanvas();
            showToast('Greeting Card Downloaded Successfully! ⬇️', 'fa-solid fa-circle-check');
        } catch (err) {
            console.error('Canvas export error:', err);
            showToast('Fallback to Pillow HD Download...', 'fa-solid fa-triangle-exclamation');
            downloadViaServer();
        } finally {
            btnDownloadClient.disabled = false;
            btnDownloadClient.innerHTML = originalText;
        }
    });

    async function renderAndDownloadCanvas() {
        const canvas = document.getElementById('export-canvas');
        const ctx = canvas.getContext('2d');
        const width = 1080;
        const height = 1350;

        ctx.clearRect(0, 0, width, height);

        const bgImg = new Image();
        bgImg.crossOrigin = 'anonymous';
        bgImg.src = `/static/images/${activeTemplate}_bg.jpg`;

        await new Promise((resolve, reject) => {
            bgImg.onload = resolve;
            bgImg.onerror = () => reject(new Error('Failed to load template background image'));
        });

        ctx.drawImage(bgImg, 0, 0, width, height);

        const panelMargin = 100;
        const panelTop = 330;
        const panelBottom = 1170;
        const panelWidth = width - (panelMargin * 2);
        const panelHeight = panelBottom - panelTop;

        ctx.save();
        ctx.fillStyle = activeTemplate === 'divine_light' ? 'rgba(16, 10, 12, 0.72)' :
                        activeTemplate === 'festive_heritage' ? 'rgba(56, 5, 16, 0.75)' : 'rgba(38, 4, 10, 0.78)';
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.7)';
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.roundRect(panelMargin, panelTop, panelWidth, panelHeight, 24);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.textAlign = 'center';
        ctx.fillStyle = '#f3e5ab';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 4;
        ctx.font = 'bold 64px "Rozha One", "Tiro Devanagari Hindi", serif';
        ctx.fillText('शुभ विजयादशमी', width / 2, 160);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 38px "Cinzel", serif';
        ctx.fillText('HAPPY DUSSEHRA', width / 2, 230);

        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(width / 2 - 140, 265);
        ctx.lineTo(width / 2 + 140, 265);
        ctx.stroke();
        ctx.restore();

        const recipient = recipientInput.value.trim() || 'Dear Family & Friends';
        ctx.save();
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffe599';
        ctx.font = '600 32px "Poppins", sans-serif';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 6;
        ctx.fillText(`To: ${recipient}`, width / 2, panelTop + 55);

        const message = messageInput.value.trim() || DEFAULT_MESSAGE;
        ctx.fillStyle = '#fdfbf7';
        ctx.font = '28px "Cormorant Garamond", "Poppins", serif';

        const maxTextWidth = panelWidth - 80;
        const words = message.split(' ');
        let line = '';
        let lines = [];

        for (let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + ' ';
            let metrics = ctx.measureText(testLine);
            if (metrics.width > maxTextWidth && n > 0) {
                lines.push(line.trim());
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line.trim());

        let startY = panelTop + 130;
        const lineHeight = 40;

        lines.slice(0, 11).forEach((l, i) => {
            ctx.fillText(l, width / 2, startY + (i * lineHeight));
        });

        const bY = panelBottom - 140;
        ctx.fillStyle = '#c8bdab';
        ctx.font = '24px "Poppins", sans-serif';
        ctx.fillText('Wishing You & Your Family', width / 2, bY);

        ctx.fillStyle = '#ffe599';
        ctx.font = '600 30px "Cinzel", "Poppins", serif';
        ctx.fillText('A Joyful, Blessed & Prosperous Dussehra', width / 2, bY + 45);

        const sender = senderInput.value.trim() || 'Dan Babi';
        ctx.fillStyle = '#f3e5ab';
        ctx.font = 'bold 36px "Poppins", sans-serif';
        ctx.shadowColor = 'rgba(0,0,0,0.9)';
        ctx.shadowBlur = 8;
        ctx.fillText(`— With Warm Regards, ${sender}`, width / 2, panelBottom + 65);
        ctx.restore();

        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `Dussehra_Greeting_${activeTemplate}_${recipient.replace(/\s+/g, '_')}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    btnDownloadServer.addEventListener('click', downloadViaServer);

    async function downloadViaServer() {
        const originalText = btnDownloadServer.innerHTML;
        btnDownloadServer.disabled = true;
        btnDownloadServer.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Pillow...';

        try {
            const payload = {
                recipient: recipientInput.value.trim(),
                sender: senderInput.value.trim(),
                message: messageInput.value.trim(),
                template: activeTemplate
            };

            const response = await fetch('/api/generate-card', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Pillow generator endpoint returned an error');

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `Dussehra_Greeting_HD_${payload.recipient.replace(/\s+/g, '_')}.png`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(downloadUrl);

            showToast('Downloaded High-Res Pillow PNG Card! 🐍🖼️', 'fa-solid fa-circle-check');
        } catch (err) {
            console.error('Server download error:', err);
            showToast('Could not reach Pillow backend, rendered client-side PNG!', 'fa-solid fa-circle-info');
            renderAndDownloadCanvas();
        } finally {
            btnDownloadServer.disabled = false;
            btnDownloadServer.innerHTML = originalText;
        }
    }

    btnShareWhatsapp.addEventListener('click', () => {
        const recipient = recipientInput.value.trim();
        const sender = senderInput.value.trim();
        
        let shareText = `Happy Dussehra! 🪔🏹\nMay this Vijayadashami bring happiness, peace, prosperity and beautiful new beginnings to ${recipient || 'you and your family'}.\n\nWishing you a blessed and joyful Dussehra!\n— ${sender || 'Warm Regards'}`;

        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
        window.open(whatsappUrl, '_blank');
        showToast('Opening WhatsApp to share greeting... 💬', 'fa-brands fa-whatsapp');
    });

    btnCopyMessage.addEventListener('click', () => {
        const message = messageInput.value.trim() || DEFAULT_MESSAGE;
        const sender = senderInput.value.trim() || 'Dan Babi';
        const recipient = recipientInput.value.trim() || 'Family & Friends';

        const fullText = `Happy Dussehra! 🪔🏹\nTo: ${recipient}\n\n${message}\n\nWishing You & Your Family A Joyful, Blessed & Prosperous Dussehra!\n— With Warm Regards, ${sender}`;

        navigator.clipboard.writeText(fullText).then(() => {
            showToast('Greeting message copied to clipboard! 📋', 'fa-solid fa-copy');
        }).catch(() => {
            showToast('Failed to copy text automatically', 'fa-solid fa-triangle-exclamation');
        });
    });

    function showToast(msg, iconClass = 'fa-solid fa-circle-check') {
        const toast = document.getElementById('toast-notification');
        const toastMsg = document.getElementById('toast-message');
        const toastIcon = document.getElementById('toast-icon');

        if (!toast || !toastMsg || !toastIcon) return;

        toastMsg.textContent = msg;
        toastIcon.className = iconClass;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);
    }

    const bgCanvas = document.getElementById('bg-particle-canvas');
    if (bgCanvas) {
        const ctx = bgCanvas.getContext('2d');
        let bgParticles = [];

        function resizeBgCanvas() {
            bgCanvas.width = window.innerWidth;
            bgCanvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeBgCanvas);
        resizeBgCanvas();

        for (let i = 0; i < 50; i++) {
            bgParticles.push({
                x: Math.random() * bgCanvas.width,
                y: Math.random() * bgCanvas.height,
                radius: Math.random() * 2 + 0.5,
                alpha: Math.random() * 0.7 + 0.2,
                speedY: -(Math.random() * 0.4 + 0.1),
                speedX: (Math.random() - 0.5) * 0.3
            });
        }

        function animateBgParticles() {
            ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

            bgParticles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 229, 153, ${p.alpha})`;
                ctx.shadowColor = '#d4af37';
                ctx.shadowBlur = 8;
                ctx.fill();

                p.y += p.speedY;
                p.x += p.speedX;

                if (p.y < -10) {
                    p.y = bgCanvas.height + 10;
                    p.x = Math.random() * bgCanvas.width;
                }
            });

            requestAnimationFrame(animateBgParticles);
        }
        animateBgParticles();
    }

    const cardCanvas = document.getElementById('card-particle-canvas');
    if (cardCanvas) {
        const cCtx = cardCanvas.getContext('2d');
        let cardParticles = [];

        function resizeCardCanvas() {
            if (cardContainer) {
                cardCanvas.width = cardContainer.clientWidth;
                cardCanvas.height = cardContainer.clientHeight;
            }
        }
        window.addEventListener('resize', resizeCardCanvas);
        resizeCardCanvas();

        for (let i = 0; i < 25; i++) {
            cardParticles.push({
                x: Math.random() * 300,
                y: Math.random() * 400,
                radius: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.8 + 0.2,
                vy: -(Math.random() * 0.3 + 0.1)
            });
        }

        function animateCardParticles() {
            if (particlesEnabled && cardCanvas.width > 0) {
                cCtx.clearRect(0, 0, cardCanvas.width, cardCanvas.height);

                cardParticles.forEach(p => {
                    cCtx.beginPath();
                    cCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    cCtx.fillStyle = `rgba(255, 229, 153, ${p.alpha})`;
                    cCtx.fill();

                    p.y += p.vy;
                    if (p.y < -5) {
                        p.y = cardCanvas.height + 5;
                        p.x = Math.random() * cardCanvas.width;
                    }
                });
            }
            requestAnimationFrame(animateCardParticles);
        }
        animateCardParticles();
    }

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-open');
        });

        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('mobile-open');
            });
        });
    }

    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    updateLiveCard();
});
