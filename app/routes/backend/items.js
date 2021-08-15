var express = require('express');
const util = require('util')
const items = require( __path_schemas + 'items');
var router = express.Router();

//Establish a connection to a colection of DB
const itemsModel = require(__path_schemas + 'items');

//Add Validator
const ValidateItems = require( __path_validates + 'items');

//add module UltisHelper
const UtilsHelper = require( __path_helpers + 'utils');
/* GET items listing. */

//add module Params
const ParamsHelper = require( __path_helpers + 'params');

//add custom notify 
const notify = require(__path_configs + 'notify'); 

const folderView = __path_views + 'pages/items/';

router.get('(/status/:status)?', (req, res, next) => {

  let keyword = ParamsHelper.getParam(req.query, 'keyword', '');
  let currentStatus = ParamsHelper.getParam(req.params, 'status', 'All');
  
  let statusFilter = UtilsHelper.createFilterStatus(currentStatus);

  let pagination = {
    totalItem : 0,
    totalItemsPerPage : 2,
    currentPage: 1, 
    pageRanges: 3,
  }



  pagination.currentPage = parseInt(ParamsHelper.getParam(req.query, 'page' , '1'));
  console.log(pagination);

  console.log(keyword);
  let objStatus = {};

  if(currentStatus === 'All'){
      if(keyword !== '' && keyword !== undefined) objStatus = { name : new RegExp(keyword, 'i') }
  } else if (currentStatus !== 'All' && keyword ===''){
    objStatus = { 
      status : currentStatus,
    }
  } else if(currentStatus !== 'All' && keyword !== '' && keyword !== undefined){
    objStatus = {
      status : currentStatus,
      name : new RegExp(keyword, 'i')
    }
  } else {
    console.log("Default");
  }
  
  console.log(objStatus.name)

  itemsModel.count(objStatus).then((data) => {
    pagination.totalItem = data;

  itemsModel.find(objStatus)
  .sort({ordering: 'desc'})
  .skip((pagination.currentPage -1 ) * pagination.totalItemsPerPage)
  .limit(pagination.totalItemsPerPage)
  .then( (items) => {
    res.render(`${folderView}list`, { 
      pageTitle: 'Item List Page' ,
      items: items,
      statusFilter: statusFilter, 
      currentStatus: currentStatus,
      keyword: keyword,
      pagination
    });
  });

  });

});

const systemConfig = require(__path_configs +'system');

//Change 1 status
router.get('/change-status/:id/:status', (req, res, next) => {
  let currentStatus = ParamsHelper.getParam(req.params, 'status', 'active');
  let id            = ParamsHelper.getParam(req.params, 'id', '');

  let status = (currentStatus === "active") ? "inactive" : "active";

  itemsModel.updateOne({_id: id}, 
    {status: status}, (err, result) => {
      req.flash('success', notify.CHANGE_STATUS_SUCCESS, false);
      res.redirect(`/${systemConfig.prefixAdmin}/items`)
    })

});

//Change Multi Status
router.post('/change-status/:status', (req, res, next) => {
  let currentStatus = ParamsHelper.getParam(req.params, 'status', 'active');
  console.log(currentStatus);
  console.log(req.body);
  itemsModel.updateMany({_id: {$in: req.body.cid}}, {status: currentStatus}, (err, result) => {
    req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCESS, result.n), false);
    res.redirect(`/${systemConfig.prefixAdmin}/items`)
  });

});

//Delete Multi Status
router.post('/delete', (req, res, next) => {

  itemsModel.remove({_id: {$in: req.body.cid}}, (err, result) => {
    req.flash('success', 'Xóa nhiều phần tử thành công', false);
    res.redirect(`/${systemConfig.prefixAdmin}/items`)
  });
});


//Form - Add New Item or Edit Item 
router.get('/form(/:id)?', (req, res, next) => {
  let id = ParamsHelper.getParam(req.params, 'id', '');
  let newitem = {name: '', ordering: 0, status: 'novalue'}
  let errors = null;
  if( id === ''){
    res.render(`${folderView}add`, {pageTitle: 'Item Management - Add', item : newitem, errors});
  }else{
    itemsModel.findById(id, (err,item) => {
        console.log(item);
        res.render(`${folderView}add`, {pageTitle: 'Item Management - Edit', item, errors});
    });
  }

});

//Save new Item/edited Item
router.post('/save', (req,res, next) => {
  //let item = Object.assign(req.body);
  let item = Object.assign(req.body);

  ValidateItems.validator(req);
  let errors = req.validationErrors();

  if( item.id !== "") {  // item.id khác null, -> Edit function

    if(errors !== false){ // is error or errors is true , show error info
      res.render(`${folderView}add`, {pageTitle: 'Item Management - Edit', item, errors});
    }else {  // not error -> Edit
        itemsModel.updateOne({_id: item.id}, {
          ordering: parseInt(item.ordering),
          name: item.name,
          status: item.status
        } ,(err, result) => {
          req.flash('success', 'Cập nhật phần tử thành công', false);
          res.redirect(`/${systemConfig.prefixAdmin}/items`);
      });
      }


  }else {  // item.id null, -> Add function

      if(errors !== false){ // is error or errors is true, show error info
        res.render(`${folderView}add`, {pageTitle: 'Item Management - Add', item, errors});
      }else {  // not error -> Add
        new itemsModel(item).save().then(() => {
            req.flash('success', 'Thêm mới phần tử thành công', false);
            res.redirect(`/${systemConfig.prefixAdmin}/items`);
        });
        }

  }

});
 
//Change ordering - Multi
router.post('/change-ordering', (req, res, next) => {
    let cids = req.body.cid;
    let orderings = req.body.ordering;
    if(Array.isArray(cids)){
      cids.forEach( (item,index) => {
        itemsModel.updateOne( {_id: item}, {ordering: parseInt(orderings[index])}, (err,result) => {});
      })
    }else {
      itemsModel.updateOne({_id: cids}, {ordering: parseInt(orderings)}, (err,result) => {});
    }
    req.flash('success', 'Cập nhật Ordering thành công', false);
    res.redirect(`/${systemConfig.prefixAdmin}/items`);
});



//Delete 1 item
router.get('/delete/:id', (req, res, next) => {

  let id = ParamsHelper.getParam(req.params, 'id', '');

  itemsModel.deleteOne({_id: id}, (err, result) => {
    req.flash('success', 'Xóa 1 phần tử thành công', false);
      res.redirect(`/${systemConfig.prefixAdmin}/items`)
    })

});


module.exports = router;

 
  

