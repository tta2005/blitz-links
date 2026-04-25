(function() {
    // ၁။ Socket.io ချိတ်ဆက်ခြင်း (သင့် Server URL ကို ပြောင်းလဲနိုင်သည်)
    const socket = io('http://localhost:3000'); 
    const OWNER_ID = "69ed2070fb1e9db48fb0fcdd"; 
    const GUEST_ID = 'guest_' + Math.floor(Math.random() * 1000000);

    // ၂။ Chat Widget UI ကို HTML ထဲသို့ ထည့်သွင်းခြင်း
    const widgetHTML = `
        <div id="nexus-widget" style="position: fixed; bottom: 20px; right: 20px; z-index: 1000; font-family: sans-serif;">
            <button id="nexus-launcher" style="width: 60px; height: 60px; border-radius: 50%; background: #3498db; color: white; border: none; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.2); font-size: 24px;">💬</button>
            <div id="nexus-chat-box" style="display: none; width: 320px; height: 450px; background: white; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.2); flex-direction: column; position: absolute; bottom: 80px; right: 0; overflow: hidden;">
                <div style="background: #3498db; color: white; padding: 15px; font-weight: bold;">Nexus Live Support</div>
                <div id="nexus-messages" style="flex: 1; padding: 15px; overflow-y: auto; background: #f9f9f9; display: flex; flex-direction: column; gap: 10px;"></div>
                <div style="padding: 10px; border-top: 1px solid #eee; display: flex; gap: 5px;">
                    <input type="text" id="nexus-input" placeholder="Type a message..." style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 20px; outline: none;">
                    <button id="nexus-send" style="background: #3498db; color: white; border: none; padding: 8px 15px; border-radius: 20px; cursor: pointer;">Send</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    // ၃။ Elements များကို ရှာဖွေခြင်း
    const launcher = document.getElementById('nexus-launcher');
    const chatBox = document.getElementById('nexus-chat-box');
    const messagesContainer = document.getElementById('nexus-messages');
    const input = document.getElementById('nexus-input');
    const sendBtn = document.getElementById('nexus-send');

    // ၄။ Widget ဖွင့်/ပိတ် Logic
    launcher.onclick = () => {
        chatBox.style.display = chatBox.style.display === 'none' ? 'flex' : 'none';
    };

    // ၅။ စာပို့သည့် Logic
    const sendMessage = () => {
        const text = input.value.trim();
        if (text) {
            const msgData = {
                ownerId: OWNER_ID,
                chatId: GUEST_ID,
                sender: 'Website Visitor',
                text: text,
                platform: 'livechat',
                type: 'incoming' // Dashboard အတွက် incoming ဖြစ်သည်
            };

            // Server ထံ စာပို့ခြင်း
            socket.emit('widget_message', msgData);

            // Widget UI တွင် စာပြခြင်း
            appendMessage('out', text);
            input.value = '';
        }
    };

    sendBtn.onclick = sendMessage;
    input.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };

    // ၆။ Admin ထံမှ စာပြန်လာသည်ကို လက်ခံခြင်း
    socket.on(`widget_reply_${GUEST_ID}`, (text) => {
        appendMessage('in', text);
    });

    // ၇။ UI တွင် စာသားများ ထည့်သွင်းသည့် Function
    function appendMessage(type, text) {
        const div = document.createElement('div');
        div.style.maxWidth = '80%';
        div.style.padding = '8px 12px';
        div.style.borderRadius = '15px';
        div.style.fontSize = '14px';
        div.style.lineHeight = '1.4';
        div.innerText = text;

        if (type === 'out') {
            div.style.alignSelf = 'flex-end';
            div.style.background = '#3498db';
            div.style.color = 'white';
        } else {
            div.style.alignSelf = 'flex-start';
            div.style.background = '#eee';
            div.style.color = '#333';
        }

        messagesContainer.appendChild(div);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
})();