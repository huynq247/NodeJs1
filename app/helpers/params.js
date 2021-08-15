let getParam = (params, property, defaultValue) =>{

  if( params[property] !== undefined ) {
    return params[property];
  }
  return defaultValue;
}

module.exports = {
  getParam
}


