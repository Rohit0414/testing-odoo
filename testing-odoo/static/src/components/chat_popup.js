odoo.define('niyu_odoo_ai.chat_popup', [], function (require) {
    'use strict';

    const { Component, tags, useState, whenReady, mount } = require('@odoo/owl');
    const { useService } = require('@web/core/utils/hooks');


    class ChatPopup extends Component {
        static template = "niyu_odoo_ai.ChatPopup";

        setup() {
            this.rpc   = useService('rpc');            // rpc still exists
            this.state = useState({ open: false, messages: [] });

            /* listen to the global custom event */
            this._toggle = () => { this.state.open = !this.state.open; };
            window.addEventListener('ai_chat:toggle', this._toggle);
        }

        /** clean-up */
        onWillUnmount() {
            window.removeEventListener('ai_chat:toggle', this._toggle);
        }

        async sendMessage(ev) {
            ev.preventDefault();
            const input = this.el.querySelector('textarea');
            const text  = input.value.trim();
            if (!text) return;

            this.state.messages.push({ role: 'user', text });
            input.value = '';

            const answer = await this.rpc('/niyu_ai/ask', { prompt: text });
            this.state.messages.push({ role: 'assistant', text: answer });

            /* auto-scroll */
            setTimeout(() => {
                const box = this.el.querySelector('.ai-history');
                box.scrollTop = box.scrollHeight;
            });
        }
    }

    /* QWeb template unchanged – omitted for brevity */

    whenReady(() => mount(ChatPopup, document.body));
});
