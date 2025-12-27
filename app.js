// DOM元素获取
const messageList = document.getElementById('messageList');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

// 初始化页面
window.onload = () => {
  // 加载本地存储的历史消息
  loadHistoryMessages();
  // 绑定发送按钮事件
  sendBtn.addEventListener('click', sendMessage);
  // 绑定回车发送
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
};

// 发送消息
function sendMessage() {
  const content = messageInput.value.trim();
  if (!content) return;

  // 创建用户消息元素
  const userMsg = createMessageElement(content, 'user');
  messageList.appendChild(userMsg);

  // 清空输入框
  messageInput.value = '';
  // 滚动到底部
  scrollToBottom();

  // 模拟机器人回复（可替换为真实接口）
  setTimeout(() => {
    const replyContent = getRobotReply(content);
    const robotMsg = createMessageElement(replyContent, 'robot');
    messageList.appendChild(robotMsg);
    scrollToBottom();
  }, 800);

  // 保存到本地存储
  saveMessage(content, 'user');
}

// 创建消息DOM元素
function createMessageElement(content, type) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${type}-message`;
  
  const avatar = document.createElement('div');
  avatar.className = `avatar ${type}-avatar`;
  avatar.textContent = type === 'user' ? '我' : '机器人';

  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  contentDiv.textContent = content;

  msgDiv.appendChild(avatar);
  msgDiv.appendChild(contentDiv);

  return msgDiv;
}

// 滚动到底部
function scrollToBottom() {
  messageList.scrollTop = messageList.scrollHeight;
}

// 模拟机器人回复
function getRobotReply(userInput) {
  const replies = {
    '你好': '你好呀 😊',
    '在吗': '我一直在哦～',
    '再见': '拜拜～下次见！',
    '谢谢': '不客气～'
  };
  // 匹配关键词，无匹配则返回默认回复
  return replies[userInput] || `我收到了你的消息：「${userInput}」，但我还在学习中～`;
}

// 本地存储 - 保存消息
function saveMessage(content, type) {
  const messages = JSON.parse(localStorage.getItem('chatHistory') || '[]');
  messages.push({
    content,
    type,
    time: new Date().toLocaleString()
  });
  localStorage.setItem('chatHistory', JSON.stringify(messages));
}

// 本地存储 - 加载历史消息
function loadHistoryMessages() {
  const messages = JSON.parse(localStorage.getItem('chatHistory') || '[]');
  messages.forEach(msg => {
    const msgElement = createMessageElement(msg.content, msg.type);
    messageList.appendChild(msgElement);
  });
  scrollToBottom();
}
