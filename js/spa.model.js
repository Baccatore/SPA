/**
 * 
 *  spa.model.js
 *  SPAのモデルモジュール 
 * @author Yuichiro SUGA
 * @since 18/11/2015
 */

/*
 * peopleオブジェクトAPI
 * ------------------
 * peopleオブジェクトはspa.model.peopleで利用できる。
 * peopleオブジェクトはpersonオブジェクトの集合を管理するためのメソッドと
 * イベントを提供する。peopleオブジェクトの集合を管理するためのメソッドと
 * イベントを提供する。
 * 
 * peopleオブジェクトのパブリックメソッドが以下の通り。
 * * get_user() - 現在のpersonオブジェクトを返す。
 * * get_db()   - あらかじめソートされたすべてのpersonオブジェクトの
 *                TaffyDBデータベースを返す。
 * * get_by_cif( <client_id> ) 
 *              - 指定された一意のIDを持つpersonオブジェクトを返す。
 * * login( <client_id> )
 *              - 指定されたユーザ名を持つユーザとしてログインする。
 * * logout()   - 現在のユーザオブジェクトを匿名に戻す。
 * 
 *  このオブジェクトが発行するjQueryグローバルイベントには以下が含まれる。
 *  * 'spa-login'  - ユーザがログイン処理を完了した時に発行。更新された
 *                   ユーザオブジェクトをデータとし提供する。
 *  * 'spa-logout' - ログアウト完了時に発行。以前のユーザオブジェクトを
 *                   データとして提供する。
 * 
 * それぞれのpersonはオブジェクトで表される。
 * personオブジェクトが提供するメソッドは以下の通り。
 * * get_is_user() - オブジェクトとが現在のユーザの場合にtrueを返す。
 * * get_is_an0n() - オブジェクトが匿名の場合にtrueを返す。
 * 
 * personオブジェクトのproperty
 * * cid     - クライアントID文字列。これは常に定義され、クライアントデ
 *             ータがバックエンドと同期していない場合のみidプロパティと
 *             異なる。
 * * id      - 一意のID。オブジェクトがあっ区エンドと同期していない場合
 *             には未定義になっていることがある。
 * * name    - ユーザの文字列名
 * * css_map - アバター表現に使う属性マップ。 
 */



/*
 * jslint
 * browser : true,  continue  : true,   devel  : true,
 * idndent : 2,     maxerr    : 50,     newcap : true,
 * nomen   : true,  plusplus  : true,   regexp : true,
 * sloppy  : true,   vars      : false,  white : true
 */

/* global TAFFY, $, spa */

spa.model = (function() {
  'use strict';
  //--Module Scope Variables BEGIN-------------------------------------------
  var
    //Configuration properties mapping
    configMap = {
      anon_id : 'a0'
    },
    
    //State properties mapping
    stateMap = {
      anon_user       : null,
      cid_serial      : 0,
      people_cid_map  : {},
      people_db       : TAFFY(),
      use             : null
    },
    
    //Flag for data flow control
    isFakeData = true,
    
    //Loclal method and object
    makeCid,      completeLogin,  clearPeopleDb,
    personProto,  makePerson,     removePerson,
    
    //Exported method and object
    people,       initModule
  ;
  //--Module Scope Variables END---------------------------------------------

  //--Utilities Method BEGIN-------------------------------------------------
  /**
   * makeCid
   */
  makeCid = function () {
    return 'c' +String( stateMap.cid_serial++ );
  };
  
  
  /**
   * clearPeopleDb
   */
  clearPeopleDb = function () {
    var user = stateMap.user;
    stateMap.people_db = TAFFY();
    stateMap.people_cid_map = {};
    if ( user ) {
      stateMap.people_db.insert( user );
      stateMap.people_cid_map[ user.cid ] = user;
    };
  }
  
  /**
   * completeLogin
   */
  completeLogin = function ( user_list ) {
    var user_map = user_list[ 0 ];
    delete stateMap.people_cid_map[ user_map.cid ];
    stateMap.user.cid     = user_map._id;
    stateMap.user.id      = user_map._id;
    stateMap.user.css_mao = user_map.css_map;
    stateMap.people_cid_map[ user_map._id ] = stateMap.user;
    
    //should do it when join it to chat
    $.gevent.publish( 'spa-login', [stateMap.user] );
  };
  
  
  /**
   * personProto
   * @prototype
   */
  personProto = {
    get_is_user : function () {
      return this.cid === stateMap.user.cid;
    },
    get_is_anon : function () {
      return this.cid === stateMap.anon_user.cid;
    }
  };
  
  /**
   * makePerson
   * @constructor
   */
  makePerson = function ( person_map ) {
    var person,
      cid     = person_map.cid,
      css_map = person_map.css_map,
      id      = person_map.id,
      name    = person_map.name
    ;
    
    if ( cid == undefined || ! name ) {
      throw 'client id and name required';
    }
    person         = Object.create( personProto );
    person.cid     = cid;
    person.name    = name;
    person.css_map = css_map;
    if ( id ) { person.id = id; }
    stateMap.people_cid_map[ cid ] = person;
    stateMap.people_db.insert( person );
    return person;
  };
  
  /**
   * removePerson
   */
  removePerson = function (person) {
    if ( ! person ) { return false; }
    
    //Cannot remove anonymous user 
    if ( person.id === configMap.anon_id ) { return false; }
    
    stateMap.people_db({ cid : person.cid }).remove();
    if ( person.cid ) {
      delete stateMap.people_cid_map[ person.cid ];
    }
    return true;
  };
  //--Utilities Method END---------------------------------------------------
  
  //--Public Method BEGIN----------------------------------------------------
  /**
   * people object
   * closure
   */
  people = (function () {
    var get_by_cid, get_db, get_user, login, logout;
    
    get_by_cid = function ( cid ) {
      return stateMap.people_cid_map [ cid ];
    };
    
    get_db = function () { return stateMap.people_db; };
    
    get_user = function () { return stateMap.user; };
    
    login = function ( name ) {
      var sio = isFakeData ?spa.fake.mockSio : spa.data.Sio();
      stateMap.user = makePerson({
        cid     : makeCid(),
        css_map : { top : 25, left : 25, 'backgroun-color' : '#8f8' },
        name    : name
      });
      sio.on( 'userupdate', completeLogin );
      sio.emit( 'adduser', {
        cid     : stateMap.user.cid,
        css_map : stateMap.user.css_map,
        name    : stateMap.user.name
      });
    } 
    
    logout = function () {
      var is_removed, user = stateMap.user;
      
      is_removed = removePerson( user );
      stateMap.user = stateMap.anon_user;
      $.gevent.publish( 'spa-logout', [ user ] );
      return is_removed;
      
    }
    
    return {
      get_by_cid  : get_by_cid,
      get_db      : get_db,
      get_user    : get_user,
      login       : login,
      logout      : logout
    }
  }());
  /**
   * initModule
   * @purpose Initialiser of this model
   * @throws nothing
   */
  initModule = function() {
    var i, people_list, person_map;
    
    //Initialise unknown users
    stateMap.anon_user = makePerson({
      cid  : configMap.anon_id,
      id   : configMap.anon_id,
      name : 'anonymous'
    });
    stateMap.user = stateMap.anon_user;
    if ( isFakeData ) {
      people_list = spa.fake.getPeopleList();
      for ( i = 0; i < people_list.length; i++ ) {
        person_map = people_list[ i ];
        makePerson({
          cid     : person_map._id,
          css_map : person_map.css_map,
          id      : person_map._id,
          name    : person_map.name
        });
      }
    }
  };
  //--Public Method END------------------------------------------------------

  /**
   * Export of Public Methods 
   * @export
   */
  return {
    initModule  : initModule,
    people      : people
  };
}());
