sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("pgp.com.budgetmaster.controller.View1", {
        onInit() {
            sap.ui.core.UIComponent.getRouterFor(this);

            this.readCall();
            this.definations();
        },
        definations: function () {
            var oFilters = {
                PRJ_TYPE: "",
                ZTLIST: "",
                ZCATEG: ""
            };
            this.getView().setModel(new JSONModel(oFilters), "oModelFilter");
        },
        onSearch: function () {
            var oTable = this.getView().byId("table");
            var oBinding = oTable.getBinding("rows");
            var filterProject = this.getView().getModel("oModelFilter").getProperty("/PRJ_TYPE");
            var filterTech = this.getView().getModel("oModelFilter").getProperty("/ZTLIST");
            var filterCat = this.getView().getModel("oModelFilter").getProperty("/ZCATEG");
            var aFiltersList = []
            if (filterProject) {
                aFiltersList.push(new sap.ui.model.Filter("PRJ_TYPE", sap.ui.model.FilterOperator.EQ, filterProject));
            }
            if (filterTech) {
                aFiltersList.push(new sap.ui.model.Filter("ZTLIST", sap.ui.model.FilterOperator.EQ, filterTech));
            }
            if (filterCat) {
                aFiltersList.push(new sap.ui.model.Filter("ZCATEG", sap.ui.model.FilterOperator.EQ, filterCat));
            }

            var aFilters = new sap.ui.model.Filter(aFiltersList, true); // true for AND
            oBinding.filter(aFilters);
        },
        onFilterBarClear: function () {
            this.getView().getModel("oModelFilter").setProperty("/PRJ_TYPE", "");
            this.getView().getModel("oModelFilter").setProperty("/ZTLIST", "");
            this.getView().getModel("oModelFilter").setProperty("/ZCATEG", "");
            this.readCall();
        },
        onAddNew: function () {
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.navTo("View2", {
                nav: "null",
            });
        },
        onClickofItem: function (oEvent) {
            var PRJ_TYPE = oEvent.getParameter("rowContext").getObject().PRJ_TYPE;
            var ZINITI = oEvent.getParameter("rowContext").getObject().ZINITI;
            var ZTLIST = oEvent.getParameter("rowContext").getObject().ZTLIST;
            var ZCATEG = oEvent.getParameter("rowContext").getObject().ZCATEG;
            var ZEXPTP = oEvent.getParameter("rowContext").getObject().ZEXPTP;
            var ZCAPEX_OPEX = oEvent.getParameter("rowContext").getObject().ZCAPEX_OPEX;
            var WERKS = oEvent.getParameter("rowContext").getObject().WERKS;
            var ZBUDG_CODE = oEvent.getParameter("rowContext").getObject().ZBUDG_CODE;
            var nav = "(MANDT='',PRJ_TYPE='" + PRJ_TYPE + "',ZINITI='" + ZINITI + "',ZTLIST='" + ZTLIST + "',ZCATEG='" + ZCATEG + "',ZEXPTP='" + ZEXPTP + "',ZCAPEX_OPEX='" + ZCAPEX_OPEX + "',WERKS='" + WERKS + "',ZBUDG_CODE='" + ZBUDG_CODE + "')"
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.navTo("View2", {
                nav: nav,
            });
        },
        readCall: function () {
            var oModel = this.getOwnerComponent().getModel();
            var sPath = "/et_budget_masterSet"
            this.getView().setBusy(true);
            oModel.read(sPath, {
                success: function (data) {
                    oModel.read("/ZpsBudPerHodSet", {
                        success: function (aData) {
                            for (var j = 0; j < data.results.length; j++) {
                                var aTableElement = data.results[j];
                                for (let index = 0; index < aData.results.length; index++) {
                                    const element = aData.results[index];

                                    if (element.Bname === aTableElement.ZPRJ_HOD) {
                                        aTableElement.ZPRJ_HOD = element.NameTextc + "-" + aTableElement.ZPRJ_HOD
                                        // this.getView().getModel("oModelTempValue").setProperty("/HODName", element.NameTextc + "-");
                                    }
                                    if (element.Bname === aTableElement.ZWBS_OWNER) {
                                        aTableElement.ZWBS_OWNER = element.NameTextc + "-" + aTableElement.ZWBS_OWNER
                                        // this.getView().getModel("oModelTempValue").setProperty("/ResName", element.NameTextc + "-");
                                    }

                                }
                            }

                            this.getView().setBusy(false);
                            this.getView().setModel(new JSONModel(data.results), "ModelForTable");
                        }.bind(this),
                        error: function () { }.bind(this)
                    });

                }.bind(this),
                error: function (sError) {
                    this.getView().setBusy(false);
                }.bind(this)
            })
        }
    });
});