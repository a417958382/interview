class PregnancyCalendar {
    constructor() {
        this.currentDate = new Date();
        this.displayDate = new Date();
        this.lastPeriodDate = null;
        this.dueDate = null;
        this.conceptionDate = null;
        
        // 阴历数据
        this.lunarMonths = ['正月', '二月', '三月', '四月', '五月', '六月', 
                           '七月', '八月', '九月', '十月', '冬月', '腊月'];
        this.lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                         '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                         '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
        
        this.initializeElements();
        this.bindEvents();
        this.renderCalendar();
    }
    
    initializeElements() {
        this.lastPeriodInput = document.getElementById('lastPeriod');
        this.calculateBtn = document.getElementById('calculateBtn');
        this.pregnancyInfo = document.getElementById('pregnancyInfo');
        this.weeksPregnantSpan = document.getElementById('weeksPregnant');
        this.dueDateSpan = document.getElementById('dueDate');
        this.daysLeftSpan = document.getElementById('daysLeft');
        this.currentMonthSpan = document.getElementById('currentMonth');
        this.calendar = document.getElementById('calendar');
        this.prevMonthBtn = document.getElementById('prevMonth');
        this.nextMonthBtn = document.getElementById('nextMonth');
    }
    
    bindEvents() {
        this.calculateBtn.addEventListener('click', () => this.calculatePregnancy());
        this.prevMonthBtn.addEventListener('click', () => this.previousMonth());
        this.nextMonthBtn.addEventListener('click', () => this.nextMonth());
        this.lastPeriodInput.addEventListener('change', () => this.calculatePregnancy());
    }
    
    calculatePregnancy() {
        const lastPeriodValue = this.lastPeriodInput.value;
        if (!lastPeriodValue) {
            this.pregnancyInfo.style.display = 'none';
            this.renderCalendar();
            return;
        }
        
        this.lastPeriodDate = new Date(lastPeriodValue);
        
        // 计算受孕日期（末次例假后14天）
        this.conceptionDate = new Date(this.lastPeriodDate);
        this.conceptionDate.setDate(this.conceptionDate.getDate() + 14);
        
        // 计算预产期（末次例假后280天）
        this.dueDate = new Date(this.lastPeriodDate);
        this.dueDate.setDate(this.dueDate.getDate() + 280);
        
        // 计算怀孕周数
        const daysSinceLastPeriod = Math.floor((this.currentDate - this.lastPeriodDate) / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(daysSinceLastPeriod / 7);
        const days = daysSinceLastPeriod % 7;
        
        // 计算距离预产期的天数
        const daysUntilDue = Math.ceil((this.dueDate - this.currentDate) / (1000 * 60 * 60 * 24));
        
        // 更新显示
        this.weeksPregnantSpan.textContent = `${weeks}周${days}天`;
        this.dueDateSpan.textContent = this.formatDate(this.dueDate);
        
        if (daysUntilDue > 0) {
            this.daysLeftSpan.textContent = `还有${daysUntilDue}天`;
        } else if (daysUntilDue === 0) {
            this.daysLeftSpan.textContent = '今天是预产期！';
        } else {
            this.daysLeftSpan.textContent = `已过预产期${Math.abs(daysUntilDue)}天`;
        }
        
        this.pregnancyInfo.style.display = 'block';
        this.renderCalendar();
    }
    
    formatDate(date) {
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    }
    
    previousMonth() {
        this.displayDate.setMonth(this.displayDate.getMonth() - 1);
        this.renderCalendar();
    }
    
    nextMonth() {
        this.displayDate.setMonth(this.displayDate.getMonth() + 1);
        this.renderCalendar();
    }
    
    renderCalendar() {
        const year = this.displayDate.getFullYear();
        const month = this.displayDate.getMonth();
        
        // 更新月份标题
        this.currentMonthSpan.textContent = `${year}年${month + 1}月`;
        
        // 清空日历
        this.calendar.innerHTML = '';
        
        // 添加星期标题
        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        weekdays.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-header-row';
            dayElement.textContent = day;
            this.calendar.appendChild(dayElement);
        });
        
        // 获取当月第一天和最后一天
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        // 渲染42天（6周）
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            // 创建日期容器
            const dateContainer = document.createElement('div');
            dateContainer.className = 'date-container';
            
            // 孕周数（在每个孕周的第一天显示）
            let weekInfo = '';
            if (this.lastPeriodDate && this.dueDate && 
                date >= this.lastPeriodDate && date <= this.dueDate) {
                const daysSinceLastPeriod = Math.floor((date - this.lastPeriodDate) / (1000 * 60 * 60 * 24));
                const weeks = Math.floor(daysSinceLastPeriod / 7);
                const dayInWeek = daysSinceLastPeriod % 7;
                
                // 只在每个孕周的第一天（dayInWeek === 0）显示周数
                if (weeks > 0 && dayInWeek === 0) {
                    weekInfo = `${weeks}周`;
                }
            }
            
            if (weekInfo) {
                const weekElement = document.createElement('div');
                weekElement.className = 'week-info-top';
                weekElement.textContent = weekInfo;
                dateContainer.appendChild(weekElement);
            }
            
            // 阳历日期（居中显示）
            const solarDate = document.createElement('div');
            solarDate.className = 'date-number';
            
            // 如果是1号，只显示月份
            if (date.getDate() === 1) {
                solarDate.textContent = `${date.getMonth() + 1}月`;
                solarDate.classList.add('month-label');
            } else {
                solarDate.textContent = date.getDate();
            }
            
            dateContainer.appendChild(solarDate);
            
            // 阴历日期（放在下方）
            const lunarDate = document.createElement('div');
            lunarDate.className = 'lunar-date';
            lunarDate.textContent = this.getLunarDate(date);
            dateContainer.appendChild(lunarDate);
            
            dayElement.appendChild(dateContainer);
            
            // 添加样式类
            if (date.getMonth() !== month) {
                dayElement.classList.add('other-month');
            }
            
            if (this.isSameDay(date, this.currentDate)) {
                dayElement.classList.add('today');
            }
            
            if (this.lastPeriodDate && this.isSameDay(date, this.lastPeriodDate)) {
                dayElement.classList.add('last-period');
                const info = document.createElement('div');
                info.className = 'week-info';
                info.textContent = '末次例假';
                dayElement.appendChild(info);
            }
            
            if (this.conceptionDate && this.isSameDay(date, this.conceptionDate)) {
                dayElement.classList.add('conception');
                const info = document.createElement('div');
                info.className = 'week-info';
                info.textContent = '受孕日';
                dayElement.appendChild(info);
            }
            
            if (this.dueDate && this.isSameDay(date, this.dueDate)) {
                dayElement.classList.add('due-date');
                const info = document.createElement('div');
                info.className = 'week-info';
                info.textContent = '预产期';
                dayElement.appendChild(info);
            }
            
            // 标记怀孕期间
            if (this.lastPeriodDate && this.dueDate && 
                date >= this.lastPeriodDate && date <= this.dueDate &&
                !this.isSameDay(date, this.lastPeriodDate) &&
                !this.isSameDay(date, this.conceptionDate) &&
                !this.isSameDay(date, this.dueDate) &&
                !this.isSameDay(date, this.currentDate)) {
                dayElement.classList.add('pregnancy-period');
            }
            
            this.calendar.appendChild(dayElement);
        }
    }
    
    // 获取农历日期（使用专业的农历转换库）
    getLunarDate(date) {
        if (window.lunarCalendar) {
            return window.lunarCalendar.getLunarDateString(date);
        }
        
        // 备用方案：简化计算
        const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 1)) / (1000 * 60 * 60 * 24));
        const lunarDay = (dayOfYear % 30) + 1;
        return this.lunarDays[lunarDay - 1] || '初一';
    }
    
    isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new PregnancyCalendar();
});