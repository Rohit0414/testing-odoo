/** @odoo-module **/

import { Component, useState, useRef } from "@odoo/owl";
// import {useRef} from "@odoo/owl/hooks";
import { rpc } from "@web/core/network/rpc";
import { registry } from "@web/core/registry";

function parseAIResponse(str) {
    const lines = str.split('\n').map(x => x.trim()).filter(Boolean);
    let intro = "";
    let points = [];
    let outro = "";
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/^\d+\./.test(line)) {
            inList = true;
            points.push(line.replace(/^\d+\.\s*/, ""));
        } else if (inList && line && !/^\d+\./.test(line)) {
            // After list, collect outro
            outro += (outro ? " " : "") + line;
        } else if (!inList && line) {
            intro += (intro ? " " : "") + line;
        }
    }
    return { intro, points, outro };
}

class NiyuAssistantPopup extends Component {
    static template = "niyu_odoo_ai.NiyuAssistantPopup";  // reference to template defined in XML
    queryInputRef = useRef("queryInput");
    static props = {};

    constructor(...args) {
        super(...args);
        console.log("NiyuAssistantPopup instance constructed.");
        // At runtime, 'this.constructor.template' is usually the string name.
        console.log("Owl template at instance:", this.constructor.template);
    }

    // Static check: logs as soon as class is loaded (before any instance is created)
    static {
        console.log("NiyuAssistantPopup class loaded, template:", this.template);
    }

    state = useState({
        open: false,
        isLoading: false,
        response: "",
        responseList: [],
        responseIntro: "",   // Add
        responseOutro: "",   // Add
        error: false
    });

  
    // Toggle the popup open/closed
    togglePopup() {
        this.state.open = !this.state.open;
    }
    // Close the popup (for convenience, e.g. on "X" button)
    closePopup() {
        this.state.open = false;
    }
    // Send the query to the AI backend and handle the response
    
   async sendQuery() {
    const inputEl = this.queryInputRef.el;
    console.log("inputEl:", inputEl);
    const queryText = inputEl.value.trim();
    if (!queryText) return;  // do nothing if input is empty
    this.state.isLoading = true;
    this.state.error = false;
    this.state.response = "";  // optionally clear previous response
    this.state.responseList = []; // clear old list
    try {
        const result = await rpc("/niyu_ai/query", { query: queryText });
       if (result && result.response) {
            // Parse the AI response
            const { intro, points, outro } = parseAIResponse(
                Array.isArray(result.response) ? result.response.join("\n") : result.response
            );
            this.state.response = result.response; // for fallback
            this.state.responseIntro = intro;
            this.state.responseList = points;
            this.state.responseOutro = outro;
            this.state.error = false;

        } else if (result && result.error) {
            this.state.response = result.error;
            this.state.responseList = [result.error];
            this.state.error = true;
        } else {
            this.state.response = "No response.";
            this.state.responseList = ["No response."];
            this.state.error = false;
        }
    } catch (e) {
        console.error("Niyu AI query failed:", e);
        this.state.response = "Request failed. Please try again.";
        this.state.responseList = ["Request failed. Please try again."];
        this.state.error = true;
    } finally {
        this.state.isLoading = false;
    }
}

}

// Register this component as a top-level element in the backend web client
registry.category("main_components").add("NiyuAssistantPopup", { 
    Component: NiyuAssistantPopup 
});
