sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (
	Controller,
	JSONModel,
	MessageBox,
	Filter,
	FilterOperator
) {
	"use strict";

	return Controller.extend("pgp.com.budgetforecast.controller.View2", {
		onInit() {
			sap.ui.core.UIComponent.getRouterFor(this);
			this.getOwnerComponent()
				.getRouter()
				.attachRoutePatternMatched(this._onRouteMatched, this);

		},


		_onRouteMatched: function (oEvent) {

			this.createLocalModel();
			this.definations();
			var nav = oEvent.getParameter("arguments").nav
			if (nav === 'null' || nav === undefined) {
				this.screenBehave('null');
			} else {
				this.nav = nav.split("$")[1];
				this.action = nav.split("$")[0];


				this.screenBehave(this.nav);
				if (this.action === "edit") {
					this.onEditButtonPress();
				}
				if (this.action === "copy") {
					this.onCopyButtonPress();
				}
				if (this.action === "delete") {
					this.onDeleteButtonPress();
				}
			}

		},
		definations: function () {
			// For financial year
			var years = [];
			var currentYear = new Date().getFullYear();
			var lastToLatFinancialYear = (currentYear - 2).toString() + "-" + (currentYear - 1).toString(),
				lastFinancialYear = (currentYear - 1).toString() + "-" + (currentYear).toString(),
				currentFinancialYear = (currentYear).toString() + "-" + (currentYear + 1).toString();
			// nextFinancialYear = (currentYear + 1).toString() + "-" + (currentYear + 2).toString();
			var years = [{ year: lastToLatFinancialYear }, { year: lastFinancialYear }, { year: currentFinancialYear }];
			this.getView().setModel(new JSONModel(years), "oModelYear");
			// For screen behavior 
			var properties = {
				keyField: false,
				editClicked: false,
				saveButton: false,
				updateButton: false,
				cancelButton: false,
				editButton: false,
				copyButton: false,
				deleteButton: false,
				cancelButton: false
			};
			this.getView().setModel(new JSONModel(properties), "oPropertyModel");
		},



		screenBehave: function (nav) {
			if (nav === 'null' || nav === undefined) {
				this.getView().getModel("oPropertyModel").setProperty("/editClicked", true);
				this.getView().getModel("oPropertyModel").setProperty("/keyField", true);
				this.getView().getModel("oPropertyModel").setProperty("/saveButton", true);
				this.getView().getModel("oPropertyModel").setProperty("/updateButton", false);

				this.getView().getModel("oPropertyModel").setProperty("/editButton", false);
				this.getView().getModel("oPropertyModel").setProperty("/copyButton", false);
				this.getView().getModel("oPropertyModel").setProperty("/deleteButton", false);
				this.getView().getModel("oPropertyModel").setProperty("/cancelButton", true);
				this.createLocalModel();
			} else {

				this.getView().getModel("oPropertyModel").setProperty("/editClicked", false);
				this.getView().getModel("oPropertyModel").setProperty("/keyField", false);
				this.getView().getModel("oPropertyModel").setProperty("/saveButton", false);
				this.getView().getModel("oPropertyModel").setProperty("/updateButton", false);

				this.getView().getModel("oPropertyModel").setProperty("/editButton", true);
				this.getView().getModel("oPropertyModel").setProperty("/copyButton", true);
				this.getView().getModel("oPropertyModel").setProperty("/deleteButton", true);
				this.getView().getModel("oPropertyModel").setProperty("/cancelButton", false);
				this.readCall(nav);
			}
		},
		createLocalModel: function () {
			var oDataForModel = {
				"MANDT": "",
				"ZBUDG_CODE": "",
				"ZWBS_YEAR": "",
				"POSID": "",
				"ZREL_BEDG": "",
				"ZACTU_EXP": "",
				"ZAPR": "",
				"ZMAY": "",
				"ZJUNE": "",
				"ZJULY": "",
				"ZAUG": "",
				"ZSEPT": "",
				"ZOCT": "",
				"ZNOV": "",
				"ZDEC": "",
				"ZJAN": "",
				"ZFEB": "",
				"ZMARCH": ""

			};
			this.getView().setModel(new JSONModel(oDataForModel), "oModel");
		},
		readCall: function (nav) {
			var oModel = this.getOwnerComponent().getModel();
			var sPath = "/et_budget_forecastSet" + nav;
			this.getView().setBusy(true);

			oModel.read(sPath, {
				success: function (data) {
					this.getView().setBusy(false);
					this.getView().setModel(new JSONModel(data), "oModel");
				}.bind(this),
				error: function (sError) {
					this.getView().setBusy(false);
				}.bind(this)
			})
		},
		onBudCodeSelectChange: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				var oBindingContext = oSelectedItem.getBindingContext();
				var oSelectedBudCode = oBindingContext.getObject();
				var oModel = this.getView().getModel("oModel");
				oModel.setProperty("/ZREL_BEDG", oSelectedBudCode);
				oModel.setProperty("/ZREL_BEDG", oSelectedBudCode);
			}

		},
		onSave: function () {
			var oModel = this.getOwnerComponent().getModel();
			var sPath = "/et_budget_forecastSet";
			var payload = this.getView().getModel("oModel").getData();
			this.getView().setBusy(true);
			var that = this;

			payload.ZJAN = Number(payload.ZJAN);
			payload.ZFEB = Number(payload.ZFEB);
			payload.ZMARCH = Number(payload.ZMARCH);
			payload.ZAPR = Number(payload.ZAPR);
			payload.ZMAY = Number(payload.ZMAY);
			payload.ZJUNE = Number(payload.ZJUNE);
			payload.ZJULY = Number(payload.ZJULY);
			payload.ZAUG = Number(payload.ZAUG);
			payload.ZSEPT = Number(payload.ZSEPT);
			payload.ZOCT = Number(payload.ZOCT);
			payload.ZNOV = Number(payload.ZNOV);
			payload.ZDEC = Number(payload.ZDEC);
			oModel.create(sPath, payload, {
				success: function (oData, response) {
					MessageBox.success("Entry created", {
						actions: ["Ok"],
						onClose: function (oAction) {
							if (oAction === "Ok") {
								that.screenBehave('null');
							}
						}
					});
					this.getView().setBusy(false);
				}.bind(this),
				error: function (sError) {
					this.getView().setBusy(false);
				}.bind(this)
			})
		},
		onEditButtonPress: function () {
			this.getView().getModel("oPropertyModel").setProperty("/editClicked", true);
			this.getView().getModel("oPropertyModel").setProperty("/keyField", false);
			this.getView().getModel("oPropertyModel").setProperty("/saveButton", false);
			this.getView().getModel("oPropertyModel").setProperty("/updateButton", true);

			this.getView().getModel("oPropertyModel").setProperty("/editButton", false);
			this.getView().getModel("oPropertyModel").setProperty("/copyButton", false);
			this.getView().getModel("oPropertyModel").setProperty("/deleteButton", false);
			this.getView().getModel("oPropertyModel").setProperty("/cancelButton", true);
		},
		onUpdateButtonPress: function () {
			var oModel = this.getOwnerComponent().getModel();
			var sPath = "/et_budget_forecastSet" + this.nav;
			var payload = this.getView().getModel("oModel").getData();
			this.getView().setBusy(true);

			var that = this;
			payload.ZJAN = Number(payload.ZJAN);
			payload.ZFEB = Number(payload.ZFEB);
			payload.ZMARCH = Number(payload.ZMARCH);
			payload.ZAPR = Number(payload.ZAPR);
			payload.ZMAY = Number(payload.ZMAY);
			payload.ZJUNE = Number(payload.ZJUNE);
			payload.ZJULY = Number(payload.ZJULY);
			payload.ZAUG = Number(payload.ZAUG);
			payload.ZSEPT = Number(payload.ZSEPT);
			payload.ZOCT = Number(payload.ZOCT);
			payload.ZNOV = Number(payload.ZNOV);
			payload.ZDEC = Number(payload.ZDEC);
			oModel.update(sPath, payload, {
				success: function () {
					MessageBox.success("Update completed", {
						actions: ["Ok"],
						onClose: function (oAction) {
							if (oAction === "Ok") {
								that.getView().setBusy(false);
								that.screenBehave(that.nav);
							}
						}
					});


				}.bind(this),
				error: function (sError) {
					this.getView().setBusy(false);
				}.bind(this)
			})
		},
		onDeleteButtonPress: function () {
			var oModel = this.getOwnerComponent().getModel();
			var sPath = "/et_budget_forecastSet" + this.nav;
			var that = this;
			MessageBox.warning("Are you sure to delete this?", {
				actions: ["Yes", "Cancel"],
				onClose: function (oAction) {

					if (oAction === "Yes") {
						that.getView().setBusy(true);
						oModel.remove(sPath, {
							success: function () {
								MessageBox.success("Deletion completed", {
									actions: ["Ok"],
									onClose: function (oAction) {
										if (oAction === "Ok") {
											that.screenBehave("null");
											that.getView().setBusy(false);
										}
									}
								});

							}.bind(this),
							error: function (sError) {
								that.screenBehave(that.nav);
								that.getView().setBusy(false);
							}.bind(this)
						})
					}
				},
			});

		},
		onCopyButtonPress: function () {
			this.getView().getModel("oPropertyModel").setProperty("/editClicked", true);
			this.getView().getModel("oPropertyModel").setProperty("/keyField", true);
			this.getView().getModel("oPropertyModel").setProperty("/saveButton", true);
			this.getView().getModel("oPropertyModel").setProperty("/updateButton", false);

			this.getView().getModel("oPropertyModel").setProperty("/editButton", false);
			this.getView().getModel("oPropertyModel").setProperty("/copyButton", false);
			this.getView().getModel("oPropertyModel").setProperty("/deleteButton", false);
			this.getView().getModel("oPropertyModel").setProperty("/cancelButton", true);
		},
		onCancelButtonPress: function () {
			var that = this;
			MessageBox.information("Changes not saved, Do you want to cancel?", {
				actions: ["Yes", "Cancel"],
				onClose: function (oAction) {

					if (oAction === "Yes") {
						that.screenBehave(that.nav);
					}
				},
			});
		},
		// F4 calls
		// Budget Code
		onBudgetCodeSelected: function (oEvent) {
			var oBudCodeInput = this.getView().byId("idBudgetCodeV2");
			var oSelectedRow = oEvent.getParameter("selectedRow");
			if (oSelectedRow) {
				var oBindingContext = oSelectedRow.getBindingContext();
				var oSelectedObject = oBindingContext.getObject();
				oBudCodeInput.setValue(oSelectedObject.ZbudgCode);
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
					"pgp.com.budgetforecast.view.fragments.budCodeF4V2",
					this
				);
				this.getView().addDependent(this.BudCodeFrag);
			}

			this.BudCodeFrag.open();
		},
		// on Value Help - Search/liveChange
		onValueHelpSearch_BudCodeV2: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter([
				new Filter("ZbudgCode", FilterOperator.Contains, sValue.toUpperCase())
			], false); // OR condition for search fields
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},
		// Confirm
		onValueHelpConfirm_BudCodeV2: function (oEvent) {
			var selectedBudCode = oEvent.getParameter("selectedItem").getTitle();
			var oModel = this.getView().getModel("oModel");
			oModel.setProperty("/ZBUDG_CODE", selectedBudCode);
		},


		// WBS
		onWBSSelectedfunction(oEvent) {
			var oBudCodeInput = this.getView().byId("idWBS");
			var oSelectedRow = oEvent.getParameter("selectedRow");
			if (oSelectedRow) {
				var oBindingContext = oSelectedRow.getBindingContext();
				var oSelectedObject = oBindingContext.getObject();
				oBudCodeInput.setValue(oSelectedObject.Posid);
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

			this.getView().getModel("oModel").setProperty("/POSID", sSelectedValue);
		},
	});
});