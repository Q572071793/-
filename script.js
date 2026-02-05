// Lottery System JavaScript
class LotterySystem {
    constructor() {
        this.participants = [];
        this.winners = [];
        this.isLotteryRunning = false;
        this.lotteryInterval = null;
        this.currentHighlightIndex = 0;
        this.settings = {
            lotterySpeed: 200,
            animationDuration: 5000,
            allowDuplicates: false,
            soundEnabled: true,
            systemTitle: '抽奖系统',
            backgroundImage: null,
            backgroundTheme: 'default', // default, festival, custom
            winnerCount: 1, // 新增：抽奖人数
            disableAutoScroll: true, // 新增：禁用自动滚动（默认禁用）
            lotteryMode: 'sequential' // 新增：抽奖方式 - sequential(逐个) 或 batch(批量)
        };
        this.prizes = [
            { name: '特等奖', count: 1 },
            { name: '一等奖', count: 1 },
            { name: '二等奖', count: 3 },
            { name: '三等奖', count: 5 },
            { name: '四等奖', count: 10 },
            { name: '五等奖', count: 20 },
            { name: '幸运奖', count: 50 }
        ];
        
        this.initializeElements();
        this.bindEvents();
        this.loadSettings();
        this.createConfettiContainer();
        this.applyBackground(); // Apply saved background settings
        
        // 初始化时渲染奖项列表
        console.log('初始化时渲染奖项，当前奖项数据：', this.prizes);
        this.renderPrizes();

    }

    initializeElements() {
        // Main elements
        this.participantsGrid = document.getElementById('participantsGrid');
        this.totalCount = document.getElementById('totalCount');
        this.winnerShowcase = document.getElementById('winnerShowcase');
        this.winnersList = document.getElementById('winnersList');
        this.startBtn = document.getElementById('startLottery');
        this.stopBtn = document.getElementById('stopLottery');
        this.resetBtn = document.getElementById('resetLottery');
        
        // Modal elements
        this.settingsModal = document.getElementById('settingsModal');
        this.importModal = document.getElementById('importModal');
        this.winnerModal = document.getElementById('winnerModal');
        this.overlay = document.getElementById('overlay');
        
        // Settings elements
        this.lotterySpeedSlider = document.getElementById('lotterySpeed');
        this.animationDurationSlider = document.getElementById('animationDuration');
        this.allowDuplicatesCheckbox = document.getElementById('allowDuplicates');
        this.soundEnabledCheckbox = document.getElementById('soundEnabled');
        this.systemTitleInput = document.getElementById('systemTitle');
        this.systemTitleDisplay = document.getElementById('systemTitleDisplay');
        this.disableAutoScrollCheckbox = document.getElementById('disableAutoScroll');
        this.lotteryModeSelect = document.getElementById('lotteryMode');
        
        // 调试信息
        console.log('初始化元素检查:');
        console.log('disableAutoScrollCheckbox:', this.disableAutoScrollCheckbox);
        console.log('lotteryModeSelect:', this.lotteryModeSelect);
        if (this.lotteryModeSelect) {
            console.log('lotteryModeSelect options length:', this.lotteryModeSelect.options.length);
        }
        
        // Prize management elements
        this.prizeList = document.getElementById('prizeList');
        this.newPrizeName = document.getElementById('newPrizeName');
        this.newPrizeCount = document.getElementById('newPrizeCount');
        this.addPrizeBtn = document.getElementById('addPrizeBtn');
        this.loadDefaultPrizes = document.getElementById('loadDefaultPrizes');
        this.clearAllPrizes = document.getElementById('clearAllPrizes');
        this.clearLocalStorage = document.getElementById('clearLocalStorage');
        // this.winnerCountInput = document.getElementById('winnerCount'); // 元素不存在，暂时注释掉
        
        // Batch delete elements
        this.batchDeleteBtn = document.getElementById('batchDeleteBtn');
        this.clearParticipantsBtn = document.getElementById('clearParticipantsBtn');
        this.selectedParticipants = new Set();
        
        // Background customization elements
        this.backgroundImageInput = document.getElementById('backgroundImage');
        this.resetBackgroundBtn = document.getElementById('resetBackground');
        this.applyFestivalThemeBtn = document.getElementById('applyFestivalTheme');
        
        // Edit prize elements
        this.editPrizeModal = document.getElementById('editPrizeModal');
        this.editPrizeName = document.getElementById('editPrizeName');
        this.editPrizeCount = document.getElementById('editPrizeCount');
        this.currentEditIndex = -1;
        
        // Import elements
        this.manualInput = document.getElementById('manualInput');
        this.fileInput = document.getElementById('fileInput');
        
        // Export modal elements
        this.exportModal = document.getElementById('exportModal');
    }

    bindEvents() {
        // Lottery controls
        this.startBtn.addEventListener('click', () => this.startLottery());
        this.stopBtn.addEventListener('click', () => this.stopLottery());
        this.resetBtn.addEventListener('click', () => this.resetLottery());
        
        // Modal controls
        document.getElementById('settingsBtn').addEventListener('click', () => this.openSettings());
        document.getElementById('importBtn').addEventListener('click', () => this.openImport());
        document.getElementById('clearWinners').addEventListener('click', () => this.clearWinners());
        document.getElementById('exportWinners').addEventListener('click', () => this.exportWinners());
        
        // Settings modal
        document.getElementById('closeSettings').addEventListener('click', () => this.closeSettings());
        document.getElementById('cancelSettings').addEventListener('click', () => this.closeSettings());
        document.getElementById('saveSettings').addEventListener('click', () => {
            console.log('保存设置按钮事件触发');
            this.saveSettings();
        });
        
        // Prize management
        this.addPrizeBtn.addEventListener('click', () => this.addPrize());
        this.loadDefaultPrizes.addEventListener('click', () => this.loadDefaultPrizeList());
        this.clearAllPrizes.addEventListener('click', () => this.clearAllPrizesList());
        this.clearLocalStorage.addEventListener('click', () => this.clearLocalStorageData());
        this.newPrizeName.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addPrize();
        });
        // this.winnerCountInput.addEventListener('change', () => this.updateWinnerCount()); // 元素不存在，暂时注释掉
        
        // Edit prize modal
        document.getElementById('closeEditPrize').addEventListener('click', () => this.closeEditPrizeModal());
        document.getElementById('cancelEditPrize').addEventListener('click', () => this.closeEditPrizeModal());
        document.getElementById('saveEditPrize').addEventListener('click', () => this.saveEditPrize());
        
        // Batch delete
        this.batchDeleteBtn.addEventListener('click', () => this.batchDeleteParticipants());
        
        // Clear all participants
        this.clearParticipantsBtn.addEventListener('click', () => this.clearAllParticipants());
        
        // Background customization
        this.backgroundImageInput.addEventListener('change', (e) => this.handleBackgroundImage(e));
        
        // Disable auto scroll setting (hidden by default, always disabled)
        this.disableAutoScrollCheckbox.addEventListener('change', (e) => {
            this.settings.disableAutoScroll = e.target.checked;
            // 不显示通知，因为这个选项是隐藏的
        });
        
        // Lottery mode change
        this.lotteryModeSelect.addEventListener('change', (e) => {
            this.settings.lotteryMode = e.target.value;
            this.showNotification(`抽奖方式已切换为：${e.target.value === 'batch' ? '一次性展示' : '逐个展示'}`, 'info');
        });
        this.resetBackgroundBtn.addEventListener('click', () => this.resetBackground());
        this.applyFestivalThemeBtn.addEventListener('click', () => this.applyFestivalTheme());
        
        // Import modal
        document.getElementById('closeImport').addEventListener('click', () => this.closeImport());
        document.getElementById('cancelImport').addEventListener('click', () => this.closeImport());
        document.getElementById('confirmImport').addEventListener('click', () => this.confirmImport());
        document.getElementById('loadSample').addEventListener('click', () => this.loadSampleData());
        
        // Winner modal
        document.getElementById('closeWinner').addEventListener('click', () => this.closeWinnerModal());
        
        // Export modal
        document.getElementById('closeExport').addEventListener('click', () => this.closeExportModal());
        document.getElementById('cancelExport').addEventListener('click', () => this.closeExportModal());
        document.getElementById('confirmExport').addEventListener('click', () => this.confirmExport());
        
        // Overlay
        this.overlay.addEventListener('click', () => this.closeAllModals());
        
        // Settings sliders
        this.lotterySpeedSlider.addEventListener('input', (e) => {
            document.getElementById('speedValue').textContent = e.target.value + 'ms';
        });
        
        this.animationDurationSlider.addEventListener('input', (e) => {
            document.getElementById('durationValue').textContent = (e.target.value / 1000) + '秒';
        });
        
        // System title input
        this.systemTitleInput.addEventListener('input', (e) => {
            this.updateSystemTitle(e.target.value);
        });
        
        // File input
        this.fileInput.addEventListener('change', (e) => this.handleFileImport(e));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    createConfettiContainer() {
        this.confettiContainer = document.createElement('div');
        this.confettiContainer.style.position = 'fixed';
        this.confettiContainer.style.top = '0';
        this.confettiContainer.style.left = '0';
        this.confettiContainer.style.width = '100%';
        this.confettiContainer.style.height = '100%';
        this.confettiContainer.style.pointerEvents = 'none';
        this.confettiContainer.style.zIndex = '9999';
        document.body.appendChild(this.confettiContainer);
    }

    // Participant Management
    addParticipant(name) {
        if (name.trim() && !this.participants.some(p => p.name === name.trim())) {
            const participant = {
                id: Date.now() + Math.random(),
                name: name.trim(),
                number: this.participants.length + 1,
                isWinner: false
            };
            this.participants.push(participant);
            this.renderParticipants();
            this.updateParticipantCount();
            return true;
        }
        return false;
    }

    removeParticipant(id) {
        this.participants = this.participants.filter(p => p.id !== id);
        this.renderParticipants();
        this.updateParticipantCount();
    }

    renderParticipants() {
        this.participantsGrid.innerHTML = '';
        this.participants.forEach(participant => {
            const card = document.createElement('div');
            card.className = 'participant-card';
            if (participant.isWinner) {
                card.classList.add('winner');
            }
            if (this.selectedParticipants.has(participant.id)) {
                card.classList.add('selected');
            }
            card.innerHTML = `
                <div class="participant-name">${participant.name}</div>
                <div class="participant-number">#${participant.number}</div>
                <div class="participant-checkbox">
                    <input type="checkbox" ${this.selectedParticipants.has(participant.id) ? 'checked' : ''}>
                </div>
            `;
            
            // 点击卡片选择/取消选择
            card.addEventListener('click', (e) => {
                if (e.target.type !== 'checkbox') {
                    this.toggleParticipantSelection(participant.id);
                }
            });
            
            // 点击复选框选择/取消选择
            card.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
                e.stopPropagation();
                this.toggleParticipantSelection(participant.id);
            });
            
            this.participantsGrid.appendChild(card);
        });
        
        // 更新批量删除按钮显示状态
        this.updateBatchDeleteButton();
    }

    updateParticipantCount() {
        this.totalCount.textContent = this.participants.length;
    }

    toggleParticipantWinner(id) {
        const participant = this.participants.find(p => p.id === id);
        if (participant) {
            participant.isWinner = !participant.isWinner;
            this.renderParticipants();
        }
    }

    toggleParticipantSelection(id) {
        if (this.selectedParticipants.has(id)) {
            this.selectedParticipants.delete(id);
        } else {
            this.selectedParticipants.add(id);
        }
        this.renderParticipants();
    }

    updateBatchDeleteButton() {
        const hasSelection = this.selectedParticipants.size > 0;
        this.batchDeleteBtn.style.display = hasSelection ? 'block' : 'none';
        this.batchDeleteBtn.innerHTML = `
            <i class="fas fa-trash"></i>
            批量删除 (${this.selectedParticipants.size})
        `;
    }

    updateWinnerCount() {
        const count = parseInt(this.winnerCountInput.value);
        if (count > 0 && count <= 10) {
            this.settings.winnerCount = count;
        } else {
            this.winnerCountInput.value = this.settings.winnerCount;
        }
    }

    batchDeleteParticipants() {
        if (this.selectedParticipants.size === 0) return;
        
        const deleteCount = this.selectedParticipants.size; // 保存删除数量
        
        if (confirm(`确定要删除选中的 ${deleteCount} 名参与人员吗？`)) {
            this.participants = this.participants.filter(p => !this.selectedParticipants.has(p.id));
            this.selectedParticipants.clear();
            
            // 重新编号
            this.participants.forEach((participant, index) => {
                participant.number = index + 1;
            });
            
            this.renderParticipants();
            this.updateParticipantCount();
            this.showNotification(`已删除 ${deleteCount} 名参与人员！`, 'success');
        }
    }

    clearAllParticipants() {
        if (this.participants.length === 0) {
            this.showNotification('当前没有参与人员！', 'warning');
            return;
        }
        
        if (confirm('确定要清空所有参与人员吗？此操作不可恢复！')) {
            this.participants = [];
            this.selectedParticipants.clear();
            this.renderParticipants();
            this.updateParticipantCount();
            this.showNotification('所有参与人员已清空！', 'success');
            
            // 如果清空了参与者，隐藏批量删除按钮
            this.batchDeleteBtn.style.display = 'none';
        }
    }

    // Lottery Logic
    startLottery() {
        if (this.participants.length === 0) {
            this.showNotification('请先添加参与人员！', 'warning');
            return;
        }

        const availableParticipants = this.settings.allowDuplicates 
            ? this.participants 
            : this.participants.filter(p => !p.isWinner);

        if (availableParticipants.length === 0) {
            this.showNotification('所有人员都已中奖！', 'info');
            return;
        }

        if (availableParticipants.length < this.settings.winnerCount) {
            this.showNotification(`可用参与人员不足 ${this.settings.winnerCount} 人！`, 'warning');
            return;
        }

        this.isLotteryRunning = true;
        this.startBtn.disabled = true;
        this.stopBtn.disabled = false;
        
        this.playSound('start');
        this.showLotteryAnimation(availableParticipants);
    }

    processBatchWinners(winners) {
        // 批量模式：一次性展示所有中奖者（只做展示，不做抽奖逻辑）
        const winnerNames = winners.map(w => w.name);
        
        // 如果中奖者太多，分组显示
        let displayNames;
        if (winnerNames.length <= 5) {
            displayNames = winnerNames.join('、');
        } else {
            // 超过5个时，显示前5个加省略号
            displayNames = winnerNames.slice(0, 5).join('、') + ` 等${winnerNames.length}人`;
        }
        
        this.updateWinnerShowcase(displayNames, `🎉 ${this.winners[this.winners.length - 1].prize}中奖者！`);
        
        // 创建特殊的批量中奖效果
        this.createBatchConfetti();
        
        // 显示批量中奖模态框
        this.showMultipleWinnersModal(winners);
    }

    showLotteryAnimation(participants) {
        const startTime = Date.now();
        const duration = this.settings.animationDuration;
        
        this.lotteryInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            
            if (elapsed < duration) {
                // Show random participants during animation
                const randomIndex = Math.floor(Math.random() * participants.length);
                const randomParticipant = participants[randomIndex];
                this.highlightParticipant(randomParticipant);
                
                // Update showcase with current highlight
                this.updateWinnerShowcase(randomParticipant.name, '抽奖中...');
            } else {
                this.stopLottery();
            }
        }, this.settings.lotterySpeed);
    }

    highlightParticipant(participant) {
        // Remove previous highlights
        document.querySelectorAll('.participant-card').forEach(card => {
            card.classList.remove('lottery-active');
        });
        
        // Add highlight to current participant
        const participantCards = document.querySelectorAll('.participant-card');
        const index = this.participants.findIndex(p => p.id === participant.id);
        if (participantCards[index]) {
            participantCards[index].classList.add('lottery-active');
            
            // 只在元素不在可视区域内时才滚动
            const card = participantCards[index];
            const rect = card.getBoundingClientRect();
            const container = this.participantsGrid;
            const containerRect = container.getBoundingClientRect();
            
            // 检查元素是否在可视区域内
            const isVisible = rect.top >= containerRect.top && 
                             rect.bottom <= containerRect.bottom &&
                             rect.left >= containerRect.left && 
                             rect.right <= containerRect.right;
            
            // 如果用户启用了禁用自动滚动，则不进行任何滚动
            if (!this.settings.disableAutoScroll && !isVisible) {
                // 只在必要时滚动，避免平滑滚动造成跳动
                card.scrollIntoView({ behavior: 'auto', block: 'nearest' });
            }
        }
    }

    stopLottery() {
        if (!this.isLotteryRunning) return;
        
        this.isLotteryRunning = false;
        clearInterval(this.lotteryInterval);
        
        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;
        
        // 选择最终中奖者（两种模式都需要）
        const availableParticipants = this.settings.allowDuplicates 
            ? this.participants 
            : this.participants.filter(p => !p.isWinner);
        
        if (availableParticipants.length > 0) {
            if (this.settings.lotteryMode === 'batch') {
                // 批量模式：一次性展示所有中奖者
                this.processBatchWinners(availableParticipants);
            } else {
                // 逐个模式：一个一个展示
                const winners = this.selectMultipleWinners(availableParticipants);
                this.processWinners(winners);
            }
        }
    }

    getCurrentPrize() {
        // 获取当前应该抽取的奖项
        let totalWinners = this.winners.length;
        
        for (let prize of this.prizes) {
            if (totalWinners < prize.count) {
                return prize;
            }
            totalWinners -= prize.count;
        }
        
        return { name: '幸运奖', count: 1 };
    }

    selectMultipleWinners(availableParticipants) {
        const winners = [];
        const count = Math.min(this.settings.winnerCount, availableParticipants.length);
        const shuffled = [...availableParticipants].sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < count; i++) {
            winners.push(shuffled[i]);
        }
        
        return winners;
    }

    processWinners(winners) {
        const winnerNames = winners.map(w => w.name);
        
        winners.forEach(winner => {
            winner.isWinner = true;
            
            // Determine prize for this winner based on current winners count
            let prizeName = '幸运奖';
            let totalWinners = this.winners.length;
            
            for (let prize of this.prizes) {
                if (totalWinners < prize.count) {
                    prizeName = prize.name;
                    break;
                }
                totalWinners -= prize.count;
            }
            
            this.winners.push({
                ...winner,
                prize: prizeName,
                timestamp: new Date()
            });
        });
        
        this.renderParticipants();
        this.renderWinners();
        
        if (this.settings.lotteryMode === 'batch') {
            // 批量模式：一次性展示所有中奖者
            this.updateWinnerShowcase(winnerNames.join('、'), `🎉 ${this.winners[this.winners.length - 1].prize}中奖者！`);
            this.showMultipleWinnersModal(winners);
            this.createBatchConfetti();
        } else {
            // 逐个模式：一个一个展示
            if (winners.length === 1) {
                this.updateWinnerShowcase(winners[0].name, this.winners[this.winners.length - 1].prize);
                this.showWinnerModal(winners[0]);
            } else {
                this.updateWinnerShowcase(winnerNames.join(', '), '恭喜中奖！');
                this.showMultipleWinnersModal(winners);
            }
        }
        
        this.playSound('win');
        this.createConfetti();
        
        // Remove highlight
        document.querySelectorAll('.participant-card').forEach(card => {
            card.classList.remove('lottery-active');
        });
    }

    updateWinnerShowcase(name, prize) {
        // 如果名字太长（多个中奖者），使用更紧凑的显示方式
        let displayName;
        if (name.includes('、') && name.length > 30) {
            // 多个名字的情况，分行显示
            const names = name.split('、');
            if (names.length <= 3) {
                displayName = name; // 3个以内直接显示
            } else {
                // 超过3个名字，显示前3行加省略号
                displayName = names.slice(0, 3).join('、') + '...';
            }
        } else {
            displayName = name.length > 50 ? name.substring(0, 50) + '...' : name;
        }
        
        this.winnerShowcase.innerHTML = `
            <div class="winner-result">
                <h3>${displayName}</h3>
                <div class="prize-name">${prize}</div>
            </div>
        `;
    }

    showMultipleWinnersModal(winners) {
        const winnerNames = winners.map(w => w.name).join('、');
        const prizeNames = winners.map(w => {
            const winnerData = this.winners.find(wd => wd.id === w.id);
            return winnerData ? winnerData.prize : '幸运奖';
        });
        const uniquePrizes = [...new Set(prizeNames)];
        
        document.getElementById('winnerName').textContent = winnerNames;
        document.getElementById('winnerPrize').textContent = uniquePrizes.length === 1 ? 
            `恭喜获得${uniquePrizes[0]}！` : '恭喜中奖！';
        this.winnerModal.style.display = 'block';
        this.overlay.style.display = 'block';
    }

    resetLottery() {
        if (confirm('确定要重置所有抽奖数据吗？')) {
            this.participants.forEach(p => p.isWinner = false);
            this.winners = [];
            this.renderParticipants();
            this.renderWinners();
            this.winnerShowcase.innerHTML = `
                <div class="winner-placeholder">
                    <i class="fas fa-trophy"></i>
                    <p>点击开始抽奖</p>
                </div>
            `;
            this.showNotification('抽奖数据已重置！', 'success');
        }
    }

    // Winners Management
    renderWinners() {
        if (this.winners.length === 0) {
            this.winnersList.innerHTML = `
                <div class="no-winners">
                    <i class="fas fa-clipboard-list"></i>
                    <p>暂无中奖记录</p>
                </div>
            `;
            return;
        }

        this.winnersList.innerHTML = this.winners.map((winner, index) => `
            <div class="winner-item">
                <div class="winner-info">
                    <div class="winner-rank">${index + 1}</div>
                    <div class="winner-details">
                        <h4>${winner.name}</h4>
                        <p>${winner.prize}</p>
                    </div>
                </div>
                <div class="winner-time">
                    ${winner.timestamp.toLocaleTimeString()}
                </div>
            </div>
        `).reverse().join('');
    }

    clearWinners() {
        if (confirm('确定要清空所有中奖记录吗？')) {
            this.winners = [];
            this.participants.forEach(p => p.isWinner = false);
            this.renderParticipants();
            this.renderWinners();
            this.showNotification('中奖记录已清空！', 'success');
        }
    }

    exportWinners() {
        if (this.winners.length === 0) {
            this.showNotification('暂无中奖记录可导出！', 'warning');
            return;
        }
        
        // 打开导出选项模态框
        this.openExportModal();
    }

    openExportModal() {
        this.exportModal.style.display = 'block';
        this.overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeExportModal() {
        this.exportModal.style.display = 'none';
        this.overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    confirmExport() {
        try {
            // 获取用户选择的格式和选项
            const format = document.querySelector('input[name="exportFormat"]:checked').value;
            const includeTimestamp = document.getElementById('includeTimestamp').checked;
            const includePrize = document.getElementById('includePrize').checked;
            
            let exportData, filename, content, mimeType;
            
            switch (format) {
                case 'csv':
                    ({ content, filename, mimeType } = this.generateCSVExport(includeTimestamp, includePrize));
                    break;
                case 'json':
                    ({ content, filename, mimeType } = this.generateJSONExport(includeTimestamp, includePrize));
                    break;
                case 'txt':
                    ({ content, filename, mimeType } = this.generateTXTExport(includeTimestamp, includePrize));
                    break;
                default:
                    throw new Error('不支持的导出格式');
            }
            
            // 创建Blob对象
            const blob = new Blob([content], { type: mimeType });
            
            // 创建下载链接
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            
            // 触发下载
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // 释放URL对象
            URL.revokeObjectURL(url);
            
            // 关闭模态框
            this.closeExportModal();
            this.showNotification(`中奖记录已导出为${format.toUpperCase()}格式！`, 'success');
            
        } catch (error) {
            console.error('导出中奖记录时出错：', error);
            this.showNotification('导出失败：' + error.message, 'error');
        }
    }

    generateCSVExport(includeTimestamp, includePrize) {
        const headers = ['序号', '姓名'];
        if (includePrize) headers.push('奖项');
        if (includeTimestamp) headers.push('中奖时间');
        
        const rows = this.winners.map((winner, index) => {
            const row = [index + 1, winner.name];
            if (includePrize) row.push(winner.prize);
            if (includeTimestamp) row.push(winner.timestamp.toLocaleString('zh-CN'));
            return row.map(cell => `"${cell}"`).join(',');
        });
        
        const content = [headers.join(','), ...rows].join('\n');
        const now = new Date();
        const dateStr = now.toLocaleDateString('zh-CN').replace(/\//g, '-');
        const timeStr = now.toLocaleTimeString('zh-CN').replace(/:/g, '-');
        const filename = `中奖记录_${dateStr}_${timeStr}.csv`;
        
        return { content: '\uFEFF' + content, filename, mimeType: 'text/csv;charset=utf-8;' };
    }

    generateJSONExport(includeTimestamp, includePrize) {
        const data = this.winners.map((winner, index) => {
            const item = { 
                序号: index + 1, 
                姓名: winner.name 
            };
            if (includePrize) item.奖项 = winner.prize;
            if (includeTimestamp) item.中奖时间 = winner.timestamp.toISOString();
            return item;
        });
        
        const content = JSON.stringify(data, null, 2);
        const now = new Date();
        const dateStr = now.toLocaleDateString('zh-CN').replace(/\//g, '-');
        const timeStr = now.toLocaleTimeString('zh-CN').replace(/:/g, '-');
        const filename = `中奖记录_${dateStr}_${timeStr}.json`;
        
        return { content, filename, mimeType: 'application/json;charset=utf-8;' };
    }

    generateTXTExport(includeTimestamp, includePrize) {
        let content = '=== 抽奖中奖记录 ===\n\n';
        content += `导出时间: ${new Date().toLocaleString('zh-CN')}\n`;
        content += `中奖总人数: ${this.winners.length}\n\n`;
        content += '--- 中奖名单 ---\n\n';
        
        this.winners.forEach((winner, index) => {
            content += `${index + 1}. ${winner.name}`;
            if (includePrize) content += ` - ${winner.prize}`;
            if (includeTimestamp) content += ` (${winner.timestamp.toLocaleString('zh-CN')})`;
            content += '\n';
        });
        
        content += '\n=== 记录结束 ===';
        
        const now = new Date();
        const dateStr = now.toLocaleDateString('zh-CN').replace(/\//g, '-');
        const timeStr = now.toLocaleTimeString('zh-CN').replace(/:/g, '-');
        const filename = `中奖记录_${dateStr}_${timeStr}.txt`;
        
        return { content, filename, mimeType: 'text/plain;charset=utf-8;' };
    }

    // Prize Management
    addPrize() {
        const prizeName = this.newPrizeName.value.trim();
        const prizeCount = parseInt(this.newPrizeCount.value) || 1;
        
        if (!prizeName) {
            this.showNotification('请输入奖项名称！', 'warning');
            return;
        }
        
        // 检查是否已存在相同名称的奖项
        const exists = this.prizes.some(prize => prize.name === prizeName);
        if (exists) {
            this.showNotification('该奖项名称已存在！', 'warning');
            return;
        }
        
        if (prizeCount <= 0) {
            this.showNotification('中奖人数必须大于0！', 'warning');
            return;
        }
        
        this.prizes.push({ name: prizeName, count: prizeCount });
        this.newPrizeName.value = '';
        this.newPrizeCount.value = '1';
        this.renderPrizes();
        this.showNotification('奖项已添加！', 'success');
    }

    deletePrize(index) {
        console.log('删除奖项被点击，索引：', index);
        if (confirm('确定要删除这个奖项吗？')) {
            this.prizes.splice(index, 1);
            this.renderPrizes();
            this.showNotification('奖项已删除！', 'success');
        }
    }

    editPrize(index) {
        console.log('编辑奖项被点击，索引：', index);
        const currentPrize = this.prizes[index];
        
        // 设置当前编辑的索引和数据
        this.currentEditIndex = index;
        this.editPrizeName.value = currentPrize.name;
        this.editPrizeCount.value = currentPrize.count;
        
        // 显示编辑模态框
        this.editPrizeModal.style.display = 'block';
        this.overlay.style.display = 'block';
    }

    closeEditPrizeModal() {
        this.editPrizeModal.style.display = 'none';
        this.overlay.style.display = 'none';
        this.currentEditIndex = -1;
    }

    saveEditPrize() {
        if (this.currentEditIndex >= 0) {
            const newName = this.editPrizeName.value.trim();
            const newCount = parseInt(this.editPrizeCount.value) || 1;
            
            if (newName) {
                this.prizes[this.currentEditIndex] = { 
                    name: newName, 
                    count: newCount 
                };
                this.renderPrizes();
                this.showNotification('奖项已更新！', 'success');
            } else {
                this.showNotification('请输入奖项名称！', 'warning');
                return;
            }
        }
        this.closeEditPrizeModal();
    }

    renderPrizes() {
        console.log('渲染奖项列表，当前奖项数据：', this.prizes);
        if (this.prizes.length === 0) {
            this.prizeList.innerHTML = `
                <div class="empty-prizes">
                    <i class="fas fa-gift"></i>
                    <p>暂无奖项设置</p>
                </div>
            `;
            return;
        }

        this.prizeList.innerHTML = this.prizes.map((prize, index) => {
            console.log(`奖项 ${index}:`, prize, '名称:', prize.name, '人数:', prize.count);
            return `
            <div class="prize-item">
                <div class="prize-info">
                    <div class="prize-name">${prize.name}</div>
                    <div class="prize-count">${prize.count}人</div>
                </div>
                <div class="prize-actions">
                    <button class="prize-btn prize-btn-edit" onclick="window.lotterySystem.editPrize(${index})" title="编辑">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="prize-btn prize-btn-delete" onclick="window.lotterySystem.deletePrize(${index})" title="删除">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            `;
        }).join('');
    }

    loadDefaultPrizeList() {
        this.prizes = [
            { name: '特等奖', count: 1 },
            { name: '一等奖', count: 1 },
            { name: '二等奖', count: 3 },
            { name: '三等奖', count: 5 },
            { name: '四等奖', count: 10 },
            { name: '五等奖', count: 20 },
            { name: '幸运奖', count: 50 }
        ];
        this.renderPrizes();
        this.showNotification('默认奖项已加载！', 'success');
    }

    clearAllPrizesList() {
        if (confirm('确定要清空所有奖项吗？')) {
            this.prizes = [];
            this.renderPrizes();
            this.showNotification('所有奖项已清空！', 'success');
        }
    }

    clearLocalStorageData() {
        if (confirm('确定要清除所有本地缓存数据吗？这将重置所有设置和奖项。')) {
            localStorage.removeItem('lotterySettings');
            localStorage.removeItem('lotteryWinners');
            localStorage.removeItem('lotteryBackground');
            
            // 重新加载默认数据
            this.prizes = [
                { name: '特等奖', count: 1 },
                { name: '一等奖', count: 1 },
                { name: '二等奖', count: 3 },
                { name: '三等奖', count: 5 },
                { name: '四等奖', count: 10 },
                { name: '五等奖', count: 20 },
                { name: '幸运奖', count: 50 }
            ];
            
            this.renderPrizes();
            this.showNotification('本地缓存已清除，已恢复默认设置！', 'success');
        }
    }

    // Modal Management
    openSettings() {
        console.log('打开设置模态框');
        this.settingsModal.style.display = 'block';
        this.overlay.style.display = 'block';
        this.loadSettingsToForm();
        
        // 检查抽奖方式选择是否存在
        console.log('lotteryModeSelect in openSettings:', this.lotteryModeSelect);
        if (this.lotteryModeSelect) {
            console.log('lotteryModeSelect options:', this.lotteryModeSelect.options);
            console.log('lotteryModeSelect value:', this.lotteryModeSelect.value);
        }
    }

    closeSettings() {
        console.log('关闭设置模态框');
        this.settingsModal.style.display = 'none';
        this.overlay.style.display = 'none';
    }

    openImport() {
        this.importModal.style.display = 'block';
        this.overlay.style.display = 'block';
    }

    closeImport() {
        this.importModal.style.display = 'none';
        this.overlay.style.display = 'none';
        this.manualInput.value = '';
        this.fileInput.value = '';
    }

    showWinnerModal(winner) {
        document.getElementById('winnerName').textContent = winner.name;
        document.getElementById('winnerPrize').textContent = this.winners[this.winners.length - 1].prize;
        this.winnerModal.style.display = 'block';
        this.overlay.style.display = 'block';
    }

    closeWinnerModal() {
        this.winnerModal.style.display = 'none';
        this.overlay.style.display = 'none';
    }

    closeAllModals() {
        this.closeSettings();
        this.closeImport();
        this.closeWinnerModal();
    }

    // Import/Export Functions
    confirmImport() {
        const manualData = this.manualInput.value.trim();
        if (manualData) {
            const names = manualData.split('\n').filter(name => name.trim());
            let imported = 0;
            names.forEach(name => {
                if (this.addParticipant(name)) imported++;
            });
            this.showNotification(`成功导入 ${imported} 名参与人员！`, 'success');
        }
        this.closeImport();
    }

    handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const names = content.split('\n').filter(name => name.trim());
            let imported = 0;
            names.forEach(name => {
                if (this.addParticipant(name)) imported++;
            });
            this.showNotification(`成功导入 ${imported} 名参与人员！`, 'success');
            this.closeImport();
        };
        reader.readAsText(file);
    }

    loadSampleData() {
        const sampleNames = [
            '张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十',
            '郑十一', '王十二', '冯十三', '陈十四', '褚十五', '卫十六', '蒋十七', '沈十八',
            '韩十九', '杨二十', '朱二一', '秦二二', '尤二三', '许二四', '何二五', '吕二六'
        ];
        
        sampleNames.forEach(name => this.addParticipant(name));
        this.showNotification('示例数据已加载！', 'success');
        this.closeImport();
    }

    // Settings Management
    loadSettings() {
        const saved = localStorage.getItem('lotterySettings');
        if (saved) {
            const parsed = JSON.parse(saved);
            this.settings = { ...this.settings, ...parsed.settings };
            this.prizes = parsed.prizes || this.prizes;
            console.log('从本地存储加载的奖项数据：', this.prizes);
        } else {
            console.log('没有本地存储数据，使用默认奖项：', this.prizes);
        }
    }

    loadSettingsToForm() {
        console.log('开始加载设置到表单');
        try {
            console.log('lotterySpeedSlider:', this.lotterySpeedSlider);
            this.lotterySpeedSlider.value = this.settings.lotterySpeed;
            
            console.log('animationDurationSlider:', this.animationDurationSlider);
            this.animationDurationSlider.value = this.settings.animationDuration;
            
            console.log('allowDuplicatesCheckbox:', this.allowDuplicatesCheckbox);
            this.allowDuplicatesCheckbox.checked = this.settings.allowDuplicates;
            
            console.log('soundEnabledCheckbox:', this.soundEnabledCheckbox);
            this.soundEnabledCheckbox.checked = this.settings.soundEnabled;
            
            console.log('systemTitleInput:', this.systemTitleInput);
            this.systemTitleInput.value = this.settings.systemTitle;
            
            console.log('disableAutoScrollCheckbox:', this.disableAutoScrollCheckbox);
            this.disableAutoScrollCheckbox.checked = this.settings.disableAutoScroll;
            
            console.log('lotteryModeSelect:', this.lotteryModeSelect);
            console.log('lotteryModeSelect value:', this.lotteryModeSelect ? this.lotteryModeSelect.value : 'element not found');
            this.lotteryModeSelect.value = this.settings.lotteryMode;
            
            // this.winnerCountInput.value = this.settings.winnerCount; // 元素不存在，暂时注释掉
            
            console.log('设置表单加载完成');
        } catch (error) {
            console.error('加载设置到表单时出错：', error);
        }
        
        document.getElementById('speedValue').textContent = this.settings.lotterySpeed + 'ms';
        document.getElementById('durationValue').textContent = (this.settings.animationDuration / 1000) + '秒';
        
        // Update system title display
        this.updateSystemTitle(this.settings.systemTitle);
        
        // Render prizes
        this.renderPrizes();
    }

    saveSettings() {
        console.log('保存设置按钮被点击');
        console.log('开始收集设置数据...');
        
        try {
            console.log('lotterySpeedSlider:', this.lotterySpeedSlider);
            this.settings.lotterySpeed = parseInt(this.lotterySpeedSlider.value);
            
            console.log('animationDurationSlider:', this.animationDurationSlider);
            this.settings.animationDuration = parseInt(this.animationDurationSlider.value);
            
            console.log('allowDuplicatesCheckbox:', this.allowDuplicatesCheckbox);
            this.settings.allowDuplicates = this.allowDuplicatesCheckbox.checked;
            
            console.log('soundEnabledCheckbox:', this.soundEnabledCheckbox);
            this.settings.soundEnabled = this.soundEnabledCheckbox.checked;
            
            console.log('systemTitleInput:', this.systemTitleInput);
            this.settings.systemTitle = this.systemTitleInput.value || 'PickerBot 抽奖系统';
            
            console.log('disableAutoScrollCheckbox:', this.disableAutoScrollCheckbox);
            this.settings.disableAutoScroll = this.disableAutoScrollCheckbox.checked;
            
            console.log('lotteryModeSelect:', this.lotteryModeSelect);
            this.settings.lotteryMode = this.lotteryModeSelect.value;
            
            // this.settings.winnerCount = parseInt(this.winnerCountInput.value) || 1; // 元素不存在，暂时注释掉
            
            console.log('设置数据收集完成');
        } catch (error) {
            console.error('收集设置数据时出错：', error);
            this.showNotification('保存设置失败：' + error.message, 'warning');
            return;
        }
        
        const settingsData = {
            settings: this.settings,
            prizes: this.prizes
        };
        
        console.log('保存的设置数据：', settingsData);
        localStorage.setItem('lotterySettings', JSON.stringify(settingsData));
        console.log('设置已保存到本地存储');
        
        this.updateSystemTitle(this.settings.systemTitle);
        this.closeSettings();
        this.showNotification('设置已保存！', 'success');
        console.log('保存完成');
    }

    // Sound Effects
    playSound(type) {
        if (!this.settings.soundEnabled) return;
        
        // Create audio context for sound effects
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        switch (type) {
            case 'start':
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
                break;
            case 'win':
                oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.2);
                oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.4);
                break;
        }
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }

    processBatchWinners(availableParticipants) {
        // 批量模式：一次性展示当前奖项的所有中奖人员
        const currentPrize = this.getCurrentPrize();
        const winnerCount = Math.min(currentPrize.count, availableParticipants.length);
        
        // 选择当前奖项的中奖者
        const shuffled = [...availableParticipants].sort(() => Math.random() - 0.5);
        const winners = shuffled.slice(0, winnerCount);
        
        // 处理中奖者（标记为中奖并添加到中奖列表）
        winners.forEach(winner => {
            winner.isWinner = true;
            this.winners.push({
                ...winner,
                prize: currentPrize.name,
                timestamp: new Date()
            });
        });
        
        // 更新界面
        this.renderParticipants();
        this.renderWinners();
        
        // 创建特殊的批量展示效果
        this.showBatchWinnersEffect(winners, currentPrize.name);
    }

    showBatchWinnersEffect(winners, prizeName) {
        // 批量模式的特殊展示效果 - 一次性展示所有中奖者
        const winnerNames = winners.map(w => w.name);
        
        // 更新展示区域，显示所有中奖者和奖项
        this.updateWinnerShowcase(winnerNames.join(', '), `🎉 ${prizeName}中奖者！`);
        
        // 创建特殊的批量中奖效果
        this.createBatchConfetti();
        
        // 显示批量中奖模态框
        this.showMultipleWinnersModal(winners);
    }

    // Visual Effects
    createConfetti() {
        const colors = ['#667eea', '#764ba2', '#4CAF50', '#FFD700', '#FF6B6B', '#4ECDC4'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 0.5 + 's';
                this.confettiContainer.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 3000);
            }, i * 50);
        }
    }

    // System Title Management
    updateSystemTitle(title) {
        console.log('更新系统标题:', title);
        this.settings.systemTitle = title || 'PickerBot 抽奖系统';
        this.systemTitleDisplay.textContent = this.settings.systemTitle;
        console.log('系统标题已更新为:', this.settings.systemTitle);
    }

    createBatchConfetti() {
        // 批量模式的特殊彩带效果
        const colors = ['#667eea', '#764ba2', '#4CAF50', '#FFD700', '#FF6B6B', '#4ECDC4', '#f093fb', '#f5576c'];
        
        // 创建更强烈的彩带效果
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.top = '-10px';
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
                confetti.style.pointerEvents = 'none';
                confetti.style.zIndex = '9999';
                confetti.style.animation = `confetti-fall ${1.5 + Math.random() * 1}s linear forwards`;
                
                this.confettiContainer.appendChild(confetti);
                
                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.parentNode.removeChild(confetti);
                    }
                }, 3000);
            }, i * 30);
        }
    }

    // Background Customization
    handleBackgroundImage(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            this.settings.backgroundImage = e.target.result;
            this.settings.backgroundTheme = 'custom';
            this.applyBackground();
            this.showNotification('背景图片已应用！', 'success');
        };
        reader.readAsDataURL(file);
    }

    applyBackground() {
        // Clear all theme classes first
        document.body.classList.remove('festival-theme');
        
        if (this.settings.backgroundImage && this.settings.backgroundTheme === 'custom') {
            document.body.style.background = `url(${this.settings.backgroundImage})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundRepeat = 'repeat';
            document.body.style.backgroundPosition = 'center center';
            document.body.style.backgroundAttachment = 'fixed';
        } else if (this.settings.backgroundTheme === 'festival') {
            document.body.classList.add('festival-theme');
        } else {
            this.resetBackground();
        }
    }

    applyFestivalTheme() {
        // 喜庆主题背景
        document.body.classList.add('festival-theme');
        this.settings.backgroundTheme = 'festival';
        this.settings.backgroundImage = null;
        this.applyBackground();
        this.showNotification('喜庆主题已应用！', 'success');
    }

    resetBackground() {
        // 默认背景
        document.body.classList.remove('festival-theme');
        document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        document.body.style.backgroundSize = 'auto';
        document.body.style.backgroundRepeat = 'repeat';
        document.body.style.backgroundPosition = 'center center';
        document.body.style.backgroundAttachment = 'scroll';
        document.body.style.animation = 'none';
        this.settings.backgroundTheme = 'default';
        this.settings.backgroundImage = null;
        this.backgroundImageInput.value = '';
        this.showNotification('背景已重置为默认主题！', 'success');
    }

    // Utility Functions
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#FF9800' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    handleKeyboard(event) {
        // Spacebar to start/stop lottery
        if (event.code === 'Space' && !this.isAnyModalOpen()) {
            event.preventDefault();
            if (this.isLotteryRunning) {
                this.stopLottery();
            } else {
                this.startLottery();
            }
        }
        
        // Escape to close modals
        if (event.code === 'Escape') {
            this.closeAllModals();
        }
    }

    isAnyModalOpen() {
        return this.settingsModal.style.display === 'block' || 
               this.importModal.style.display === 'block' || 
               this.winnerModal.style.display === 'block' ||
               this.editPrizeModal.style.display === 'block';
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize the lottery system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.lotterySystem = new LotterySystem();
    
    // Load sample data for demonstration
    setTimeout(() => {
        if (window.lotterySystem.participants.length === 0) {
            window.lotterySystem.loadSampleData();
        }
    }, 1000);
});