sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
], function (
	Controller, JSONModel, Filter, FilterOperator, MessageBox
) {
	"use strict";

	return Controller.extend("pgp.com.budgetmaster.controller.View2", {
		onInit() {
			sap.ui.core.UIComponent.getRouterFor(this);
			this.getOwnerComponent()
				.getRouter()
				.attachRoutePatternMatched(this._onRouteMatched, this);
			this.definations();
		},

		onBeforeRendering() {
			this.getView().setModel(new JSONModel({}), "oModel");
		},
		definations: function () {
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
				budCodeVisible: false
			};
			this.getView().setModel(new JSONModel(properties), "oPropertyModel");
			var tempValue = {
				HODName: "",
				ResName: ""
			}
			this.getView().setModel(new JSONModel(tempValue), "oModelTempValue");
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
				debugger;
				this.readCall(this.nav);
				this.screenBehave(this.nav);

			}
		},
		screenBehave: function (nav) {
			if (nav === 'null') {
				this.getView().setModel(new JSONModel({
					HODName: "",
					ResName: ""
				}), "oModelTempValue");
				this.getView().getModel("oPropertyModel").setProperty("/editClicked", true);
				this.getView().getModel("oPropertyModel").setProperty("/keyField", true);
				this.getView().getModel("oPropertyModel").setProperty("/saveButton", true);
				this.getView().getModel("oPropertyModel").setProperty("/updateButton", false);

				this.getView().getModel("oPropertyModel").setProperty("/editButton", false);
				this.getView().getModel("oPropertyModel").setProperty("/copyButton", false);
				this.getView().getModel("oPropertyModel").setProperty("/deleteButton", false);
				this.getView().getModel("oPropertyModel").setProperty("/cancelButton", true);
				this.getView().getModel("oPropertyModel").setProperty("/budCodeVisible", false);
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
				this.getView().getModel("oPropertyModel").setProperty("/budCodeVisible", true);
				this.readCall(nav);
			}
		},
		createLocalModel: function () {
			var oDataForModel = {
				"MANDT": "",
				"PRJ_TYPE": "",
				"ZINITI": "",
				"ZTLIST": "",
				"ZCATEG": "",
				"ZEXPTP": "",
				"ZCAPEX_OPEX": "",
				"WERKS": "",
				"ZBUDG_CODE": "",
				"ZBUDG_DISC": "",
				"ZBUDG_STATUS": "",
				"ZWBS_OWNER": "",
				"ZPRJ_HOD": "",
				"ZREMARKS": ""
			};
			this.getView().setModel(new JSONModel(oDataForModel), "oModel");

			var tempValues = {
				title: "Project Details"
			};
			this.getView().setModel(new JSONModel(tempValues), "oModelTempValue");
		},
		readCall: function (nav) {
			var oModel = this.getOwnerComponent().getModel();
			var sPath = "/et_budget_masterSet" + nav;
			this.getView().setBusy(true);

			oModel.read(sPath, {
				success: function (data) {

					oModel.read("/ZpsBudPerHodSet", {
						success: function (aData) {

							for (let index = 0; index < aData.results.length; index++) {
								const element = aData.results[index];
								if (element.Bname === data.ZPRJ_HOD) {
									this.getView().getModel("oModelTempValue").setProperty("/HODName", element.NameTextc + "-");
								}
								if (element.Bname === data.ZWBS_OWNER) {
									this.getView().getModel("oModelTempValue").setProperty("/ResName", element.NameTextc + "-");
								}

							}


							if (this.action === "edit") {
								this.getView().getModel("oModelTempValue").setProperty("/title", data.ZBUDG_CODE);
								this.onEditButtonPress();

							}
							if (this.action === "copy") {
								this.getView().getModel("oModelTempValue").setProperty("/title", "Project Details");
								this.onCopyButtonPress();

							}
							if (this.action === "delete") {
								this.getView().getModel("oModelTempValue").setProperty("/title", data.ZBUDG_CODE);
								this.onDeleteButtonPress();

							}
							this.getView().setBusy(false);
							this.getView().setModel(new JSONModel(data), "oModel");
						}.bind(this),
						error: function () { }.bind(this)
					});


				}.bind(this),
				error: function (sError) {
					this.getView().setBusy(false);
				}.bind(this)
			})
		},
		onSave: function () {
			var oModel = this.getOwnerComponent().getModel();
			var sPath = "/et_budget_masterSet";
			var payload = this.getView().getModel("oModel").getData();
			payload.ZBUDG_CODE = '';
			if (payload.ZBUDG_STATUS === 'false') {
				payload.ZBUDG_STATUS = false;
			} else {
				payload.ZBUDG_STATUS = true;
			}

			this.getView().setBusy(true);
			var that = this;
			oModel.create(sPath, payload, {
				success: function (oData, response) {
					MessageBox.success("Entry created", {
						actions: ["Ok"],
						onClose: function (oAction) {
							if (oAction === "Ok") {
								that.screenBehave("null");
							}
						}
					});
					this.getView().setBusy(false);
				}.bind(this),
				error: function (sError) {
					this.getView().setBusy(false);
				}
			})
		},
		onEditButtonPress: function () {
			this.getView().getModel("oPropertyModel").setProperty("/editClicked", true);
			this.getView().getModel("oPropertyModel").setProperty("/budCodeVisible", true);
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
			var sPath = "/et_budget_masterSet" + this.nav;
			var payload = this.getView().getModel("oModel").getData();
			this.getView().setBusy(true);
			if (payload.ZBUDG_STATUS === 'false' || payload.ZBUDG_STATUS === false) {
				payload.ZBUDG_STATUS = false;
			} else if (payload.ZBUDG_STATUS === 'true' || payload.ZBUDG_STATUS === true) {
				payload.ZBUDG_STATUS = true;
			}
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
			var sPath = "/et_budget_masterSet" + this.nav;
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
			this.getView().getModel("oPropertyModel").setProperty("/budCodeVisible", false);
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
				.getModel("oModel")
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
				.getModel("oModel")
				.setProperty("/ZWBS_OWNER", sSelectedValue);
			this.getView().getModel("oModelTempValue").setProperty("/ResName", resName)
		},

	});
});