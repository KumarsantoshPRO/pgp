sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (
	Controller, JSONModel
) {
	"use strict";

	return Controller.extend("pgp.com.budgetmaster.controller.View2", {
		onInit() {
			sap.ui.core.UIComponent.getRouterFor(this);
			this.getOwnerComponent()
				.getRouter()
				.attachRoutePatternMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function (oEvent) {
			this.createLocalModel();
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
			}
			this.getView().setModel(new JSONModel(oDataForModel), "oModel");
		},
		onSave: function () {
			var sService = "/sap/opu/odata/sap/ZBUDGET_MASTER_SRV";
			var oModel = new sap.ui.model.odata.ODataModel(sService, true);
			var sPath = "/et_budget_masterSet";
			var payload = this.getView().getModel("oModel").getData();

			// var sPath = "/et_budget_master_assignSet";
			// var payload = {
			// 	"MANDT": "240",
			// 	"ZBUDG_CODE": "S1234",
			// 	"ZBUDG_DISC": "S1234",
			// 	"ZWBS_YEAR": "2024",
			// 	"POSID": "SKP"
			// };
		 
			oModel.create(sPath, payload, {
				success: function (oData, response) { }.bind(this),
				error: function (sError) { }
			})
		}

	});
});