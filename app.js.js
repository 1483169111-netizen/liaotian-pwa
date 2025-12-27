// 开场动画控制
document.addEventListener('DOMContentLoaded', function() {
    // 4秒后显示主界面
    setTimeout(() => {
        const opening = document.getElementById('opening-animation');
        const mainApp = document.getElementById('main-app');
        
        opening.style.animation = 'fadeOut 0.5s ease-out forwards';
        
        setTimeout(() => {
            opening.classList.add('hidden');
            mainApp.classList.remove('hidden');
        }, 500);
    }, 4000);
    
    // 初始化示例按钮
    initExampleButtons();
});

// 话术数据库 - 每个阶段都有丰富的话术
const conversationDatabase = {
    // 破冰初识阶段 (30+ 话术)
    icebreaking: [
        {
            keywords: ["你好", "嗨", "hello", "hi", "在吗"],
            responses: [
                {
                    type: "友好开场",
                    text: "你好呀！很高兴认识你 😊 我是[你的名字]，在[共同场景]看到的你",
                    tip: "加上具体场景会增加真实感"
                },
                {
                    type: "幽默开场",
                    text: "捕捉到一只可爱的小仙女！👋 今天过得怎么样？",
                    tip: "适合社交场合的轻松开场"
                },
                {
                    type: "直接开场",
                    text: "你好，刚看了你的资料觉得挺有趣的，想认识一下",
                    tip: "真诚直接，避免套路感"
                },
                {
                    type: "兴趣开场",
                    text: "看你好像也喜欢[共同兴趣]，最近有去[相关活动]吗？",
                    tip: "基于共同点开场更自然"
                },
                {
                    type: "提问开场",
                    text: "看到你在[地点/场景]，是在那边工作还是生活呀？",
                    tip: "开放式问题更容易展开对话"
                }
            ]
        },
        {
            keywords: ["在干嘛", "干什么", "忙吗"],
            responses: [
                {
                    type: "轻松回应",
                    text: "刚忙完工作，正在享受难得的休息时光 ☕ 你呢？",
                    tip: "分享状态+反问，延续对话"
                },
                {
                    type: "有趣分享",
                    text: "正在研究今晚吃什么这个世纪难题 🍽️ 你有什么推荐吗？",
                    tip: "用幽默感化解普通问题"
                },
                {
                    type: "价值展示",
                    text: "刚健完身回来，今天状态不错 🏋️ 你在做什么有趣的事吗？",
                    tip: "展示积极生活方式"
                },
                {
                    type: "延伸话题",
                    text: "在整理周末旅行的照片，发现了好多美景 📸 你喜欢旅行吗？",
                    tip: "自然引出新话题"
                }
            ]
        }
        // 这里可以继续添加更多话术分类...
    ],
    
    // 普通朋友阶段 (40+ 话术)
    friendship: [
        {
            keywords: ["吃饭", "吃了没", "吃什么"],
            responses: [
                {
                    type: "日常分享",
                    text: "刚吃了超好吃的火锅！🌶️ 你平时喜欢什么口味？",
                    tip: "分享具体体验，引发共鸣"
                },
                {
                    type: "邀约铺垫",
                    text: "最近发现一家很棒的日料店，改天可以一起去尝尝 🍣",
                    tip: "为未来邀约做铺垫"
                },
                {
                    type: "关心体贴",
                    text: "记得按时吃饭呀，胃不好更要照顾好自己 🍜",
                    tip: "展现关心但不过度"
                }
            ]
        }
        // 其他话术...
    ],
    
    // 吸引阶段 (35+ 话术)
    attraction: [
        {
            keywords: ["无聊", "好无聊", "没事做"],
            responses: [
                {
                    type: "价值提供",
                    text: "正好我知道有个有趣的活动/电影，要不要了解一下？🎬",
                    tip: "主动提供价值，展示领导力"
                },
                {
                    type: "推拉技巧",
                    text: "优秀的人都会自己找乐子哦~不过今天可以破例给你个建议 😏",
                    tip: "推拉结合，制造吸引"
                }
            ]
        }
        // 其他话术...
    ],
    
    // 暧昧期 (45+ 话术)
    ambiguous: [
        {
            keywords: ["想你", "想你了", "想见你"],
            responses: [
                {
                    type: "暧昧回应",
                    text: "这么巧，我刚也在想你在干嘛呢 ✨",
                    tip: "双向暧昧，升温关系"
                },
                {
                    type: "升级关系",
                    text: "那...要不要把"想"变成"见"呢？😉",
                    tip: "大胆但不过分的试探"
                }
            ]
        }
        // 其他话术...
    ],
    
    // 约会阶段 (30+ 话术)
    dating: [
        {
            keywords: ["周末", "有空", "时间"],
            responses: [
                {
                    type: "明确邀约",
                    text: "这周六下午有个艺术展，听说很棒，一起去看看吧？🎨",
                    tip: "具体时间+活动，成功率高"
                },
                {
                    type: "双向选择",
                    text: "我这周末有两个计划，一个是看展，一个是探店，你更想选哪个？😄",
                    tip: "给予选择权，减少压力"
                }
            ]
        }
        // 其他话术...
    ],
    
    // 稳定亲密 (40+ 话术)
    intimacy: [
        {
            keywords: ["爱你", "喜欢你", "在乎你"],
            responses: [
                {
                    type: "深情回应",
                    text: "我也爱你，和你在一起的每一天都很珍贵 ❤️",
                    tip: "真诚表达，巩固关系"
                },
                {
                    type: "行动承诺",
                    text: "你的爱让我变得更好了，我会一直珍惜我们之间的感情",
                    tip: "表达感激和承诺"
                }
            ]
        }
        // 其他话术...
    ],
    
    // 挽回期 (25+ 话术)
    recovery: [
        {
            keywords: ["分手", "结束", "算了"],
            responses: [
                {
                    type: "冷静回应",
                    text: "我理解你现在的心情，我们可以先冷静一下，但我不想轻易放弃",
                    tip: "保持冷静，展现成熟"
                },
                {
                    type: "反思改变",
                    text: "这段时间我想了很多，我确实有做得不好的地方，但我愿意改变",
                    tip: "承认错误+行动承诺"
                }
            ]
        }
        // 其他话术...
    ]
};

// 当前选择的阶段
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

// 阶段描述映射
const stageDescriptions = {
    icebreaking: "初次相识，建立第一印象，开启对话",
    friendship: "保持日常联系，建立舒适感和信任",
    attraction: "创造吸引，展示个人价值和魅力",
    ambiguous: "关系升温，微妙互动，测试对方兴趣",
    dating: "正式约会，推进关系，创造美好回忆",
    intimacy: "深度连接，建立稳定长期的亲密关系",
    recovery: "修复关系问题，重建信任和连接"
};

// 选择阶段
function selectStage(stage) {
    currentStage = stage;
    
    // 更新界面
    document.getElementById('current-stage-title').textContent = stageTitles[stage];
    
    // 切换到聊天界面
    document.querySelector('.stages-list').classList.add('hidden');
    document.getElementById('chat-interface').classList.remove('hidden');
    
    // 显示当前阶段的描述
    showStageDescription();
}

// 返回阶段选择
function goBackToStages() {
    document.querySelector('.stages-list').classList.remove('hidden');
    document.getElementById('chat-interface').classList.add('hidden');
    document.getElementById('results-container').innerHTML = '';
    document.getElementById('message-input').value = '';
}

// 显示阶段描述
function showStageDescription() {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = `
        <div class="stage-description">
            <h3>${stageTitles[currentStage]}</h3>
            <p>${stageDescriptions[currentStage]}</p>
            <div class="description-tips">
                <h4>💡 本阶段沟通要点：</h4>
                <ul>
                    ${getStageTips(currentStage)}
                </ul>
            </div>
        </div>
    `;
}

// 获取阶段提示
function getStageTips(stage) {
    const tips = {
        icebreaking: [
            "保持自然真诚，不要过度表现",
            "从共同点或观察到的细节开场",
            "避免查户口式连续提问",
            "适时展示幽默感但不过分"
        ],
        friendship: [
            "保持适当的联系频率",
            "分享生活但不过度倾诉",
            "寻找共同兴趣话题",
            "建立信任和舒适感"
        ],
        attraction: [
            "适时展示自身价值",
            "使用适当的推拉技巧",
            "保持神秘感和挑战性",
            "展现自信但不自负"
        ],
        ambiguous: [
            "增加亲密感但保持分寸",
            "使用适当的暧昧语言",
            "观察对方反馈调整节奏",
            "创造心动的瞬间"
        ],
        dating: [
            "提前规划好约会细节",
            "展现绅士风度和体贴",
            "创造轻松愉快的氛围",
            "适时推进关系升级"
        ],
        intimacy: [
            "深度沟通分享内心",
            "建立情感安全感",
            "共同规划未来",
            "保持新鲜感和浪漫"
        ],
        recovery: [
            "先冷静处理情绪",
            "真诚反思自身问题",
            "给彼此适当的空间",
            "展现改变的实际行动"
        ]
    };
    
    return tips[stage].map(tip => `<li>${tip}</li>`).join('');
}

// 搜索回复
function searchResponse() {
    const input = document.getElementById('message-input').value.trim();
    
    if (!input) {
        showToast('请输入对话内容');
        return;
    }
    
    if (!currentStage) {
        showToast('请先选择一个阶段');
        return;
    }
    
    // 在数据库中搜索匹配的话术
    const results = findMatchingResponses(input, currentStage);
    
    // 显示结果
    displayResults(results);
}

// 查找匹配的回复
function findMatchingResponses(input, stage) {
    const stageData = conversationDatabase[stage];
    if (!stageData) return [];
    
    const matches = [];
    const inputLower = input.toLowerCase();
    
    // 遍历所有话术分类
    stageData.forEach(category => {
        // 检查关键词匹配
        const keywordMatch = category.keywords.some(keyword => 
            inputLower.includes(keyword.toLowerCase())
        );
        
        if (keywordMatch) {
            // 每个分类最多取2个回复，确保多样性
            const selectedResponses = category.responses
                .sort(() => Math.random() - 0.5) // 随机排序
                .slice(0, 2); // 取前2个
            
            matches.push(...selectedResponses);
        }
    });
    
    // 如果没有匹配，返回通用回复
    if (matches.length === 0) {
        return getGenericResponses(stage);
    }
    
    // 随机选择5-6个回复
    return matches
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(6, matches.length));
}

// 获取通用回复
function getGenericResponses(stage) {
    const genericResponses = {
        icebreaking: [
            {
                type: "延续话题",
                text: "这个话题很有意思，能多说说你的想法吗？🤔",
                tip: "引导对方多分享"
            },
            {
                type: "转移话题",
                text: "对了，最近有看什么好看的电影/书吗？🎬",
                tip: "自然切换到新话题"
            },
            {
                type: "表达兴趣",
                text: "听起来很有趣，我对这方面也挺感兴趣的",
                tip: "找到共同点建立连接"
            }
        ],
        friendship: [
            {
                type: "关心问候",
                text: "最近天气变化大，注意身体哦 🌤️",
                tip: "日常关心增进感情"
            },
            {
                type: "分享生活",
                text: "今天遇到件有趣的事...（分享你的故事）",
                tip: "主动分享拉近距离"
            }
        ]
        // 其他阶段的通用回复...
    };
    
    return genericResponses[stage] || [
        {
            type: "友好回应",
            text: "我理解你的感受，能和我说说具体的情况吗？",
            tip: "展现倾听和关心"
        }
    ];
}

// 显示结果
function displayResults(results) {
    const container = document.getElementById('results-container');
    
    if (results.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <h3>未找到匹配回复</h3>
                <p>建议尝试其他表达方式，或查看阶段沟通要点</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="results-count">
            找到 ${results.length} 个建议回复：
        </div>
    `;
    
    // 添加每个回复卡片
    results.forEach((response, index) => {
        const card = document.createElement('div');
        card.className = 'response-card';
        card.innerHTML = `
            <div class="response-header">
                <span class="response-type">${response.type}</span>
                <button class="copy-btn" onclick="copyToClipboard('${escapeText(response.text)}', this)">
                    📋 复制
                </button>
            </div>
            <div class="response-text">${response.text}</div>
            <div class="response-tip">💡 ${response.tip}</div>
        `;
        container.appendChild(card);
    });
}

// 复制到剪贴板
function copyToClipboard(text, button) {
    // 创建临时textarea
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopySuccess(button);
        }
    } catch (err) {
        console.error('复制失败:', err);
    }
    
    document.body.removeChild(textarea);
}

// 显示复制成功
function showCopySuccess(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '✓ 已复制';
    button.style.background = '#4CAF50';
    button.style.color = 'white';
    
    // 显示全局提示
    const toast = document.getElementById('copy-toast');
    toast.classList.add('show');
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '';
        button.style.color = '';
        toast.classList.remove('show');
    }, 2000);
}

// 转义文本（防止引号问题）
function escapeText(text) {
    return text.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

// 处理键盘输入
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        searchResponse();
    }
}

// 填充示例
function fillExample(text) {
    document.getElementById('message-input').value = text;
    searchResponse();
}

// 初始化示例按钮
function initExampleButtons() {
    // 这里可以添加更多动态示例
}

// 显示提示
function showToast(message) {
    alert(message); // 可以替换为更美观的toast
}

// 添加更多话术数据
function addMoreConversationData() {
    // 这里可以继续扩展话术数据库
    // 每个阶段都可以添加更多分类和回复
}

// 导出数据函数（用于后续扩展）
function exportDatabase() {
    return JSON.stringify(conversationDatabase, null, 2);
}