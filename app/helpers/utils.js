const itemsModel = require( __path_schemas + 'items');

let createFilterStatus = (currentStatus) => {
    let statusFilter = [
        {name: 'All', value: 'All', count: 0, link:'#', class: 'default'},
        {name: 'Active', value: 'active', count: 0, link:'#', class: 'default'},
        {name: 'inActive', value: 'inactive', count: 0, link:'#', class: 'default'},
      ];
      statusFilter.forEach((item, index) => {
        
        // Count How many objects in ALL, objects with status active, objects with status inactive
        if (item.value == "All"){
          itemsModel.count({ }).then( (data) => {
            item.count = data;
          });
        }else {
          itemsModel.count({status: item.value}).then((data) =>{
            item.count = data;  
          });
        }
        // Set success-status for chosen button
        if(item.value == currentStatus){
          item.class = "success";
        }

      });

    return statusFilter;
}

module.exports = {
    createFilterStatus: createFilterStatus
}




