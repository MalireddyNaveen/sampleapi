
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
],
    function (Controller, Fragment, MessageToast, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("com.app.project2.controller.Home", {
            onInit: function () {

            },
            onDelete: function () {
                var select = this.getView().byId("idTable").getSelectedItem().getBindingContext().getPath();
                var oModel = this.getView().getModel();
                oModel.setUseBatch(false);
                var that = this;
                oModel.remove(select, {
                    success: function (oData) {
                        sap.m.MessageBox.success("Succesfully deleted");
                        oModel.refresh(true);
                        that.onAfterRendering();
                        
                    },
                    error: function (oError) {
                        sap.m.MessageBox.error("Error while deleting data");

                    }
                })
                this.onCancel();
            },
            onAdd: async function () {
                this.oDialog ??= await this.loadFragment({
                    name: "com.app.project2.fragments.create"

                })
                this.oDialog.open();
            },
            onCancel: function () {
                // this.oDialog.close(); another way to close a dialog
                this.byId("idDialog").close();

            },
            // onCreate:function(){ another create method
            //     const oPayload = new sap.ui.model.json.JSONModel({
            //         ID:this.byId("idInput").getValue(),
            //         Name:this.byId("idInput1").getValue(),
            //         Description:this.byId("idInput2").getValue(),
            //         ReleaseDate:this.byId("idInput3").getValue(),
            //         Rating:this.byId("idInput4").getValue(),
            //         DiscontinuedDate:this.byId("idInput5").getValue(),
            //         Price:this.byId("idInput6").getValue()
            //     })
            //     var oModel= this.getView().getModel();
            //     oModel.setUseBatch(false);

            //  sending json model to data
            // this.getView().setModel(oPayload,"oPayload");
            //     oModel.create("/Products" ,oPayload.getData(),{
            //         success:function(oData){
            //             sap.m.MessageBox.success("Succesfully Created");
            //             oModel.refresh(true);
            //         },
            //         error:function(oError){
            //             sap.m.MessageBox.error("Error while creating data");

            //         }

            //     });

            // }  
            onCreate: async function () {
                var oModel = this.getView().getModel();
                oModel.setUseBatch(false);
                var oId = this.getView().byId("idInput").getValue();
                var idEsixts = await this.checkID(oId);
                if (idEsixts) {
                    MessageToast.show("ID already exsists");
                    return
                }
                var that = this;
                oModel.create("/Products", {
                    ID: this.byId("idInput").getValue(),
                    Name: this.byId("idInput1").getValue(),
                    Description: this.byId("idInput2").getValue(),
                    ReleaseDate: this.byId("idInput3").getValue(),
                    Rating: this.byId("idInput4").getValue(),
                    DiscontinuedDate: this.byId("idInput5").getValue(),
                    Price: this.byId("idInput6").getValue()
                }, {
                    success: function (oData) {
                        sap.m.MessageBox.success("Succesfully Created");
                        oModel.refresh(true);
                        that.onAfterRendering();
                    },
                    error: function (oError) {
                        sap.m.MessageBox.error("Error while creating data");

                    }

                });
                this.onClear();

            },
            onEdit1: function (oEvent) {
                var oButton = oEvent.getSource();
                var oText = oButton.getText();
                var Table = oButton.getParent();
                var oModel = this.getView().getModel();
                oModel.setUseBatch(false)

                if (oText === 'Edit') {
                    oButton.setText("Submit");
                    var ocell1 = oButton.getParent().getCells()[4].setEditable(true);
                    var ocell2 = oButton.getParent().getCells()[6].setEditable(true);
                } else {
                    oButton.setText("Edit");
                    var ocell1 = oButton.getParent().getCells()[4].setEditable(false);
                    var ocell2 = oButton.getParent().getCells()[6].setEditable(false);
                    var value1 = oButton.getParent().getCells()[4].getValue();
                    var value2 = oButton.getParent().getCells()[6].getValue();
                    var id = oButton.getParent().getCells()[0].getText();

                    oModel.update("/Products(" + id + ")", { Rating: value1, Price: value2 }, {
                        success: function (oData) {
                            sap.m.MessageBox.success("Succesfully Updated");
                            oModel.refresh(true);
                        },
                        error: function (oError) {
                            sap.m.MessageBox.error("Error while Updating data");

                        }

                    })
                }
            },
            checkID: function (sID) {
                var oModel = this.getView().getModel();
                return new Promise((resolve, reject) => {
                    oModel.read("/Products", {
                        filters: [
                            new Filter("ID", FilterOperator.EQ, sID),

                        ],
                        success: function (oData) {
                            resolve(oData.results.length > 0);
                        },
                        error: function () {
                            reject(
                                "An error occurred while checking username existence."
                            );
                        }
                    })
                });

            },
            onClear: function () {
                const oView = this.getView();
                oView.byId("idInput").setValue();
                oView.byId("idInput1").setValue();
                oView.byId("idInput2").setValue();
                oView.byId("idInput3").setValue();
                oView.byId("idInput4").setValue();
                oView.byId("idInput5").setValue();
            },
            onSorter: function () {
                var oTable = this.byId("idTable");
                var oBinding = oTable.getBinding("items");

                if (oBinding) {
                    var oSorter = new sap.ui.model.Sorter('Rating', true); // Replace 'Price' with your sorting property
                    oBinding.sort(oSorter);
                } else {
                    sap.m.MessageToast.show("Table binding not found. Cannot apply sorting.");
                }

            },
            onAfterRendering: function () {
                var oTable = this.byId("idTable");
                var oBinding = oTable.getBinding("items");
                if (oBinding) {
                    oBinding.attachEventOnce("dataReceived", function () {
                        var iRowCount = oBinding.getLength();
                        var oText = this.byId("rowCount");
                        oText.setText("Total Rows: " + iRowCount);
                    }, this);
                }
            }
        });
    });

