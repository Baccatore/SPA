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
      people_cid_map  : {},
      people_db       : TAFFY()
    },
    isFakeData = true,
    personProto, makePerson, people,
    /*configModule,*/ initModule
  ;
  //--Module Scope Variables END---------------------------------------------

  //--Utilities Method BEGIN-------------------------------------------------
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
  //--Utilities Method END---------------------------------------------------
  
  //--Public Method BEGIN----------------------------------------------------
  /**
   * people object
   */
  people = {
    get_db      : function () { return stateMap.people_db; },
    get_cid_map : function () { return stateMap.people_cid_map; }
  };
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
