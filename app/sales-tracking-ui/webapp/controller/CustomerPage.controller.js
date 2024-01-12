sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        'sap/ui/core/Fragment',
        "sap/m/MessageBox",
        "sap/m/MessageToast",

    ],
    /**
    * @param {typeof sap.ui.core.mvc.Controller} Controller
    */
    function (Controller, Fragment, MessageBox, MessageToast) {
        "use strict";

        return Controller.extend("com.ndbs.salestrackingui.controller.CustomerPage", {
            onInit: function () {

            },
            onNavToView: function (oEvent) {
                this.getOwnerComponent().getRouter().navTo(oEvent);
            },
            onCreate: function (oEvent) {
                let oButton = oEvent.getSource(),
                    oView = this.getView();

                if (!this._pPopover) {
                    this._pPopover = Fragment.load({
                        id: oView.getId(),
                        name: "com.ndbs.salestrackingui.fragments.customer.CustomerPage",
                        controller: this
                    })
                }
                this._pPopover.then(function (oPopover) {
                    oPopover.openBy(oButton);
                });
            },
            onCreateRequest: function (oEvent) {
                let customerUUID = this.getView().byId("inpUUID").getValue();
                let customerName = this.getView().byId("inpNameCustomer").getValue();
                let customerAddress = this.getView().byId("inpAddress").getValue();
                if (customerName.length < 1 || customerUUID.length != 36) {
                    MessageBox.error("Error happened while inserting new record.");
                    return false;
                }

                this.getView().getModel().create("/Customers", {
                    ID: customerUUID,
                    name: customerName,
                    address: customerAddress
                }, {
                    success: function (ret) {
                        MessageBox.success("New record has been created with ID : " + ret.ID);
                    }
                }
                );
            },
            onCreateUUID: function (oEvent) {
                let oView = this.getView();
                $.ajax({
                    url: "https://www.uuidgenerator.net/api/version4",
                    method: "GET",
                    success: function (oResult) {
                        oView.byId("inpUUID").setValue(oResult);
                    }
                });
            },
            onUpdate: function (oEvent) {
                let oItem = this.getView().byId("tblCustomer").getSelectedItem();
                if (oItem == null) {
                    MessageBox.error("Please selecet a any row of table.");
                    return;
                }
                let oRow = oItem.getBindingContext().getObject();
                this.getView().getModel("globalJSONModel").setData({
                    ID : oRow.ID, name : oRow.name, address : oRow.address});
                let oButton = oEvent.getSource(),
                    oView = this.getView();

                if (!this._pPopoverUpdate) {
                    this._pPopoverUpdate = Fragment.load({
                        id: oView.getId(),
                        name: "com.ndbs.salestrackingui.fragments.customer.CustomerPageUpdate",
                        controller: this
                    })
                }
                this._pPopoverUpdate.then(function (oPopover) {
                    oView.addDependent(oPopover);
                    oPopover.openBy(oButton);
                });
            },
            onUpdateRequest: function () {
                let customerUUID = this.getView().byId("inpUUIDUpdate").getValue();
                let customerName = this.getView().byId("inpNameCustomerUpdate").getValue();
                let customerAddress = this.getView().byId("inpAddressUpdate").getValue();
                if (customerName.length < 1 || customerUUID.length != 36) {
                    MessageBox.error("Error happened while inserting new record.");
                    return false;
                }
                this.getView().getModel().update("/Customers" + `(${customerUUID})`, {
                    ID: customerUUID,
                    name: customerName,
                    address: customerAddress
                }, {
                    success: function (ret) {
                        MessageBox.success(ret.ID + "has been updated!..");
                    }
                }
                );
            }, 
            onDelete: function () {
                let oDataModel = this.getView().getModel();
                let oItem = this.getView().byId("tblCustomer").getSelectedItem();
                if (oItem == null) {
                    MessageBox.error("Please selecet a any row of table.");
                    return;
                }
                let oRow = oItem.getBindingContext().getObject();

                oDataModel.remove("/Customers" + `(${oRow.ID})`, {
                    success: function (ret) {
                        MessageBox.success(oRow.ID + " has been deleted!..");
                    }
                });
            }
        });
    }
);
