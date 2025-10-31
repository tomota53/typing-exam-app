// 実績管理クラス
class AchievementManager {
    constructor() {
        this.achievements = [
            {
                id: 'first_play',
                name: 'はじめの一歩',
                description: '初めてプレイした',
                icon: '🎯',
                condition: (stats) => stats.totalGames >= 1
            },
            {
                id: 'keep_going',
                name: '継続は力なり',
                description: '5回プレイした',
                icon: '💪',
                condition: (stats) => stats.totalGames >= 5
            },
            {
                id: 'hard_worker',
                name: '努力家',
                description: '50回プレイした',
                icon: '⭐',
                condition: (stats) => stats.totalGames >= 50
            },
            {
                id: 'speed_star',
                name: 'スピードスター',
                description: '平均入力速度5文字/秒達成',
                icon: '⚡',
                condition: (stats) => stats.maxSpeed >= 5
            },
            {
                id: 'light_speed',
                name: '光速の指',
                description: '平均入力速度7文字/秒達成',
                icon: '💫',
                condition: (stats) => stats.maxSpeed >= 7
            },
            {
                id: 'perfectionist',
                name: '完璧主義者',
                description: 'ミスなしでクリア',
                icon: '💯',
                condition: (stats) => stats.perfectClear
            },
            {
                id: 'genius',
                name: '天才の片鱗',
                description: 'スコア80点以上達成',
                icon: '🌟',
                condition: (stats) => stats.bestScore >= 80
            },
            {
                id: 'godlike',
                name: '神の領域',
                description: 'スコア95点以上達成',
                icon: '👑',
                condition: (stats) => stats.bestScore >= 95
            },
            {
                id: 'combo_master',
                name: 'コンボマスター',
                description: '30コンボ達成',
                icon: '🔥',
                condition: (stats) => stats.maxCombo >= 30
            },
            {
                id: 'all_categories',
                name: '全カテゴリ制覇',
                description: 'すべてのカテゴリをプレイ',
                icon: '🏆',
                condition: (stats) => stats.categoriesPlayed >= 10
            },
            {
                id: 'century',
                name: '百戦錬磨',
                description: '100回プレイした',
                icon: '💎',
                condition: (stats) => stats.totalGames >= 100
            },
            {
                id: 'marathon',
                name: 'マラソンランナー',
                description: '200回プレイした',
                icon: '🏃',
                condition: (stats) => stats.totalGames >= 200
            },
            {
                id: 'super_combo',
                name: 'スーパーコンボ',
                description: '50コンボ達成',
                icon: '💥',
                condition: (stats) => stats.maxCombo >= 50
            },
            {
                id: 'ultra_combo',
                name: 'ウルトラコンボ',
                description: '100コンボ達成',
                icon: '🌪️',
                condition: (stats) => stats.maxCombo >= 100
            },
            {
                id: 'score_master',
                name: 'スコアマスター',
                description: 'スコア90点以上を10回達成',
                icon: '🎖️',
                condition: (stats) => stats.highScoreCount >= 10
            },
            {
                id: 'accuracy_king',
                name: '正確王',
                description: '正答率100%を5回達成',
                icon: '🎯',
                condition: (stats) => stats.perfectCount >= 5
            },
            {
                id: 'night_owl',
                name: '夜更かし',
                description: '深夜（0時〜6時）にプレイ',
                icon: '🦉',
                condition: (stats) => stats.nightPlay
            },
            {
                id: 'early_bird',
                name: '早起き',
                description: '早朝（5時〜7時）にプレイ',
                icon: '🐦',
                condition: (stats) => stats.morningPlay
            },
            {
                id: 'speed_demon',
                name: '超音速',
                description: '平均入力速度10文字/秒達成',
                icon: '🚀',
                condition: (stats) => stats.maxSpeed >= 10
            },
            {
                id: 'collector',
                name: 'コレクター',
                description: '実績を10個解除',
                icon: '📚',
                condition: (stats) => stats.achievementCount >= 10
            },
            {
                id: 'weekend_warrior',
                name: '週末プレイヤー',
                description: '土日にプレイ',
                icon: '🎮',
                condition: (stats) => stats.weekendPlay
            },
            {
                id: 'weekday_fighter',
                name: '平日戦士',
                description: '平日にプレイ',
                icon: '💼',
                condition: (stats) => stats.weekdayPlay
            },
            {
                id: 'fever_mode',
                name: 'フィーバー',
                description: '1日に10回以上プレイ',
                icon: '🎊',
                condition: (stats) => stats.dailyPlayCount >= 10
            },
            {
                id: 'skilled_player',
                name: '熟練者',
                description: '平均スコア70点以上',
                icon: '🥈',
                condition: (stats) => stats.averageScore >= 70
            },
            {
                id: 'elite_player',
                name: 'エリート',
                description: '平均スコア80点以上',
                icon: '🥇',
                condition: (stats) => stats.averageScore >= 80
            },
            {
                id: 'legend_points',
                name: 'レジェンド',
                description: '累計スコア10000点達成',
                icon: '🌠',
                condition: (stats) => stats.totalScore >= 10000
            },
            {
                id: 'master_level',
                name: '達人の域',
                description: '全実績の50%解除',
                icon: '🎓',
                condition: (stats) => stats.achievementRate >= 50
            },
            {
                id: 'combo_god',
                name: 'コンボ神',
                description: '150コンボ達成',
                icon: '⚡',
                condition: (stats) => stats.maxCombo >= 150
            },
            {
                id: 'ultimate_player',
                name: '究極のプレイヤー',
                description: 'スコア98点以上達成',
                icon: '💠',
                condition: (stats) => stats.bestScore >= 98
            },
            {
                id: 'platinum_trophy',
                name: 'プラチナトロフィー',
                description: '全実績の75%解除',
                icon: '🏅',
                condition: (stats) => stats.achievementRate >= 75
            }
        ];
        
        this.unlockedAchievements = this.loadUnlockedAchievements();
    }

    // 解除済み実績を読み込み
    loadUnlockedAchievements() {
        try {
            const saved = localStorage.getItem('typingApp_achievements');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('実績の読み込みに失敗しました:', error);
            return [];
        }
    }

    // 解除済み実績を保存
    saveUnlockedAchievements() {
        try {
            localStorage.setItem('typingApp_achievements', JSON.stringify(this.unlockedAchievements));
        } catch (error) {
            console.error('実績の保存に失敗しました:', error);
        }
    }

    // 実績をチェック
    checkAchievements(gameResult) {
        const stats = this.calculateStats(gameResult);
        const newlyUnlocked = [];

        this.achievements.forEach(achievement => {
            // 未解除かつ条件を満たす場合
            if (!this.isUnlocked(achievement.id) && achievement.condition(stats)) {
                this.unlockAchievement(achievement.id);
                newlyUnlocked.push(achievement);
            }
        });

        return newlyUnlocked;
    }

    // 統計を計算
    calculateStats(gameResult) {
        const history = scoreStorage.getGameHistory();
        const statistics = scoreStorage.getStatistics();
        
        // カテゴリ数をカウント
        const playedCategories = new Set();
        history.forEach(record => {
            if (record.category && record.category.id) {
                playedCategories.add(record.category.id);
            }
        });

        // 最大速度を計算
        let maxSpeed = 0;
        history.forEach(record => {
            if (record.averageSpeed && parseFloat(record.averageSpeed) > maxSpeed) {
                maxSpeed = parseFloat(record.averageSpeed);
            }
        });

        // 最大コンボを取得
        let maxCombo = 0;
        history.forEach(record => {
            if (record.maxCombo > maxCombo) {
                maxCombo = record.maxCombo;
            }
        });

        // 完璧クリア判定
        const perfectClear = gameResult.wrong === 0 && gameResult.correct > 0;
        
        // 高スコア回数（90点以上）
        const highScoreCount = history.filter(r => r.score >= 90).length;
        
        // 正答率100%の回数
        const perfectCount = history.filter(r => r.accuracy === 100).length;
        
        // 時間帯判定
        const currentHour = new Date().getHours();
        const nightPlay = currentHour >= 0 && currentHour < 6;
        const morningPlay = currentHour >= 5 && currentHour < 7;
        
        // 曜日判定
        const currentDay = new Date().getDay();
        const weekendPlay = currentDay === 0 || currentDay === 6; // 日曜日または土曜日
        const weekdayPlay = currentDay >= 1 && currentDay <= 5; // 月曜日から金曜日
        
        // 1日のプレイ回数をカウント
        const today = new Date().toDateString();
        const dailyPlayCount = history.filter(record => {
            const recordDate = new Date(record.date).toDateString();
            return recordDate === today;
        }).length;
        
        // 累計スコアを計算
        const totalScore = history.reduce((sum, record) => sum + (record.score || 0), 0);
        
        // 実績解除数と解除率
        const achievementCount = this.unlockedAchievements.length;
        const achievementRate = Math.round((achievementCount / this.achievements.length) * 100);

        return {
            totalGames: statistics.totalGames,
            bestScore: statistics.bestScore,
            averageScore: statistics.averageScore,
            maxSpeed: maxSpeed,
            maxCombo: maxCombo,
            perfectClear: perfectClear,
            categoriesPlayed: playedCategories.size,
            highScoreCount: highScoreCount,
            perfectCount: perfectCount,
            nightPlay: nightPlay,
            morningPlay: morningPlay,
            weekendPlay: weekendPlay,
            weekdayPlay: weekdayPlay,
            dailyPlayCount: dailyPlayCount,
            totalScore: totalScore,
            achievementCount: achievementCount,
            achievementRate: achievementRate
        };
    }

    // 実績を解除
    unlockAchievement(achievementId) {
        if (!this.unlockedAchievements.includes(achievementId)) {
            this.unlockedAchievements.push(achievementId);
            this.saveUnlockedAchievements();
        }
    }

    // 実績が解除されているか確認
    isUnlocked(achievementId) {
        return this.unlockedAchievements.includes(achievementId);
    }

    // すべての実績を取得
    getAllAchievements() {
        return this.achievements.map(achievement => ({
            ...achievement,
            unlocked: this.isUnlocked(achievement.id)
        }));
    }

    // 解除率を計算
    getUnlockPercentage() {
        return Math.round((this.unlockedAchievements.length / this.achievements.length) * 100);
    }
}

// グローバルインスタンスを作成
const achievementManager = new AchievementManager();
