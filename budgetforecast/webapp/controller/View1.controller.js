sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], (Controller, JSONModel, MessageBox) => {
    "use strict";

    return Controller.extend("pgp.com.budgetforecast.controller.View1", {
        onInit() {
            sap.ui.core.UIComponent.getRouterFor(this);
            this.getOwnerComponent()
                .getRouter()
                .attachRoutePatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function (oEvent) {
            this.definations();
            this.getView().byId("table").clearSelection();
            var nav = oEvent.getParameter("arguments").nav
            if (nav === 'null' || nav === undefined) {
                this.readCall();
            } else {
                this.readCall();
            }
        },



        definations: function () {
            var oDataForFilters = {
                budgetCode: "",
                finYear: "",
                WBS: ""
            };
            this.getView().setModel(new JSONModel(oDataForFilters), "oModelFilter")

        },
        onSearch: function () {
            var oTable = this.getView().byId("table");
            var oBinding = oTable.getBinding("rows");
            var budgetCode = this.getView().getModel("oModelFilter").getProperty("/budgetCode");
            var finYear = this.getView().getModel("oModelFilter").getProperty("/finYear");
            var WBS = this.getView().getModel("oModelFilter").getProperty("/WBS");
            var aFiltersList = []
            if (budgetCode) {
                aFiltersList.push(new sap.ui.model.Filter("ZBUDG_CODE", sap.ui.model.FilterOperator.EQ, budgetCode));
            }
            if (finYear) {
                aFiltersList.push(new sap.ui.model.Filter("ZWBS_YEAR", sap.ui.model.FilterOperator.EQ, finYear));
            }
            if (WBS) {
                aFiltersList.push(new sap.ui.model.Filter("POSID", sap.ui.model.FilterOperator.EQ, WBS));
            }

            var aFilters = new sap.ui.model.Filter(aFiltersList, true); // true for AND
            oBinding.filter(aFilters);
        },
        onFilterBarClear: function () {
            this.getView().getModel("oModelFilter").setProperty("/budgetCode", "");
            this.getView().getModel("oModelFilter").setProperty("/finYear", "");
            this.getView().getModel("oModelFilter").setProperty("/WBS", "");
            this.readCall();
        },
        onAddNew: function () {
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.navTo("View2", {
                nav: "null",
            });
        },
        onClickofItem: function (oEvent) {

            var ZBUDG_CODE = oEvent.getParameter("rowContext").getObject().ZBUDG_CODE;
            var ZWBS_YEAR = oEvent.getParameter("rowContext").getObject().ZWBS_YEAR;
            var POSID = oEvent.getParameter("rowContext").getObject().POSID;
            var nav = "(MANDT='',ZBUDG_CODE='" + ZBUDG_CODE + ",ZWBS_YEAR='" + ZWBS_YEAR + ",POSID='" + POSID + "')"
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.navTo("View2", {
                nav: nav,
            });
        },
        onEditButtonPress: function () {
            this.action("edit");
        },
        onCopyButtonPress: function () {
            this.action("copy");
        },
        onDeleteButtonPress: function () {
            this.action("delete");
        },
        action: function (action) {
            var oTable = this.getView().byId("table");
            var iSelectedIndex = oTable.getSelectedIndex();

            if (iSelectedIndex > -1) {
                var oContext = oTable.getContextByIndex(iSelectedIndex);
                if (oContext) {
                    var oSelectedRowData = oContext.getObject();
                }

                var ZBUDG_CODE = oSelectedRowData.ZBUDG_CODE;
                var ZWBS_YEAR = oSelectedRowData.ZWBS_YEAR;
                var POSID = oSelectedRowData.POSID;

                var sPath = "(MANDT='',ZBUDG_CODE='" + ZBUDG_CODE + "',ZWBS_YEAR='" + ZWBS_YEAR + "',POSID='" + POSID + "')"
                var nav = action + "$" + sPath;
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("View2", {
                    nav: nav,
                });
            } else {
                MessageBox.error("Please select row");
            }


        },
        readCall: function () {
            var oModel = this.getOwnerComponent().getModel();
            var sPath = "/et_budget_forecastSet"
            this.getView().setBusy(true);
            oModel.read(sPath, {
                success: function (data) {
                    this.getView().setBusy(false);
                    this.getView().setModel(new JSONModel(data.results), "ModelForTable");
                    var aYear = []
                    for (let index = 0; index < data.results.length; index++) {
                        const element = data.results[index];
                        aYear.push(element.ZWBS_YEAR)
                    }
                    const uniqueYears = Array.from(new Set(aYear));
                    var dataForYear = []
                    for (let j = 0; j < uniqueYears.length; j++) {
                        const element = uniqueYears[j];
                        var oModelyear = {
                            year: element
                        }
                        dataForYear.push(oModelyear)
                    }
                    this.getView().setModel(new JSONModel(dataForYear), "oModelYearFilter");
                }.bind(this),
                error: function (sError) {
                    this.getView().setBusy(false);
                }.bind(this)
            })
        },
            // F4 calls
        // WBS
        // on Value Help(F4)
        onEBSValueHelp: function () {
            if (!this.wbsFrag) {
                this.wbsFrag = sap.ui.xmlfragment(
                    "pgp.com.budgetforecast.view.fragments.wbsF4",
                    this
                );
                this.getView().addDependent(this.wbsFrag);
                this._wbsTemp = sap.ui
                    .getCore()
                    .byId("idSLwbsValueHelp")
                    .clone();
            }

            var aFilter = [];
            sap.ui.getCore().byId("idSDwbsF4").bindAggregation("items", {
                path: "/ZpsBudWbsSet",
                filters: aFilter,
                template: this._wbsTemp,
            });

            this.wbsFrag.open();
        },

        // on Value Help - Search/liveChange
        onValueHelpSearch_wbs: function (oEvent) {
            var aFilter = [];
            var sValue = oEvent.getParameter("value");
            var sPath = "/ZpsBudWbsSet";
            var oSelectDialog = sap.ui.getCore().byId(oEvent.getParameter("id"));

            var oFilterName = new Filter(
                [new Filter("Posid", FilterOperator.Contains, sValue)],
                false
            );
            aFilter.push(oFilterName);

            oSelectDialog.bindAggregation("items", {
                path: sPath,
                filters: aFilter,
                template: this.wbsFrag,
            });
        },

        // on Value Help - Confirm
        onValueHelpConfirm_wbs: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                sSelectedValue = oSelectedItem.getProperty("title"),
                wbsName = oSelectedItem.getProperty("description") + "-";
            this
                .getView()
                .getModel("oModelFilter")
                .setProperty("/WBS", sSelectedValue);
        },
    });
});