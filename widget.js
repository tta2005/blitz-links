(function() {
    // ၁။ Socket.io Connection (127.0.0.1 သည် localhost ထက် ပိုစိတ်ချရသည်)
    const socket = io('http://127.0.0.1:3000'); 
    const OWNER_ID = "69ed2070fb1e9db48fb0fcdd"; 
    const GUEST_ID = 'guest_' + Math.floor(Math.random() * 1000000);

    // ၂။ Chat Widget UI (Neon Style)
    const widgetHTML = `
        <div id="nexus-widget" style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: 'Outfit', sans-serif;">
            <button id="nexus-launcher" style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #00f2ff, #ff0055); color: white; border: none; cursor: pointer; box-shadow: 0 0 15px #00f2ff; font-size: 24px; display: flex; align-items: center; justify-content: center;">💬</button>
            <div id="nexus-chat-box" style="display: none; width: 320px; height: 450px; background: rgba(10,10,15,0.95); border: 1.5px solid #00f2ff; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); flex-direction: column; position: absolute; bottom: 80px; right: 0; overflow: hidden; backdrop-filter: blur(15px);">
                <div style="background: linear-gradient(90deg, #00f2ff, #ff0055); color: white; padding: 15px; font-weight: bold; font-family: 'Syncopate'; font-size: 12px; display: flex; justify-content: space-between;">
                    <span>NEXUS SUPPORT</span>
                    <span id="nexus-close" style="cursor:pointer;">×</span>
                </div>
                <div id="nexus-messages" style="flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px;"></div>
                <div style="padding: 10px; border-top: 1px solid rgba(0,242,255,0.2); display: flex; gap: 5px;">
                    <input type="text" id="nexus-input" placeholder="Type a message..." style="flex: 1; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid #00f2ff; border-radius: 10px; color: white; outline: none; font-size: 13px;">
                    <button id="nexus-send" style="background: #00f2ff; color: black; border: none; padding: 8px 15px; border-radius: 10px; cursor: pointer; font-weight: bold;">Send</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    const launcher = document.getElementById('nexus-launcher');
    const chatBox = document.getElementById('nexus-chat-box');
    const closeBtn = document.getElementById('nexus-close');
    const messagesContainer = document.getElementById('nexus-messages');
    const input = document.getElementById('nexus-input');
    const sendBtn = document.getElementById('nexus-send');

    launcher.onclick = () => { chatBox.style.display = 'flex'; launcher.style.display = 'none'; };
    closeBtn.onclick = () => { chatBox.style.display = 'none'; launcher.style.display = 'flex'; };

    const sendMessage = () => {
        const text = input.value.trim();
        if (text) {
            socket.emit('widget_message', {
                ownerId: OWNER_ID,
                chatId: GUEST_ID,
                sender: 'Website Visitor',
                text: text,
                platform: 'livechat',
                type: 'incoming'
            });
            appendMessage('out', text);
            input.value = '';
        }
    };

    sendBtn.onclick = sendMessage;
    input.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };

    socket.on(`widget_reply_${GUEST_ID}`, (text) => { appendMessage('in', text); });

    function appendMessage(type, text) {
        const div = document.createElement('div');
        div.style.maxWidth = '80%';
        div.style.padding = '10px 14px';
        div.style.borderRadius = '15px';
        div.style.fontSize = '13px';
        div.innerText = text;

        if (type === 'out') {
            div.style.alignSelf = 'flex-end';
            div.style.background = '#00f2ff';
            div.style.color = 'black';
        } else {
            div.style.alignSelf = 'flex-start';
            div.style.background = 'rgba(255,255,255,0.1)';
            div.style.color = 'white';
            div.style.border = '1px solid rgba(0,242,255,0.3)';
        }
        messagesContainer.appendChild(div);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
})();
