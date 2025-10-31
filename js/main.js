// アプリケーションのメイン制御
class App {
    constructor() {
        this.currentScreen = 'start';
        this.selectedCategory = null;
        this.selectedMode = 'timeattack';
        this.init();
    }

    // 初期化
    init() {
        this.setupEventListeners();
        this.renderCategoryCards();
        this.showScreen('start-screen');
    }

    // カテゴリカードを生成
    renderCategoryCards() {
        const categoryGrid = document.getElementById('category-grid');
        if (!categoryGrid) return;

        categoryGrid.innerHTML = '';

        categories.forEach(category => {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.dataset.categoryId = category.id;
            card.tabIndex = 0; // キーボードフォーカス可能に
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `${category.name}カテゴリを選択`);
            
            card.innerHTML = `
                <span class="category-icon">${category.icon}</span>
                <div class="category-name">${category.name}</div>
                <div class="category-description">${category.description}</div>
            `;

            // クリックイベント
            card.addEventListener('click', () => {
                this.selectCategory(category);
            });

            // キーボードイベント
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selectCategory(category);
                }
            });

            categoryGrid.appendChild(card);
        });
    }

    // カテゴリを選択
    selectCategory(category) {
        this.selectedCategory = category;
        this.showModeScreen();
    }

    // モード選択画面を表示
    showModeScreen() {
        this.showScreen('mode-screen');
        this.setupModeCards();
    }

    // モードカードを設定
    setupModeCards() {
        const modeCards = document.querySelectorAll('.mode-card');
        modeCards.forEach(card => {
            const mode = card.dataset.mode;
            
            // クリックイベント
            card.onclick = () => {
                this.selectMode(mode);
            };
            
            // キーボードイベント
            card.onkeydown = (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selectMode(mode);
                }
            };
        });
    }

    // モードを選択
    selectMode(mode) {
        this.selectedMode = mode;
        
        // カウントダウンを表示してからゲーム開始
        showCountdown(() => {
            this.startGame(this.selectedCategory, mode);
        });
    }

    // イベントリスナーを設定
    setupEventListeners() {
        // スタート画面
        document.getElementById('start-btn')?.addEventListener('click', () => {
            this.showCategoryScreen();
        });

        document.getElementById('scores-btn')?.addEventListener('click', () => {
            this.showScores();
        });

        document.getElementById('achievements-btn')?.addEventListener('click', () => {
            this.showAchievements();
        });

        // 実績一覧画面
        document.getElementById('back-from-achievements-btn')?.addEventListener('click', () => {
            this.showScreen('start-screen');
        });

        // ゲーム画面
        const typingInput = document.getElementById('typing-input');
        if (typingInput) {
            typingInput.addEventListener('input', (e) => {
                this.handleTypingInput(e.target.value);
            });

            typingInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.handleEnterKey();
                }
            });
        }

        // 結果画面
        document.getElementById('retry-btn')?.addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('home-btn')?.addEventListener('click', () => {
            this.showScreen('start-screen');
        });

        // スコア記録画面
        document.getElementById('back-btn')?.addEventListener('click', () => {
            this.showScreen('start-screen');
        });

        document.getElementById('clear-history-btn')?.addEventListener('click', () => {
            this.clearHistory();
        });

        // 結果画面から成績を見る
        document.getElementById('view-scores-btn')?.addEventListener('click', () => {
            this.showScores();
        });

        // カテゴリ選択画面
        document.getElementById('back-to-top-btn')?.addEventListener('click', () => {
            this.showScreen('start-screen');
        });

        // モード選択画面
        document.getElementById('back-to-category-btn')?.addEventListener('click', () => {
            this.showScreen('category-screen');
        });

        // ゲーム中断ボタン
        document.getElementById('stop-btn')?.addEventListener('click', () => {
            this.showStopConfirmation();
        });
    }

    // カテゴリ選択画面を表示
    showCategoryScreen() {
        this.showScreen('category-screen');
    }

    // 画面を表示
    showScreen(screenId) {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            screen.classList.remove('active');
        });

        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
        }
    }

    // ゲームを開始
    startGame(category = null, mode = null) {
        this.showScreen('game-screen');
        
        // カテゴリとモードを指定してゲームを開始
        const selectedCat = category || this.selectedCategory;
        const selectedMode = mode || this.selectedMode;
        game.start(selectedCat, selectedMode);
        
        // 表示を更新
        this.updateGameDisplay();
        
        // 入力フィールドをクリアしてフォーカス
        const typingInput = document.getElementById('typing-input');
        if (typingInput) {
            typingInput.value = '';
            typingInput.focus();
        }
        
        // フィードバックをクリア
        this.clearFeedback();
    }

    // ゲーム表示を更新
    updateGameDisplay() {
        game.updateTimerDisplay();
        game.updateScoreDisplay();
        game.updateWordDisplay();
        this.updateMistakesDisplay();
    }

    // ミス回数表示を更新
    updateMistakesDisplay() {
        const mistakesItem = document.getElementById('mistakes-item');
        const mistakesElement = document.getElementById('mistakes');
        const timerItem = document.querySelector('.info-item:nth-child(2)');
        
        if (!mistakesItem || !mistakesElement) return;
        
        // ミス制限モードの場合のみ表示
        if (game.maxMistakes !== Infinity) {
            mistakesItem.style.display = 'block';
            const remaining = game.maxMistakes - game.wrongCount;
            mistakesElement.textContent = Math.max(0, remaining);
            
            // 残りミスが少ない場合は赤色で警告
            if (remaining <= 1) {
                mistakesElement.style.color = '#f44336';
            } else {
                mistakesElement.style.color = '#f5576c';
            }
            
            // タイマー非表示（時間無制限）
            if (timerItem) {
                timerItem.style.display = 'none';
            }
        } else {
            mistakesItem.style.display = 'none';
            // タイマー表示
            if (timerItem) {
                timerItem.style.display = 'block';
            }
        }
    }

    // タイピング入力を処理
    handleTypingInput(input) {
        if (!game.isGamePlaying()) {
            return;
        }

        const result = game.checkInput(input);

        if (result !== null) {
            if (result.isCorrect) {
                // 効果音を再生
                soundManager.play('correct');
                
                // 正解エフェクト
                this.showCorrectEffect(result);
                this.showFeedback(`正解！ +${result.points}点`, 'correct');
                
                // コンボエフェクト
                this.checkComboMilestone(result.combo);
                
                this.nextQuestion();
            } else {
                // 効果音を再生
                soundManager.play('wrong');
                
                // 不正解エフェクト
                this.showWrongEffect();
                this.showFeedback(`不正解！ 正解: ${result.correctAnswer}`, 'wrong');
                this.nextQuestion();
            }
        }
    }

    // 正解エフェクト
    showCorrectEffect(result) {
        // パーティクルエフェクト
        particleSystem.correctEffect(result.combo);
        
        // 画面フラッシュ
        this.flashScreen('correct');
    }

    // 不正解エフェクト
    showWrongEffect() {
        // 入力フィールドエラーエフェクト
        const typingInput = document.getElementById('typing-input');
        if (typingInput) {
            typingInput.classList.add('error');
            setTimeout(() => {
                typingInput.classList.remove('error');
            }, 300);
        }
        
        // 画面フラッシュ
        this.flashScreen('wrong');
    }

    // 画面フラッシュ
    flashScreen(type) {
        const flash = document.createElement('div');
        flash.className = `screen-flash ${type === 'wrong' ? 'wrong' : ''}`;
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.remove();
        }, 300);
    }

    // コンボマイルストーンチェック
    checkComboMilestone(combo) {
        let message = '';
        let multiplier = game.getComboMultiplier(combo);
        
        if (combo === 5) {
            message = `Good! 🎉\n×${multiplier}倍！`;
            soundManager.play('combo');
            particleSystem.comboEffect(combo);
        } else if (combo === 10) {
            message = `Great! ⭐\n×${multiplier}倍！`;
            soundManager.play('combo');
            particleSystem.comboEffect(combo);
        } else if (combo === 20) {
            message = `Excellent! 🌟\n×${multiplier}倍！`;
            soundManager.play('combo');
            particleSystem.comboEffect(combo);
        } else if (combo === 30) {
            message = `Perfect! ✨\n×${multiplier}倍！`;
            soundManager.play('combo');
            particleSystem.comboEffect(combo);
        } else if (combo === 50) {
            message = `AMAZING!! 🔥\n×${multiplier}倍！`;
            soundManager.play('combo');
            particleSystem.comboEffect(combo);
        }
        
        if (message) {
            this.showComboEffect(message);
        }
    }

    // コンボエフェクト表示
    showComboEffect(message) {
        const effect = document.createElement('div');
        effect.className = 'combo-effect';
        effect.textContent = message;
        document.body.appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 1000);
    }

    // Enterキー処理
    handleEnterKey() {
        if (!game.isGamePlaying()) {
            return;
        }

        const typingInput = document.getElementById('typing-input');
        if (typingInput && typingInput.value.trim()) {
            const result = game.checkInput(typingInput.value);
            
            if (result === null) {
                // 文字数が足りない場合は不正解扱い
                this.showFeedback('不正解！', 'wrong');
                game.wrongCount++;
                this.nextQuestion();
            }
        }
    }

    // フィードバックを表示
    showFeedback(message, type) {
        const feedbackElement = document.getElementById('feedback');
        if (feedbackElement) {
            feedbackElement.textContent = message;
            feedbackElement.className = `feedback ${type}`;
            
            // 一定時間後にフィードバックをクリア
            setTimeout(() => {
                this.clearFeedback();
            }, 1500);
        }
    }

    // フィードバックをクリア
    clearFeedback() {
        const feedbackElement = document.getElementById('feedback');
        if (feedbackElement) {
            feedbackElement.textContent = '';
            feedbackElement.className = 'feedback';
        }
    }

    // 次の問題へ
    nextQuestion() {
        game.nextWord();
        game.updateWordDisplay();
        game.updateScoreDisplay();
        
        const typingInput = document.getElementById('typing-input');
        if (typingInput) {
            typingInput.value = '';
            typingInput.focus();
        }
    }

    // ゲーム終了処理
    endGame() {
        // ゲームから結果を取得（既にend()が呼ばれている場合はgetState()から取得）
        const state = game.getState();
        
        // 正答率を計算
        const totalAttempts = state.correctCount + state.wrongCount;
        const accuracy = totalAttempts > 0 
            ? Math.round((state.correctCount / totalAttempts) * 100) 
            : 0;
        
        const results = {
            score: state.score,
            correct: state.correctCount,
            wrong: state.wrongCount,
            accuracy: accuracy,
            maxCombo: game.maxCombo || 0,
            averageSpeed: 0,
            time: 60 - state.timeLeft
        };
        
        // スコアを保存
        scoreStorage.saveScore(results);
        
        // 結果画面を表示
        this.showResults(results);
    }

    // 称号を判定
    getRank(score, accuracy, maxCombo) {
        let rank = '';
        let badges = [];
        
        // スコアによる称号
        if (score >= 1000) {
            rank = '絶対的存在';
        } else if (score >= 800) {
            rank = '次元の創造主';
        } else if (score >= 600) {
            rank = '無限の境地';
        } else if (score >= 500) {
            rank = '神々の頂点';
        } else if (score >= 400) {
            rank = '宇宙の支配者';
        } else if (score >= 350) {
            rank = '時空を統べる者';
        } else if (score >= 300) {
            rank = '次元を超えし者';
        } else if (score >= 250) {
            rank = '全知全能';
        } else if (score >= 200) {
            rank = '究極神';
        } else if (score >= 180) {
            rank = '超越神';
        } else if (score >= 160) {
            rank = '破壊神';
        } else if (score >= 140) {
            rank = 'タイピング神';
        } else if (score >= 120) {
            rank = '界王神';
        } else if (score >= 100) {
            rank = '覇王';
        } else if (score >= 85) {
            rank = '伝説';
        } else if (score >= 70) {
            rank = '英雄';
        } else if (score >= 55) {
            rank = '天才';
        } else if (score >= 40) {
            rank = '秀才';
        } else if (score >= 25) {
            rank = '一般人';
        } else if (score >= 10) {
            rank = '初心者';
        } else {
            rank = '見習い';
        }
        
        // 特別称号
        if (accuracy === 100) {
            badges.push('完璧主義者');
        }
        if (maxCombo >= 20) {
            badges.push('コンボマスター');
        }
        
        return { rank, badges };
    }

    // 結果を表示
    showResults(results) {
        // ゲーム終了の効果音を再生
        soundManager.play('gameEnd');
        
        // 称号判定
        const rankInfo = this.getRank(results.score, results.accuracy, results.maxCombo);
        
        // 称号表示
        document.getElementById('rank-title').textContent = rankInfo.rank;
        
        // バッジ表示
        const badgesContainer = document.getElementById('rank-badges');
        badgesContainer.innerHTML = '';
        rankInfo.badges.forEach(badge => {
            const badgeElement = document.createElement('div');
            badgeElement.className = 'badge';
            badgeElement.textContent = badge;
            badgesContainer.appendChild(badgeElement);
        });
        
        // スコア表示
        document.getElementById('final-score').textContent = results.score;
        document.getElementById('final-correct').textContent = results.correct;
        document.getElementById('accuracy').textContent = results.accuracy;
        document.getElementById('max-combo').textContent = results.maxCombo || 0;
        document.getElementById('time-taken').textContent = results.time || 60;
        
        this.showScreen('result-screen');
    }

    // 称号のレベルを取得
    getRankLevel(rank) {
        const level8 = ['絶対的存在', '次元の創造主'];
        const level7 = ['無限の境地', '神々の頂点', '宇宙の支配者'];
        const level6 = ['時空を統べる者', '次元を超えし者', '全知全能'];
        const level5 = ['究極神', '超越神', '破壊神'];
        const level4 = ['タイピング神', '界王神', '覇王'];
        const level3 = ['伝説', '英雄'];
        const level2 = ['天才', '秀才'];
        const level1 = ['一般人', '初心者', '見習い'];
        
        if (level8.includes(rank)) return 8;
        if (level7.includes(rank)) return 7;
        if (level6.includes(rank)) return 6;
        if (level5.includes(rank)) return 5;
        if (level4.includes(rank)) return 4;
        if (level3.includes(rank)) return 3;
        if (level2.includes(rank)) return 2;
        if (level1.includes(rank)) return 1;
        return 1; // デフォルト
    }

    // スコア記録を表示
    showScores() {
        this.showScreen('scores-screen');
        
        // 統計情報を取得して表示
        const stats = scoreStorage.getStatistics();
        document.getElementById('total-games').textContent = stats.totalGames;
        document.getElementById('avg-score').textContent = stats.averageScore;
        document.getElementById('best-score').textContent = stats.bestScore;
        
        const history = scoreStorage.getGameHistory();
        
        // 最高称号を表示
        const bestRankElement = document.getElementById('best-rank');
        const bestRankCard = document.getElementById('best-rank-card');
        if (bestRankElement && bestRankCard) {
            const bestRank = stats.bestRank || '-';
            bestRankElement.textContent = bestRank;
            
            // 称号レベルに応じたクラスを適用
            if (bestRank !== '-') {
                const level = this.getRankLevel(bestRank);
                bestRankCard.className = `stat-card rank-card rank-level-${level}`;
            }
        }
        
        // 最後のプレイ称号とスコアを表示
        const lastRankElement = document.getElementById('last-rank');
        const lastScoreElement = document.getElementById('last-score');
        const lastRankCard = document.getElementById('last-rank-card');
        
        if (lastRankElement && lastScoreElement && lastRankCard && history.length > 0) {
            const lastRank = history[0].rank || '-';
            const lastScore = history[0].score || 0;
            
            lastRankElement.textContent = lastRank;
            lastScoreElement.textContent = lastScore;
            
            // 称号レベルに応じたクラスを適用
            if (lastRank !== '-') {
                const level = this.getRankLevel(lastRank);
                lastRankCard.className = `stat-card rank-card rank-level-${level}`;
            }
        } else if (lastRankElement && lastScoreElement) {
            lastRankElement.textContent = '-';
            lastScoreElement.textContent = '0';
        }
        
        // グラフを描画
        this.drawScoreChart(history);
        this.drawCategoryChart(history);
        
        // プレイ履歴を表示
        const scoresList = document.getElementById('scores-list');
        if (!scoresList) return;
        
        if (history.length === 0) {
            scoresList.innerHTML = '<div class="no-scores">まだ記録がありません</div>';
            return;
        }
        
        let html = '';
        history.slice(0, 20).forEach((record) => {
            const date = scoreStorage.formatDate(record.date);
            const categoryName = record.category && record.category.name ? record.category.name : '不明';
            const rank = record.rank || '見習い';
            
            html += `
                <div class="score-item">
                    <div>
                        <div class="date">${date}</div>
                        <div style="margin-top: 5px;">
                            <strong>${categoryName}</strong> | 
                            正解: ${record.correct}問 | 
                            正答率: ${record.accuracy}% | 
                            称号: ${rank}
                        </div>
                    </div>
                    <div class="score-value">${record.score}点</div>
                </div>
            `;
        });
        
        scoresList.innerHTML = html;
    }

    // スコア推移グラフを描画
    drawScoreChart(history) {
        const canvas = document.getElementById('score-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // キャンバスをクリア
        ctx.clearRect(0, 0, width, height);
        
        if (history.length === 0) {
            ctx.font = '20px sans-serif';
            ctx.fillStyle = '#999';
            ctx.textAlign = 'center';
            ctx.fillText('データがありません', width / 2, height / 2);
            return;
        }
        
        // 最新20件を取得（古い順に並び替え）
        const data = history.slice(0, 20).reverse();
        const scores = data.map(h => h.score);
        const maxScore = Math.max(...scores, 100);
        
        // グラフのマージン
        const margin = { top: 30, right: 30, bottom: 40, left: 50 };
        const graphWidth = width - margin.left - margin.right;
        const graphHeight = height - margin.top - margin.bottom;
        
        // 背景
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, width, height);
        
        // グリッド線
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = margin.top + (graphHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(margin.left, y);
            ctx.lineTo(width - margin.right, y);
            ctx.stroke();
            
            // Y軸ラベル
            ctx.fillStyle = '#666';
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'right';
            const value = Math.round(maxScore * (1 - i / 5));
            ctx.fillText(value.toString(), margin.left - 10, y + 4);
        }
        
        // 折れ線グラフ
        if (scores.length > 1) {
            ctx.strokeStyle = '#667eea';
            ctx.lineWidth = 3;
            ctx.beginPath();
            
            scores.forEach((score, index) => {
                const x = margin.left + (graphWidth / (scores.length - 1)) * index;
                const y = margin.top + graphHeight - (score / maxScore) * graphHeight;
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.stroke();
            
            // ポイント
            scores.forEach((score, index) => {
                const x = margin.left + (graphWidth / (scores.length - 1)) * index;
                const y = margin.top + graphHeight - (score / maxScore) * graphHeight;
                
                ctx.fillStyle = '#764ba2';
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, Math.PI * 2);
                ctx.fill();
            });
        }
        
        // X軸ラベル
        ctx.fillStyle = '#666';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('プレイ回数', width / 2, height - 10);
    }

    // カテゴリ別プレイ回数グラフを描画
    drawCategoryChart(history) {
        const container = document.getElementById('category-chart');
        if (!container) return;
        
        // カテゴリごとのプレイ回数を集計
        const categoryCount = {};
        history.forEach(h => {
            if (h.category && h.category.name) {
                categoryCount[h.category.name] = (categoryCount[h.category.name] || 0) + 1;
            }
        });
        
        if (Object.keys(categoryCount).length === 0) {
            container.innerHTML = '<div class="no-data">データがありません</div>';
            return;
        }
        
        // 最大値を取得
        const maxCount = Math.max(...Object.values(categoryCount));
        
        // 棒グラフを生成
        let html = '';
        Object.keys(categoryCount).forEach(category => {
            const count = categoryCount[category];
            const heightPercent = (count / maxCount) * 100;
            
            html += `
                <div class="bar-item">
                    <div class="bar" style="height: ${heightPercent}%">
                        <div class="bar-value">${count}</div>
                    </div>
                    <div class="bar-label">${category}</div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }

    // 履歴をクリア
    clearHistory() {
        if (scoreStorage.clearHistory()) {
            // 画面を再表示
            this.showScores();
        }
    }

    // 実績一覧を表示
    showAchievements() {
        this.showScreen('achievements-screen');
        
        const allAchievements = achievementManager.getAllAchievements();
        const percentage = achievementManager.getUnlockPercentage();
        
        // 解除率を表示
        document.getElementById('achievement-percentage').textContent = percentage;
        const progressBar = document.getElementById('achievement-progress-bar');
        if (progressBar) {
            progressBar.style.width = percentage + '%';
        }
        
        // 実績一覧を表示
        const achievementsList = document.getElementById('achievements-list');
        if (!achievementsList) return;
        
        let html = '';
        allAchievements.forEach(achievement => {
            const statusClass = achievement.unlocked ? 'unlocked' : 'locked';
            html += `
                <div class="achievement-card ${statusClass}">
                    <span class="achievement-card-icon">${achievement.icon}</span>
                    <div class="achievement-card-name">${achievement.name}</div>
                    <div class="achievement-card-desc">${achievement.description}</div>
                </div>
            `;
        });
        
        achievementsList.innerHTML = html;
    }

    // 実績解除を表示
    showAchievementUnlock(achievements) {
        achievements.forEach((achievement, index) => {
            setTimeout(() => {
                const modal = document.createElement('div');
                modal.className = 'achievement-modal';
                modal.innerHTML = `
                    <div class="achievement-content">
                        <div class="achievement-icon">${achievement.icon}</div>
                        <div class="achievement-title">実績解除！</div>
                        <div class="achievement-name">${achievement.name}</div>
                        <div class="achievement-desc">${achievement.description}</div>
                    </div>
                `;
                document.body.appendChild(modal);
                
                setTimeout(() => {
                    modal.classList.add('show');
                }, 100);
                
                setTimeout(() => {
                    modal.classList.remove('show');
                    setTimeout(() => modal.remove(), 500);
                }, 3000);
            }, index * 3500);
        });
    }

    // 中断確認ダイアログを表示
    showStopConfirmation() {
        const modal = document.createElement('div');
        modal.className = 'confirm-modal';
        modal.innerHTML = `
            <div class="confirm-overlay"></div>
            <div class="confirm-content">
                <div class="confirm-icon">⚠️</div>
                <h3 class="confirm-title">ゲームを中断しますか？</h3>
                <p class="confirm-message">プレイ記録は保存されず、実績も解除されません</p>
                <div class="confirm-buttons">
                    <button class="confirm-btn confirm-btn-cancel">キャンセル</button>
                    <button class="confirm-btn confirm-btn-confirm">中断する</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // アニメーション用に少し遅延
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // ボタンイベント
        const cancelBtn = modal.querySelector('.confirm-btn-cancel');
        const confirmBtn = modal.querySelector('.confirm-btn-confirm');
        
        const closeModal = () => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        };
        
        cancelBtn.onclick = () => {
            closeModal();
            // ゲームに戻る - 入力フィールドにフォーカス
            const typingInput = document.getElementById('typing-input');
            if (typingInput) {
                typingInput.focus();
            }
        };
        
        confirmBtn.onclick = () => {
            closeModal();
            // ゲームを強制終了（実績解除なし、スコア保存なし）
            game.isPlaying = false;
            if (game.timerInterval) {
                clearInterval(game.timerInterval);
                game.timerInterval = null;
            }
            this.showScreen('category-screen');
        };
        
        // オーバーレイクリックで閉じる
        const overlay = modal.querySelector('.confirm-overlay');
        overlay.onclick = () => {
            closeModal();
            const typingInput = document.getElementById('typing-input');
            if (typingInput) {
                typingInput.focus();
            }
        };
    }
}

// グローバル変数としてappを保存
let app;

// ローディング画面を表示
function showLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingProgress = document.getElementById('loading-progress');
    
    if (!loadingScreen || !loadingProgress) return;
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        loadingProgress.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 300);
        }
    }, 100);
}

// カウントダウンを表示
function showCountdown(callback) {
    const countdownScreen = document.getElementById('countdown-screen');
    const countdownNumber = document.getElementById('countdown-number');
    
    if (!countdownScreen || !countdownNumber) {
        if (callback) callback();
        return;
    }
    
    let count = 3;
    countdownScreen.classList.add('show');
    countdownNumber.textContent = count;
    
    const interval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownNumber.textContent = count;
        } else if (count === 0) {
            countdownNumber.textContent = 'Start!';
        } else {
            clearInterval(interval);
            countdownScreen.classList.remove('show');
            if (callback) callback();
        }
    }, 1000);
}

// ページ読み込み完了時にアプリを初期化
document.addEventListener('DOMContentLoaded', () => {
    // ローディング画面を表示
    showLoading();
    
    // アプリ初期化
    app = new App();
    
    // ゲームにコールバックを設定（結果を受け取る）
    game.onGameEnd = (results) => {
        // 称号を判定してresultsに追加
        const rankInfo = app.getRank(results.score, results.accuracy, results.maxCombo);
        results.rank = rankInfo.rank;
        
        // スコアを保存
        scoreStorage.saveScore(results);
        
        // 実績をチェック
        const unlockedAchievements = achievementManager.checkAchievements(results);
        
        // 実績解除があれば表示
        if (unlockedAchievements.length > 0) {
            app.showAchievementUnlock(unlockedAchievements);
        }
        
        // 結果画面を表示
        app.showResults(results);
    };
});
