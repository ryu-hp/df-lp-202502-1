/*=============================
スマホ振り分け
=============================*/
/*デバイス別にbodyタグにクラス付け*/
var agent = navigator.userAgent;
var userAgent = window.navigator.userAgent.toLowerCase();
$(function(){
	//loading();
	setOperate();
	LenisScroll();

});

/*=============================
imagesloaded
追加<script src="https://unpkg.com/imagesloaded@4/imagesloaded.pkgd.min.js"></script>
=============================*/
function loading(){
	const progressBar = document.querySelector('#loadArea .loadpBar')
	const progressNumber = document.querySelector('#loadArea .loadPer')
	
	const imgLoad = imagesLoaded('body');//body内の画像を監視
	const imgTotal = imgLoad.images.length;//画像の総数を取得
	console.log(imgTotal);
	
	let imgLoaded = 0;//ロードした画像カウント
	let progressSpeed = 1;//プログレスバーの進むスピード 大きいほど速くなる
	let progressCount = 0;//ローディングの進捗状況 0〜100
	let progressResult = 0;//ローディングの進捗状況 0〜100
	
	//読み込み状況をアップデート
	let progressInit = setInterval(function () {
		updateProgress();
	}, 25);
	
	//画像を一つロードするたびにimgLoadedのカウントをアップ
	imgLoad.on('progress', function (instance, image) {
		imgLoaded++
	})
	
	//読み込み状況アップデート関数
	function updateProgress() {
		//ローディング演出用の計算
		progressCount += (imgLoaded / imgTotal) * progressSpeed;
		
		if(progressCount >= 100 && imgTotal > imgLoaded) {
			//カウントは100以上だが画像の読み込みが終わってない
			progressResult = 99;
		} else if(progressCount > 99.9) {
			//カウントが100以上になった
			progressResult = 100;
		} else {
			//現在のカウント
			progressResult = progressCount;
		}
		
		//ローディング進捗状況をプログレスバーと数字で表示
		progressBar.style.width = progressResult + '%';
		progressNumber.innerText = Math.floor(progressResult);
		
		//ローディング完了後 0.8秒待ってページを表示
		if (progressResult >= 100 && imgTotal == imgLoaded) {
			clearInterval(progressInit);
			setTimeout(function () {
				document.querySelector('body').classList.add('is-loaded');
			}, 250);
		}
	}
}


function setOperate(){
	setView();
	$('body').attr({ 'ontouchstart': '' });
	if (agent.search(/Android/) != -1 || agent.search(/iPhone/) != -1 || agent.search(/iPad/) != -1 || userAgent.indexOf('macintosh') > -1 && 'ontouchend' in document) {
		$("body").addClass("mobile");
		if (agent.search(/iPhone/) != -1 || agent.search(/iPad/) != -1 || userAgent.indexOf('macintosh') > -1 && 'ontouchend' in document) {
			$("body").addClass("iOS");
			window.onorientationchange = setView;
			if (agent.search(/iPhone/) != -1) {
				$("body").addClass("iPhone");
			} else if (agent.search(/iPad/) || userAgent.indexOf('macintosh') > -1 && 'ontouchend' in document) {
				$("body").addClass("iPad");
			}
		} else if (agent.search(/Android/) != -1) {
			$("body").addClass("Android");
			window.onresize = setView;
		}
	} else {
		if (agent.toLowerCase().indexOf('win') != -1) {
			// Windowsでの処理
			$("body").addClass("win");
			if (userAgent.indexOf('msie') != -1 || userAgent.indexOf('trident') != -1) {
				$("body").addClass("ie");
			} else if (userAgent.indexOf('edge') != -1 || userAgent.indexOf('edg') != -1) {
				$("body").addClass("edge");
			}
		} else if (agent.toLowerCase().indexOf('mac') != -1) {
			// Macでの処理
			$("body").addClass("mac");
		} else {
			$("body").addClass("other");
		}
		window.onorientationchange = setView;
	}
	/*
	モバイルには「body class="mobile"」追加
	モバイル且つiOSには「body class="mobile iOS"」追加
	モバイル且つiOSでiPhone又はiPadには「body class="mobile iOS iPad_or_iPhone"」追加
	モバイル且つAndroidには「body class="mobile Android"」追加
	PCには「body class="other"」追加
	PC且つFirefoxには「body class="other firefox"」追加
	*/
}

function setView(){
	var orientation = window.orientation;
	if(orientation === 0){
		$("body").addClass("portrait"); //画面が縦向きの場合は「body class="portrait"」追加
		$("body").removeClass("landscape"); //画面が縦向きの場合は「body class="landscape"」削除
	}else{
		$("body").addClass("landscape"); //画面が横向きの場合は「body class="landscape"」追加
		$("body").removeClass("portrait"); //画面が横向きの場合は「body class="portrait"」削除
	}
}

/*=============================
Lenis慣性スクロール
=============================*/
function LenisScroll(){
	const lenis = new Lenis();
	function raf(time) {
		lenis.raf(time);
		requestAnimationFrame(raf);
	}
	requestAnimationFrame(raf);
}

/*=============================
iPhone scroll lock
androidはoverflowで可能
=============================*/
function movefun(e) { e.preventDefault(); }

function scLock(key) {
	//単純なロック scLock('lock'); で切り分け
	if (key == 'lock') {
		$('html').addClass('lock');
		if (agent.search(/iPhone/) != -1 || agent.search(/iPad/) != -1) {
			document.addEventListener('touchmove', movefun, { passive: false });
		}
		return true;
	}
	if (key == 'unlock') {
		$('html').removeClass('lock');
		if (agent.search(/iPhone/) != -1 || agent.search(/iPad/) != -1) {
			document.removeEventListener('touchmove', movefun, { passive: false });
		}
		return true;
	}
}

//iPhoneのoverflow問題に対応
//gnav内の上と下に到達したとき、touchmoveでスクロールロック、即1pxずらす
//-webkit-overflow-scrolling: touch;を使うと安定動作せず
//縦横でスクロールが発生する際は単独使用
function togglemodal() {
	if (agent.search(/iPhone/) != -1 || agent.search(/iPad/) != -1) {
		var elem = document.getElementById('gnav');
		elem.addEventListener('touchmove', function (e) {
			var scroll = elem.scrollTop;
			var range = elem.scrollHeight - elem.offsetHeight - 1;
			if (scroll < 1) {
				movefun;
				elem.scrollTop = 1;
			} else if (scroll > range) {
				movefun;
				elem.scrollTop = range;
			}
		});
	}
}
function togglefw() {
	if (agent.search(/iPhone/) != -1 || agent.search(/iPad/) != -1) {
		const targets = document.getElementsByClassName('fw');
		for (let i = 0; i < targets.length; i++) {
			targets[i].addEventListener('touchmove', function (e) {
				var scroll = targets[i].scrollTop;
				var range = targets[i].scrollHeight - targets[i].offsetHeight - 1;
				if (scroll < 1) {
					movefun;
					targets[i].scrollTop = 1;
				} else if (scroll > range) {
					movefun;
					targets[i].scrollTop = range;
				}
			}, false);
		}
	}
}
//iPhoneのoverflow問題に対応
//縦でスクロールロック、横でtogglemodalスクロール制限
function oriFun() {
	//画面の向きでロック振り分け
	var orientation = window.orientation;
	if (orientation === 0) {
		//画面が縦向きの
		document.addEventListener('touchmove', movefun, { passive: false });
		//alert('oriFun縦だよ');
	} else {
		//画面が横向き
		togglemodal();
		//document.removeEventListener('touchmove', movefun, { passive: false });
		//alert('oriFun横だよ');
	}
}
function gnscLock() {
	//ハンバーガー展開でのメニューロック（スマホ回転動作込み）
	if (agent.search(/iPhone/) != -1 || agent.search(/iPad/) != -1) {
		if ($('html').hasClass('lock')) {
			// スクロール停止の処理
			oriFun();
			$(window).on("orientationchange", function () { oriFun(); });
			//alert('lock');
		} else {
			// スクロール停止することを停止する処理
			document.removeEventListener('touchmove', movefun, { passive: false });
			$(window).off("orientationchange");
			//alert('nolock');
		}
	}
}
/*=============================
gnav gnavBt fw
=============================*/
//keyframesのスタートと終了イベント取得
var navElm = $('nav#gnav');
var fwElm = '.fw';
var aniStartEvt = 'animationstart webkitAnimationStart MSAnimationStart oAnimationStart',
	aniEndEvt = 'animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd',
	hasAniEvt = 'AnimationEvent' in window;//使えれば true 使えなければ false が返る

if(hasAniEvt){
	$('#gnavBt a').click(function(){
		if ($(this).hasClass('open')) {
			$(this).removeClass();
			$('html').removeClass('lock');
			//gnscLock();
			navElm.off(aniEndEvt).removeClass().addClass('closing').one(aniEndEvt, function(){
				navElm.removeClass().addClass('closed');
			});
		} else {
			$(this).addClass('open');
			$('html').addClass('lock');
			//gnscLock();
			togglemodal();//SP縦横でグロナビスクロールが必要な場合
			navElm.off(aniEndEvt).removeClass().addClass('opening').one(aniEndEvt, function(){
				navElm.removeClass().addClass('opened');
			});
			const modal = document.querySelector('#gnav')
			modal.addEventListener('wheel',(e)=>{
				e.stopPropagation()
			})
		}
		return false;
	});

	//SP用グロナビClose
	/*$('#gmenu a').click(function () {
		$('#gnavBt a').removeClass();
		$('html').removeClass('lock');
		//gnscLock();
		navElm.off(aniEndEvt).removeClass().addClass('closing').one(aniEndEvt, function () {
			navElm.removeClass().addClass('closed');
		});
	});
	*/
	
	//fw
	function fwOpen(fwelmID){
		if (!$(fwelmID).hasClass('current')){
			if ($(fwElm).hasClass('current')) {
				var fwcID = '#' + $(fwElm + '.current').attr("id");
				if ($('#gnavBt a').hasClass('open')) {
					$('#gnavBt a').removeClass();
					navElm.off(aniEndEvt).removeClass().addClass('closing').one(aniEndEvt, function () {
						navElm.removeClass().addClass('closed');
					});
					$.when(
						$(fwcID).off(aniEndEvt).removeClass('opened').addClass('closing').one(aniEndEvt, function (event) {
							$(fwcID).removeClass('closing opened').addClass('closed');
							event.stopPropagation();
						})
					).done(function () {
						//gnscLock();
						togglefw();//SP縦横でグロナビスクロールが必要な場合
						//var fwID = $(this).attr("href");
						$(fwelmID).off(aniEndEvt).removeClass('closed').addClass('opening').one(aniEndEvt, function (event) {
							$(fwelmID).removeClass('opening closed').addClass('opened');
							event.stopPropagation();//親要素に伝搬させない→コールバックで親にkeyframes使うときは重要
						})
						$(fwcID).removeClass('current');
						$(fwelmID).addClass('current');
					});
				} else {
					$.when(
						$(fwcID).off(aniEndEvt).removeClass('opened').addClass('closing').one(aniEndEvt, function (event) {
							$(fwcID).removeClass('closing opened').addClass('closed');
							event.stopPropagation();
						})
					).done(function () {
						//gnscLock();
						togglefw();//SP縦横でグロナビスクロールが必要な場合
						//var fwelmID = $(this).attr("href");
						$(fwelmID).off(aniEndEvt).removeClass('closed').addClass('opening').one(aniEndEvt, function (event) {
							$(fwelmID).removeClass('opening closed').addClass('opened');
							event.stopPropagation();//親要素に伝搬させない→コールバックで親にkeyframes使うときは重要
						})
						$(fwcID).removeClass('current');
						$(fwelmID).addClass('current');
					});
				}
			} else {
				if ($('#gnavBt a').hasClass('open')) {
					$('#gnavBt a').removeClass();
					navElm.off(aniEndEvt).removeClass().addClass('closing').one(aniEndEvt, function () {
						navElm.removeClass().addClass('closed');
					});
				}
				$(fwelmID).addClass('current');
				$('html').addClass('lock');
				togglefw();//SP縦横でグロナビスクロールが必要な場合
				//var fwelmID = $(this).attr("href");
				$(fwelmID).off(aniEndEvt).removeClass('closed').addClass('opening').one(aniEndEvt, function (event) {
					$(fwelmID).removeClass('opening closed').addClass('opened');
					event.stopPropagation();//親要素に伝搬させない→コールバックで親にkeyframes使うときは重要
				});
				const modal = document.querySelector(fwelmID)
				modal.addEventListener('wheel',(e)=>{
					e.stopPropagation()
				})
			}
		}
	}

	//外部からfwさせる
	var url = location.href;
	if (url.indexOf("?fw=") == -1) {
		// スムーズスクロール以外の処理（必要なら）
	}else{
		var url_sp = url.split("?fw=");
		var fwID   = '#' + url_sp[url_sp.length - 1];
		fwOpen(fwID);
	}

	$('.fw_bt').on('click',function () {
		if(!($(this).parents().hasClass('yokoSc'))){
			var fwID = $(this).attr("href");
			fwOpen(fwID);
			return false;
		}
	});
	$('.fw_close a, .fw_bg').click(function () {
		var fwcID = '#' + $(fwElm + '.current').attr("id");
		$('html').removeClass('lock');
		$(fwcID).removeClass('current');
		//gnscLock();
		$(fwcID).off(aniEndEvt).removeClass('opened').addClass('closing').one(aniEndEvt, function (event) {
			$(fwcID).removeClass('closing opened').addClass('closed');
			event.stopPropagation();
		});
		return false;
	});
	if ($('.fw_start').length) {
		$(window).on("load", function () {
			var fwID = '#' + $('.fw_start').attr("id");
			$('.fw_start').addClass('current');
			$('html').addClass('lock');
			togglefw();//SP縦横でグロナビスクロールが必要な場合
			//var fwID = $(this).attr("href");
			$(fwID).off(aniEndEvt).removeClass('closed').addClass('opening').one(aniEndEvt, function (event) {
				$(fwID).removeClass('opening closed').addClass('opened');
				event.stopPropagation();//親要素に伝搬させない→コールバックで親にkeyframes使うときは重要
			});
		});
	}
	/*$('.fw_bt').click(function () {
		$('html').addClass('lock');
		//gnscLock();
		togglefw();//SP縦横でグロナビスクロールが必要な場合
		var fwID = $(this).attr("href");
		$(fwID).off(aniEndEvt).removeClass('closed').addClass('opening').one(aniEndEvt, function (event) {
			$(fwID).removeClass('opening closed').addClass('opened');
			event.stopPropagation();//親要素に伝搬させない→コールバックで親にkeyframes使うときは重要
		});
		return false;
	});

	$('.fw_close, .fw_bg').click(function () {
		$('html').removeClass('lock');
		//gnscLock();
		fwElm.off(aniEndEvt).removeClass('opened').addClass('closing').one(aniEndEvt, function (event) {
			fwElm.removeClass('closing opened').addClass('closed');
			event.stopPropagation();
		});
		return false;
	});*/
}


/*=============================
ドラッグ横スクロール jquery-ui
=============================*/
let is_drag = false;

$(".yokoSc").on('mousedown', function() {
	is_drag = false;
});

$(".yokoSc").on('mouseup mouseleave', function() {
	if (is_drag === true) {
		//ドラッグ中offでclick無効化、onのpreventDefault、return falseでリンク無効化
		$(this).find('a').off().on('click', function(e) {e.preventDefault(); return false;});
		is_drag = false;
	} else {
		//ドラッグ中以外
		$(this).find('a').off();
		//fwを展開
		if($(this).find('a').hasClass('fw_bt')){
			$(this).find('a.fw_bt').on('click', function(e) {
				var fwID = $(this).attr("href");
				fwOpen(fwID);
				return false;
			});
		}
		
	}
});

$(".yokoSc").on('mousemove', function() {
	is_drag = true;
	$(this).customDraggable();
});

$.prototype.customDraggable = function() {
	var t;
	$(this).each(function(i,e) {
		$(e).mousedown(function(e2) {
			e2.preventDefault();
			t = $(e);
			$(e).data({
				down: true,
				x: e2.clientX,
				y: e2.clientY,
				left: $(e).scrollLeft(),
				top: $(e).scrollTop()
			});
		});
	});
	$(document).mousemove(function(e) {
		if($(t).data("down")) {
			e.preventDefault();
			$(t).scrollLeft($(t).data("x")+$(t).data("left")-e.clientX);
			$(t).scrollTop($(t).data("y")+$(t).data("top")-e.clientY);
		}
	})
	.mouseup(function(e) {
		$(t).data("down", false);
	});

	$('.droppable').droppable({
		drop: function () {
			handleDropEvent();
			removelink($(this).find('a'))
		},
		accept: function(e){
			if(e.hasClass('draggable')) {
				if (!$(this).hasClass('occupied')){return true; }
			}}
	});
	function removelink(obj) {
		obj.removeAttr('href');
	}
};

/*=============================
リサイズ（X方向のみ検知）
スマホ回転時の上下画面リサイズを回避
=============================*/
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
		//var winH = window.innerHeight ? window.innerHeight: $(window).height();
		//var mainH = winH - $('header').height();//header固定の場合
		//var newCss = {height: winH}; svhで対応可能
		//$('.fullH').css( newCss );

		if(winW < spW){
			//hover解除
			$('.hoge').off('mouseenter mouseleave');//これでhover解除できる
			//click解除
			$('.hoge > a').off("click");
			//style削除
			$('.hoge').removeAttr('style');

			/*aTel
			=============================*/
			$('a.aTel').off('click',function () { return false; });

			var offsH = 0;
		} else {
			/*aTel
			=============================*/
			$('a.aTel').on('click',function () { return false; });

			var offsH = 0;
		}
		
		$('a.aTel').on('click',function () { return false; });
		/*スムーススクロール　jquery.smooth-scroll.min.js
		=============================*/
		$('a.sSc').smoothScroll({
			offset: offsH,
			easing: 'easeOutQuart',
			speed: 1000
		});
		/*$('').smoothScroll({
			offset: -150,
			easing: 'easeOutQuart',
			speed: 1000
			direction: 'top',
			scrollTarget: null,
			beforeScroll: function() {},
			afterScroll: function() {},
			easing: 'swing',
			speed: 400,
			autoCoefficient: 2,
			preventDefault: true
		});
		Git：https://github.com/kswedberg/jquery-smooth-scroll*/

		//外部ページへのスムーズスクロール リンクは?id=XXX
		//var url = jQuery(location).attr('href');IE7でエラー
		var url = location.href;
		if (url.indexOf("?id=") == -1) {
			// スムーズスクロール以外の処理（必要なら）
		}else{
			// スムーズスクロールの処理
			setScroll();
		}
		function setScroll(){
			var offs = offsH;
			var url_sp = url.split("?id=");
			var hash   = '#' + url_sp[url_sp.length - 1];
			var tgt    = $(hash);
			var pos    = tgt.offset().top - offs;
			$('html, body').firstScrollable().animate({scrollTop: pos}, 1000, 'easeOutQuart');
		}

		/*複数Var
		var url = location.search;
		if (url) {
			params = url.split("?");
			spparams = params[1].split("&");
			var paramArray = [];
			for (i = 0; i < spparams.length; i++) {
				vol = spparams[i].split("=");
				paramArray.push(vol[0]);
				paramArray[vol[0]] = vol[1];
			}
		}
		function setScroll() {
			var offs = offsH;
			if (paramArray["id"]) {
				var url_sp = paramArray["id"];
				var hash = '#' + url_sp;
			}
			var tgt = $(hash);
			var pos = tgt.offset().top + offs;
			$('html, body').firstScrollable().animate({ scrollTop: pos }, 1000, 'easeOutQuart');
		}*/
	}


	/*noLink
	=============================*/
	$('.noLink a,a.noLink').click(function(){return false;});

	/*アコーディオン
	=============================*/
	$('.acBt').click(function () {
		var hitItem = $(this).next('.acc');
		if ($(this).hasClass('open')) {
			$(this).removeClass('open');
			hitItem.stop().removeClass('show').slideUp(250);
		} else {
			$(this).addClass('open');
			hitItem.stop().addClass('show').slideDown(250);
		}
		return false;
	});

	$('.acBt_pre').click(function () {
		var hitItem = $(this).parents().siblings('.acc');
		if ($(this).hasClass('open')) {
			$(this).removeClass('open');
			hitItem.stop().slideUp(250);
		} else {
			$(this).addClass('open');
			hitItem.stop().slideDown(250);
		}
		return false;
	});

});
