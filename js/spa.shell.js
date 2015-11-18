/**
 *  spa.shell.js
 *  SPAのシェルモジュール 
 */

/**
 * jslint browser : true, continue : true, devel : true, idndent : 2, maxerr :
 * 50, newcap : true, nomen : true, plusplus : true, regexp : true, sloppy :
 * true, vars : false, white : true
 */

/* global $, saa */
spa.shell = (function() {
  /*
   * モジュール変数宣言
   */
  // 静的構成値
  // こうした値は最終的にはXMLでマッピングする
  var configMap = {
    anchor_shema_map : {
      chat : { open : true, closed : false }
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
      + '<div class="spa-shell-chat"></div>'
      + '<div class="spa-shell-modal"></div>',
    chat_extend_time    : 250,
    chat_retract_time   : 300,
    chat_extend_height  : 450,
    chat_retract_height : 15,
    chat_extend_title   : 'Click to retract',
    chat_retracted_title: 'Click to extend'
  },
  // 動的情報値
  stateMap = {
    $container : null,
    anchor_map  : {},
    is_chat_retracted : true
  },
  // jQueryコレクションのキャッシュ
  jqueryMap = {},
  copyAnchorMap, setJqueryMap, toggleChat,
  changeAnchorpart, onHashchange,
  onClickChat, initModule;

  /*
   * ユーティリティメッソッド
   * 
   */
  //格納したアンカーマップのコピーを返す。オーバーヘッドを最小限にする。
  copyAnchorMap = function (){
    return $.extend(true, {}, stateMap.anchor_map);
  }

  /*
   * DOMメソッド
   * 
   */
  //Begin setJqueryMap
  setJqueryMap = function() {
    var $container = stateMap.$container;
    // jQueryコレクションのキャッシュ
    jqueryMap = {
      $container : $container,
      $chat : $container.find('.spa-shell-chat')
    };
  };
  //End setJqueryMap
  
  //Begin changeAnchorPart
  changeAnchorPart = function (arg_map){
    var
      anchor_map_revise = copyAnchorMap(),
      bool_return = true,
      key_name, key_name_dep;
    
    //アンカーマップへの統合を開始
    KEYVAL:
      for(key_name in arg_map){
        if(arg_map.hasOwnProperty(key_name)){
          //反復中に従属キーを飛ばす
          if(key_name.indexOf('_')===0){continue KEYVAL;}
          //独立キー値を更新する
          anchor_map_revise[key_name] = arg_map[key_name];
          //合致する独立キーを更新する
          key_name_dep = '_' + key_name;
          if( arg_map[key_name_dep]){
            anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
          } else {
            delete anchor_map_revise[key_name_dep];
            delete anchor_map_revise['_s' + key_name_dep];
          }
        }
      }
    
    //URIへの変更を開始
    try {
      $.uriAnchor.setAnchor(anchor_map_revise);
    }
    catch(error){
      $.uriAnchor.setAnchor(stateMap.anchor_map,null,true);
      bool_return = false;
    }
    return bool_return;
  };
  //End changeAnchorPart
  
  //Begin toggleChate
  /*
   * @attr do_extend, callback
   * @true スライダーは格納されている
   * @false スライダーは拡大されている
   */
  toggleChat = function(do_extend, callback) {
    var
      px_chat_ht = jqueryMap.$chat.height(),
      is_open = px_chat_ht === configMap.chat_extend_height,
      is_closed = px_chat_ht === configMap.chat_retract_height,
      is_sliding = !is_open && !is_closed;

    if (is_sliding) return false;

    if (do_extend) {
      jqueryMap.$chat.animate(
        {height : configMap.chat_extend_height},
        configMap.chat_extend_time,
        function() {
          jqueryMap.$chat.attr(
            'title', configMap.chat_extended_title
          );
          stateMap.is_chat_retracted = false;
          if (callback) callback(jqueryMap.$chat);
        }
      );
      return true;
    }
    
    jqueryMap.$chat.animate(
      {height : configMap.chat_retract_height},
      configMap.chat_retract_time,
      function(){
        jqueryMap.$chat.attr(
          'title',configMap.chat_retracted_title
        );
        stateMap.is_chat_retracted = true;
        if(callback){callback(jqueryMap.$chat);}
      }
    );
    return true;
  };
  //End toggleChat

  /*
   * イベントハンドラ
   * 
   */
  //Begin onHashchange
  onHashchange = function(event){
    var
      anchor_map_previous = copyAnchorMap(),
      anchor_map_proposed,
      _s_chat_previous, _s_chat_proposed, s_chat_proposed;
    try{ anchor_map_proposed = $.uriAnchor.makeAnchorMap();}
    catch(error){
      $.uriAnchor.setAnchor(anchor_map_previous, null, true);
      return false;
    }
    stateMap.anchor_map = anchor_map_proposed;
    
    _s_chat_previous = anchor_map_previous._s_chat;
    _s_chat_proposed = anchor_map_proposed._s_chat;
    
    if(!anchor_map_previous || _s_chat_previous !== _s_chat_proposed){
      s_chat_proposed = anchor_map_proposed.chat;
      switch(s_chat_proposed){
      case 'open':
        toggleChat(true);
        break;
      case 'closed':
        toggleChat(false);
        break;
      default:
        toggleChat(false);
        delete anchor_map_proposed.chat;
        $.uriAnchor.setAnchor(anchor_map_proposed,null,null);
      }
    }
    return false;
  }
  //End onHashchange
  
  onClickChat = function (event){
     changeAnchorPart({
       chat: (stateMap.is_chat_retracted ? 'open' : 'closed')
     }) ;
    return false;
  }

  /*
   * パブリックメソッド
   * 
   */
  
  //Begin initModule
  initModule = function($container) {
    stateMap.$container = $container;
    $container.html(configMap.main_html);
    setJqueryMap();
    
//TODO 削除    
//    setTimeout(function(){toggleChat(true);},3000);
//    setTimeout(function(){toggleChat(false);},3000);
    stateMap.is_chat_retracted = true;
    jqueryMap.$chat
      .attr('title', configMap.chat_retracted_title)
      .click(onClickChat);
    //uriAnchorの初期値の読み込み
    $.uriAnchor.configModule({
      schema_map : configMap.anchor_shema_ma
    });
    $(window).bind('hashchange',onHashchange).trigger('hashchange');
  }
  //End initModule
  
 

  // パブリックメソッドのエクスポート
  return {
    initModule : initModule
  };

}());
