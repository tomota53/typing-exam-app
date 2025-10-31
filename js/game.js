// ひらがなをローマ字に変換する関数
function hiraganaToRomaji(hiragana) {
    const map = {
        'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
        'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
        'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
        'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
        'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
        'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
        'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
        'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
        'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
        'わ': 'wa', 'を': 'wo', 'ん': 'n',
        'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
        'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
        'だ': 'da', 'ぢ': 'di', 'づ': 'du', 'で': 'de', 'ど': 'do',
        'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
        'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
        'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo',
        'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'sho',
        'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'cho',
        'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo',
        'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo',
        'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myo',
        'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',
        'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyo',
        'じゃ': 'ja', 'じゅ': 'ju', 'じょ': 'jo',
        'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo',
        'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo',
        'ー': '-', '　': ' ', ' ': ' '
    };
    
    let result = '';
    let i = 0;
    
    while (i < hiragana.length) {
        // 促音(っ)の処理
        if (hiragana[i] === 'っ' && i < hiragana.length - 1) {
            const nextChar = hiragana[i + 1];
            // 次の文字の子音を取得
            let consonant = '';
            
            // 2文字の組み合わせをチェック（きゃ、しゃなど）
            if (i + 1 < hiragana.length - 1) {
                const twoChar = hiragana.substring(i + 1, i + 3);
                if (map[twoChar]) {
                    consonant = map[twoChar][0]; // 最初の文字を子音として使用
                }
            }
            
            // 1文字の場合
            if (!consonant && map[nextChar]) {
                consonant = map[nextChar][0]; // 最初の文字を子音として使用
            }
            
            result += consonant || 't'; // 子音が取得できない場合はtを使用
            i++;
            continue;
        }
        
        // 2文字の組み合わせをチェック
        if (i < hiragana.length - 1) {
            const twoChar = hiragana.substring(i, i + 2);
            if (map[twoChar]) {
                result += map[twoChar];
                i += 2;
                continue;
            }
        }
        
        // 1文字をチェック
        const oneChar = hiragana[i];
        if (map[oneChar]) {
            result += map[oneChar];
        } else {
            result += oneChar; // マッピングにない文字はそのまま
        }
        i++;
    }
    
    return result;
}

// ゲームロジックを管理するクラス
class TypingGame {
    constructor() {
        this.currentWord = null;
        this.score = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.timeLeft = 60;
        this.timerInterval = null;
        this.isPlaying = false;
        this.usedWords = [];
        this.combo = 0;
        this.maxCombo = 0;
        this.maxMistakes = Infinity; // ミス制限（デフォルトは無制限）
        this.category = null;
        this.categoryWords = [];
        this.questionStartTime = null;
        this.totalQuestions = 0;
        this.averageSpeed = 0;
        this.onGameEnd = null; // ゲーム終了時のコールバック
    }

    // ゲームを開始（カテゴリ指定、モード指定）
    start(category = null, mode = 'timeattack') {
        this.reset();
        this.category = category;
        this.mode = mode;
        
        // モードに応じた初期設定
        switch(mode) {
            case 'quick':
                this.timeLeft = 30;
                this.maxMistakes = Infinity;
                break;
            case 'perfect':
                this.timeLeft = Infinity;
                this.maxMistakes = 3;
                break;
            case 'survival':
                this.timeLeft = Infinity;
                this.maxMistakes = 1;
                break;
            case 'timeattack':
            default:
                this.timeLeft = 60;
                this.maxMistakes = Infinity;
                break;
        }
        
        // カテゴリが指定されている場合、そのカテゴリの問題を使用
        if (category && category.words) {
            this.categoryWords = [...category.words];
            this.totalQuestions = this.categoryWords.length;
        } else {
            // カテゴリが指定されていない場合は全問題から選択
            this.categoryWords = [];
            categories.forEach(cat => {
                this.categoryWords.push(...cat.words);
            });
            this.totalQuestions = this.categoryWords.length;
        }
        
        this.isPlaying = true;
        this.nextWord();
        
        // タイマーモードの場合のみタイマー開始
        if (this.timeLeft !== Infinity) {
            this.startTimer();
        }
    }

    // ゲームをリセット
    reset() {
        this.score = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.timeLeft = 60;
        this.maxMistakes = Infinity; // ミス制限をリセット
        this.usedWords = [];
        this.currentWord = null;
        this.combo = 0;
        this.maxCombo = 0;
        this.questionStartTime = null;
        this.averageSpeed = 0;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    // タイマーを開始
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.end();
            }
        }, 1000);
    }

    // 次の単語を取得
    nextWord() {
        if (this.categoryWords.length === 0) {
            return null;
        }

        // 全ての単語を使い切ったらリセット
        if (this.usedWords.length >= this.categoryWords.length) {
            this.usedWords = [];
        }

        // 使用していない単語からランダムに選択
        const availableWords = this.categoryWords.filter(
            word => !this.usedWords.some(used => used.word === word.word)
        );

        if (availableWords.length === 0) {
            this.usedWords = [];
            return this.nextWord();
        }

        const randomIndex = Math.floor(Math.random() * availableWords.length);
        this.currentWord = availableWords[randomIndex];
        this.usedWords.push(this.currentWord);
        
        // 問題開始時間を記録
        this.questionStartTime = Date.now();

        return this.currentWord;
    }

    // 入力をチェック
    checkInput(input) {
        if (!this.isPlaying || !this.currentWord) {
            return null;
        }

        const normalizedInput = input.trim().toLowerCase();
        // 読み仮名をローマ字に変換
        const correctRomaji = hiraganaToRomaji(this.currentWord.reading).toLowerCase();

        if (normalizedInput === correctRomaji) {
            // 正解
            this.correctCount++;
            this.combo++;
            
            // 最大コンボ更新
            if (this.combo > this.maxCombo) {
                this.maxCombo = this.combo;
            }
            
            // 入力速度を計算（文字/秒）
            const timeElapsed = (Date.now() - this.questionStartTime) / 1000;
            const speed = correctRomaji.length / timeElapsed;
            
            // スコア計算
            const points = this.calculateScore(correctRomaji.length, this.combo, speed);
            this.score += points;
            
            return {
                isCorrect: true,
                points: points,
                word: this.currentWord,
                combo: this.combo,
                speed: speed.toFixed(2)
            };
        } else if (normalizedInput.length >= correctRomaji.length) {
            // 不正解（文字数が同じか超えた場合）
            this.wrongCount++;
            this.combo = 0; // コンボリセット
            
            console.log('[DEBUG] 不正解:', {
                wrongCount: this.wrongCount,
                maxMistakes: this.maxMistakes,
                isInfinity: this.maxMistakes === Infinity,
                shouldEnd: this.maxMistakes !== Infinity && this.wrongCount >= this.maxMistakes
            });
            
            // ミス制限モードでゲームオーバーチェック
            if (this.maxMistakes !== Infinity && this.wrongCount >= this.maxMistakes) {
                console.log('[DEBUG] ゲーム終了条件を満たしました。end()を呼びます');
                this.end();
                console.log('[DEBUG] end()完了。isPlaying:', this.isPlaying);
            }
            
            return {
                isCorrect: false,
                correctAnswer: correctRomaji,
                word: this.currentWord
            };
        }

        return null; // まだ判定しない
    }

    // スコアを計算
    calculateScore(length, combo, speed) {
        // 基本点: 10点
        let baseScore = 10;
        
        // コンボボーナス: コンボ数 × 2点
        let comboBonus = combo * 2;
        
        // 速度ボーナス: 入力速度に応じて加点
        let speedBonus = 0;
        if (speed >= 5) {
            speedBonus = 10;
        } else if (speed >= 4) {
            speedBonus = 5;
        } else if (speed >= 3) {
            speedBonus = 3;
        }
        
        // コンボ倍率を適用
        let multiplier = this.getComboMultiplier(combo);
        
        return Math.round((baseScore + comboBonus + speedBonus) * multiplier);
    }

    // コンボ倍率を取得
    getComboMultiplier(combo) {
        if (combo >= 30) return 2.5;
        if (combo >= 20) return 2.0;
        if (combo >= 10) return 1.5;
        if (combo >= 5) return 1.2;
        return 1.0;
    }

    // 得点を計算（文字数に応じて）- 後方互換性のため残す
    calculatePoints(length) {
        if (length <= 5) return 10;
        if (length <= 8) return 20;
        if (length <= 12) return 30;
        return 50;
    }

    // タイマー表示を更新
    updateTimerDisplay() {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = this.timeLeft;
            
            // 残り時間が少なくなったら警告アニメーション
            if (this.timeLeft <= 10) {
                timerElement.style.color = '#f44336';
                timerElement.classList.add('timer-warning');
            } else {
                timerElement.style.color = '#f5576c';
                timerElement.classList.remove('timer-warning');
            }
        }
    }

    // スコア表示を更新
    updateScoreDisplay() {
        const scoreElement = document.getElementById('score');
        const comboElement = document.getElementById('combo');
        
        if (scoreElement) {
            scoreElement.textContent = this.score;
        }
        if (comboElement) {
            comboElement.textContent = this.combo;
        }
        
        // 進捗バー更新
        this.updateProgressBar();
    }

    // 進捗バーを更新
    updateProgressBar() {
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        
        const answered = this.correctCount + this.wrongCount;
        const progress = (answered / this.totalQuestions) * 100;
        
        if (progressBar) {
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        }
        if (progressText) {
            progressText.textContent = `${answered} / ${this.totalQuestions}`;
        }
    }

    // 単語表示を更新
    updateWordDisplay() {
        const japaneseElement = document.getElementById('japanese-word');
        const readingElement = document.getElementById('reading-word');
        const romajiElement = document.getElementById('romaji-display');
        const hintElement = document.getElementById('hint-text');
        
        if (this.currentWord) {
            if (japaneseElement) {
                japaneseElement.textContent = this.currentWord.word;
            }
            if (readingElement) {
                readingElement.textContent = this.currentWord.reading;
            }
            // ローマ字表示を追加
            if (romajiElement) {
                const romaji = hiraganaToRomaji(this.currentWord.reading);
                romajiElement.textContent = `入力: ${romaji}`;
            }
            if (hintElement) {
                hintElement.textContent = this.currentWord.hint ? `補足: ${this.currentWord.hint}` : '';
            }
        }
    }

    // ゲームを終了
    end() {
        this.isPlaying = false;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        // 正答率を計算
        const totalAttempts = this.correctCount + this.wrongCount;
        const accuracy = totalAttempts > 0 
            ? Math.round((this.correctCount / totalAttempts) * 100) 
            : 0;

        // 平均速度を計算（時間無制限モードの場合の処理も追加）
        let totalTime;
        if (this.timeLeft === Infinity) {
            // 時間無制限モードの場合、経過時間を計算できないので0とする
            totalTime = 0;
        } else {
            totalTime = 60 - this.timeLeft;
        }
        
        // 平均速度（totalTimeが0または正解数が0の場合は0）
        const averageSpeed = (totalAttempts > 0 && totalTime > 0 && this.correctCount > 0)
            ? (this.correctCount / totalTime).toFixed(2)
            : '0';

        const results = {
            score: this.score,
            correct: this.correctCount,
            wrong: this.wrongCount,
            accuracy: accuracy,
            maxCombo: this.maxCombo,
            averageSpeed: averageSpeed,
            time: totalTime,
            category: this.category // カテゴリ情報を追加
        };

        // コールバックがあれば実行
        if (this.onGameEnd) {
            this.onGameEnd(results);
        }

        return results;
    }

    // ゲームの状態を取得
    getState() {
        return {
            score: this.score,
            correctCount: this.correctCount,
            wrongCount: this.wrongCount,
            timeLeft: this.timeLeft,
            isPlaying: this.isPlaying,
            currentWord: this.currentWord
        };
    }

    // プレイ中かどうか
    isGamePlaying() {
        return this.isPlaying;
    }
}

// グローバルインスタンスを作成
const game = new TypingGame();
