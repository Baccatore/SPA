/**
 * slider.js
 * 1章のコード
 */
    /*モジュールスコープ変数
     * すべての変数を使用する前に宣言する。
     * モジュールの構成値はconfigMap
     * 状態地はstateMapに格納する
     * 文字列など、具体的な値はXMLなどで別で作成したほうが
     * 管理しやすいのではないか?
     */
    var
      configMap = {
      	  extended_height : 434,
    	  extended_title : 'Click to retract',
    	  retracted_height : 16,
    	  retracted_title : 'Click to extend',
    	  template_html : '<div class="spq-slider"></div>'
       },
       //その他
       $charSlider,
       toggleSlider, onClickSlider, initModule;
    
    /*DOMメソッド
     * すべてのドキュメントオブジェクトモデル操作メソッドをこのセクションにまとめる
     */
    //スライダーの高さの切り替え
    toggkeSlider = function(){
	var slider_height = $charSlider.height();
	
	if(slider_height === configMap.retracted_height){
	    $chatSlider
	      .animate({ height : configMap.extednded_height})
	      .attr('title',config.extended_title);
	    return true;
	} else if(slider_height == configMap.extended_height){
	    $chatSlider
	      .animate({ height : configMap.retracted_height})
	      .attr('title',config.retracted_title);
	    return true;
	}
	//スライダーが移行中の間は何もしない
	return false;
    }
    
    /*イベントハンドラ
     * すべてのイベントハンドラをこのセクションにまとめる。
     * ハンドラは小規模で集中的にするようにするのがよい。
     * ハンドラは他のメソッドを呼び出し、表示の更新やビジネスロジックの調整を行う。
     */
    onClickSlider = function ( event ){
	toggleSlider();
	return false;
    };
