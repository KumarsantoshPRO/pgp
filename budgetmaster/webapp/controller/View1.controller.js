sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/m/Token',
], (Controller, JSONModel, MessageBox, Filter, FilterOperator, Token) => {
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
            this.loadF4Data();
            this.getView().byId("table").clearSelection();
            var nav = oEvent.getParameter("arguments").nav
            if (nav === 'null' || nav === undefined) {
                this.readCall();
            } else {
                this.readCall();
            }
        },

        loadF4Data: function () {
            this.getOwnerComponent().getModel().read("/ZpsBudBdcodeSet", {
                success: function (data) {

                    this.getView().setModel(new JSONModel(data.results), "oModelBudCode");
                }.bind(this),
                error: function (sError) {

                }.bind(this)
            })
        },
        definations: function () {
            this.aFiltersList = [];
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
                budgetCode: "",
                budgetCodeDescr: ""

            };
            this.getView().setModel(new JSONModel(oFilters), "oModelFilter");
        },

        onSearch: function () {
            var aFilters = [];
            var oTable = this.getView().byId("table");
            var oBinding = oTable.getBinding("rows");

            // Project MultiComboBox
            var oCategoryMultiComboBox = this.getView().byId("idProjectFilter");
            var aSelectedCategories = oCategoryMultiComboBox.getSelectedKeys();
            if (aSelectedCategories && aSelectedCategories.length > 0) {
                var aCategoryFilters = [];
                aSelectedCategories.forEach(function (sCategory) {
                    aCategoryFilters.push(new Filter("PRJ_TYPE", FilterOperator.EQ, sCategory));
                });
                aFilters.push(new Filter({
                    filters: aCategoryFilters,
                    and: false // OR condition for selected categories
                }));
            }

            // Initiative MultiComboBox
            var oStatusMultiComboBox = this.getView().byId("idInitiativeFilter");
            var aSelectedStatuses = oStatusMultiComboBox.getSelectedKeys();
            if (aSelectedStatuses && aSelectedStatuses.length > 0) {
                var aStatusFilters = [];
                aSelectedStatuses.forEach(function (sStatus) {
                    aStatusFilters.push(new Filter("ZINITI", FilterOperator.EQ, sStatus));
                });
                aFilters.push(new Filter({
                    filters: aStatusFilters,
                    and: false // OR condition for selected statuses
                }));
            }

            // Technology MultiComboBox
            var oStatusMultiComboBox = this.getView().byId("idTechnologyFilter");
            var aSelectedStatuses = oStatusMultiComboBox.getSelectedKeys();
            if (aSelectedStatuses && aSelectedStatuses.length > 0) {
                var aStatusFilters = [];
                aSelectedStatuses.forEach(function (sStatus) {
                    aStatusFilters.push(new Filter("ZTLIST", FilterOperator.EQ, sStatus));
                });
                aFilters.push(new Filter({
                    filters: aStatusFilters,
                    and: false // OR condition for selected statuses
                }));
            }

            // Category MultiComboBox
            var oStatusMultiComboBox = this.getView().byId("idCategoryFilter");
            var aSelectedStatuses = oStatusMultiComboBox.getSelectedKeys();
            if (aSelectedStatuses && aSelectedStatuses.length > 0) {
                var aStatusFilters = [];
                aSelectedStatuses.forEach(function (sStatus) {
                    aStatusFilters.push(new Filter("ZCATEG", FilterOperator.EQ, sStatus));
                });
                aFilters.push(new Filter({
                    filters: aStatusFilters,
                    and: false // OR condition for selected statuses
                }));
            }

            // Expense Type MultiComboBox
            var oStatusMultiComboBox = this.getView().byId("idExpenseFilter");
            var aSelectedStatuses = oStatusMultiComboBox.getSelectedKeys();
            if (aSelectedStatuses && aSelectedStatuses.length > 0) {
                var aStatusFilters = [];
                aSelectedStatuses.forEach(function (sStatus) {
                    aStatusFilters.push(new Filter("ZEXPTP", FilterOperator.EQ, sStatus));
                });
                aFilters.push(new Filter({
                    filters: aStatusFilters,
                    and: false // OR condition for selected statuses
                }));
            }

            // Spend Type MultiComboBox
            var oStatusMultiComboBox = this.getView().byId("idSpendFilter");
            var aSelectedStatuses = oStatusMultiComboBox.getSelectedKeys();
            if (aSelectedStatuses && aSelectedStatuses.length > 0) {
                var aStatusFilters = [];
                aSelectedStatuses.forEach(function (sStatus) {
                    aStatusFilters.push(new Filter("ZCAPEX_OPEX", FilterOperator.EQ, sStatus));
                });
                aFilters.push(new Filter({
                    filters: aStatusFilters,
                    and: false // OR condition for selected statuses
                }));
            }

            // Business Unit MultiComboBox
            var oStatusMultiComboBox = this.getView().byId("idBusinessFilter");
            var aSelectedStatuses = oStatusMultiComboBox.getSelectedKeys();
            if (aSelectedStatuses && aSelectedStatuses.length > 0) {
                var aStatusFilters = [];
                aSelectedStatuses.forEach(function (sStatus) {
                    aStatusFilters.push(new Filter("WERKS", FilterOperator.EQ, sStatus));
                });
                aFilters.push(new Filter({
                    filters: aStatusFilters,
                    and: false // OR condition for selected statuses
                }));
            }


            // Active / Inactive MultiComboBox
            var oStatusMultiComboBox = this.getView().byId("idStatusFilter");
            var aSelectedStatuses = oStatusMultiComboBox.getSelectedKeys();
            if (aSelectedStatuses && aSelectedStatuses.length > 0) {
                var aStatusFilters = [];
                aSelectedStatuses.forEach(function (sStatus) {
                    aStatusFilters.push(new Filter("ZBUDG_STATUS", FilterOperator.EQ, sStatus));
                });
                aFilters.push(new Filter({
                    filters: aStatusFilters,
                    and: false // OR condition for selected statuses
                }));
            }

            // Budget Code MultiComboBox
            // var oStatusMultiComboBox = this.getView().byId("idBudCodeFilter");
            // var aSelectedStatuses = oStatusMultiComboBox.getSelectedKeys();
            // if (aSelectedStatuses && aSelectedStatuses.length > 0) {
            //     var aStatusFilters = [];
            //     aSelectedStatuses.forEach(function (sStatus) {
            //         aStatusFilters.push(new Filter("ZBUDG_CODE", FilterOperator.EQ, sStatus));
            //     });
            //     aFilters.push(new Filter({
            //         filters: aStatusFilters,
            //         and: false // OR condition for selected statuses
            //     }));
            // }

            // Responsible MultiInput
            var oMultiInputRes = this.byId("idResponsible");
            var aTokensRes = oMultiInputRes.getTokens();
            if (aTokensRes && aTokensRes.length > 0) {
                var aStatusFilters = [];
                aTokensRes.forEach(function (sStatus) {
                    aStatusFilters.push(new Filter("ZWBS_OWNER", FilterOperator.Contains, sStatus.getProperty("key")));
                });
                aFilters.push(new Filter({
                    filters: aStatusFilters,
                    and: false // OR condition for selected statuses
                }));
            }
            // Responsible Budget Code
            var oMultiInputBudCode = this.byId("idBudgetCode");
            var aTokensBudCode = oMultiInputBudCode.getTokens();
            if (aTokensBudCode && aTokensBudCode.length > 0) {
                var aStatusFilters = [];
                aTokensBudCode.forEach(function (sStatus) {
                    aStatusFilters.push(new Filter("ZBUDG_CODE", FilterOperator.Contains, sStatus.getProperty("key")));
                });
                aFilters.push(new Filter({
                    filters: aStatusFilters,
                    and: false // OR condition for selected statuses
                }));
            }
            // HOD MultiInput
            var oMultiInputHOD = this.byId("idHod");
            var aTokensHOD = oMultiInputHOD.getTokens();
            if (aTokensHOD && aTokensHOD.length > 0) {
                var aStatusFilters = [];
                aTokensHOD.forEach(function (sStatus) {
                    aStatusFilters.push(new Filter("ZPRJ_HOD", FilterOperator.Contains, sStatus.getProperty("key")));
                });
                aFilters.push(new Filter({
                    filters: aStatusFilters,
                    and: false // OR condition for selected statuses
                }));
            }
            // Budget Code Description MultiComboBox
            // var oStatusMultiComboBox = this.getView().byId("idBudCodeDescrFilter");
            // var aSelectedStatuses = oStatusMultiComboBox.getSelectedKeys();
            // if (aSelectedStatuses && aSelectedStatuses.length > 0) {
            //     var aStatusFilters = [];
            //     aSelectedStatuses.forEach(function (sStatus) {
            //         aStatusFilters.push(new Filter("ZBUDG_DISC", FilterOperator.EQ, sStatus));
            //     });
            //     aFilters.push(new Filter({
            //         filters: aStatusFilters,
            //         and: false // OR condition for selected statuses
            //     }));
            // }

            // Combine all individual MultiComboBox filters with an AND condition
            if (aFilters.length > 0) {
                var oCombinedFilter = new Filter({
                    filters: aFilters,
                    and: true // AND condition between different MultiComboBox filters
                });
                oBinding.filter(oCombinedFilter);
            } else {
                // If no filters are selected, clear all filters
                oBinding.filter([]);
            }
        },
        // onSearch: function () {
        //     var oTable = this.getView().byId("table");
        //     var oBinding = oTable.getBinding("rows");

        //     // var filterProject = this.getView().getModel("oModelFilter").getProperty("/PRJ_TYPE");

        //     // if (filterProject) {
        //     //     this.aFiltersList.push(new sap.ui.model.Filter("PRJ_TYPE", sap.ui.model.FilterOperator.EQ, filterProject));
        //     // }
        //     // var filterInti = this.getView().getModel("oModelFilter").getProperty("/ZINITI");
        //     // if (filterInti) {
        //     //     this.aFiltersList.push(new sap.ui.model.Filter("ZINITI", sap.ui.model.FilterOperator.EQ, filterInti));
        //     // }
        //     // var filterTech = this.getView().getModel("oModelFilter").getProperty("/ZTLIST");
        //     // if (filterTech) {
        //     //     this.aFiltersList.push(new sap.ui.model.Filter("ZTLIST", sap.ui.model.FilterOperator.EQ, filterTech));
        //     // }
        //     // var filterCat = this.getView().getModel("oModelFilter").getProperty("/ZCATEG");
        //     // if (filterCat) {
        //     //     this.aFiltersList.push(new sap.ui.model.Filter("ZCATEG", sap.ui.model.FilterOperator.EQ, filterCat));
        //     // }
        //     // var filterExpty = this.getView().getModel("oModelFilter").getProperty("/ZEXPTP");
        //     // if (filterExpty) {
        //     //     this.aFiltersList.push(new sap.ui.model.Filter("ZEXPTP", sap.ui.model.FilterOperator.EQ, filterExpty));
        //     // }
        //     // var filterSpend = this.getView().getModel("oModelFilter").getProperty("/ZCAPEX_OPEX");
        //     // if (filterSpend) {
        //     //     this.aFiltersList.push(new sap.ui.model.Filter("ZCAPEX_OPEX", sap.ui.model.FilterOperator.EQ, filterSpend));
        //     // }
        //     // var filterBUnit = this.getView().getModel("oModelFilter").getProperty("/WERKS");
        //     // if (filterBUnit) {
        //     //     this.aFiltersList.push(new sap.ui.model.Filter("WERKS", sap.ui.model.FilterOperator.EQ, filterBUnit));
        //     // }
        //     // var filterResp = this.getView().getModel("oModelFilter").getProperty("/ZWBS_OWNER");
        //     // if (filterResp) {
        //     //     this.aFiltersList.push(new sap.ui.model.Filter("ZWBS_OWNER", sap.ui.model.FilterOperator.Contains, filterResp));
        //     // }
        //     // var filterHOD = this.getView().getModel("oModelFilter").getProperty("/ZPRJ_HOD");

        //     // if (filterHOD) {
        //     //     this.aFiltersList.push(new sap.ui.model.Filter("ZPRJ_HOD", sap.ui.model.FilterOperator.Contains, filterHOD));
        //     // }
        //     // var filterBudgetCodeDescr = this.getView().getModel("oModelFilter").getProperty("/budgetCodeDescr");

        //     // if (filterBudgetCodeDescr) {
        //     //     this.aFiltersList.push(new sap.ui.model.Filter("ZBUDG_DISC", sap.ui.model.FilterOperator.Contains, filterBudgetCodeDescr));
        //     // }

        //     // var filterActiveInactive = this.getView().getModel("oModelFilter").getProperty("/ZBUDG_STATUS");
        //     // if (filterActiveInactive) {
        //     //     if (filterActiveInactive === "true") {
        //     //         this.aFiltersList.push(new sap.ui.model.Filter("ZBUDG_STATUS", sap.ui.model.FilterOperator.EQ, true));
        //     //     } else {
        //     //         this.aFiltersList.push(new sap.ui.model.Filter("ZBUDG_STATUS", sap.ui.model.FilterOperator.EQ, false));
        //     //     }

        //     // }
        //     // var filterBudCode = this.getView().getModel("oModelFilter").getProperty("/budgetCode");
        //     // if (filterBudCode) {
        //     //     this.aFiltersList.push(new sap.ui.model.Filter("budgetCode", sap.ui.model.FilterOperator.EQ, filterBudCode));
        //     // }
        //     var aFilters = new sap.ui.model.Filter(this.aFiltersList, true); // true for AND
        //     oBinding.filter(aFilters);
        // },
        onResetButtonPress: function () {
            this.onFilterBarClear();
            this.getView().byId("table").clearSelection();
        },
        onFilterBarClear: function () {
            this.getView().byId("idProjectFilter").setSelectedKeys([]);
            this.getView().byId("idInitiativeFilter").setSelectedKeys([]);
            this.getView().byId("idTechnologyFilter").setSelectedKeys([]);
            this.getView().byId("idCategoryFilter").setSelectedKeys([]);
            this.getView().byId("idExpenseFilter").setSelectedKeys([]);
            this.getView().byId("idSpendFilter").setSelectedKeys([]);
            this.getView().byId("idBusinessFilter").setSelectedKeys([]);
            this.getView().byId("idStatusFilter").setSelectedKeys([]);
            // this.getView().byId("idBudCodeFilter").setSelectedKeys([]);
            // this.getView().byId("idBudCodeDescrFilter").setSelectedKeys([]);
            this.getView().byId("idBudgetCode").setTokens([]);
            this.getView().byId("idHod").setTokens([]);
            this.getView().byId("idResponsible").setTokens([]);
            // Clear other MultiComboBoxes as needed
            this.onSearch();

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
            var oTable = this.getView().byId("table");
            var aSelectedIndex = oTable.getSelectedIndices();
            if (aSelectedIndex.length < 2 && aSelectedIndex.length > 0) {
                this.action("edit", aSelectedIndex[0], oTable);
            } else {
                MessageBox.error("Please select single item to edit");
            }

        },
        onCopyButtonPress: function () {
            var oTable = this.getView().byId("table");
            var aSelectedIndex = oTable.getSelectedIndices();
            if (aSelectedIndex.length < 2 && aSelectedIndex.length > 0) {
                this.action("copy", aSelectedIndex[0], oTable);
            } else {
                MessageBox.error("Please select single item to copy");
            }
        },
        onDeleteButtonPress: function () {
            var oTable = this.getView().byId("table");
            var aSelectedIndex = oTable.getSelectedIndices();
            if (aSelectedIndex.length < 2 && aSelectedIndex.length > 0) {
                this.action("delete", aSelectedIndex[0], oTable);
            } else {
                this.multiDelete(aSelectedIndex, oTable);
            }
        },
        action: function (action, iSelectedIndex, oTable) {
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
        },
        multiDelete: function (aSelectedIndexs, oTable) {
            var aBudgetCode = [];
            for (let index = 0; index < aSelectedIndexs.length; index++) {
                const element = aSelectedIndexs[index];
                var oContext = oTable.getContextByIndex(element);
                if (oContext) {
                    var oSelectedRowData = oContext.getObject();
                }
                aBudgetCode.push(oSelectedRowData.ZBUDG_CODE);
            }
            var that = this;
            MessageBox.warning("Are you sure to delete " + aBudgetCode + "?", {
                actions: ["Yes", "Cancel"],
                onClose: function (oAction) {
                    if (oAction === "Yes") {
                        var promise = Promise.resolve();
                        aSelectedIndexs.forEach(function (Payload, i) {
                            promise = promise.then(function () {
                                var oContext = oTable.getContextByIndex(aSelectedIndexs[i]);
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
                                var sPath = "/et_budget_masterSet(MANDT='',PRJ_TYPE='" + PRJ_TYPE + "',ZINITI='" + ZINITI + "',ZTLIST='" + ZTLIST + "',ZCATEG='" + ZCATEG + "',ZEXPTP='" + ZEXPTP + "',ZCAPEX_OPEX='" + ZCAPEX_OPEX + "',WERKS='" + WERKS + "',ZBUDG_CODE='" + ZBUDG_CODE + "')";
                                return that._promiseDeleteCallForEachContract(sPath, ZBUDG_CODE);
                            });
                        });
                        promise.then(function () {
                            MessageBox.success("Deletion completed", {
                                actions: ["Ok"],
                                onClose: function (oAction) {
                                    if (oAction === "Ok") {
                                        that.onResetButtonPress();
                                        that.getView().setBusy(false);
                                    }
                                }
                            });
                            that.getView().setBusy(false);
                        }).catch(function () { });
                    }
                },
            });

        },

        _promiseDeleteCallForEachContract: function (sPath, budCode) {

            var oModel = this.getOwnerComponent().getModel();
            var that = this;

            that.getView().setBusy(true);
            oModel.remove(sPath, {
                success: function () {


                }.bind(this),
                error: function (sError) {
                    // that.screenBehave(that.nav);
                    that.getView().setBusy(false);
                }.bind(this)
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
                            var aBCodeDescription = [];
                            for (var j = 0; j < data.results.length; j++) {
                                const element = data.results[j];
                                aBCodeDescription.push(element.ZBUDG_DISC)
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
                            const uniqueBCodeDesc = Array.from(new Set(aBCodeDescription));
                            var dataForBCodeDesc = []
                            for (let j = 0; j < uniqueBCodeDesc.length; j++) {
                                const element = uniqueBCodeDesc[j];
                                if (element) {
                                    var oModelBCodeDesc = {
                                        BCodeDesc: element
                                    }
                                    dataForBCodeDesc.push(oModelBCodeDesc)
                                }
                            }
                            this.getView().setModel(new JSONModel(dataForBCodeDesc), "oModelBCodeDescFilter");
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
        // Budget Code
        onBudgetCodeSelected: function (oEvent) {
            var oMultiInput = this.getView().byId("idBudgetCode");
            var oSelectedRow = oEvent.getParameter("selectedRow");
            if (oSelectedRow) {
                var oBindingContext = oSelectedRow.getBindingContext();
                var oSelectedObject = oBindingContext.getObject();

                oMultiInput.addToken(new Token({
                    key: oSelectedObject.ZbudgCode,
                    text: oSelectedObject.ZbudgCode
                }));
            }
        },
        onBudgetCodeSuggestion: function (oEvent) {
            var sValue = oEvent.getParameter('suggestValue'); // The current input value
            var oBinding = oEvent.getSource().getBinding("suggestionRows");
            if (oBinding) {
                var aFilters = [];

                if (sValue) {
                    // Create filters for each column you want to search
                    // Use FilterOperator.Contains for "contains" search
                    aFilters.push(new Filter({
                        filters: [
                            new Filter("ZbudgCode", FilterOperator.Contains, sValue),
                            new Filter("ZbudgDisc", FilterOperator.Contains, sValue)
                        ],
                        and: false // OR condition: show if any of the above fields contain the value
                    }));
                }

                // Apply the filters to the suggestion items binding
                oBinding.filter(aFilters);
            }
        },
        // on Value Help(F4)
        onBudgetCodeValueHelpRequest: function (oEvent) {
            if (!this.BudCodeFrag) {
                this.BudCodeFrag = sap.ui.xmlfragment(
                    "pgp.com.budgetmaster.view.fragments.budCodeF4",
                    this
                );
                this.getView().addDependent(this.BudCodeFrag);
            }

            this.BudCodeFrag.open();
        },
        // on Value Help - Search/liveChange

        onValueHelpSearch_BudCode: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter([
                new Filter("ZbudgCode", FilterOperator.Contains, sValue.toUpperCase())
            ], false); // OR condition for search fields
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        onValueHelpConfirm_BudCode: function (oEvent) {
            var aSelectedContexts = oEvent.getParameter("selectedContexts");
            var aSelectedProducts = []; // Array to store full product objects
            var aTokens = []; // Array to store sap.m.Token objects

            if (aSelectedContexts && aSelectedContexts.length > 0) {
                aSelectedContexts.forEach(function (oContext) {
                    var oBudcode = oContext.getObject(); // Get the full data object

                    // Add to the array of selected product objects
                    aSelectedProducts.push(oBudcode);

                    // Create a new Token for the MultiInput
                    aTokens.push(new Token({
                        key: oBudcode.ZbudgCode,
                        text: oBudcode.ZbudgCode
                    }));
                });
            }

            // Update the MultiInput's tokens
            this.getView().byId("idBudgetCode").setTokens(aTokens);

            // Update the model's 'selectedProducts' array
            this.getView().getModel().setProperty("/ZpsBudBdcodeSet", aSelectedProducts);

            // Close the dialog
            oEvent.getSource().close();
        },
        onValueHelpCancel_BudCode: function (oEvent) {
            // Just close the dialog without making changes
            oEvent.getSource().close();
        },

        // HOD
        onHODSelected: function (oEvent) {
            var oMultiInput = this.getView().byId("idHod");
            var oSelectedRow = oEvent.getParameter("selectedRow");
            if (oSelectedRow) {
                var oBindingContext = oSelectedRow.getBindingContext();
                var oSelectedObject = oBindingContext.getObject();


                oMultiInput.addToken(new Token({
                    key: oSelectedObject.Bname,
                    text: oSelectedObject.NameTextc
                }));
            }
        },
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
        onResponsibleSelected: function (oEvent) {
            var oMultiInput = this.getView().byId("idResponsible");
            var oSelectedRow = oEvent.getParameter("selectedRow");
            if (oSelectedRow) {
                var oBindingContext = oSelectedRow.getBindingContext();
                var oSelectedObject = oBindingContext.getObject();


                oMultiInput.addToken(new Token({
                    key: oSelectedObject.Bname,
                    text: oSelectedObject.NameTextc
                }));
            }
        },
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