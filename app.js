// ==================== 开场动画控制 ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM 加载完成，开始开场动画');
    
    // 确保主应用界面初始隐藏
    const mainApp = document.getElementById('main-app');
    if (mainApp) {
        mainApp.style.display = 'none';
    }
    
    // 4秒后显示主界面
    setTimeout(() => {
        console.log('开场动画结束，显示主界面');
        
        const opening = document.getElementById('opening-animation');
        const mainApp = document.getElementById('main-app');
        
        if (!opening || !mainApp) {
            console.error('找不到必要的DOM元素');
            return;
        }
        
        // 淡出开场动画
        opening.style.opacity = '0';
        opening.style.transition = 'opacity 0.5s ease-out';
        
        // 500ms后隐藏开场动画，显示主应用
        setTimeout(() => {
            opening.style.display = 'none';
            mainApp.style.display = 'block';
            
            // 初始化 PWA 功能
            initPWA();
            
            console.log('主界面显示完成');
        }, 500);
    }, 4000);
    
    // 初始化示例按钮
    initExampleButtons();
});

// ==================== PWA 功能 ====================
function initPWA() {
    console.log('初始化 PWA 功能');
    
    let deferredPrompt;
    const installButton = document.getElementById('pwa-install-button');
    
    if (!installButton) {
        console.log('未找到 PWA 安装按钮');
        return;
    }
    
    // 监听安装提示事件
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('beforeinstallprompt 事件触发');
        
        // 阻止默认安装提示
        e.preventDefault();
        
        // 保存事件以便后续使用
        deferredPrompt = e;
        
        // 显示安装按钮
        installButton.style.display = 'inline-block';
        
        // 点击安装
        installButton.onclick = () => {
            if (deferredPrompt) {
                // 显示安装提示
                deferredPrompt.prompt();
                
                // 等待用户选择
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('用户接受了安装');
                        showPWAToast('应用安装成功！🎉');
                        installButton.style.display = 'none';
                    } else {
                        console.log('用户拒绝了安装');
                    }
                    deferredPrompt = null;
                });
            }
        };
    });
    
    // 监听应用安装成功
    window.addEventListener('appinstalled', () => {
        console.log('应用已安装成功');
        installButton.style.display = 'none';
        showPWAToast('应用安装成功！✨');
    });
    
    // 检查是否已安装
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('应用已安装，运行在独立模式');
        installButton.style.display = 'none';
    }
}

// ==================== 基础聊天功能 ====================
let currentStage = '';

// 阶段标题映射
const stageTitles = {
    icebreaking: "破冰初识",
    friendship: "普通朋友",
    attraction: "吸引阶段",
    ambiguous: "暧昧期",
    dating: "约会阶段",
    intimacy: "稳定亲密",
    recovery: "挽回期"
};

// 选择阶段
function selectStage(stage) {
    console.log('选择阶段:', stage);
    currentStage = stage;
    
    // 更新界面
    const stageTitle = document.getElementById('current-stage-title');
    if (stageTitle) {
        stageTitle.textContent = stageTitles[stage] || stage;
    }
    
    // 切换到聊天界面
    const stagesList = document.querySelector('.stages-list');
    const chatInterface = document.getElementById('chat-interface');
    
    if (stagesList) stagesList.style.display = 'none';
    if (chatInterface) chatInterface.style.display = 'block';
    
    // 显示阶段描述
    showStageDescription();
}

// 返回阶段选择
function goBackToStages() {
    console.log('返回阶段选择');
    
    const stagesList = document.querySelector('.stages-list');
    const chatInterface = document.getElementById('chat-interface');
    
    if (stagesList) stagesList.style.display = 'block';
    if (chatInterface) chatInterface.style.display = 'none';
    
    // 清空结果
    const resultsContainer = document.getElementById('results-container');
    if (resultsContainer) resultsContainer.innerHTML = '';
    
    // 清空输入
    const messageInput = document.getElementById('message-input');
    if (messageInput) messageInput.value = '';
}

// 显示阶段描述
function showStageDescription() {
    const container = document.getElementById('results-container');
    if (!container) return;
    
    const descriptions = {
        icebreaking: "初次相识，建立第一印象，开启对话",
        friendship: "保持日常联系，建立舒适感和信任",
        attraction: "创造吸引，展示个人价值和魅力",
        ambiguous: "关系升温，微妙互动，测试对方兴趣",
        dating: "正式约会，推进关系，创造美好回忆",
        intimacy: "深度连接，建立稳定长期的亲密关系",
        recovery: "修复关系问题，重建信任和连接"
    };
    
    const tips = {
        icebreaking: ["保持自然真诚", "从共同点开场", "避免连续提问", "适时展示幽默"],
        friendship: ["保持适当联系频率", "分享生活", "寻找共同兴趣", "建立信任"],
        attraction: ["展示自身价值", "使用推拉技巧", "保持神秘感", "展现自信"],
        ambiguous: ["增加亲密感", "使用暧昧语言", "观察反馈", "创造心动瞬间"],
        dating: ["规划约会细节", "展现绅士风度", "创造愉快氛围", "适时推进关系"],
        intimacy: ["深度沟通分享", "建立安全感", "共同规划未来", "保持新鲜感"],
        recovery: ["冷静处理情绪", "真诚反思问题", "给彼此空间", "展现实际行动"]
    };
    
    const currentTips = tips[currentStage] || [];
    
    container.innerHTML = `
        <div class="stage-description">
            <h3>${stageTitles[currentStage] || currentStage}</h3>
            <p>${descriptions[currentStage] || ''}</p>
            <div class="description-tips">
                <h4>💡 沟通要点：</h4>
                <ul>
                    ${currentTips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

// 搜索回复
function searchResponse() {
    const input = document.getElementById('message-input');
    if (!input) return;
    
    const text = input.value.trim();
    if (!text) {
        showToast('请输入对话内容');
        return;
    }
    
    if (!currentStage) {
        showToast('请先选择一个阶段');
        return;
    }
    
    console.log('搜索回复:', text, '阶段:', currentStage);
    
    // 模拟搜索结果
    const results = [
        {
            type: "友好回应",
            text: "刚忙完，正在休息呢 ☕ 你呢？今天过得怎么样？",
            tip: "分享状态+反问，延续对话"
        },
        {
            type: "幽默回应",
            text: "正在思考宇宙终极问题：晚上吃什么？🍽️ 你有推荐吗？",
            tip: "用幽默化解普通问题"
        },
        {
            type: "延伸话题",
            text: "今天天气不错，有出去走走吗？🌤️",
            tip: "自然引出新话题"
        }
    ];
    
    // 显示结果
    displayResults(results);
}

// 显示结果
function displayResults(results) {
    const container = document.getElementById('results-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="results-count">
            找到 ${results.length} 个建议回复：
        </div>
    `;
    
    results.forEach((response) => {
        const card = document.createElement('div');
        card.className = 'response-card';
        card.innerHTML = `
            <div class="response-header">
                <span class="response-type">${response.type}</span>
                <button class="copy-btn" onclick="copyToClipboard(this)">
                    📋 复制
                </button>
            </div>
            <div class="response-text">${response.text}</div>
            <div class="response-tip">💡 ${response.tip}</div>
        `;
        
        // 存储文本到按钮的 data 属性
        const copyBtn = card.querySelector('.copy-btn');
        copyBtn.dataset.text = response.text;
        
        container.appendChild(card);
    });
}

// 复制到剪贴板
function copyToClipboard(button) {
    const text = button.dataset.text;
    if (!text) return;
    
    navigator.clipboard.writeText(text).then(() => {
        // 显示复制成功效果
        const originalText = button.innerHTML;
        button.innerHTML = '✓ 已复制';
        button.style.background = '#4CAF50';
        button.style.color = 'white';
        
        // 显示提示
        showToast('已复制到剪贴板');
        
        // 2秒后恢复
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
            button.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('复制失败:', err);
        showToast('复制失败，请手动复制');
    });
}

// 处理键盘输入
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        searchResponse();
    }
}

// 填充示例
function fillExample(text) {
    const input = document.getElementById('message-input');
    if (input) {
        input.value = text;
        searchResponse();
    }
}

// 初始化示例按钮
function initExampleButtons() {
    // 简单的示例按钮初始化
    console.log('示例按钮初始化完成');
}

// 显示提示
function showToast(message) {
    const toast = document.getElementById('copy-toast');
    if (toast) {
        toast.textContent = message;
        toast.style.display = 'block';
        
        // 使用简单的动画
        toast.style.opacity = '1';
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.style.display = 'none';
            }, 300);
        }, 2000);
    } else {
        // 如果没有 toast，用 alert 代替
        alert(message);
    }
}

// 显示 PWA 安装成功提示
function showPWAToast(message) {
    const toast = document.getElementById('pwa-toast');
    if (toast) {
        toast.textContent = message;
        toast.style.display = 'block';
        
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }
}

// 确保全局函数可用
window.selectStage = selectStage;
window.goBackToStages = goBackToStages;
window.searchResponse = searchResponse;
window.handleKeyPress = handleKeyPress;
window.fillExample = fillExample;
window.copyToClipboard = copyToClipboard;
