class QuizSystem {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = -1;
        this.answers = {};
        this.init();
    }

    async init() {
        await this.loadQuestions();
        this.setupEventListeners();
        this.renderQuestionList();
        this.updateProgress();
    }

    async loadQuestions() {
        try {
            const response = await fetch('questions.json');
            const data = await response.json();
            this.questions = data.questions;
        } catch (error) {
            console.error('加载题目失败:', error);
            this.showError('无法加载题目数据，请检查网络连接。');
        }
    }

    setupEventListeners() {
        // 题目导航按钮
        document.getElementById('prevBtn').addEventListener('click', () => {
            this.navigateQuestion(-1);
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            this.navigateQuestion(1);
        });

        // 答案输入框
        const answerText = document.getElementById('answerText');
        answerText.addEventListener('input', (e) => {
            this.saveAnswer(e.target.value);
            this.updateAnswerStats(e.target.value);
        });

        // 工具按钮
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearCurrentAnswer();
        });

        document.getElementById('saveBtn').addEventListener('click', () => {
            this.saveCurrentAnswer();
        });

        // 提交按钮
        document.getElementById('submitAllBtn').addEventListener('click', () => {
            this.showSubmitModal();
        });

        // 模态框
        document.getElementById('modalClose').addEventListener('click', () => {
            this.hideSubmitModal();
        });

        document.getElementById('cancelSubmit').addEventListener('click', () => {
            this.hideSubmitModal();
        });

        document.getElementById('confirmSubmit').addEventListener('click', () => {
            this.submitAllAnswers();
        });

        // 点击模态框外部关闭
        document.getElementById('submitModal').addEventListener('click', (e) => {
            if (e.target.id === 'submitModal') {
                this.hideSubmitModal();
            }
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 's':
                        e.preventDefault();
                        this.saveCurrentAnswer();
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.navigateQuestion(-1);
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.navigateQuestion(1);
                        break;
                }
            }
        });
    }

    renderQuestionList() {
        const questionList = document.getElementById('questionList');
        const totalPoints = document.getElementById('totalPoints');
        
        let totalPointsSum = 0;
        questionList.innerHTML = '';

        this.questions.forEach((question, index) => {
            totalPointsSum += question.points;
            
            const questionItem = document.createElement('div');
            questionItem.className = 'question-item';
            questionItem.dataset.index = index;
            
            if (this.answers[question.id]) {
                questionItem.classList.add('answered');
            }

            questionItem.innerHTML = `
                <div class="question-item-header">
                    <span class="question-item-number">第 ${index + 1} 题</span>
                    <span class="question-item-points">${question.points}分</span>
                </div>
                <div class="question-item-title">${question.title}</div>
            `;

            questionItem.addEventListener('click', () => {
                this.selectQuestion(index);
            });

            questionList.appendChild(questionItem);
        });

        totalPoints.textContent = totalPointsSum;
    }

    selectQuestion(index) {
        if (index < 0 || index >= this.questions.length) return;

        // 更新当前题目索引
        this.currentQuestionIndex = index;
        
        // 更新侧边栏选中状态
        document.querySelectorAll('.question-item').forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });

        // 显示题目内容
        this.displayQuestion(this.questions[index]);
        
        // 更新导航按钮状态
        this.updateNavigationButtons();
        
        // 显示答题区域
        document.getElementById('answerSection').style.display = 'block';
        
        // 加载已保存的答案
        this.loadSavedAnswer(this.questions[index].id);
    }

    displayQuestion(question) {
        document.getElementById('questionTitle').textContent = question.title;
        document.getElementById('questionNumber').textContent = `第 ${this.currentQuestionIndex + 1} 题`;
        document.getElementById('questionPoints').textContent = `${question.points} 分`;
        document.getElementById('questionText').innerHTML = `
            <div style="white-space: pre-wrap; line-height: 1.6;">${question.question}</div>
        `;
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        prevBtn.disabled = this.currentQuestionIndex <= 0;
        nextBtn.disabled = this.currentQuestionIndex >= this.questions.length - 1;
    }

    navigateQuestion(direction) {
        const newIndex = this.currentQuestionIndex + direction;
        if (newIndex >= 0 && newIndex < this.questions.length) {
            this.selectQuestion(newIndex);
        }
    }

    saveAnswer(answer) {
        if (this.currentQuestionIndex >= 0) {
            const questionId = this.questions[this.currentQuestionIndex].id;
            this.answers[questionId] = answer;
            
            // 更新侧边栏显示状态
            const questionItem = document.querySelector(`[data-index="${this.currentQuestionIndex}"]`);
            if (answer.trim()) {
                questionItem.classList.add('answered');
            } else {
                questionItem.classList.remove('answered');
            }
            
            this.updateProgress();
            this.saveToLocalStorage();
        }
    }

    loadSavedAnswer(questionId) {
        const answerText = document.getElementById('answerText');
        const savedAnswer = this.answers[questionId] || '';
        answerText.value = savedAnswer;
        this.updateAnswerStats(savedAnswer);
    }

    updateAnswerStats(text) {
        const charCount = document.getElementById('charCount');
        const wordCount = document.getElementById('wordCount');
        
        charCount.textContent = `${text.length} 字符`;
        
        // 简单的中文词数统计
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        wordCount.textContent = `${words} 词`;
    }

    clearCurrentAnswer() {
        if (confirm('确定要清空当前答案吗？')) {
            document.getElementById('answerText').value = '';
            this.saveAnswer('');
            this.showNotification('答案已清空', 'info');
        }
    }

    saveCurrentAnswer() {
        const answer = document.getElementById('answerText').value;
        this.saveAnswer(answer);
        this.showNotification('答案已保存', 'success');
    }

    updateProgress() {
        const answeredCount = Object.keys(this.answers).filter(id => this.answers[id].trim()).length;
        const totalCount = this.questions.length;
        const percentage = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;
        
        document.getElementById('progressFill').style.width = `${percentage}%`;
        document.getElementById('progressText').textContent = `${answeredCount}/${totalCount}`;
    }

    showSubmitModal() {
        const answeredCount = Object.keys(this.answers).filter(id => this.answers[id].trim()).length;
        const unansweredCount = this.questions.length - answeredCount;
        
        document.getElementById('answeredCount').textContent = answeredCount;
        document.getElementById('unansweredCount').textContent = unansweredCount;
        document.getElementById('submitModal').classList.add('show');
    }

    hideSubmitModal() {
        document.getElementById('submitModal').classList.remove('show');
    }

    submitAllAnswers() {
        // 模拟提交过程
        this.hideSubmitModal();
        this.showNotification('正在提交答案...', 'info');
        
        setTimeout(() => {
            // 生成提交报告
            const report = this.generateSubmitReport();
            this.showSubmitReport(report);
            
            // 清除本地存储
            localStorage.removeItem('quiz_answers');
            
            this.showNotification('答案提交成功！', 'success');
        }, 2000);
    }

    generateSubmitReport() {
        const answeredQuestions = [];
        const unansweredQuestions = [];
        let totalPoints = 0;
        let answeredPoints = 0;

        this.questions.forEach(question => {
            totalPoints += question.points;
            if (this.answers[question.id] && this.answers[question.id].trim()) {
                answeredQuestions.push(question);
                answeredPoints += question.points;
            } else {
                unansweredQuestions.push(question);
            }
        });

        return {
            totalQuestions: this.questions.length,
            answeredCount: answeredQuestions.length,
            unansweredCount: unansweredQuestions.length,
            totalPoints,
            answeredPoints,
            completionRate: ((answeredQuestions.length / this.questions.length) * 100).toFixed(1),
            answers: this.answers
        };
    }

    showSubmitReport(report) {
        const reportWindow = window.open('', '_blank', 'width=800,height=600');
        reportWindow.document.write(`
            <!DOCTYPE html>
            <html lang="zh-CN">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>答题报告</title>
                <style>
                    body { font-family: 'Segoe UI', sans-serif; margin: 40px; background: #f8fafc; }
                    .report-container { background: white; padding: 40px; border-radius: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
                    .report-header { text-align: center; margin-bottom: 40px; }
                    .report-title { color: #2d3748; font-size: 2rem; margin-bottom: 10px; }
                    .report-subtitle { color: #718096; }
                    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; }
                    .stat-card { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 10px; text-align: center; }
                    .stat-value { font-size: 2rem; font-weight: bold; margin-bottom: 5px; }
                    .stat-label { font-size: 0.9rem; opacity: 0.9; }
                    .answers-section { margin-top: 40px; }
                    .answer-item { background: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #667eea; }
                    .answer-question { font-weight: bold; color: #2d3748; margin-bottom: 10px; }
                    .answer-content { color: #4a5568; white-space: pre-wrap; line-height: 1.6; }
                    .no-answer { color: #e53e3e; font-style: italic; }
                </style>
            </head>
            <body>
                <div class="report-container">
                    <div class="report-header">
                        <h1 class="report-title">📊 答题报告</h1>
                        <p class="report-subtitle">提交时间: ${new Date().toLocaleString('zh-CN')}</p>
                    </div>
                    
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-value">${report.answeredCount}</div>
                            <div class="stat-label">已答题目</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${report.completionRate}%</div>
                            <div class="stat-label">完成率</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${report.answeredPoints}</div>
                            <div class="stat-label">已答分数</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${report.totalPoints}</div>
                            <div class="stat-label">总分</div>
                        </div>
                    </div>
                    
                    <div class="answers-section">
                        <h2>📝 答题详情</h2>
                        ${this.questions.map((question, index) => `
                            <div class="answer-item">
                                <div class="answer-question">第 ${index + 1} 题: ${question.title} (${question.points}分)</div>
                                <div class="answer-content">
                                    ${report.answers[question.id] && report.answers[question.id].trim() 
                                        ? report.answers[question.id] 
                                        : '<span class="no-answer">未作答</span>'}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </body>
            </html>
        `);
        reportWindow.document.close();
    }

    saveToLocalStorage() {
        localStorage.setItem('quiz_answers', JSON.stringify(this.answers));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('quiz_answers');
        if (saved) {
            try {
                this.answers = JSON.parse(saved);
            } catch (error) {
                console.error('加载本地数据失败:', error);
            }
        }
    }

    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 3000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        // 显示动画
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // 自动隐藏
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    getNotificationColor(type) {
        const colors = {
            success: 'linear-gradient(135deg, #48bb78, #38a169)',
            error: 'linear-gradient(135deg, #f56565, #e53e3e)',
            warning: 'linear-gradient(135deg, #ed8936, #dd6b20)',
            info: 'linear-gradient(135deg, #4299e1, #3182ce)'
        };
        return colors[type] || colors.info;
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #f56565, #e53e3e);
                color: white;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                margin: 20px;
                box-shadow: 0 4px 12px rgba(245, 101, 101, 0.3);
            ">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 10px;"></i>
                <h3 style="margin-bottom: 10px;">加载错误</h3>
                <p>${message}</p>
                <button onclick="location.reload()" style="
                    background: rgba(255,255,255,0.2);
                    border: 1px solid rgba(255,255,255,0.3);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 15px;
                ">重新加载</button>
            </div>
        `;
        document.body.appendChild(errorDiv);
    }
}

// 初始化答题系统
document.addEventListener('DOMContentLoaded', () => {
    const quizSystem = new QuizSystem();
    
    // 从本地存储加载数据
    quizSystem.loadFromLocalStorage();
    
    // 页面卸载时保存数据
    window.addEventListener('beforeunload', () => {
        quizSystem.saveToLocalStorage();
    });
});

// 添加一些实用的全局函数
window.quizUtils = {
    // 格式化时间
    formatTime: (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    },
    
    // 导出答案为JSON
    exportAnswers: () => {
        const answers = JSON.parse(localStorage.getItem('quiz_answers') || '{}');
        const dataStr = JSON.stringify(answers, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `quiz_answers_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    },
    
    // 导入答案
    importAnswers: (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const answers = JSON.parse(e.target.result);
                localStorage.setItem('quiz_answers', JSON.stringify(answers));
                location.reload();
            } catch (error) {
                alert('文件格式错误，请选择有效的JSON文件');
            }
        };
        reader.readAsText(file);
    }
};
