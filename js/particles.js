// パーティクルエフェクト管理クラス
class ParticleSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        this.setupCanvas();
    }

    // Canvasを設定
    setupCanvas() {
        // Canvas要素を作成
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'particle-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        // ウィンドウリサイズ時に再設定
        window.addEventListener('resize', () => this.resize());
    }

    // Canvasサイズを調整
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    // パーティクルを生成
    createParticles(x, y, count, options = {}) {
        const defaults = {
            colors: ['#FFD700', '#FFA500', '#FF69B4', '#87CEEB', '#98FB98'],
            minSize: 3,
            maxSize: 8,
            minSpeed: 2,
            maxSpeed: 6,
            gravity: 0.1,
            lifetime: 60
        };
        
        const config = { ...defaults, ...options };
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
            const speed = config.minSpeed + Math.random() * (config.maxSpeed - config.minSpeed);
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: config.minSize + Math.random() * (config.maxSize - config.minSize),
                color: config.colors[Math.floor(Math.random() * config.colors.length)],
                alpha: 1,
                gravity: config.gravity,
                lifetime: config.lifetime,
                age: 0
            });
        }
        
        // アニメーション開始
        if (!this.animationId) {
            this.animate();
        }
    }

    // 正解時のエフェクト
    correctEffect(comboCount = 1) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // コンボ数に応じてパーティクル数を増やす
        const particleCount = Math.min(20 + comboCount * 2, 60);
        
        this.createParticles(centerX, centerY, particleCount, {
            colors: ['#FFD700', '#FFA500', '#FFFF00', '#FF69B4'],
            minSize: 4,
            maxSize: 10,
            minSpeed: 3,
            maxSpeed: 8,
            gravity: 0.15,
            lifetime: 80
        });
    }

    // コンボエフェクト
    comboEffect(comboCount) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // コンボが高いほど派手に
        const particleCount = Math.min(30 + comboCount * 3, 100);
        
        this.createParticles(centerX, centerY, particleCount, {
            colors: ['#FF1493', '#FFD700', '#00BFFF', '#7FFF00', '#FF69B4'],
            minSize: 5,
            maxSize: 12,
            minSpeed: 4,
            maxSpeed: 10,
            gravity: 0.1,
            lifetime: 100
        });
        
        // 追加の星エフェクト
        this.createStars(centerX, centerY, 10);
    }

    // 星を生成
    createStars(x, y, count) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const distance = 50 + Math.random() * 100;
            
            this.particles.push({
                x: x + Math.cos(angle) * distance,
                y: y + Math.sin(angle) * distance,
                vx: 0,
                vy: -1,
                size: 8 + Math.random() * 6,
                color: '#FFD700',
                alpha: 1,
                gravity: 0,
                lifetime: 50,
                age: 0,
                isStar: true
            });
        }
    }

    // パーティクルを更新
    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            // 速度を更新
            p.vy += p.gravity;
            p.x += p.vx;
            p.y += p.vy;
            
            // 年齢を更新
            p.age++;
            
            // アルファ値を減少
            p.alpha = 1 - (p.age / p.lifetime);
            
            // 寿命が尽きたら削除
            if (p.age >= p.lifetime) {
                this.particles.splice(i, 1);
            }
        }
    }

    // パーティクルを描画
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (const p of this.particles) {
            this.ctx.save();
            this.ctx.globalAlpha = p.alpha;
            
            if (p.isStar) {
                // 星を描画
                this.drawStar(p.x, p.y, p.size, p.color);
            } else {
                // 円を描画
                this.ctx.fillStyle = p.color;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            this.ctx.restore();
        }
    }

    // 星を描画
    drawStar(x, y, size, color) {
        const spikes = 5;
        const outerRadius = size;
        const innerRadius = size / 2;
        
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (Math.PI * i) / spikes;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        
        this.ctx.closePath();
        this.ctx.fill();
    }

    // アニメーションループ
    animate() {
        this.update();
        this.draw();
        
        // パーティクルが残っている場合は継続
        if (this.particles.length > 0) {
            this.animationId = requestAnimationFrame(() => this.animate());
        } else {
            this.animationId = null;
        }
    }

    // すべてのパーティクルをクリア
    clear() {
        this.particles = [];
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// グローバルインスタンスを作成
const particleSystem = new ParticleSystem();
