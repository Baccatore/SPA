/**
 * 
 *  spa.fake.js
 *  フェイクモジュール 
 * @author Yuichiro SUGA
 * @since 
 */

/*
 * jslint
 * browser : true,  continue  : true,   devel  : true,
 * idndent : 2,     maxerr    : 50,     newcap : true,
 * nomen   : true,  plusplus  : true,   regexp : true,
 * sloppy  :true,   vars      : false,  white : true
 */

/* global $, saa */
spa.fake = (function() {
  'use strict';
  //--Module Scope Variables BEGIN-------------------------------------------
  var getPeopleList;
  
  getPeopleList = function () {
    return [
            {
              name : 'ゆういちろう', _id : 'id_01',
              css_map : {
                top  : 20,
                left : 20,
                'background-color' : 'rgb( 128, 128, 128 )'
              }
            },
            {
              name : 'まひろ', _id : 'id_02',
              css_map : {
                top  : 60,
                left : 20,
                'background-color' : 'rgb( 128, 255, 128 )'
              }
            },
            {
              name : 'のり', _id : 'id_03',
              css_map : {
                top  : 100,
                left : 20,
                'background-color' : 'rgb( 128, 192, 192 )'
              }
            },
            {
              name : 'ゆうだい', _id : 'id_04',
              css_map : {
                top  : 120,
                left : 20,
                'background-color' : 'rgb( 192, 128, 128 )'
              }
            }
            ];
  };
  
  return { getPeopleList : getPeopleList };
}());
