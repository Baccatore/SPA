/**
 * spa.chat.js
 * チャット機能モジュール
 */

/*jslint
 * browser  : true, continue    : true,
 * devel    : true, indent      : 2,
 * maxerr   : 50,   newcap      : true,
 * nomen    : true, plusplus    : true,
 * regexp   : true, vars        : false,
 * white    : true
 */

/* global $, spa */

spa.chat = (function(){
 /**
  * モジュールスコープ
  */
  var configMap = {
				main_html : String()
 				  + '<div style="padding:1em; color:#fff">'
				    + 'Say Hello to Chat'
				  + '</div>',
				settable_map : {}
			},
			stateMap = { $container : null},
			jqueryMap = {},
			setJqueryMap, configModule, initModule
	;
	
	
	//DOMメソッド開始
	setJqueryMap = function() {
		var $container = stateMap.$container;
				jqueryMap = {$container : $container};
	};
  //パブリックイベント開始
	//パブリックメソッド/setSliderPosition/開始
	//用例: spa.chat.setSliderPosition( 'closed' );
	//目的: チャットスライダーが要求された状態になるようにする
	//引数:
	//  * position_type - enum('closed', 'opened', 'hidded')
	//  * callback - アニメーションの最後のオプションコールバック
	//    (コールバックは引数としてスライダーDOM要素を受け取る)
	//動作:
	//  スライダーが要求に合致している場合は現在の状態のままにする。
	//  それ以外の場合はアニメーションを使って要求された状態にする。
	//戻り値:
	//  * true - 要求された状態を実現した
	//  * false - 要求された状態を実現していない
	//例外発行: なし
	
	//イベントハンドラ開始
  //用例: spa.chat.configModule({slider_open_em : 18});
	//目的: 初期化前にモジュールを構成する
	//引数:
	//	* set_chat_anchor - オープンまたはクローズ状態を示すように
	//		URIアンカーを変更するコールバック。このこーrバックは要求された
	//		状態を満たせない場合にはfalseを返さなければならない
	//  * chat_module - インスタントメッセージングとやりとりする
	//    メソッドを提供するチャットモデルオブジェクト。
	//  * people_model - 詣でるが保持する人々のリストを管理する
	//    メソッドを提供するピープルモデルオブジェクト。
	//  * slider_* - すべてのオプションのスカラー
	//    完全なリストはmapConfig,settable_mapを参照。
	//    用例: slider_open_emはem単位のオープン時の高さ
	//動作:
	//  指定された引数で内部構成データ(configMap)を更新する。
	//  その他の動作は行わない。
	//返り値: true
	//例外発行: 受け入れられない引数や欠如した引数では
	//					JavaScriptエラーオブジェクトとスタックトレース

	configModule = function ( input_map ){
		spa.util.setConfigMap({
			input_map : input_map,
			settable_map : configMap.settable_map,
			config_map : configMap
		});
		return true;
	};
	//パブリックメソッド/initModul/開始
	//用例: spa.chat.initModule( $('#div_id') );
	//目的: ユーザに既往をて異教するようにチャットに指示する。
	//引数:
	//  * $append_target (例: $('#div_id))
	//    1つのDOMコンテナを表すjQueryコレクション
	//動作:
	//  指定されたコンテナにチャットスライダーを付加し、HTMLコンテンツで埋める。
	//  そして、要素、イベント、ハンドラを初期化し、ユーザにチャットルーム
	//  インターフェースを提供する。
	//戻り値: 成功時にはtrue,失敗時にはfalse
	//例外発行: なし
	initModule = function ( $container ) {
		$container.html( configMap.main_html );
		stateMap.$container = $container;
		setJqueryMap();
		return true;
	}
	
	return{
		configModule : configModule,
		initModule : initModule
	};	
}());

