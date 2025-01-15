$(function(){
	var timer = false;
	var winW = 0;
	var spW = 768;
	var spMinH = 350;
	var pcMinH = 650;
	//ロード時
	$(window).load(function() {
		//画面表示時の幅を変数に保持
		winW = window.innerWidth ? window.innerWidth: $(window).width();
		spAction();
	});

	//リサイズ時
	$(window).resize(function() {
		if (timer !== false) {
			clearTimeout(timer);
		}
		timer = setTimeout(function() {
			//幅が変わっているかチェック
			rewinW = window.innerWidth ? window.innerWidth: $(window).width();
			if(rewinW != winW){
			// 幅変更後に行う処理
				//幅再設定
				winW = window.innerWidth ? window.innerWidth: $(window).width();
				spAction();
			}
		}, 500);//.resize();//200だとiPhoneで正確に全画面できない（ちょっと切れる）
	});
	function spAction(){
		var slideC = $( ".slideContents" );
		slideC.each(function () {
			var slideC = $(this),
			slideArea = $( ".slideArea" ,slideC ),
			slideList = $( ".slide", slideArea );
			var slideAreaW = slideArea.innerWidth(),
			slideListW = slideList.innerWidth(),
			scrollW = slideListW - slideAreaW;//多分外側の余白部分が計算されない
			
			$(".slider",slideC).slider({
				animate: false,
				max:100, //最大値
				min: 0, //最小値
				//value: 0, //初期値
				step: 0.01, //幅
				
				slide: function( event, ui ) {
					var scrollvalue = scrollW * (ui.value/100);
					slideArea.stop().animate({scrollLeft: scrollvalue},10);
					slideArea.find('.scroll').addClass('hide');
				}
			});

			//スクロール⇒スライドバー連動
			slideArea.on('scroll', function() {
				var slideCurrent = slideArea.scrollLeft(),
				slideCurrentP = slideCurrent/scrollW * 100;
				$(".slider",slideC).slider('value', slideCurrentP);
				slideArea.find('.scroll').addClass('hide');
				//console.log('value');
			});
		});
	}



	var param = new URLSearchParams(window.location.search);
	var p = param.get('p');
	var url = '';

	switch(p) {
		case 'fb':
			url = 'https://dental-fitness.jp/p/r/ta0GbQgT?ref=di';
			break;
		case 'rl':
			url = 'https://dental-fitness.jp/p/r/ta0GbQgT?ref=mlp';
			break;
		case 'ptr':
			url = 'https://dental-fitness.jp/p/r/ta0GbQgT?ref=re';
			break;
		case 'soe':
			url = 'https://dental-fitness.jp/p/r/mBmbLf7b';
			break;
		default:
			url = 'https://dental-fitness.jp/p/r/ta0GbQgT?ref=we'; // デフォルトのURLを設定します
			break;
	}

	$('.paramLink').attr('href', url);
});