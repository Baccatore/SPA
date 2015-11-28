/**
 * 
 *  spa.data.js
 *  データモジュール 
 * @author Yuichiro SUGA
 * @since 2015/11/26
 */

/*
 * jslint
 * browser : true,  continue  : true,   devel  : true,
 * idndent : 2,     maxerr    : 50,     newcap : true,
 * nomen   : true,  plusplus  : true,   regexp : true,
 * sloppy  :true,   vars      : false,  white : true
 */

/* global $, saa */
spa.data = (function() {
  //--Module Scope Variables BEGIN-------------------------------------------
  var
    //Configulation propetries mapping
    configMap = {
      main_html     : undefined,
      settable_map  : undefined
    },
    //State properties mapping
    stateMap = {
      $append_target : null,   //DOM Element to append this function on shell
    },
    jqueryMap = {}, //Cash for jQuery mapping
    setJqueryMap, configModule, initModule
  ;
  //--Module Scope Variables END---------------------------------------------

  //--Utilities Method BEGIN-------------------------------------------------
  //--Utilities Method END---------------------------------------------------

  //--DOM Method BEGIN-------------------------------------------------------
  /**
   * setJqueryMap
   */
  setJqueryMap = function () {
    var $append_target = stateMap.$append_target;
    jqueryMap = {
        $container : $container,
    };
  };
  //--DOM Method END---------------------------------------------------------
  
  //--Public Method BEGIN----------------------------------------------------
  /**
   * configModule
   * Rewrite configuration mapping (configMap) with arguments.  This method
   * will never do any other operation. 
   * @purpose Configure the module before initialisation
   * @param input_map - Object having the configuration info
   * @return true
   * @throws throws  js  error objects  and  stack  traces  if  unacceptable 
   * arguments or lack of parameters
   */
  configModule = function ( input_map ){
    spa.util.setConfigMap({
      input_map : input_map,
      settable_map : configMap.settable_map,
      config_map : configMap
    });
    return true;
  };
  
  /**
   * initModule
   * Append the function to a DOM element asigned by the argument, and fill
   * it out with HTML contents.  After, initialise its properties and event
   * handlers. Finaly supply the UI to users on shell.
   * @purpose Initialiser of this module
   * @param $append_target
   *    a jQquery collection to append this function on shell
   * @return
   *    TRUE for success, FALSE if not
   * @throws nothing
   */
  initModule = function( $append_target ) {
    $append_target.append( configMap.main_html );
    stateMap.$append_target = $append_target;
    setJqueryMap();
    
    return true;
  }
  //--Public Method END------------------------------------------------------

  /**
   * Export of Public Methods 
   * @export
   */
  return {
    configModule  : configModule,
    initModule    : initModule
  };
}());
