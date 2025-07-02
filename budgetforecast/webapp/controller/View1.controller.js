sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/Token"
], (Controller,
    JSONModel,
    Filter,
    FilterOperator,
    MessageBox,
    Token) => {
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
            var aFilters = [];
            var oTable = this.getView().byId("table");
            var oBinding = oTable.getBinding("rows");

            // Budget Code MultiInput 
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
            // Budget Code MultiComboBox
            // var oMultiComboBox = this.getView().byId("idBudget");
            // var aSelected = oMultiComboBox.getSelectedKeys();
            // if (aSelected && aSelected.length > 0) {
            //     var abudFilters = [];
            //     aSelected.forEach(function (s) {
            //         abudFilters.push(new Filter("ZBUDG_CODE", FilterOperator.EQ, s));
            //     });
            //     aFilters.push(new Filter({
            //         filters: abudFilters,
            //         and: false // OR condition for selected categories
            //     }));
            // }

            // Financial Year MultiComboBox
            var oMultiComboBox = this.getView().byId("idYear");
            var aSelected = oMultiComboBox.getSelectedKeys();
            if (aSelected && aSelected.length > 0) {
                var aYearFilters = [];
                aSelected.forEach(function (s) {
                    aYearFilters.push(new Filter("ZWBS_YEAR", FilterOperator.EQ, s));
                });
                aFilters.push(new Filter({
                    filters: aYearFilters,
                    and: false // OR condition for selected categories
                }));
            }


            // WBS MultiInput
            var oMultiInputWBS = this.byId("idWBS");
            var aTokensWBS = oMultiInputWBS.getTokens();
            if (aTokensWBS && aTokensWBS.length > 0) {
                var aWBSFilters = [];
                aTokensWBS.forEach(function (sStatus) {
                    aWBSFilters.push(new Filter("POSID", FilterOperator.Contains, sStatus.getProperty("key")));
                });
                aFilters.push(new Filter({
                    filters: aWBSFilters,
                    and: false // OR condition for selected statuses
                }));
            }


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
        onFilterBarClear: function () {
            // this.getView().byId("idBudget").setSelectedKeys([]);
            this.getView().byId("idBudgetCode").setTokens([]);
            this.getView().byId("idYear").setSelectedKeys([]);
            this.getView().byId("idWBS").setTokens([]);
            this.onSearch();
        },
        onResetButtonPress: function () {
            this.onFilterBarClear();
            this.readCall();
            this.getView().byId("table").clearSelection();
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
            var nav = "(MANDT='',ZBUDG_CODE='" + ZBUDG_CODE + "',ZWBS_YEAR='" + ZWBS_YEAR + "',POSID='" + POSID + "'')"
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

                                var ZBUDG_CODE = oSelectedRowData.ZBUDG_CODE;
                                var ZBUDG_CODE = oSelectedRowData.ZBUDG_CODE;
                                var ZWBS_YEAR = oSelectedRowData.ZWBS_YEAR;
                                var POSID = oSelectedRowData.POSID;
                                var sPath = "/et_budget_forecastSet" + "(MANDT='',ZBUDG_CODE='" + ZBUDG_CODE + "',ZWBS_YEAR='" + ZWBS_YEAR + "',POSID='" + POSID + "')"
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

                    oModel.read("/ZpsBudWbsSet", {
                        success: function (aWBSdata) {
                            var aWBS = [];
                            data.results.forEach(element => {
                                aWBSdata.results.forEach(wbsElement => {
                                    if (element.POSID === wbsElement.Posid) {
                                        element.WBSDescr = wbsElement.Post1;
                                        aWBS.push({ WBSCode: wbsElement.Posid, WBSDescription: wbsElement.Post1 });
                                    }
                                });
                            });
                            this.getView().setModel(new JSONModel(dataForYear), "oModelYearFilter");
                            this.getView().setModel(new JSONModel(data.results), "ModelForTable");
                            this.getView().setModel(new JSONModel(aWBS), "oModelWBS");
                            this.getView().setBusy(false);

                        }.bind(this), error: function (sError) { }.bind(this)
                    });

                }.bind(this),
                error: function (sError) {
                    this.getView().setBusy(false);
                }.bind(this)
            })
        },
        // F4 and Suggestion calls
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
                    "pgp.com.budgetforecast.view.fragments.budCodeF4",
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
        // Confirm
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
            // oEvent.getSource().close();
        },



        // WBS
        onWBSSelected: function (oEvent) {
            var oMultiInput = this.getView().byId("idWBS");
            var oSelectedRow = oEvent.getParameter("selectedRow");
            if (oSelectedRow) {
                var oBindingContext = oSelectedRow.getBindingContext();
                var oSelectedObject = oBindingContext.getObject();


                oMultiInput.addToken(new Token({
                    key: oSelectedObject.Posid,
                    text: oSelectedObject.Post1
                }));
            }
        },
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