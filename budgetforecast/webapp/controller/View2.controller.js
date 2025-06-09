sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (
	Controller,
	JSONModel
) {
	"use strict";

	return Controller.extend("pgp.com.budgetforecast.controller.View2", {
		oninit: function () {
			this.getView().setModel(new JSONModel(), "ModelForTable");
		}
	});
});