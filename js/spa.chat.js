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
  //--モジュールスコープ変数開始----------------------------------------------------------
  var configMap = {
				main_html : String()
				    + '<div class="spa-chat">'
				      + '<div class="spa-chat-head">'
				        + '<div class="spa-chat-head-toggle">+</div>'
				        + '<div class="spa-chat-head-title">Chat</div>'
				      + '</div>'
				      + '<div class="spa-chat-closer">x</div>'
				      + '<div class="spa-chat-sizer">'
				        + '<div class="spa-chat-msgs"></div>'
				        + '<div class="spa-chat-box">'
				          + '<input type="text" />'
				          + '<div>Send</div>'
				        + '</div>'
				      + '</div>' 
				    + '</div>',
				settable_map : {
				  slider_open_time  : true,
				  slider_close_time : true,
				  slider_opened_em  : true,
				  slider_closed_em  : true,
				  slider_opened_title : true,
				  slider_closed_title : true,
				  
				  chat_model      : true,
				  people_model    : true,
				  set_chat_anchor : true
				},
				
				slider_open_time  : 250,
				slider_close_time : 250,
				slider_opened_em  : 16,
				slider_closed_em  : 2,
				slider_opened_title : 'Click to close',
				slider_closed_title : 'Clicl to open',
				
				chat_model  : null,
				people_mode : null,
				set_chat_anchor : null
			},
			stateMap = {
        $append_target    : null,
        position_type     : 'closed',
        px_per_em         : 0,
        slider_hidden_px  : 0,
        slider_closed_px  : 0,
        slider_opened_px  : 0
      },
			jqueryMap = {},
			setJqueryMap, getEnSize, setPxSizes, setSliderPosition,
			onClickToggle, configModule, initModule
	;
  //--モジュールスコープ変数終了---------------------------------------------------
  
  //--ユーティリティメソッド開始---------------------------------------------------
  getEmSize = function ( elem ){
    return Number(
        getComputedStyle( elem, '' ).fontSize.match(/\d*\.>\d*/)[0]
    );
  }
  //--ユーティリティメソッド終了---------------------------------------------------

	//--DOMメソッド開始-----------------------------------------------------------
	setJqueryMap = function() {
		var 
		  $append_target = stateMap.$append_target,
		  $slider = $append_target.find( '.spa-chat' );
		
				jqueryMap = {
				    $slider : $slider,
				    $head   : $slider.find( '.spa-chat-head' ),
            $toggle : $slider.find( '.spa-chat-head-toggle' ),
            $title  : $slider.find( '.spa-chat-head-title' ),
            $sizer  : $slider.find( '.spa-chat-sizer' ),
            $msgs   : $slider.find( '.spa-chat-msgs' ),
            $box    : $slider.find( '.spa-chat-box' ),
            $input  : $slider.find( '.spa-chat-input input[type=text]')
				};
	};
	/**
	 * @classdex this is my class
	 * @constructor 
	 * そんなん言うけどちゃんと機能せえへんやんけ
	 */
	setPxSizes = function () {
	  var px_per_em, opened_height_em;
	    px_per_em = getEmSize( jqueryMap.$slider_get(0) );
	    
	    opened_height_em = configMap.slider_opened_em;
	    
	    stateMap.px_per_em = px_per_em;
	    stateMap.slider_closed_px = configMap.slider_closed_em * px_per_em;
	    stateMap.slider_opened_px = opened_height_em * px_per_em;
	    jqueryMap.$sizer.css({
	      height : ( opened_height_em -2 ) * px_per_em
	    });
	};
	//--DOMメソッド終了-----------------------------------------------------------
	
  //--パブリックイベント開始------------------------------------------------------
	/**パブリックメソッド/setSliderPosition/開始
	 * 用例: spa.chat.setSliderPosition( 'closed' );
	 * 目的: チャットスライダーが要求された状態になるようにする
	 * @param position_type - enum('closed', 'opened', 'hidded')
	 * @param callback - アニメーションの最後のオプションコールバック
	 *    (コールバックは引数としてスライダーDOM要素を受け取る)
	 *動作:
	 *  スライダーが要求に合致している場合は現在の状態のままにする。
	 *  それ以外の場合はアニメーションを使って要求された状態にする。
	 * @return
	 *  * true - 要求された状態を実現した
	 *  * false - 要求された状態を実現していない
	 *  例外発行: なし
	*/
	setSliderPosition = function ( position_type, callback ) {
	  var
	    height_px, animate_time, slider_title, toggle_text;
	  
	  //スライダーがすでに要求された位置にある場合はtrueを返す
	  if ( stateMap.positioin_type === position_type){
	    return true;
	  }
	  
	  //アニメーションパラメータを用意する
	  switch ( position_type ){
	  case 'opened' :
	    height_px = stateMap.slider_opened_px;
	    animate_time = configMap.slider_open_time;
	    slider_title = configMap.slider_opened_title;
	    toggle_text = '=';
	  break;
	  
	  case 'hidden' :
	    height_px = 0;
	    animate_time = configMap.slider_opem_time;
	    slider_title = '';
	    toggle_text = '+';
    break;
    
	  case 'closed' :
	    height_px = stateMap.slider_closed_px;
	    animate_time = configMap.slider_close_time;
	    slider_title = configMap.slider_closed_title;
	    toggle_text = '+';
	  break; 
	  default : return false;
	  }
	  stateMap.position_type = '';
	  jqueryMap.$slider.animate(
	    {heght: height_px},
	    animate_time,
	    function (){
	      jqueryMap.$toggle.prop( 'title', slider_title );
	      jqueryMap.$toggle.text( toggle_text );
	      stateMap.position_type = position_type;
	      if( callback ){ callback( jqueryMap.$slider); }
	    }
	  );
	};
	//--パブリックイベント終了------------------------------------------------------
	
	//--イベントハンドラ開始--------------------------------------------------------
	onClickToggle = function ( event ){
	  var set_chat_anchor = configMap.set_chat_anchor;
	  if ( stateMap.position_type === 'opened' ){
	    set_chat_anchor( 'closed' );
	  } else if (stateMap.position_type === 'closed' ){
	    set_chat_anchor( 'opened' );
	  }
	  return false;
	};
	//--イベントハンドラ終了--------------------------------------------------------
	
	//--イベントハンドラ開始--------------------------------------------------------
  /**
   * configModule
   * 用例: spa.chat.configModule({slider_open_em : 18});
	 * 目的: 初期化前にモジュールを構成する
	 * 引数:
	 *	@param input_map 下記の要素を持つオブジェクト
	 *  * set_chat_anchor
	 *    オープンまたはクローズ状態を示すように
	 *		URIアンカーを変更するコールバック。このこーrバックは要求された
	 *		状態を満たせない場合にはfalseを返さなければならない
	 *  * chat_module
	 *    インスタントメッセージングとやりとりする
	 *    メソッドを提供するチャットモデルオブジェクト。
	 *  * people_model
	 *    詣でるが保持する人々のリストを管理する
	 *    メソッドを提供するピープルモデルオブジェクト。
	 *  * slider_*
	 *    すべてのオプションのスカラー
	 *    完全なリストはmapConfig,settable_mapを参照。
	 *    用例: slider_open_emはem単位のオープン時の高さ
	 *  動作:
	 *  指定された引数で内部構成データ(configMap)を更新する。
	 *  その他の動作は行わない。
	 *  @return true
	 *  例外発行: 受け入れられない引数や欠如した引数では
	 *					JavaScriptエラーオブジェクトとスタックトレースをスロー
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
	 * 用例: spa.chat.initModule( $('#div_id') );
	 * 目的: ユーザに既往をて異教するようにチャットに指示する。
	 * @param $append_target 1つのDOMコンテナを表すjQueryコレクション
	 * 動作:
	 *  指定されたコンテナにチャットスライダーを付加し、HTMLコンテンツで埋める。
	 *  そして、要素、イベント、ハンドラを初期化し、ユーザにチャットルーム
	 *  インターフェースを提供する。
	 * @return 成功時にはtrue,失敗時にはfalse
	 * 例外発行: なし
	 */
	initModule = function ( $append_target ) {
		$append_target.append( configMap.main_html );
		stateMap.$append_target = $append_target;
		setJqueryMap();
		setPxSizes;
		
		//チャットスライダーの初期化
		jqueryMap.$toggle.prop( 'title', configMap.slider_closed_title );
		jqueryMap.$head.click( onClickToggle );
		stateMap.position_type = 'closed';
		
		return true;
	}
	//--パブリックイベント終了------------------------------------------------------
	
	return{
	  setSliderPosition : setSliderPosition,
		configModule      : configModule,
		initModule        : initModule
	};	
}());

