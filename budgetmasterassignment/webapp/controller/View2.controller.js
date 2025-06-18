sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (
	Controller,
	JSONModel,
	MessageBox,
	MessageToast
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
			if (nav === "null") {
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
			var lastFinancialYear = (currentYear - 1).toString() + "-" + (currentYear).toString(),
				currentFinancialYear = (currentYear).toString() + "-" + (currentYear + 1).toString(),
				nextFinancialYear = (currentYear + 1).toString() + "-" + (currentYear + 2).toString();
			var years = [{ year: lastFinancialYear }, { year: currentFinancialYear }, { year: nextFinancialYear }];
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
			if (nav === 'null') {
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
				"ZBUDG_DISC": "",
				"ZWBS_YEAR": "",
				"POSID": ""

			};
			this.getView().setModel(new JSONModel(oDataForModel), "oModel");
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
					this.getView().setBusy(false);
					this.getView().setModel(new JSONModel(data), "oModel");
				}.bind(this),
				error: function (sError) {
					this.getView().setBusy(false);
				}.bind(this)
			})
		},
		onSave: function () {
			var oModel = this.getOwnerComponent().getModel();
			var sPath = "/et_budget_master_assignSet";
			var payload = this.getView().getModel("oModel").getData();
			this.getView().setBusy(true);
			var that = this;
			oModel.create(sPath, payload, {
				success: function (oData, response) {
					MessageBox.success("Entry created", {
						actions: ["Ok"],
						onClose: function (oAction) {
							if (oAction === "Ok") {
								debugger;
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
		// F4 calls
		// WBS
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

			this.getView().getModel("oModel").setProperty("/POSID", sSelectedValue);
		},
	});
});