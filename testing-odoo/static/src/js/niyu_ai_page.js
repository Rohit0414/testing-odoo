/** @odoo-module **/

import { registry } from "@web/core/registry";
import { rpc } from "@web/core/network/rpc";
import { useService, useBus } from "@web/core/utils/hooks"; // <-- Import useBus
import { Component, useState, onWillStart, onPatched, useRef, onMounted } from "@odoo/owl"; // <-- Import onMounted
import { Layout } from "@web/search/layout";

class NiyuAIClientAction extends Component {
    static template = "niyu_odoo_ai.niyu_ai_client_action_template";
    static components = { Layout };
    static props = { ...Layout.props, "*": { type: true, optional: true } };

    setup() {
        this.notification = useService("notification");
        this.chatHistoryEl = useRef("chatHistory");
        this.queryInput = useRef("queryInput");

        // THIS IS THE NEW, MORE FORCEFUL FIX
        useBus(this.env.bus, "ACTION_MANAGER:UPDATE", (ev) => {
            ev.detail.controller.display.controlPanel = false;
        });

        this.state = useState({
            isLoading: false,
            chatHistory: [],
            activeChatId: null,
            activeConversation: [],
        });

        onWillStart(() => {
            this._loadChatsFromStorage();
        });

        onPatched(() => this._scrollToBottom());
    }

    // --- CHAT MANAGEMENT ---
    _loadChatsFromStorage() {
        const storedChats = localStorage.getItem("niyu_ai_chats");
        if (storedChats) {
            this.state.chatHistory = JSON.parse(storedChats);
        }
    }
    _saveChatsToStorage() {
        if (this.state.activeChatId) {
            const chatIndex = this.state.chatHistory.findIndex(c => c.id === this.state.activeChatId);
            if (chatIndex !== -1) {
                this.state.chatHistory[chatIndex].messages = this.state.activeConversation;
            }
        }
        localStorage.setItem("niyu_ai_chats", JSON.stringify(this.state.chatHistory));
    }
    onNewChat() {
        const newChat = {
            id: Date.now(),
            title: "New Chat",
            messages: [{
                id: Date.now() + 1,
                role: 'assistant',
                content: 'Hello! How can I help you with your Odoo data today?',
            }]
        };
        this.state.chatHistory.unshift(newChat);
        this.onSelectChat(newChat.id);
    }
    onSelectChat(chatId) {
        if (!chatId) {
            this.state.activeChatId = null;
            this.state.activeConversation = [];
            return;
        }
        const chat = this.state.chatHistory.find(c => c.id === chatId);
        if (chat) {
            this.state.activeChatId = chatId;
            this.state.activeConversation = [...chat.messages];
        }
    }
    onDeleteChat(chatIdToDelete) {
        this.state.chatHistory = this.state.chatHistory.filter(c => c.id !== chatIdToDelete);
        if (this.state.activeChatId === chatIdToDelete) {
            this.onSelectChat(null);
        }
        this._saveChatsToStorage();
    }

    // --- CONVERSATION LOGIC ---
    async onAskAI() {
        if (this.state.isLoading || !this.state.activeChatId) return;
        const query = this.queryInput.el.value.trim();
        if (!query) return;

        this.state.isLoading = true;
        this.state.activeConversation.push({ id: Date.now(), role: 'user', content: query });
        const assistantMessageId = Date.now() + 1;
        this.state.activeConversation.push({ id: assistantMessageId, role: 'assistant', isLoading: true });
        
        const activeChat = this.state.chatHistory.find(c => c.id === this.state.activeChatId);
        if (activeChat && activeChat.title === "New Chat") {
            activeChat.title = query.substring(0, 30) + (query.length > 30 ? "..." : "");
        }
        this.queryInput.el.value = "";

        try {
            const result = await rpc("/niyu_ai/query", { query });
            const assistantMessage = this.state.activeConversation.find(m => m.id === assistantMessageId);
            if (result.error) {
                assistantMessage.isError = true;
                assistantMessage.content = result.error;
            } else {
                assistantMessage.content = result.response;
                assistantMessage.sql = result.sql_query;
            }
            assistantMessage.isLoading = false;
        } catch (err) {
            const assistantMessage = this.state.activeConversation.find(m => m.id === assistantMessageId);
            assistantMessage.isError = true;
            assistantMessage.content = "An unexpected error occurred.";
            assistantMessage.isLoading = false;
        } finally {
            this.state.isLoading = false;
            this._saveChatsToStorage();
        }
    }
    onInputKeydown(ev) {
        if (ev.key === "Enter" && !ev.shiftKey) {
            ev.preventDefault();
            this.onAskAI();
        }
    }

    // --- UI HELPERS ---
    toggleSqlVisibility(message) { message.showSql = !message.showSql; }
    copySQLToClipboard(sql) {
        navigator.clipboard.writeText(sql).then(() => this.notification.add("SQL copied!", { type: "success" }));
    }
    _scrollToBottom() {
        if (this.chatHistoryEl.el) {
            this.chatHistoryEl.el.scrollTop = this.chatHistoryEl.el.scrollHeight;
        }
    }
}

registry.category("actions").add("niyu_odoo_ai.action", NiyuAIClientAction);