sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
], (Controller,
    JSONModel,
    Filter,
    FilterOperator,
    MessageBox) => {
    "use strict";

    return Controller.extend("pgp.com.budgetmasterassignmentassignment.controller.View1", {
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
        onResetButtonPress: function () {
            this.onFilterBarClear();
            this.readCall();
            this.getView().byId("table").clearSelection();
        },
        onSearch: function () {
            var aFilters = [];
            var oTable = this.getView().byId("table");
            var oBinding = oTable.getBinding("rows");

            // Budget Code MultiComboBox
            var oMultiComboBox = this.getView().byId("idBudget");
            var aSelected = oMultiComboBox.getSelectedKeys();
            if (aSelected && aSelected.length > 0) {
                var abudFilters = [];
                aSelected.forEach(function (s) {
                    abudFilters.push(new Filter("ZBUDG_CODE", FilterOperator.EQ, s));
                });
                aFilters.push(new Filter({
                    filters: abudFilters,
                    and: false // OR condition for selected categories
                }));
            }

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
            this.getView().byId("idBudget").setSelectedKeys([]);
            this.getView().byId("idYear").setSelectedKeys([]);
            this.getView().byId("idWBS").setTokens([]);
            this.onSearch();
        },
        onAddNew: function () {
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.navTo("View2", {
                nav: "null",
            });
        },
        onClickofItem: function (oEvent) {

            var ZBUDG_CODE = oEvent.getParameter("rowContext").getObject().ZBUDG_CODE;
            var nav = "(MANDT='',ZBUDG_CODE='" + ZBUDG_CODE + "')"
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
            var ZBUDG_CODE = oSelectedRowData.ZBUDG_CODE;
            var nav = action + "$" + "(MANDT='',ZBUDG_CODE='" + ZBUDG_CODE + "')";
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

                                var ZBUDG_CODE = oSelectedRowData.ZBUDG_CODE;
                                var sPath = "/et_budget_master_assignSet" + "(MANDT='',ZBUDG_CODE='" + ZBUDG_CODE + "')";
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
            var sPath = "/et_budget_master_assignSet"
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
        onWBSSelected: function (oEvent) {
            var oMultiInput = this.getView().byId("idWBS");
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
        onEBSValueHelp: function () {
            if (!this.wbsFrag) {
                this.wbsFrag = sap.ui.xmlfragment(
                    "pgp.com.budgetmasterassignment.view.fragments.wbsF4",
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