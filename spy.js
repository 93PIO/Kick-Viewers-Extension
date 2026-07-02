(function() {
    console.log("🟢 [Kick Ext] spy.js يعمل الآن في السياق الرئيسي (MAIN world) عند document_start.");
    const OriginalWebSocket = window.WebSocket;
    
    window.WebSocket = function(url, protocols) {
        const ws = new OriginalWebSocket(url, protocols);
        
        ws.addEventListener('message', function(event) {
            // التحقق الأصلي البسيط والمضمون
            if (typeof event.data === 'string' && event.data.includes('ChatMessageEvent')) {
                let username = null;
                try {
                    const outer = JSON.parse(event.data);
                    const inner = JSON.parse(outer.data);
                    username = inner?.sender?.username || null;
                } catch (e) {
                    // تجاهل الخطأ، سنقوم بعدّ الرسالة على أي حال
                }
                
                document.dispatchEvent(new CustomEvent('KickRealtimeMessage', {
                    detail: { username: username }
                }));
            }
        });
        
        return ws;
    };
    
    Object.setPrototypeOf(window.WebSocket, OriginalWebSocket);
    window.WebSocket.prototype = OriginalWebSocket.prototype;
})();