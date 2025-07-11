// ask_ai_systray/static/src/components/ask_ai_systray.js
/** @odoo-module **/
import { registry }        from '@web/core/registry';
import { Component }       from '@odoo/owl';
import { useService }      from '@web/core/utils/hooks';

class AskAISystray extends Component {
  setup() {
    this.action = useService('action');
  }
  onClick() {
    // Replace with your client-action or any RPC:
    this.action.doAction({
      type: 'ir.actions.client',
      tag:  'ask_ai_chat',
    });
  }
}
// point at the QWeb template defined below
AskAISystray.template = 'ask_ai_systray_template';

// register it in the systray, with a sequence so it sits near the others
registry.category('systray').add('AskAISystray', AskAISystray, { sequence: 150 });
