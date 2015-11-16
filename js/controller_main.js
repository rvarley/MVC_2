// An MVC implementation of webpage that taps the Google Sheets API
// for interaction with a single, predefined spreadsheet.  Front end
// is a basic Bootstrap website from template.
//
// Author: Cole Howard
//

;  // Defensive

function Wrapper() {

    'use strict';

    var Model = {

        // Array will be populated by dictionaries with column headers
        // from the spreadsheet as keys
        // Get info from Google
        // Push that info into Model
        // Method to get spreadsheet data
        // Push add data to data structure and up to Google
        // Remove deleted data from list and Google
        info : []


    };

    var Controller = {

        fetchData : function() {
            return Model.objectname;
        },

        updateData : function(data, position) {
            Model.set(data, position);
            return Model.objectname;
        },

        eventHandler : function(e, data) {
            // If Add Button is clicked
            if (e.target.className === "adder") {
                this.updateData(data, end_of_list);

            // If Delete Button is clicked
            } else if (e.target.className === "del") {
                this.updateData(null, e.target.position);

            // If A Cell is Updated
            } else if (e.target.className === "data") {
                this.updateData(val, e.target.position);

            }
            // Should return new copy of model after any button click.
            return this.fetchData();
        }


    };


    var View = {
        mainLocale : $(".starter-template"),
        datList : $(".data"),
        drawDisplay : function() {
            // Add event listner
            this.mainLocale.append("<h3>Current Spreadsheet Data</h3>");
            this.mainLocale.append("<ul class='data'></ul>");
            this.mainLocale.append("<button class='adder'>Add Item</button>");
            this.mainLocale.append("<button class='del'>Delete</button>");
            this.mainLocale.append("<button class='update'>Fetch Newest Info</button>");
            var data = 6;
            this.mainLocale.click(function(e) {
                Controller.eventHandler(e, data);
            });
        },        

        // Draw list
        displayList : function() {
            // append, add attrib = add checkbox, add radio buttons (both with No Display)
            $.each(Model.objectname, function(){
                // this.datList.append("<li>" + ???)
            });
            this.datList.append("<li>Woot</li>");
            this.datList.append("<li>What</li>");
        },

        refreshList : function(info) {
            // Republish everything in the model

        }

    };
    
View.drawDisplay();

}

Wrapper();
