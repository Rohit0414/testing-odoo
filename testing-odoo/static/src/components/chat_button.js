/**  Ask-AI toggle button – always mounted once **/

import { Component, mount } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

class AskAIButton extends Component {
    static template = "niyu_ai_chat.AskAIButton";
    setup() {
        this.bus = useService("bus");
        this.toggle = () => this.bus.trigger("ai_chat:toggle");
    }
}
AskAIButton.template = /* xml */`
    <div class="ai-fab" t-on-click="toggle">
        <i class="fa fa-comments-o"/> <!-- FontAwesome already loaded in backend -->
    </div>
`;

whenReady(() => {
    /** mount onto <body> so it is visible everywhere */
    mount(AskAIButton, document.body);
});
