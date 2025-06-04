// BohemR Enhanced UI & Visual Design System

class EnhancedUIManager {
    constructor() {
        this.currentTheme = null;
        this.animationQueue = [];
        this.trustMeter = null;
        this.cube3D = null;
        
        this.initializeEnhancedUI();
    }
    
    // Initialize enhanced UI components
    initializeEnhancedUI() {
        this.createDynamicStyles();
        this.initializeTrustMeter();
        this.setupThemeSystem();
        this.createEnhancedParticles();
        
        if (CONFIG.APP.DEBUG) {
            console.log('Enhanced UI initialized');
        }
    }
    
    // Create dynamic CSS variables for personality-adaptive themes
    createDynamicStyles() {
        const style = document.createElement('style');
        style.id = 'dynamic-theme-styles';
        
        style.textContent = `
            :root {
                --primary-color: #4ECDC4;
                --secondary-color: #44A08D;
                --accent-color: #FFD93D;
                --danger-color: #FF6B6B;
                --personality-gradient: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
                --trust-level: 0.25;
                --animation-speed: 1s;
                --glow-intensity: 0.3;
            }
            
            .personality-adaptive {
                background: var(--personality-gradient);
                color: var(--primary-color);
                transition: all 0.8s ease;
            }
            
            .trust-indicator {
                opacity: var(--trust-level);
                transform: scale(calc(0.8 + var(--trust-level) * 0.4));
                transition: all 1s ease;
            }
            
            .enhanced-glow {
                box-shadow: 0 0 calc(20px * var(--glow-intensity)) var(--primary-color);
                animation: pulse-glow var(--animation-speed) ease-in-out infinite alternate;
            }
            
            @keyframes pulse-glow {
                from { box-shadow: 0 0 calc(10px * var(--glow-intensity)) var(--primary-color); }
                to { box-shadow: 0 0 calc(30px * var(--glow-intensity)) var(--primary-color); }
            }
            
            .personality-confident {
                --primary-color: #FF6B35;
                --secondary-color: #F7931E;
                --accent-color: #FFD93D;
            }
            
            .personality-open {
                --primary-color: #4ECDC4;
                --secondary-color: #44A08D;
                --accent-color: #A8E6CF;
            }
            
            .personality-stable {
                --primary-color: #6C5CE7;
                --secondary-color: #A29BFE;
                --accent-color: #DDA0DD;
            }
            
            .personality-cautious {
                --primary-color: #00B894;
                --secondary-color: #00CEC9;
                --accent-color: #55EFC4;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // Update theme based on personality
    updatePersonalityTheme(personality) {
        this.currentTheme = personality;
        
        // Remove existing personality classes
        document.body.classList.remove('personality-confident', 'personality-open', 'personality-stable', 'personality-cautious');
        
        // Add new personality class
        if (personality) {
            document.body.classList.add(`personality-${personality}`);
        }
        
        // Update CSS variables
        this.updateCSSVariables(personality);
        
        // Trigger theme change animations
        this.animateThemeChange(personality);
        
        if (CONFIG.APP.DEBUG) {
            console.log('Theme updated to:', personality);
        }
    }
    
    // Update CSS variables for smooth transitions
    updateCSSVariables(personality) {
        const root = document.documentElement;
        
        const themes = {
            confident: {
                primary: '#FF6B35',
                secondary: '#F7931E',
                accent: '#FFD93D',
                speed: '0.8s',
                intensity: '0.5'
            },
            open: {
                primary: '#4ECDC4',
                secondary: '#44A08D',
                accent: '#A8E6CF',
                speed: '1.2s',
                intensity: '0.4'
            },
            stable: {
                primary: '#6C5CE7',
                secondary: '#A29BFE',
                accent: '#DDA0DD',
                speed: '1.5s',
                intensity: '0.3'
            },
            cautious: {
                primary: '#00B894',
                secondary: '#00CEC9',
                accent: '#55EFC4',
                speed: '1.8s',
                intensity: '0.25'
            }
        };
        
        const theme = themes[personality] || themes.open;
        
        root.style.setProperty('--primary-color', theme.primary);
        root.style.setProperty('--secondary-color', theme.secondary);
        root.style.setProperty('--accent-color', theme.accent);
        root.style.setProperty('--animation-speed', theme.speed);
        root.style.setProperty('--glow-intensity', theme.intensity);
    }
    
    // Initialize trust meter
    initializeTrustMeter() {
        this.trustMeter = {
            level: 1,
            maxLevel: 4,
            element: null
        };
    }
    
    // Update trust meter display
    updateTrustMeter(level) {
        this.trustMeter.level = Math.max(1, Math.min(4, level));
        const normalizedLevel = this.trustMeter.level / this.trustMeter.maxLevel;
        
        // Update CSS variable
        document.documentElement.style.setProperty('--trust-level', normalizedLevel);
        
        // Find and update trust meter elements
        const trustElements = document.querySelectorAll('.trust-indicator');
        trustElements.forEach(element => {
            element.style.opacity = normalizedLevel;
            element.style.transform = `scale(${0.8 + normalizedLevel * 0.4})`;
        });
        
        // Show trust level animation
        this.animateTrustLevelUp(level);
        
        if (CONFIG.APP.DEBUG) {
            console.log('Trust meter updated to level:', level);
        }
    }
    
    // Create 3D personality cube
    create3DPersonalityCube() {
        const cubeContainer = document.createElement('div');
        cubeContainer.className = 'cube-3d-container';
        cubeContainer.innerHTML = `
            <div class="cube-3d">
                <div class="cube-face cube-front">
                    <div class="face-content">
                        <span class="face-icon">⚡</span>
                        <span class="face-label">Confident</span>
                    </div>
                </div>
                <div class="cube-face cube-back">
                    <div class="face-content">
                        <span class="face-icon">🧭</span>
                        <span class="face-label">Cautious</span>
                    </div>
                </div>
                <div class="cube-face cube-left">
                    <div class="face-content">
                        <span class="face-icon">⚖️</span>
                        <span class="face-label">Stable</span>
                    </div>
                </div>
                <div class="cube-face cube-right">
                    <div class="face-content">
                        <span class="face-icon">🌀</span>
                        <span class="face-label">Open</span>
                    </div>
                </div>
                <div class="cube-face cube-top">
                    <div class="face-content">
                        <span class="face-icon">🎯</span>
                        <span class="face-label">You</span>
                    </div>
                </div>
                <div class="cube-face cube-bottom">
                    <div class="face-content">
                        <span class="face-icon">✨</span>
                        <span class="face-label">Discover</span>
                    </div>
                </div>
            </div>
        `;
        
        this.cube3D = cubeContainer;
        return cubeContainer;
    }
    
    // Animate cube rotation to show personality result
    animateCubeToPersonality(personality) {
        if (!this.cube3D) return;
        
        const cube = this.cube3D.querySelector('.cube-3d');
        if (!cube) return;
        
        const rotations = {
            confident: 'rotateY(0deg) rotateX(0deg)',
            cautious: 'rotateY(180deg) rotateX(0deg)',
            stable: 'rotateY(-90deg) rotateX(0deg)',
            open: 'rotateY(90deg) rotateX(0deg)'
        };
        
        cube.style.transform = rotations[personality] || rotations.open;
        cube.style.transition = 'transform 2s cubic-bezier(0.4, 0.0, 0.2, 1)';
        
        // Add celebration particles
        setTimeout(() => {
            this.createPersonalityCelebration(personality);
        }, 1000);
    }
    
    // Create enhanced particle system
    createEnhancedParticles() {
        const particleContainer = document.getElementById('particles');
        if (!particleContainer) return;
        
        // Clear existing particles
        particleContainer.innerHTML = '';
        
        // Create neural network particles
        this.createNeuralNetworkParticles(particleContainer);
        
        // Create floating data particles
        this.createDataParticles(particleContainer);
        
        // Create personality energy particles
        this.createPersonalityParticles(particleContainer);
    }
    
    // Create neural network visualization
    createNeuralNetworkParticles(container) {
        const networkSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        networkSvg.setAttribute('width', '100%');
        networkSvg.setAttribute('height', '100%');
        networkSvg.style.position = 'absolute';
        networkSvg.style.top = '0';
        networkSvg.style.left = '0';
        networkSvg.style.opacity = '0.3';
        networkSvg.style.pointerEvents = 'none';
        
        // Create nodes
        const nodes = [];
        for (let i = 0; i < 12; i++) {
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', x + '%');
            circle.setAttribute('cy', y + '%');
            circle.setAttribute('r', '2');
            circle.setAttribute('fill', 'var(--primary-color)');
            circle.setAttribute('opacity', '0.6');
            
            networkSvg.appendChild(circle);
            nodes.push({ x, y, element: circle });
        }
        
        // Create connections
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const distance = Math.sqrt(
                    Math.pow(nodes[i].x - nodes[j].x, 2) + 
                    Math.pow(nodes[i].y - nodes[j].y, 2)
                );
                
                if (distance < 30) { // Only connect nearby nodes
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', nodes[i].x + '%');
                    line.setAttribute('y1', nodes[i].y + '%');
                    line.setAttribute('x2', nodes[j].x + '%');
                    line.setAttribute('y2', nodes[j].y + '%');
                    line.setAttribute('stroke', 'var(--primary-color)');
                    line.setAttribute('stroke-width', '1');
                    line.setAttribute('opacity', '0.2');
                    
                    networkSvg.appendChild(line);
                }
            }
        }
        
        container.appendChild(networkSvg);
    }
    
    // Create data particles that respond to interactions
    createDataParticles(container) {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'data-particle';
            
            const size = Math.random() * 4 + 2;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 10 + 15;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}%;
                top: ${y}%;
                background: var(--accent-color);
                border-radius: 50%;
                opacity: 0.4;
                animation: dataFloat ${duration}s ${delay}s ease-in-out infinite;
                pointer-events: none;
            `;
            
            container.appendChild(particle);
        }
        
        // Add data float animation if not exists
        if (!document.querySelector('#data-float-keyframes')) {
            const style = document.createElement('style');
            style.id = 'data-float-keyframes';
            style.textContent = `
                @keyframes dataFloat {
                    0%, 100% { 
                        transform: translateY(0px) translateX(0px) scale(1); 
                        opacity: 0.4; 
                    }
                    25% { 
                        transform: translateY(-20px) translateX(10px) scale(1.2); 
                        opacity: 0.8; 
                    }
                    50% { 
                        transform: translateY(-10px) translateX(-5px) scale(0.8); 
                        opacity: 0.6; 
                    }
                    75% { 
                        transform: translateY(-30px) translateX(15px) scale(1.1); 
                        opacity: 0.9; 
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Create personality-specific particles
    createPersonalityParticles(container) {
        if (!this.currentTheme) return;
        
        const particleConfigs = {
            confident: { count: 15, shapes: ['⚡', '🔥', '💥'], speed: 'fast' },
            open: { count: 20, shapes: ['✨', '🌟', '💫'], speed: 'medium' },
            stable: { count: 12, shapes: ['⚖️', '🔮', '💎'], speed: 'slow' },
            cautious: { count: 10, shapes: ['🧭', '🔍', '💡'], speed: 'slow' }
        };
        
        const config = particleConfigs[this.currentTheme];
        if (!config) return;
        
        for (let i = 0; i < config.count; i++) {
            const particle = document.createElement('div');
            particle.className = 'personality-particle';
            
            const shape = config.shapes[Math.floor(Math.random() * config.shapes.length)];
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = Math.random() * 16 + 12;
            const duration = config.speed === 'fast' ? 8 : config.speed === 'medium' ? 12 : 16;
            
            particle.style.cssText = `
                position: absolute;
                left: ${x}%;
                top: ${y}%;
                font-size: ${size}px;
                opacity: 0.6;
                animation: personalityFloat ${duration}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
                pointer-events: none;
                z-index: 1;
            `;
            particle.textContent = shape;
            
            container.appendChild(particle);
        }
    }
    
    // Animate theme change
    animateThemeChange(personality) {
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'theme-change-ripple';
        ripple.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: var(--primary-color);
            border-radius: 50%;
            opacity: 0.3;
            pointer-events: none;
            z-index: 9999;
            animation: rippleOut 1.5s ease-out forwards;
        `;
        
        document.body.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 1500);
        
        // Regenerate particles with new theme
        setTimeout(() => {
            this.createEnhancedParticles();
        }, 800);
        
        // Add ripple animation if not exists
        if (!document.querySelector('#ripple-keyframes')) {
            const style = document.createElement('style');
            style.id = 'ripple-keyframes';
            style.textContent = `
                @keyframes rippleOut {
                    0% {
                        width: 0;
                        height: 0;
                        transform: translate(-50%, -50%);
                        opacity: 0.5;
                    }
                    50% {
                        width: 200vw;
                        height: 200vw;
                        transform: translate(-50%, -50%);
                        opacity: 0.2;
                    }
                    100% {
                        width: 300vw;
                        height: 300vw;
                        transform: translate(-50%, -50%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Animate trust level increase
    animateTrustLevelUp(newLevel) {
        // Create trust level notification
        const notification = document.createElement('div');
        notification.className = 'trust-level-notification';
        notification.innerHTML = `
            <div class="trust-icon">🤝</div>
            <div class="trust-text">Trust Level ${newLevel}</div>
            <div class="trust-subtitle">Understanding you better</div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--personality-gradient);
            color: white;
            padding: 15px 20px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            z-index: 1000;
            animation: trustSlideIn 0.5s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'trustSlideOut 0.5s ease-in forwards';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
        
        // Add trust animations if not exists
        if (!document.querySelector('#trust-keyframes')) {
            const style = document.createElement('style');
            style.id = 'trust-keyframes';
            style.textContent = `
                @keyframes trustSlideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes trustSlideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Create personality celebration effect
    createPersonalityCelebration(personality) {
        const colors = {
            confident: ['#FF6B35', '#F7931E', '#FFD93D'],
            open: ['#4ECDC4', '#44A08D', '#A8E6CF'],
            stable: ['#6C5CE7', '#A29BFE', '#DDA0DD'],
            cautious: ['#00B894', '#00CEC9', '#55EFC4']
        };
        
        const personalityColors = colors[personality] || colors.open;
        
        // Create burst of particles
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            const color = personalityColors[Math.floor(Math.random() * personalityColors.length)];
            
            particle.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                width: 8px;
                height: 8px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                animation: celebrationBurst 2s ease-out forwards;
                animation-delay: ${Math.random() * 0.5}s;
            `;
            
            // Random direction
            const angle = (Math.PI * 2 * i) / 30;
            const distance = 150 + Math.random() * 100;
            const endX = Math.cos(angle) * distance;
            const endY = Math.sin(angle) * distance;
            
            particle.style.setProperty('--end-x', endX + 'px');
            particle.style.setProperty('--end-y', endY + 'px');
            
            document.body.appendChild(particle);
            
            // Remove after animation
            setTimeout(() => {
                particle.remove();
            }, 2500);
        }
        
        // Add celebration animation if not exists
        if (!document.querySelector('#celebration-keyframes')) {
            const style = document.createElement('style');
            style.id = 'celebration-keyframes';
            style.textContent = `
                @keyframes celebrationBurst {
                    0% {
                        transform: translate(-50%, -50%) scale(0);
                        opacity: 1;
                    }
                    20% {
                        transform: translate(-50%, -50%) scale(1.5);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(
                            calc(-50% + var(--end-x)), 
                            calc(-50% + var(--end-y))
                        ) scale(0.5);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Setup theme system
    setupThemeSystem() {
        // Add CSS for 3D cube
        const cubeStyles = document.createElement('style');
        cubeStyles.textContent = `
            .cube-3d-container {
                perspective: 1000px;
                width: 200px;
                height: 200px;
                margin: 20px auto;
            }
            
            .cube-3d {
                position: relative;
                width: 100%;
                height: 100%;
                transform-style: preserve-3d;
                animation: cubeRotate 20s linear infinite;
            }
            
            .cube-face {
                position: absolute;
                width: 200px;
                height: 200px;
                border: 2px solid var(--primary-color);
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
                font-weight: 600;
            }
            
            .cube-front { transform: rotateY(0deg) translateZ(100px); }
            .cube-back { transform: rotateY(180deg) translateZ(100px); }
            .cube-left { transform: rotateY(-90deg) translateZ(100px); }
            .cube-right { transform: rotateY(90deg) translateZ(100px); }
            .cube-top { transform: rotateX(90deg) translateZ(100px); }
            .cube-bottom { transform: rotateX(-90deg) translateZ(100px); }
            
            .face-content {
                text-align: center;
                color: var(--primary-color);
            }
            
            .face-icon {
                display: block;
                font-size: 2rem;
                margin-bottom: 10px;
            }
            
            .face-label {
                font-size: 0.9rem;
                opacity: 0.8;
            }
            
            @keyframes cubeRotate {
                0% { transform: rotateX(0deg) rotateY(0deg); }
                25% { transform: rotateX(90deg) rotateY(90deg); }
                50% { transform: rotateX(180deg) rotateY(180deg); }
                75% { transform: rotateX(270deg) rotateY(270deg); }
                100% { transform: rotateX(360deg) rotateY(360deg); }
            }
        `;
        
        document.head.appendChild(cubeStyles);
    }
}

// Initialize enhanced UI manager
window.enhancedUI = new EnhancedUIManager();