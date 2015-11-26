/**
 * 
 *  spa.shell.js
 *  SPAのシェルモジュール 
 * @author Yuichiro SUGA
 * @since 18/11/2015
 * @file
 * @constructor
 */

/*
 * jslint browser : true, continue : true, devel : true, idndent : 2, maxerr :
 * 50, newcap : true, nomen : true, plusplus : true, regexp : true, sloppy :
 * true, vars : false, white : true
 */

/** global $, saa */
spa.shell = (function() {
  //--モジュール変数宣言-------------------------------------------------------
  var
    configMap = {
      anchor_shema_map : {
          chat : { opened : true, closed : true }
        },
      main_html : String()
        + '<div class="spa-shell-head">'
          + '<div class="spa-shell-head-logo"></div>'
          + '<div class="spa-shell-head-acct"></div>'
          + '<div class="spa-shell-head-search"></div>'
        + '</div>'
        + '<div class="spa-shell-main">'
          + '<div class="spa-shell-main-nav"></div>'
          + '<div class="spa-shell-main-content"></div>'
        + '</div>'
        + '<div class="spa-shell-foot"></div>'
        + '<div class="spa-shell-modal"></div>',
      },
    stateMap = { anchor_map  : {} },
    jqueryMap = {},
    copyAnchorMap, setJqueryMap,
    changeAnchorPart, onHashchange,
    setChatAnchor, initModule
  ;
  //--モジュール変数宣言-------------------------------------------------------

  //--ユーティリティメソッド開始------------------------------------------------------
  /**
   * 格納したアンカーマップのコピーを返す。オーバーヘッドを最小限にする。
   * @param なし
   * @return anchorMap
   */
  copyAnchorMap = function (){
    return $.extend(true, {}, stateMap.anchor_map);
  }
  //--ユーティリティメソッド終了------------------------------------------------------

  //--DOMメソッド開始--------------------------------------------------------------
  //Begin setJqueryMap
  setJqueryMap = function() {
    var $container = stateMap.$container;
    // jQueryコレクションのキャッシュ
    jqueryMap = { $container : $container };
  };
  //End setJqueryMap
  
  //Begin changeAnchorPart
  changeAnchorPart = function (arg_map){
    var
      anchor_map_revise = copyAnchorMap(),
      bool_return = true,
      key_name, key_name_dep
    ;
    //アンカーマップへの統合を開始
    KEYVAL:
    for( key_name in arg_map ){
      if( arg_map.hasOwnProperty( key_name ) ){
        //反復中に従属キーを飛ばす
        if( key_name.indexOf( '_' )===0){ continue KEYVAL; }
        //独立キー値を更新する
        anchor_map_revise[key_name] = arg_map[key_name];
        //合致する独立キーを更新する
        key_name_dep = '_' + key_name;
        if( arg_map[key_name_dep] ){
          anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
        } else {
          delete anchor_map_revise[key_name_dep];
          delete anchor_map_revise['_s' + key_name_dep];
        }
      }
    }
    
    //URIへの変更を開始
    try {
      $.uriAnchor.setAnchor( anchor_map_revise );
    }
    catch( error ){
      $.uriAnchor.setAnchor( stateMap.anchor_map, null, true);
      bool_return = false;
    }
    return bool_return;
  };
  //End changeAnchorPart
  //--DOMメソッド終了---------------------------------------------------------
  
  //--イベントハンドラ開始------------------------------------------------------
  /**
   * onHashchange
   * 
   */
  onHashchange = function( event ){
    var
      _s_chat_previous, _s_chat_proposed, s_chat_proposed,
      anchor_map_proposed,
      anchor_map_previous = copyAnchorMap(),
      is_ok = true
    ;

    try{ anchor_map_proposed = $.uriAnchor.makeAnchorMap();}

    catch(error){
      $.uriAnchor.setAnchor(anchor_map_previous, null, true);
      return false;
    }
    stateMap.anchor_map = anchor_map_proposed;
    
    _s_chat_previous = anchor_map_previous._s_chat;
    _s_chat_proposed = anchor_map_proposed._s_chat;
    
    if( ! anchor_map_previous || _s_chat_previous !== _s_chat_proposed){
      s_chat_proposed = anchor_map_proposed.chat;
      switch(s_chat_proposed){
      case 'opened':
        is_ok = spa.chat.setSliderPosition( 'opened' );
        break;
      case 'closed':
        is_ok = spa.chat.setSliderPosition( 'closed' );
        break;
      default:
        spa.chat.setSliderPosition( 'closed' );
        delete anchor_map_proposed.chat;
        $.uriAnchor.setAnchor( anchor_map_proposed, null, true );
      }
    }
    //スライダーの変更が拒否された場合
    if( ! is_ok ) {
      if( anchor_map_previous ){
        $.uriAnchor.setAnchor( anchor_map_previous, null, true );
        stateMap.anchor_map = anchor_map_previous;
      } else {
        delete anchor_map_proposed.chat;
        $.uriAnchor.setAnchor( anchor_map_proposed, null, true );
      }
    }
    return false;
  }
  //End onHashchange
  
  //--コールバック関数開始----------------------------------------------------
  // setChatAnchor
  // 用例: setChatAnchor( 'closed' );
  // 目的: アンカーチャットコンポーネントを変更する。
  // @param position_type 'closed' or 'opened'
  // 動作: 可能ならURIアンカーパラメーターchat要求値に変更する。
  // @return
  //  * true  要求されたアンカー部分が更新された
  //  * false 要求されたアンカー部分が更新されなかった
  // 例外発行: なし
  setChatAnchor = function ( position_type ) {
    return changeAnchorPart({ chat : position_type });
  };
  //--コールバック関数終了----------------------------------------------------
  
  //--パブリックメソッド開始---------------------------------------------------
  /**
   * Begin initModule
   * @param {jQueryコレクション}
   * 用例: spa.shell.initModule( $('#app_div_id') );
   * 目的: ユーザに機能を提供するようにチャットに指示する
   * 動作: $containerにUIのシェルを含め、機能モジュールを構成して初期化する。
   *      シェルはURIアンカーやCookieの管理などのブラウザ全体に及ぶ問題を担当する。
   * 例外発行: なし
   */
  initModule = function( $container ) {
    //HTMLをロードしjQueryコレクションをマッピング
    stateMap.$container = $container;
    $container.html( configMap.main_html );
    setJqueryMap();
    
    //uriAnchorの初期値の読み込み
    $.uriAnchor.configModule({
        schema_map : configMap.anchor_schema_map
    });
    
		//機能モジュールを構成して初期化する
		spa.chat.configModule({
		  set_chat_anchor : setChatAnchor,
		  chat_model      : spa.model.chat,
		  people_model    : spa.model.people
		});
		spa.chat.initModule( jqueryMap.$container );
		
		//URIアンカー変更イベントを処理する。
		//これはすべての機能モジュールを構成して初期化した後に行う。
		//そうしないと、トリガーイベントを処理できる状態にならない。
		//トリガーイベントはアンカーがロード状態とみなせることを保証するために使う。
    $(window)
      .bind( 'hashchange', onHashchange )
      .trigger( 'hashchange' );
  }
  //End initModule

  // パブリックメソッドのエクスポート
  return {
    initModule : initModule
  };
  //--パブリックメソッド終了---------------------------------------------------
}());
