sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("pgp.com.budgetmaster.controller.View1", {
        onInit() {
            sap.ui.core.UIComponent.getRouterFor(this);
            this.getOwnerComponent()
                .getRouter()
                .attachRoutePatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function (oEvent) {
            this.readCall();
        },
        onAddNew: function () {
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.navTo("View2", {
                nav: "null",
            });
        },
        readCall: function () {
            var sService = "/sap/opu/odata/sap/ZBUDGET_MASTER_SRV";
            var oModel = new sap.ui.model.odata.ODataModel(sService, true);
            var sPath = "/et_budget_masterSet"
            this.getView().setBusy(true);
            oModel.read(sPath, {
                success: function (data) {
                    this.getView().setModel(new JSONModel(data), "ModelForTable");
                    this.getView().setBusy(false);
                }.bind(this),
                error: function (sError) {
                    this.getView().setBusy(false);
                }.bind(this)
            })
        }
    });
});