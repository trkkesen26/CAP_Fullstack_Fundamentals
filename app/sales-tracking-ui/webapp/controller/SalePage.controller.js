sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    /**
    * @param {typeof sap.ui.core.mvc.Controller} Controller
    */
    function (Controller) {
        "use strict";

        return Controller.extend("com.ndbs.salestrackingui.controller.SalePage", {
            onInit: function () {

            },
            onNavToView : function (oEvent) {
                this.getOwnerComponent().getRouter().navTo(oEvent);
            },
        });
    }
);
