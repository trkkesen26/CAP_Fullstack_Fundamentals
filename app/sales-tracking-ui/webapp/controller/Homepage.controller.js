sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    "sap/ui/model/json/JSONModel",
    'sap/m/Label',
    'sap/ui/comp/smartvariants/PersonalizableInfo'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, JSONModel, Label, PersonalizableInfo) {
        "use strict";

        return Controller.extend("com.ndbs.salestrackingui.controller.Homepage", {
            onInit: function () {

                this.applyData = this.applyData.bind(this);
                this.fetchData = this.fetchData.bind(this);
                this.getFiltersWithValues = this.getFiltersWithValues.bind(this);
    
                this.oExpandedLabel = this.getView().byId("expandedLabel");
                this.oSnappedLabel = this.getView().byId("snappedLabel");
                this.oFilterBar = this.getView().byId("fbSalesReport");
                this.oTable = this.getView().byId("tblSalesReport");
    
                this.oFilterBar.registerFetchData(this.fetchData);
                this.oFilterBar.registerApplyData(this.applyData);
                this.oFilterBar.registerGetFiltersWithValues(this.getFiltersWithValues);
            },

            onNavToView : function (oEvent) {
                this.getOwnerComponent().getRouter().navTo(oEvent);
            },
    
            onExit: function() {
                this.oModel = null;

                this.oExpandedLabel = null;
                this.oSnappedLabel = null;
                this.oFilterBar = null;
                this.oTable = null;
            },
    
            fetchData: function () {
                var aData = this.oFilterBar.getAllFilterItems().reduce(function (aResult, oFilterItem) {
                    aResult.push({
                        groupName: oFilterItem.getGroupName(),
                        fieldName: oFilterItem.getName(),
                        fieldData: oFilterItem.getControl().getSelectedKeys()
                    });
    
                    return aResult;
                }, []);
    
                return aData;
            },
    
            applyData: function (aData) {
                aData.forEach(function (oDataObject) {
                    var oControl = this.oFilterBar.determineControlByName(oDataObject.fieldName, oDataObject.groupName);
                    oControl.setSelectedKeys(oDataObject.fieldData);
                }, this);
            },
    
            getFiltersWithValues: function () {
                var aFiltersWithValue = this.oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
                    var oControl = oFilterGroupItem.getControl();
    
                    if (oControl && oControl.getSelectedKeys && oControl.getSelectedKeys().length > 0) {
                        aResult.push(oFilterGroupItem);
                    }
    
                    return aResult;
                }, []);
    
                return aFiltersWithValue;
            },
    
            onSelectionChange: function (oEvent) {
                this.oFilterBar.fireFilterChange(oEvent);
            },
    
            onSearch: function () {
                var aTableFilters = this.oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
                    var oControl = oFilterGroupItem.getControl(),
                        aSelectedKeys = oControl.getSelectedKeys(),
                        aFilters = aSelectedKeys.map(function (sSelectedKey) {
                            return new Filter({
                                path: oFilterGroupItem.getName(),
                                operator: FilterOperator.Contains,
                                value1: sSelectedKey
                            });
                        });
    
                    if (aSelectedKeys.length > 0) {
                        aResult.push(new Filter({
                            filters: aFilters,
                            and: false
                        }));
                    }
    
                    return aResult;
                }, []);
    
                this.oTable.getBinding("items").filter(aTableFilters);
                this.oTable.setShowOverlay(false);
            },
    
            onFilterChange: function () {
                this._updateLabelsAndTable();
            },
    
            onAfterVariantLoad: function () {
                this._updateLabelsAndTable();
            },
    
            getFormattedSummaryText: function() {
                var aFiltersWithValues = this.oFilterBar.retrieveFiltersWithValues();
    
                if (aFiltersWithValues.length === 0) {
                    return "No filters active";
                }
    
                if (aFiltersWithValues.length === 1) {
                    return aFiltersWithValues.length + " filter active: " + aFiltersWithValues.join(", ");
                }
    
                return aFiltersWithValues.length + " filters active: " + aFiltersWithValues.join(", ");
            },
    
            getFormattedSummaryTextExpanded: function() {
                var aFiltersWithValues = this.oFilterBar.retrieveFiltersWithValues();
    
                if (aFiltersWithValues.length === 0) {
                    return "No filters active";
                }
    
                var sText = aFiltersWithValues.length + " filters active",
                    aNonVisibleFiltersWithValues = this.oFilterBar.retrieveNonVisibleFiltersWithValues();
    
                if (aFiltersWithValues.length === 1) {
                    sText = aFiltersWithValues.length + " filter active";
                }
    
                if (aNonVisibleFiltersWithValues && aNonVisibleFiltersWithValues.length > 0) {
                    sText += " (" + aNonVisibleFiltersWithValues.length + " hidden)";
                }
    
                return sText;
            },
    
            _updateLabelsAndTable: function () {
                this.oExpandedLabel.setText(this.getFormattedSummaryTextExpanded());
                this.oSnappedLabel.setText(this.getFormattedSummaryText());
                this.oTable.setShowOverlay(true);
            }
        });
    });
