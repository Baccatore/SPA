/**
 * spa.js
 * ルート名前空間モジュール
 */

/*jslint
 browser: true,	continue: ture,  deval	: true,
 indent	: 2,	maxerr	: 50,	 newcap	: true,
 nomen	: true, plusplus: true,  regexp	: true,
 sloppy	: true, vars	: false, white	: true
 */
/*global $, spa:true */

var spa = (function() {
    /**
     * パブリックメソッド
     * 初期状態を設定し機能を提供する。
     */
    var initModule = function($container) {
	spa.shell.initModule($container);
    };

    //パブリックメソッドのエクスポート
    return {initModule : initModule};
}());