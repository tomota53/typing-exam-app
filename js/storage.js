// ローカルストレージを使ったスコア管理
class ScoreStorage {
    constructor() {
        this.storageKey = 'typingExamScores';
    }

    // ゲーム結果を保存する
    saveGameResult(result) {
        const history = this.getGameHistory();
        
        // 新しいゲーム結果を追加
        const newResult = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            date: new Date().toISOString(),
            category: result.category || null,
            score: result.score || 0,
            correct: result.correct || 0,
            wrong: result.wrong || 0,
            accuracy: result.accuracy || 0,
            maxCombo: result.maxCombo || 0,
            averageSpeed: result.averageSpeed || 0,
            time: result.time || 0,
            rank: result.rank || '見習い'
        };
        
        history.push(newResult);
        
        // 最大100件まで保存
        const limitedHistory = history.slice(-100);
        
        // ローカルストレージに保存
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(limitedHistory));
            this.updateStatistics();
            return true;
        } catch (error) {
            console.error('ゲーム結果の保存に失敗しました:', error);
            return false;
        }
    }

    // 旧メソッドとの互換性のため残す
    saveScore(scoreData) {
        return this.saveGameResult(scoreData);
    }

    // ゲーム履歴を取得
    getGameHistory() {
        try {
            const historyJson = localStorage.getItem(this.storageKey);
            const history = historyJson ? JSON.parse(historyJson) : [];
            // 新しい順に並び替え
            return history.sort((a, b) => b.timestamp - a.timestamp);
        } catch (error) {
            console.error('履歴の読み込みに失敗しました:', error);
            return [];
        }
    }

    // すべてのスコアを取得
    getAllScores() {
        try {
            const scoresJson = localStorage.getItem(this.storageKey);
            return scoresJson ? JSON.parse(scoresJson) : [];
        } catch (error) {
            console.error('スコアの読み込みに失敗しました:', error);
            return [];
        }
    }

    // トップスコアを取得（上位10件）
    getTopScores(limit = 10) {
        const scores = this.getAllScores();
        return scores
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }

    // 最新のスコアを取得
    getLatestScore() {
        const scores = this.getAllScores();
        return scores.length > 0 ? scores[0] : null;
    }

    // 平均スコアを計算
    getAverageScore() {
        const scores = this.getAllScores();
        if (scores.length === 0) return 0;
        
        const total = scores.reduce((sum, score) => sum + score.score, 0);
        return Math.round(total / scores.length);
    }

    // ベストスコアを取得
    getBestScore() {
        const scores = this.getAllScores();
        if (scores.length === 0) return 0;
        
        return Math.max(...scores.map(s => s.score));
    }

    // スコアをすべて削除
    clearAllScores() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('スコアの削除に失敗しました:', error);
            return false;
        }
    }

    // 日付をフォーマット
    formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}/${month}/${day} ${hours}:${minutes}`;
    }

    // 統計情報を取得
    getStatistics() {
        const history = this.getGameHistory();
        
        if (history.length === 0) {
            return {
                totalGames: 0,
                averageScore: 0,
                bestScore: 0,
                bestRank: '見習い',
                totalCorrect: 0,
                totalWrong: 0,
                averageAccuracy: 0,
                maxCombo: 0,
                favoriteCategory: null
            };
        }

        const totalScore = history.reduce((sum, h) => sum + h.score, 0);
        const totalCorrect = history.reduce((sum, h) => sum + h.correct, 0);
        const totalWrong = history.reduce((sum, h) => sum + h.wrong, 0);
        const totalAccuracy = history.reduce((sum, h) => sum + h.accuracy, 0);
        const maxCombo = Math.max(...history.map(h => h.maxCombo || 0));
        
        // 最高スコアの記録を取得
        const bestGame = history.reduce((best, h) => 
            h.score > best.score ? h : best, history[0]);
        
        // 最高スコアから称号を計算（過去の記録が古い場合のため）
        let bestRank = bestGame.rank;
        if (!bestRank || bestRank === '見習い') {
            // 称号を再計算
            const score = bestGame.score;
            
            if (score >= 1000) {
                bestRank = '絶対的存在';
            } else if (score >= 800) {
                bestRank = '次元の創造主';
            } else if (score >= 600) {
                bestRank = '無限の境地';
            } else if (score >= 500) {
                bestRank = '神々の頂点';
            } else if (score >= 400) {
                bestRank = '宇宙の支配者';
            } else if (score >= 350) {
                bestRank = '時空を統べる者';
            } else if (score >= 300) {
                bestRank = '次元を超えし者';
            } else if (score >= 250) {
                bestRank = '全知全能';
            } else if (score >= 200) {
                bestRank = '究極神';
            } else if (score >= 180) {
                bestRank = '超越神';
            } else if (score >= 160) {
                bestRank = '破壊神';
            } else if (score >= 140) {
                bestRank = 'タイピング神';
            } else if (score >= 120) {
                bestRank = '界王神';
            } else if (score >= 100) {
                bestRank = '覇王';
            } else if (score >= 85) {
                bestRank = '伝説';
            } else if (score >= 70) {
                bestRank = '英雄';
            } else if (score >= 55) {
                bestRank = '天才';
            } else if (score >= 40) {
                bestRank = '秀才';
            } else if (score >= 25) {
                bestRank = '一般人';
            } else if (score >= 10) {
                bestRank = '初心者';
            } else {
                bestRank = '見習い';
            }
        }
        
        // お気に入りカテゴリ（最も多くプレイしたカテゴリ）
        const categoryCount = {};
        history.forEach(h => {
            if (h.category && h.category.name) {
                categoryCount[h.category.name] = (categoryCount[h.category.name] || 0) + 1;
            }
        });
        const favoriteCategory = Object.keys(categoryCount).length > 0
            ? Object.keys(categoryCount).reduce((a, b) => 
                categoryCount[a] > categoryCount[b] ? a : b)
            : null;
        
        return {
            totalGames: history.length,
            averageScore: Math.round(totalScore / history.length),
            bestScore: bestGame.score,
            bestRank: bestRank,
            totalCorrect: totalCorrect,
            totalWrong: totalWrong,
            averageAccuracy: Math.round(totalAccuracy / history.length),
            maxCombo: maxCombo,
            favoriteCategory: favoriteCategory
        };
    }

    // 履歴をクリア
    clearHistory() {
        if (confirm('すべての履歴を削除しますか？この操作は取り消せません。')) {
            return this.clearAllScores();
        }
        return false;
    }

    // カテゴリ別の統計を取得
    getCategoryStats(categoryId) {
        const history = this.getGameHistory();
        const categoryGames = history.filter(h => 
            h.category && h.category.id === categoryId
        );
        
        if (categoryGames.length === 0) {
            return {
                playCount: 0,
                averageScore: 0,
                bestScore: 0,
                averageAccuracy: 0
            };
        }
        
        const totalScore = categoryGames.reduce((sum, g) => sum + g.score, 0);
        const totalAccuracy = categoryGames.reduce((sum, g) => sum + g.accuracy, 0);
        
        return {
            playCount: categoryGames.length,
            averageScore: Math.round(totalScore / categoryGames.length),
            bestScore: Math.max(...categoryGames.map(g => g.score)),
            averageAccuracy: Math.round(totalAccuracy / categoryGames.length)
        };
    }

    // 統計情報を更新（内部用）
    updateStatistics() {
        // 将来的な拡張のための予約メソッド
        // 現在は特に処理なし
    }
}

// グローバルインスタンスを作成
const scoreStorage = new ScoreStorage();
