sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("pgp.com.budgetmaster.controller.View1", {
        onInit() {
            sap.ui.core.UIComponent.getRouterFor(this);

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
            var oTempValues = {
                ResName: "",
                HODName: ""
            };
            this.getView().setModel(new JSONModel(oTempValues), "oModelTempValue");

            var oFilters = {
                PRJ_TYPE: "",
                ZINITI: "",
                ZTLIST: "",
                ZCATEG: "",
                ZEXPTP: "",
                ZCAPEX_OPEX: "",
                WERKS: "",
                ZWBS_OWNER: "",
                ZPRJ_HOD: "",
                ZBUDG_STATUS: "",
                budgetCode: ""

            };
            this.getView().setModel(new JSONModel(oFilters), "oModelFilter");
        },
        onSearch: function () {
            var oTable = this.getView().byId("table");
            var oBinding = oTable.getBinding("rows");
            var aFiltersList = [];
            var filterProject = this.getView().getModel("oModelFilter").getProperty("/PRJ_TYPE");
            if (filterProject) {
                aFiltersList.push(new sap.ui.model.Filter("PRJ_TYPE", sap.ui.model.FilterOperator.EQ, filterProject));
            }
            var filterInti = this.getView().getModel("oModelFilter").getProperty("/ZINITI");
            if (filterInti) {
                aFiltersList.push(new sap.ui.model.Filter("ZINITI", sap.ui.model.FilterOperator.EQ, filterInti));
            }
            var filterTech = this.getView().getModel("oModelFilter").getProperty("/ZTLIST");
            if (filterTech) {
                aFiltersList.push(new sap.ui.model.Filter("ZTLIST", sap.ui.model.FilterOperator.EQ, filterTech));
            }
            var filterCat = this.getView().getModel("oModelFilter").getProperty("/ZCATEG");
            if (filterCat) {
                aFiltersList.push(new sap.ui.model.Filter("ZCATEG", sap.ui.model.FilterOperator.EQ, filterCat));
            }
            var filterExpty = this.getView().getModel("oModelFilter").getProperty("/ZEXPTP");
            if (filterExpty) {
                aFiltersList.push(new sap.ui.model.Filter("ZEXPTP", sap.ui.model.FilterOperator.EQ, filterExpty));
            }
            var filterSpend = this.getView().getModel("oModelFilter").getProperty("/ZCAPEX_OPEX");
            if (filterSpend) {
                aFiltersList.push(new sap.ui.model.Filter("ZCAPEX_OPEX", sap.ui.model.FilterOperator.EQ, filterSpend));
            }
            var filterBUnit = this.getView().getModel("oModelFilter").getProperty("/WERKS");
            if (filterBUnit) {
                aFiltersList.push(new sap.ui.model.Filter("WERKS", sap.ui.model.FilterOperator.EQ, filterBUnit));
            }
            var filterResp = this.getView().getModel("oModelFilter").getProperty("/ZWBS_OWNER");
            if (filterResp) {
                aFiltersList.push(new sap.ui.model.Filter("ZWBS_OWNER", sap.ui.model.FilterOperator.Contains, filterResp));
            }
            var filterHOD = this.getView().getModel("oModelFilter").getProperty("/ZPRJ_HOD");
            
            if (filterHOD) {
                aFiltersList.push(new sap.ui.model.Filter("ZPRJ_HOD", sap.ui.model.FilterOperator.Contains, filterHOD));
            }
            var filterActiveInactive = this.getView().getModel("oModelFilter").getProperty("/ZBUDG_STATUS");
            if (filterActiveInactive) {
                if (filterActiveInactive === "true") {
                    aFiltersList.push(new sap.ui.model.Filter("ZBUDG_STATUS", sap.ui.model.FilterOperator.EQ, true));
                } else {
                    aFiltersList.push(new sap.ui.model.Filter("ZBUDG_STATUS", sap.ui.model.FilterOperator.EQ, false));
                }

            }
            var filterBudCode = this.getView().getModel("oModelFilter").getProperty("/budgetCode");
            if (filterBudCode) {
                aFiltersList.push(new sap.ui.model.Filter("budgetCode", sap.ui.model.FilterOperator.EQ, filterBudCode));
            }
            var aFilters = new sap.ui.model.Filter(aFiltersList, true); // true for AND
            oBinding.filter(aFilters);
        },
        onFilterBarClear: function () {
            this.getView().getModel("oModelFilter").setProperty("/PRJ_TYPE", "");
            this.getView().getModel("oModelFilter").setProperty("/ZINITI", "");
            this.getView().getModel("oModelFilter").setProperty("/ZTLIST", "");
            this.getView().getModel("oModelFilter").setProperty("/ZCATEG", "");
            this.getView().getModel("oModelFilter").setProperty("/ZEXPTP", "");
            this.getView().getModel("oModelFilter").setProperty("/ZCAPEX_OPEX", "");
            this.getView().getModel("oModelFilter").setProperty("/WERKS", "");
            this.getView().getModel("oModelFilter").setProperty("/ZWBS_OWNER", "");
            this.getView().getModel("oModelFilter").setProperty("/ZPRJ_HOD", "");
            this.getView().getModel("oModelFilter").setProperty("/ZBUDG_STATUS", "");
            this.getView().getModel("oModelFilter").setProperty("/budgetCode", "");
            this.getView().getModel("oModelTempValue").setProperty("/HODName", "");
            this.getView().getModel("oModelTempValue").setProperty("/ResName", "");
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



                var PRJ_TYPE = oSelectedRowData.PRJ_TYPE;
                var ZINITI = oSelectedRowData.ZINITI;
                var ZTLIST = oSelectedRowData.ZTLIST;
                var ZCATEG = oSelectedRowData.ZCATEG;
                var ZEXPTP = oSelectedRowData.ZEXPTP;
                var ZCAPEX_OPEX = oSelectedRowData.ZCAPEX_OPEX;
                var WERKS = oSelectedRowData.WERKS;
                var ZBUDG_CODE = oSelectedRowData.ZBUDG_CODE;

                var sPath = "(MANDT='',PRJ_TYPE='" + PRJ_TYPE + "',ZINITI='" + ZINITI + "',ZTLIST='" + ZTLIST + "',ZCATEG='" + ZCATEG + "',ZEXPTP='" + ZEXPTP + "',ZCAPEX_OPEX='" + ZCAPEX_OPEX + "',WERKS='" + WERKS + "',ZBUDG_CODE='" + ZBUDG_CODE + "')";
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
        },
        // F4 calls
        // HOD
        // on Value Help(F4)
        onHODValueHelp: function () {
            if (!this.hodFrag) {
                this.hodFrag = sap.ui.xmlfragment(
                    "pgp.com.budgetmaster.view.fragments.hodF4",
                    this
                );
                this.getView().addDependent(this.hodFrag);
                this._hodTemp = sap.ui
                    .getCore()
                    .byId("idSLhodValueHelp")
                    .clone();
            }

            var aFilter = [];
            sap.ui.getCore().byId("idSDhodF4").bindAggregation("items", {
                path: "/ZpsBudPerHodSet",
                filters: aFilter,
                template: this._hodTemp,
            });

            this.hodFrag.open();
        },

        // on Value Help - Search/liveChange
        onValueHelpSearch_hod: function (oEvent) {
            var aFilter = [];
            var sValue = oEvent.getParameter("value");
            var sPath = "/ZpsBudPerHodSet";
            var oSelectDialog = sap.ui.getCore().byId(oEvent.getParameter("id"));

            var oFilterName = new Filter(
                [new Filter("NameTextc", FilterOperator.Contains, sValue)],
                false
            );
            aFilter.push(oFilterName);

            oSelectDialog.bindAggregation("items", {
                path: sPath,
                filters: aFilter,
                template: this.hodFrag,
            });
        },

        // on Value Help - Confirm
        onValueHelpConfirm_hod: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                sSelectedValue = oSelectedItem.getProperty("title"),
                hodName = oSelectedItem.getProperty("description") + "-";
            this
                .getView()
                .getModel("oModelFilter")
                .setProperty("/ZPRJ_HOD", sSelectedValue);
            this.getView().getModel("oModelTempValue").setProperty("/HODName", hodName);

        },
        // resp
        // on Value Help(F4)
        onresValueHelp: function () {
            if (!this.resFrag) {
                this.resFrag = sap.ui.xmlfragment(
                    "pgp.com.budgetmaster.view.fragments.resF4",
                    this
                );
                this.getView().addDependent(this.resFrag);
                this._resTemp = sap.ui
                    .getCore()
                    .byId("idSLresValueHelp")
                    .clone();
            }

            var aFilter = [];
            sap.ui.getCore().byId("idSDresF4").bindAggregation("items", {
                path: "/ZpsBudPerHodSet",
                filters: aFilter,
                template: this._resTemp,
            });

            this.resFrag.open();
        },

        // on Value Help - Search/liveChange
        onValueHelpSearch_res: function (oEvent) {
            var aFilter = [];
            var sValue = oEvent.getParameter("value");
            var sPath = "/ZpsBudPerHodSet";
            var oSelectDialog = sap.ui.getCore().byId(oEvent.getParameter("id"));

            var oFilterName = new Filter(
                [new Filter("NameTextc", FilterOperator.Contains, sValue)],
                false
            );
            aFilter.push(oFilterName);

            oSelectDialog.bindAggregation("items", {
                path: sPath,
                filters: aFilter,
                template: this.resFrag,
            });
        },

        // on Value Help - Confirm
        onValueHelpConfirm_res: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                sSelectedValue = oSelectedItem.getProperty("title"),
                resName = oSelectedItem.getProperty("description") + "-";

            this
                .getView()
                .getModel("oModelFilter")
                .setProperty("/ZWBS_OWNER", sSelectedValue);
            this.getView().getModel("oModelTempValue").setProperty("/ResName", resName)
        },
    });
});