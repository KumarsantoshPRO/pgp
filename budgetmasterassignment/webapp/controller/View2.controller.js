sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/m/Token",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (
	Controller,
	JSONModel,
	MessageBox,
	MessageToast,
	Token,
	Filter,
	FilterOperator
) {
	"use strict";

	return Controller.extend("pgp.com.budgetmasterassignment.controller.View2", {
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
			if (nav === "null" || nav === undefined) {
				this.screenBehave('null');
				this.getView().getModel("oModelTempValue").setProperty("/title", "Assignments Details");
			} else {
				this.nav = nav.split("$")[1];
				this.action = nav.split("$")[0];

				this.readCall(this.nav);
				this.screenBehave(this.nav);

			}

		},
		definations: function () {
			// For financial year
			var years = [];
			var currentYear = new Date().getFullYear();
			var lastTolastFinancialYear = (currentYear - 2).toString() + "-" + (currentYear - 1).toString(),
				lastFinancialYear = (currentYear - 1).toString() + "-" + (currentYear).toString();
			// currentFinancialYear = (currentYear).toString() + "-" + (currentYear + 1).toString();

			var years = [{ year: lastTolastFinancialYear }, { year: lastFinancialYear }];
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
				cancelButton: false,
				multiInput: false,
				singleInput: false

			};
			this.getView().setModel(new JSONModel(properties), "oPropertyModel");
		},



		screenBehave: function (nav) {
			if (nav === 'null') {
				this.getView().byId("idWBSV2Single").setValue("");
				this.getView().byId("idWBSV2").setTokens([]);
				this.getView().getModel("oPropertyModel").setProperty("/editClicked", true);
				this.getView().getModel("oPropertyModel").setProperty("/keyField", true);
				this.getView().getModel("oPropertyModel").setProperty("/saveButton", true);
				this.getView().getModel("oPropertyModel").setProperty("/updateButton", false);

				this.getView().getModel("oPropertyModel").setProperty("/editButton", false);
				this.getView().getModel("oPropertyModel").setProperty("/copyButton", false);
				this.getView().getModel("oPropertyModel").setProperty("/deleteButton", false);
				this.getView().getModel("oPropertyModel").setProperty("/cancelButton", true);
				this.getView().getModel("oPropertyModel").setProperty("/multiInput", true);
				this.createLocalModel();
			} else {
				this.getView().byId("idWBSV2Single").setValue("");
				this.getView().byId("idWBSV2").setTokens([]);
				this.getView().getModel("oPropertyModel").setProperty("/editClicked", false);
				this.getView().getModel("oPropertyModel").setProperty("/keyField", false);
				this.getView().getModel("oPropertyModel").setProperty("/saveButton", false);
				this.getView().getModel("oPropertyModel").setProperty("/updateButton", false);

				this.getView().getModel("oPropertyModel").setProperty("/editButton", true);
				this.getView().getModel("oPropertyModel").setProperty("/copyButton", true);
				this.getView().getModel("oPropertyModel").setProperty("/deleteButton", true);
				this.getView().getModel("oPropertyModel").setProperty("/cancelButton", false);
				this.getView().getModel("oPropertyModel").setProperty("/multiInput", false);
				this.readCall(nav);
			}
		},
		createLocalModel: function () {
			var oDataForModel = {
				"MANDT": "",
				"ZBUDG_CODE": "",
				"ZBUDG_DISC": "",
				"ZWBS_YEAR": "",
				"POSID": ""

			};
			this.getView().setModel(new JSONModel(oDataForModel), "oModel");

			var tempValues = {
				title: "Assignments Details"
			};
			this.getView().setModel(new JSONModel(tempValues), "oModelTempValue");

			// For Budget Code F4
			var oModel = this.getOwnerComponent().getModel();
			var sPath = "/ZpsBudBdcodeSet";
			this.getView().setBusy(true);
			oModel.read(sPath, {
				success: function (data) {
					this.getView().setModel(new JSONModel(data), "oModelForBudCode");
					this.getView().setBusy(false);
				}.bind(this),
				error: function (sError) {
					this.getView().setBusy(false);
				}.bind(this)
			});
			// For WBS F4
			var sPathWBS = "/ZpsBudWbsSet";	
			this.getView().setBusy(true);
			oModel.read(sPathWBS, {
				success: function (data) {
					this.getView().setModel(new JSONModel(data), "oModelForWBS");
					this.getView().setBusy(false);
				}.bind(this),
				error: function (sError) {
					this.getView().setBusy(false);
				}.bind(this)
			});

		},
		onBudCodeSetSelectChange: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				var oBindingContext = oSelectedItem.getBindingContext();
				var oSelectedBudgetCode = oBindingContext.getObject();
				if (oSelectedBudgetCode.ZbudgDisc) {
					this.getView().getModel("oModel").setProperty("/ZBUDG_DISC", oSelectedBudgetCode.ZbudgDisc);
				} else {
					this.getView().getModel("oModel").setProperty("/ZBUDG_DISC", oSelectedBudgetCode.ZbudgDisc);
					MessageToast.show("Budget Code Description not present");
				}

			}
		},
		readCall: function (nav) {
			var oModel = this.getOwnerComponent().getModel();
			var sPath = "/et_budget_master_assignSet" + nav;
			this.getView().setBusy(true);

			oModel.read(sPath, {
				success: function (data) {
					if (this.action === "edit") {
						this.getView().getModel("oPropertyModel").setProperty("/singleInput", true);
						this.getView().getModel("oPropertyModel").setProperty("/multiInput", false);
						this.getView().getModel("oModelTempValue").setProperty("/title", data.ZBUDG_CODE);
						this.onEditButtonPress();
					}
					if (this.action === "copy") {
						this.getView().getModel("oPropertyModel").setProperty("/singleInput", false);
						this.getView().getModel("oPropertyModel").setProperty("/multiInput", true);
						this.getView().getModel("oModelTempValue").setProperty("/title", "Assignments Details");
						this.onCopyButtonPress();
					}
					if (this.action === "delete") {
						this.getView().getModel("oPropertyModel").setProperty("/singleInput", false);
						this.getView().getModel("oPropertyModel").setProperty("/multiInput", true);
						this.getView().getModel("oModelTempValue").setProperty("/title", data.ZBUDG_CODE);
						this.onDeleteButtonPress();
					}
					this.getView().setModel(new JSONModel(data), "oModel");
					this.getView().byId("idWBSV2").setValue(data.POSID);
					this.getView().setBusy(false);
				}.bind(this),
				error: function (sError) {
					this.getView().setBusy(false);
				}.bind(this)
			})
		},
		onSave: function () {

			this.getView().setBusy(true);
			var that = this;
			var oMultiInputWBS = that.byId("idWBSV2");
			var aWBS = oMultiInputWBS.getTokens();
			var aPayload = [];
			var payload = that.getView().getModel("oModel").getData();
			aWBS.forEach(element => {
				var itemPayload = {
					"MANDT": "",
					"ZBUDG_CODE": payload.ZBUDG_CODE,
					"ZBUDG_DISC": payload.ZBUDG_DISC,
					"ZWBS_YEAR": payload.ZWBS_YEAR,
					"POSID": element.getProperty('key')
				}
				aPayload.push(itemPayload)
			});
			var promise = Promise.resolve();
			aPayload.forEach(function (Payload, i) {
				promise = promise.then(function () {
					var oModel = that.getOwnerComponent().getModel();
					var sPath = "/et_budget_master_assignSet";
					return that._promiseCreateCallForEachContract(oModel, sPath, Payload);
				});
			});
			promise.then(function () {
				MessageBox.success("Creation completed", {
					actions: ["Ok"],
					onClose: function (oAction) {
						if (oAction === "Ok") {
							that.screenBehave('null');
							that.getView().setBusy(false);
						}
					}
				});
				that.getView().setBusy(false);
			}).catch(function () { });

		},

		_promiseCreateCallForEachContract: function (oModel, sPath, payload) {

			oModel.create(sPath, payload, {
				success: function (oData, response) {

				}.bind(this),
				error: function (sError) {
					var sMessage = JSON.parse(sError.responseText).error.message.value;
					MessageBox.error(sMessage);
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
			var sPath = "/et_budget_master_assignSet" + this.nav;
			var payload = this.getView().getModel("oModel").getData();
			this.getView().setBusy(true);

			var that = this;
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
			var sPath = "/et_budget_master_assignSet" + this.nav;
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
		// F4 and Suggestion calls
		// WBS Single
		onWBSSelectedSingle: function (oEvent) {
			var oSinglInput = this.getView().byId("idWBSV2Single");
			var oSelectedRow = oEvent.getParameter("selectedRow");
			if (oSelectedRow) {
				var oBindingContext = oSelectedRow.getBindingContext();
				var oSelectedObject = oBindingContext.getObject();
				oSinglInput.setValue(oSelectedObject.Posid)
			}
		},
		// on Value Help(F4)
		onWBSValueHelpRequestSingle: function (oEvent) {
			if (!this.WBSFragSingle) {
				this.WBSFragSingle = sap.ui.xmlfragment(
					"pgp.com.budgetmasterassignment.view.fragments.WBSV2F4Single",
					this
				);
				this.getView().addDependent(this.WBSFragSingle);
			}

			this.WBSFragSingle.open();
		},
		// on Value Help - Search/liveChange
		onValueHelpSearch_WBSV2Single: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter([
				new Filter("Posid", FilterOperator.Contains, sValue.toUpperCase()),
				new Filter("Post1", FilterOperator.Contains, sValue.toUpperCase())
			], false); // OR condition for search fields
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},
		// Confirm
		onValueHelpConfirm_WBSV2Single: function (oEvent) {
			var selectedWBS = oEvent.getParameter("selectedItem").getTitle();
			var oModel = this.getView().getModel("oModel");
			oModel.setProperty("/POSID", selectedWBS);
		},

		// WBS Multi
		onWBSSelected: function (oEvent) {
			var oMultiInput = this.getView().byId("idWBSV2");
			var oSelectedRow = oEvent.getParameter("selectedRow");
			if (oSelectedRow) {
				var oBindingContext = oSelectedRow.getBindingContext();
				var oSelectedObject = oBindingContext.getObject();
				oMultiInput.addToken(new Token({
					key: oSelectedObject.Posid,
					text: oSelectedObject.Posid
				}));
			}
		},
		// on Value Help(F4)
		onWBSValueHelpRequest: function (oEvent) {
			if (!this.WBSFrag) {
				this.WBSFrag = sap.ui.xmlfragment(
					"pgp.com.budgetmasterassignment.view.fragments.WBSV2F4",
					this
				);
				this.getView().addDependent(this.WBSFrag);
			}

			this.WBSFrag.open();
		},
		// on Value Help - Search/liveChange
		onValueHelpSearch_WBSV2: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter([
				new Filter("Posid", FilterOperator.Contains, sValue.toUpperCase()),
				new Filter("Post1", FilterOperator.Contains, sValue.toUpperCase())
			], false); // OR condition for search fields
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},
		// Confirm
		onValueHelpConfirm_WBSV2: function (oEvent) {
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
						key: oBudcode.Posid,
						text: oBudcode.Posid
					}));
				});
			}

			// Update the MultiInput's tokens
			this.getView().byId("idWBSV2").setTokens(aTokens);

			// Update the model's 'selectedProducts' array
			this.getView().getModel().setProperty("/ZpsBudWbsSet", aSelectedProducts);

			// Close the dialog
			// oEvent.getSource().close();
		},

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
					"pgp.com.budgetmasterassignment.view.fragments.budCodeF4V2",
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
				new Filter("ZbudgCode", FilterOperator.Contains, sValue.toUpperCase()),
				new Filter("ZbudgDisc", FilterOperator.Contains, sValue.toUpperCase())
			], false); // OR condition for search fields
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},
		// Confirm
		onValueHelpConfirm_BudCodeV2: function (oEvent) {
			var selectedBudCode = oEvent.getParameter("selectedItem").getTitle(),
				selectedBudCodeDescription = oEvent.getParameter("selectedItem").getDescription()

			var oModel = this.getView().getModel("oModel");
			oModel.setProperty("/ZBUDG_CODE", selectedBudCode);
			oModel.setProperty("/ZBUDG_DISC", selectedBudCodeDescription);
		},
	});
});