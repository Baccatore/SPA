/**
 * 
 *  spa.util.js
 *  汎用javascriptユーティリティ 
 * @author Yuichiro SUGA
 * @since 18/11/2015
 * @file
 * @constructor
 */

/*
 * jslint
 * browser : true,  continue  : true,   devel  : true,
 * idndent : 2,     maxerr    : 50,     newcap : true,
 * nomen   : true,  plusplus  : true,   regexp : true,
 * sloppy  :true,   vars      : false,  white : true
 */

/** global $, saa */
spa.util = (function() {
  /**
   * モジュール変数宣言
   */
  var makeError, setConfigMap;

  /* パブリックコンストラクタmakeError */
	makeError = function ( name_text, msg_text, data ) {
		var error = new Error();
		error.name = name_text;
		error.massage = msg_text;
	
		if( data ) { error.data = data; }
		return error;
	};

	/* パブリックメソッドsetConfigMap */
	setConfigMap = function ( arg_map ){
		var
			input_map = arg_map.input_map,
			settable_map = arg_map.settable_map,
			config_map = arg_map.config_map,
			keyname, error;
		
		for ( key_name in input_map ){
			if(input_map.hasOwnProperty( key_name ) ){
		 		if( settable_map.hasOwnProperty( key_name ) ){
					config_map[key_name] = input_map[key_name];
				} else {
					error = nakeError( 'Bad Input',
						'Setting config key |' + key_name + '| is not supported');
					throw error;
				}
		 	}
		}
	};
	return {
		makeError : makeError,
		setConfigMap : setConfigMap
	}
}());
