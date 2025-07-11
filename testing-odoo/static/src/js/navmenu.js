/** @odoo-module **/
import { registry }        from "@web/core/registry";
import { Component }       from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

export class NavbarMenu extends Component {
  onClickNavbarMenu() {
    // debugger;  // or your actual click behavior
    // this.action.doAction({
    //   type: 'ir.actions.client',
    //   tag:  'ask_ai_chat',
    // });
    this.bus = useService("bus");
        this.bus.trigger("ai_chat:toggle");
  }
}
// this must match the t-name in your XML template:
NavbarMenu.template = "NavbarMenu";

registry
  .category("systray")
  .add("niyu_odoo_ai.NavbarMenu", { Component: NavbarMenu }, { sequence: 30 });
