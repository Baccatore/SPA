/**
 * 
 *  spa.util_b.js
 *  ブラウザ共有ユーティリティモジュール 
 * @author Yuichiro SUGA
 * @since 2015/11/26
 * MITライセンス
 */

/*
 * jslint
 * browser : true,  continue  : true,   devel  : true,
 * idndent : 2,     maxerr    : 50,     newcap : true,
 * nomen   : true,  plusplus  : true,   regexp : true,
 * sloppy  :true,   vars      : false,  white : true
 */

/* global $, spa */
spa.util_b = (function() {
  'use stract';
  //--Module Scope Variables BEGIN-------------------------------------------
  var
    //Configuration properties mapping
    configMap = {
      regex_encode_html   : /[&"'><]/g,
      regex_encode_noamp  : /["'><]/g,
      html_encode_map : {
        '&' : '&#38;',
        '"' : '&#34;',
        "'" : '&#39;',
        '>' : '&#62;',
        '<' : '&#60;',
      },
    },
    decodeHtml, encodeHtml, getEmSize
  ;

  configMap.encode_noamp_map = $.extend( {}, configMap.html_encode_map );
  delete configMap.encode_noamp_map['&'];
  //--Module Scope Variables END---------------------------------------------

  //--Public Method BEGIN----------------------------------------------------
  /**
   * decodeHtml
   * Decode HTML entities in the appropriate way for web browsers.
   */
  decodeHtml = function () {
    return $('<div/>').html(str || '').text();
  };
  
  /**
   * encodeHtml
   * Encode characters to HTML entities as one-way pass coder.  Available for
   * any number of character.
   */
  encode = function (input_arg_str, exclude_amp) {
    var 
      intput_str = String( input_arg_str), //XXX　このinput_strは何に使われているのか？
      regex, lookup_map
    ;
    if ( exclude_map ) {
      lookup_map = configMap.encode_noamp_map;
      regex = configMap.regex_encode_noamp;
    } else {
      lookup_map = configMap.html_encode_map;
      regex = configMap.regex_encode_html;
    }
    
    return input_str.replace(
        regex,
        function ( match, name ){
          return lookup_map[ match ]|| '';
        }
    );
  };
  
  /**
   * getEmSize
   * Return the size of 'em' in 'px'.
   */
  getEmSize = function ( elem ) {
    return Number(
      getComputedStyle( elem, '' ).fontSize.match(/\d*\.?\d*/)[0]
    );
  };
  //--Public Method END------------------------------------------------------

  /**
   * Export of Public Methods 
   */
  return {
    decodeHtml  : decodeHtml,
    encodeHtml  : encodeHtml,
    getEmSize   : getEmSize
  };
}());
