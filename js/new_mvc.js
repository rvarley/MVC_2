
function MVC() {

    var Model = {
        url: "https://spreadsheets.google.com/feeds/cells/" +
              "1sYkU_8raV14Bqm33dWcaksC3iMm73DH9OMsooxSMItM" +
              "/od6/public/values?alt=json",
        data: {},

        getModel: function(callback) {
            $.getJSON(Model.url, function(data) {
                var col_high = 0;

                $.each(data.feed.entry, function(key, value) {
                    var cur_col = Number(value.gs$cell.col);  //Returns column value
                    if (cur_col > col_high) {
                        col_high = cur_col; //reset the value as we iterate
                        Model.data[(cur_col).toString()] = {};
                    }
                    Model.data[value.gs$cell.col][value.gs$cell.row] = value.gs$cell.$t;
                }); // End .each
                callback(Model.data);
            });
        },


        setModel: function(data) {

            console.log('arr[1] in setModel is: ', View.arr[1]);
            var temp_data = {};
            // The following 4 lines set header rows required by sheetsu API
            var col1_key = data[1][1];
            var col2_key = data[2][1];
            var col3_key = data[3][1];
            var col4_key = data[4][1];

            // The following 4 lines set keys required by sheetsu API 
            temp_data[col1_key] = View.arr[0];
            temp_data[col2_key] = View.arr[1];
            temp_data[col3_key] = View.arr[2];
            temp_data[col4_key] = View.arr[3];

            console.log("temp_data in setModel is: ", temp_data);
            // console.log("data in setModel is ", data);
            var address = "https://sheetsu.com/apis/0a299348";
            $.post(address, temp_data);
        }, // End of setModel

        refreshModel: function() {
            location.reload();  // reloads webpage which fetches data
        }, // End of refreshModel 

        updateModel: function() {

        }
    };  // End of Model 

    var Controller = {
        
        fetchData : function() {
            Model.getModel(View.displayList);
        },

        eventHandler : function(e) {
            // If Add Button is clicked
            // console.log("in controller event handler, e.target.id is: ", e.target.id);
            if (e.target.id === "refresh") {
                console.log("Refresh button clicked");
                Model.refreshModel();

            } else if (e.target.id === "addrow") {
                var new_data = prompt("Enter CSV data to add to spreadsheet.");
                View.arr = new_data.split(',');
                Model.setModel(View.test);
            }
        }
    }; // End of controller

    var View = {
        table : $('table'),
        rowmax : 0,
        colmax : 0,
        addform : $('#addrowform'),
        test : {},
        arr : '',
        addRow : $('#addrow'),
        refreshData : $('#refresh'),

        getMax : function(test) {
            //cycles through the Model and saves number of rows and columns
            View.test = test;
            for (var i = 0;i < Object.keys(View.test).length; i++){

                if(Number(Object.keys(View.test)[i]) > View.colmax) {
                    View.colmax = Object.keys(View.test)[i];
                }
            }
            for (var key in View.test){
                var values = View.test[key];
                for (var j = 0; j < Object.keys(values).length; j++) {
                    if(Number(Object.keys(values)[j]) > View.rowmax) {
                        View.rowmax = Object.keys(values)[j];
                    }
                }
            }
        },

        displayAdd : function() {
            this.mainLocale.append("<input class='add_box' type=text></input>");
            this.mainLocale.append("<button class='sub'>Submit</button>");
            this.mainLocale.append("<p id='direction'>CSV Please</p>");
        }, // End of displayAdd

        createTable : function() {
            //creates a table with the dimensions of rowmax and colmax
            for (var r = 1; r <= View.rowmax; r++) {
                var tr = View.table[0].insertRow(-1);
                for (var c = 1; c <= View.colmax; c++) {
                    var cell = tr.insertCell(-1);
                    cell.setAttribute("id", r + ',' + c);
                    View.populateCell(r, c, cell);
                }
            }
            View.refreshData.click(function(e) {
                Controller.eventHandler(e);
            });
            View.addRow.click(function(e) {
                Controller.eventHandler(e);
            });
        },

        populateCell : function(r, c, cell) {
            //fills each cell with its corresponding text, empty ojbects are filled with placeholder text to maintain table shape
            if (View.test[c] && View.test[c][r]) {
                cell.innerHTML = View.test[c][r];
            }
            else {
                cell.innerHTML = '&nbsp';
            }
        }

        }; // End of View object

    function displayCallback(incomingData) {
        var temp_data = {};
        View.getMax(incomingData);
        View.createTable();      // Initialize view
    }

    $(document).ready(function() {
        Model.getModel(displayCallback);
    });

    

} //end of wrapper

MVC();