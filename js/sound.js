// 効果音管理クラス
class SoundManager {
    constructor() {
        this.sounds = {};
        this.enabled = true;
        this.volume = 0.5;
        this.loadSounds();
        this.loadSettings();
    }

    // 効果音を読み込み
    loadSounds() {
        // 効果音のパスを定義
        // ※実際の音声ファイルはassets/sounds/に配置してください
        this.sounds = {
            correct: this.createSound('assets/sounds/correct.mp3'),
            wrong: this.createSound('assets/sounds/wrong.mp3'),
            combo: this.createSound('assets/sounds/combo.mp3'),
            gameEnd: this.createSound('assets/sounds/game-end.mp3'),
            click: this.createSound('assets/sounds/click.mp3')
        };
    }

    // Audio要素を作成
    createSound(path) {
        const audio = new Audio();
        audio.src = path;
        audio.volume = this.volume;
        
        // エラーハンドリング
        audio.addEventListener('error', () => {
            console.warn(`効果音ファイルが見つかりません: ${path}`);
        });
        
        return audio;
    }

    // 効果音を再生
    play(soundName) {
        if (!this.enabled) return;
        
        const sound = this.sounds[soundName];
        if (!sound) {
            console.warn(`効果音が見つかりません: ${soundName}`);
            return;
        }

        // 再生中の場合は巻き戻して再生
        sound.currentTime = 0;
        sound.volume = this.volume;
        
        // 再生を試みる
        const playPromise = sound.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn('効果音の再生に失敗しました:', error);
            });
        }
    }

    // ON/OFFを切り替え
    toggle() {
        this.enabled = !this.enabled;
        this.saveSettings();
        return this.enabled;
    }

    // 効果音を有効化
    enable() {
        this.enabled = true;
        this.saveSettings();
    }

    // 効果音を無効化
    disable() {
        this.enabled = false;
        this.saveSettings();
    }

    // 音量を設定（0.0 - 1.0）
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        
        // すべての効果音の音量を更新
        Object.values(this.sounds).forEach(sound => {
            sound.volume = this.volume;
        });
        
        this.saveSettings();
    }

    // 設定を保存
    saveSettings() {
        try {
            const settings = {
                enabled: this.enabled,
                volume: this.volume
            };
            localStorage.setItem('typingApp_soundSettings', JSON.stringify(settings));
        } catch (error) {
            console.error('設定の保存に失敗しました:', error);
        }
    }

    // 設定を読み込み
    loadSettings() {
        try {
            const settingsJson = localStorage.getItem('typingApp_soundSettings');
            if (settingsJson) {
                const settings = JSON.parse(settingsJson);
                this.enabled = settings.enabled !== undefined ? settings.enabled : true;
                this.volume = settings.volume !== undefined ? settings.volume : 0.5;
                
                // 音量を反映
                Object.values(this.sounds).forEach(sound => {
                    sound.volume = this.volume;
                });
            }
        } catch (error) {
            console.error('設定の読み込みに失敗しました:', error);
        }
    }

    // 設定状態を取得
    getSettings() {
        return {
            enabled: this.enabled,
            volume: this.volume
        };
    }
}

// グローバルインスタンスを作成
const soundManager = new SoundManager();
