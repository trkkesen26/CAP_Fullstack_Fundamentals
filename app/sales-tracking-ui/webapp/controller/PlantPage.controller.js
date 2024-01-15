sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        'sap/ui/core/Fragment',
        "sap/m/MessageBox",
        "sap/m/MessageToast"
    ],
    /**
    * @param {typeof sap.ui.core.mvc.Controller} Controller
    */
    function (Controller, Fragment, MessageBox, MessageToast) {
        "use strict";

        return Controller.extend("com.ndbs.salestrackingui.controller.PlantPage", {
            onInit: function () {

            },
            onNavToView: function (oEvent) {
                this.getOwnerComponent().getRouter().navTo(oEvent);
            },
            onCreateNewRecord: function () {
                let oView = this.getView(),
                    oEntry;

                if (!this._oNewPlantDialog) {
                    this._oNewPlantDialog = Fragment.load({
                        id: oView.getId(),
                        name: "com.ndbs.salestrackingui.fragments.plant.PlantPageAdd",
                        controller: this
                    }).then(function (oValueHelpDialog) {
                        oView.addDependent(oValueHelpDialog);
                        return oValueHelpDialog;
                    });
                }
                this._oNewPlantDialog.then(function (oValueHelpDialog) {
                    oValueHelpDialog.open();
                    oEntry = this.getView().getModel().createEntry("/Plant", {
                        properties: {
                            ID: window.crypto.randomUUID()
                        }
                    });
                    this.byId("spfPlant").bindElement(oEntry.getPath());
                }.bind(this));
            },
            onCreateNewPlant: function () {
                let oDataModel = this.getView().getModel();
                oDataModel.submitChanges();

                this._oNewPlantDialog.then(function (oDialog) {
                    oDialog.close();
                })
            },
            onUpdateRecord: function () {
                let oPersonnelsTable = this.getView().byId("tblPlant"),
                    oSelectedPersonnelPath = oPersonnelsTable.getSelectedItem().getBindingContextPath(),
                    oView = this.getView();

                if (!this._oUpdatePersonnelDialog) {
                    this._oUpdatePersonnelDialog = Fragment.load({
                        id: oView.getId(),
                        name: "com.ndbs.salestrackingui.fragments.plant.PlantPageUpdate",
                        controller: this
                    }).then(function (oValueHelpDialog) {
                        oView.addDependent(oValueHelpDialog);
                        return oValueHelpDialog;
                    });
                }
                this._oUpdatePersonnelDialog.then(function (oValueHelpDialog) {
                    oValueHelpDialog.open();
                    this.byId("sfPlantUpdate").bindElement(oSelectedPersonnelPath);
                }.bind(this));
            },
            onSavePlant: function () {
                let oDataModel = this.getView().getModel();

                if (oDataModel.hasPendingChanges()) {
                    oDataModel.submitChanges();
                }

                this._oUpdatePersonnelDialog.then(function (oDialog) {
                    oDialog.close();
                });
            },
            onDeleteRecord: function () {
                let oDataModel = this.getView().getModel(),
                    oPersonnelsTable = this.getView().byId("tblPlant"),
                    oSelectedPersonnelPath = oPersonnelsTable.getSelectedItem().getBindingContextPath();

                MessageBox.confirm("Selected plant will be deleted. Do you confirm?", {
                    title: "Confirmation ?",
                    onClose: function (oEvent) {
                        if (oEvent == "OK") {
                            oDataModel.remove(oSelectedPersonnelPath);
                        }
                    },
                    styleClass: "",
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: sap.m.MessageBox.Action.OK,
                    initialFocus: null,
                    textDirection: sap.ui.core.TextDirection.Inherit
                });
            },
            onCloseDialog: function (oEvent) {
                let oDataModel = this.getView().getModel(),
                    sPath;

                switch (oEvent) {
                    case "_oNewPersonnelDialog":
                        sPath = this.byId("spfPlant").getBindingContext().getPath();
                        oDataModel.resetChanges([sPath]);
                        break;
                    case "_oUpdatePersonnelDialog":
                        sPath = this.byId("sfPlantUpdate").getBindingContext().getPath();
                        oDataModel.resetChanges([sPath]);
                        break;
                }
                
                this[oEvent].then(function (oDialog) {
                    oDialog.close();
                });
            },
            preventCloseByEscape: function(oPromise) {
                oPromise.reject();
            }
        });
    }
);
