
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
            // var data = {};
            /*$.each(to_post, function(k, v) {
                data[Model[k]["1"]] = v;
            }) */

            var temp_data = {};
            // The following 4 lines set header rows required by sheetsu API
            var col1_key = data[1][1];
            var col2_key = data[2][1];
            var col3_key = data[3][1];
            var col4_key = data[4][1];

            // The following 4 lines set keys required by sheetsu API 
            temp_data[col1_key] = "999";
            temp_data[col2_key] = "zzz";
            temp_data[col3_key] = "Ni Hao";
            temp_data[col4_key] = "It works?";

            console.log("temp_data in setModel", temp_data);
            console.log("data in setModel is ", data);
            var address = "https://sheetsu.com/apis/0a299348";
            $.post(address, temp_data);
        }, // End of setModel

        updateModel: function() {

        }
    };  // End of Model 

    var Controller = {
        
        fetchData : function() {
            Model.getModel(View.displayList);
        },

        // *** What is pos_str used for? ***/
        // *** Looks like this method isn't being used ***///
       /* updateData : function(pos_str) {
           
            Model.setData(data, position);
            Model.getModel();
            return Model.currentState;
        }, */

        eventHandler : function(e) {
            // If Add Button is clicked
            if (e.target.className === "adder") {
                $(e.target).prop("disabled",true);
                View.displayAdd();

            } else if (e.target.className === "sub") {
                var addList = [];
                var input = $('.add_box').val();
                var adds = input.split(',');
                for (var i = 0; i < adds.length; i++) {
                    addList.push($.trim(adds[i]));      // RV - remove spaces and newlines from cell data
                }
                Model.appendLine(adds);     // *** Why is appendLine being passed adds instead of addList? *** 
                View.removeAdd();
                View.displayList();
            } else if (e.target.className === "update") {
                return Controller.fetchData();
            }
        }
    }; // End of controller

    var View = {
        table : $('table'),
        rowmax : 0,
        colmax : 0,
        addform : $('#addrowform'),
        // test : {1:{1:'num', 2:'2', 3:'3', 5:'4'}, 2:{1:'alpha', 2:'a', 3:'b'}, 4:{1:'hello', 2:'goodbye', 3:'adios'}},
        test : {},

        getMax : function(test) {
            console.log("data object keys in getmax is ", Object.keys(test));
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
            console.log("in getMax, rolmax is:  ", View.rowmax);
            console.log("in getMax, View.test is:  ", View.test);
        },

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
            console.log("in createTable, View.test", View.test);
        },

        populateCell : function(r, c, cell) {
            //fills each cell with its corresponding text, empty ojbects are filled with placeholder text to maintain table shape
            if (View.test[c] && View.test[c][r]) {
                cell.innerHTML = View.test[c][r];
            }
            else {
                cell.innerHTML = '&nbsp';
            }
        },

        addNewRow : function() {
            //appends a row of text boxes to bottom of the table to pass to Controller
            var tr = View.table[0].insertRow(View.rowmax);
            for (var c = 1; c <= View.colmax; c++) {
                var cell = tr.insertCell(-1);
                cell.setAttribute("id", (c));
                cell.innerHTML = '<input type="text">';
            }
        },

        addDone : function() {
            //creates a Submit button to send to Controller
            var $done = $('<input type="submit" value="Done" id="donebutton" />');
            $done.appendTo(View.addform);
            console.log($(":submit"));
            $(":submit").click(function() {
            //Controller.something?
        });
        console.log("in addDone", View.addform);
        }

        }; // End of View object

// Our original callback stuff
    function displayCallback(incomingData) {
        var temp_data = {};
        console.log("incoming:w
        Data in displayCallback is ", incomingData);
        View.getMax(incomingData);
        View.createTable();      // Initialize view
    }

    $(document).ready(function() {
        Model.getModel(displayCallback);
        // data = { "Num": "69", "Alpha": "zz", "Greet": "Ni Hao", "Test Column": "Oy Vey!" };
        // Model.getModel(Model.setModel);
    });
// Model.getModel(Model.nonFunc);  // Initialize model

    

} //end of wrapper

MVC();