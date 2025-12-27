// ==================== 开场动画控制 ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM 加载完成');
    
    // 4秒后显示主界面
    setTimeout(() => {
        console.log('开场动画结束');
        
        const opening = document.getElementById('opening-animation');
        const mainApp = document.getElementById('main-app');
        
        if (opening && mainApp) {
            // 淡出开场动画
            opening.style.opacity = '0';
            opening.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                opening.style.display = 'none';
                mainApp.style.display = 'block';
                
                // 初始化 PWA
                initPWA();
            }, 500);
        }
    }, 4000);
});

// ==================== PWA 功能 ====================
function initPWA() {
    console.log('初始化 PWA');
    
    let deferredPrompt;
    const installButton = document.getElementById('pwa-install-button');
    
    if (!installButton) return;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('PWA 安装提示可用');
        
        // 阻止默认安装提示
        e.preventDefault();
        
        // 保存事件
        deferredPrompt = e;
        
        // 显示安装按钮
        installButton.style.display = 'inline-block';
        
        installButton.onclick = () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('用户接受了安装');
                        showToast('应用安装成功！🎉');
                        installButton.style.display = 'none';
                    } else {
                        console.log('用户拒绝了安装');
                    }
                    deferredPrompt = null;
                });
            }
        };
    });
    
    // 检查是否已安装
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('应用已安装');
        installButton.style.display = 'none';
    }
}

// ==================== 聊天基础功能 ====================
let currentStage = '';

// 选择阶段
function selectStage(stage) {
    console.log('选择阶段:', stage);
    currentStage = stage;
    
    // 更新界面
    const stageTitle = document.getElementById('current-stage-title');
    if (stageTitle) {
        stageTitle.textContent = getStageTitle(stage);
    }
    
    // 切换显示
    document.querySelector('.stages-list').style.display = 'none';
    document.getElementById('chat-interface').style.display = 'block';
    
    // 显示描述
    showStageDescription();
}

// 返回阶段选择
function goBackToStages() {
    console.log('返回阶段选择');
    
    document.querySelector('.stages-list').style.display = 'block';
    document.getElementById('chat-interface').style.display = 'none';
    
    // 清空
    const resultsContainer = document.getElementById('results-container');
    if (resultsContainer) resultsContainer.innerHTML = '';
    
    const messageInput = document.getElementById('message-input');
    if (messageInput) messageInput.value = '';
}

// 获取阶段标题
function getStageTitle(stage) {
    const titles = {
        icebreaking: "破冰初识",
        friendship: "普通朋友", 
        attraction: "吸引阶段",
        ambiguous: "暧昧期",
        dating: "约会阶段",
        intimacy: "稳定亲密",
        recovery: "挽回期"
    };
    return titles[stage] || stage;
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
    
    container.innerHTML = `
        <div class="stage-description">
            <h3>${getStageTitle(currentStage)}</h3>
            <p>${descriptions[currentStage] || ''}</p>
            <div class="description-tips">
                <h4>💡 使用说明：</h4>
                <p>1. 输入对方的消息内容</p>
                <p>2. 点击"获取回复"按钮</p>
                <p>3. 选择合适的回复并复制使用</p>
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
    
    console.log('搜索:', text);
    
    // 简单的回复示例
    const responses = [
        {
            type: "友好回应",
            text: "刚忙完，正在休息呢 ☕ 你呢？今天过得怎么样？",
            tip: "分享状态+反问，延续对话"
        },
        {
            type: "幽默回应", 
            text: "正在思考人生大事：晚上吃什么？🍽️ 你有推荐吗？",
            tip: "用幽默化解普通问题"
        },
        {
            type: "关心回应",
            text: "听起来你今天有点忙呢，记得照顾好自己哦 🌟",
            tip: "展现关心和体贴"
        }
    ];
    
    displayResults(responses);
}

// 显示结果
function displayResults(results) {
    const container = document.getElementById('results-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="results-count">
            为您找到 ${results.length} 个建议回复：
        </div>
    `;
    
    // 安全地添加结果 - 限制数量
    const limitedResults = results.slice(0, 5); // 最多显示5个
    
    limitedResults.forEach((response, index) => {
        const card = document.createElement('div');
        card.className = 'response-card';
        card.innerHTML = `
            <div class="response-header">
                <span class="response-type">${response.type}</span>
                <button class="copy-btn" onclick="copyResponse(${index})">
                    📋 复制
                </button>
            </div>
            <div class="response-text">${response.text}</div>
            <div class="response-tip">💡 ${response.tip}</div>
        `;
        
        // 存储到全局变量
        if (!window.responseData) window.responseData = [];
        window.responseData[index] = response.text;
        
        container.appendChild(card);
    });
}

// 复制回复
function copyResponse(index) {
    const text = window.responseData && window.responseData[index];
    if (!text) return;
    
    navigator.clipboard.writeText(text).then(() => {
        showToast('已复制到剪贴板');
    }).catch(() => {
        // 备用方法
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('已复制到剪贴板');
    });
}

// 填充示例
function fillExample(text) {
    const input = document.getElementById('message-input');
    if (input) {
        input.value = text;
        searchResponse();
    }
}

// 处理键盘输入
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        searchResponse();
    }
}

// 显示提示
function showToast(message) {
    const toast = document.getElementById('copy-toast');
    if (toast) {
        toast.textContent = message;
        toast.style.display = 'block';
        
        setTimeout(() => {
            toast.style.display = 'none';
        }, 2000);
    }
}

// 导出全局函数
window.selectStage = selectStage;
window.goBackToStages = goBackToStages;
window.searchResponse = searchResponse;
window.handleKeyPress = handleKeyPress;
window.fillExample = fillExample;
window.copyResponse = copyResponse;
