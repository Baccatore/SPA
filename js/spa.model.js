/**
 * 
 *  spa.model.js
 *  SPAのモデルモジュール 
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
 * sloppy  : true,   vars      : false,  white : true
 */

/** global $, saa */
spa.model = (function() {
  /**
   * モジュール変数宣言
   */
  var
    configMap = {
		},
main_html = String(),
	// 動的情報値
		stateMap = {
			$container : null,
		},
  // jQueryコレクションのキャッシュ
		jqueryMap = {}, initModule;

  /**
   * ユーティリティメッソッド
   * 
   */

  /**
   * DOMメソッド
     + '* '
   */

  setJqueryMap = function() {
    var $container = stateMap.$container;
    jqueryMap = {
      $container : $container,
    };
  };
  
  /*
   * イベントハンドラ
   * 
   */

  /*
   * パブリックメソッド
   * 
   */
  
  //Begin initModule
  initModule = function($container) {
    stateMap.$container = $container;
    $container.html(configMap.main_html);
    setJqueryMap();
  }
  //End initModule
  // パブリックメソッドのエクスポート
  return {
    initModule : initModule
  };
}());
