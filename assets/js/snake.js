$(function() {

  var snakeBody = jQuery('<div class="snakeBody">');

	var top = jQuery('#game_panel').position().top + 8;
	var left = jQuery('#game_panel').position().left + 8;

	var score = 0;
	var height = jQuery('#game_panel').css('height').replace('px', '')-16;
	var width = jQuery('#game_panel').css('width').replace('px', '') -16;

	console.log(height);
	console.log(width);

  var positionList = JSON.parse(localStorage.getItem('positionList') || "[]");

  var direction = JSON.parse(localStorage.getItem('direction')) || {
    horizontal: 1,
    vertical: 0
  };

	var high_score = JSON.parse(localStorage.getItem('high_score')) || 0;

	jQuery('#high_score').text(high_score);
	jQuery('#hhigh_score').text(high_score);

	var snake_length = 1;

	var game_is_over =0;

	var meal_position = {};

	wall_option =0;

	var stopGame = function (){
		positionList = [];
		game_is_over =1;

	}

	var gameOver = function(){
		console.log('game over');

		jQuery('#your_current_score').text(score);
		jQuery('#btnModal').click();
		stopGame();
	}

	var updateScore = function (){
		jQuery('#current_score').text(score);
		saveGameData();
	}

	var checkPosition = function(){
		for(var i = 2; i<snake_length; i++){
			if(positionList[0].top == positionList[i].top && positionList[0].left == positionList[i].left){
					gameOver();
			}
		}
	}

	var eatMeal = function() {
		jQuery('#game_panel').append(snakeBody.clone().css(positionList[0] || {}));
    snake_length++;
		score+=2;
		generateMeal();
		updateScore();
  }

  var generateMeal = function() {

		meal_position = {
			left : Math.floor(Math.random() * width / 15) * 15 + left,
	    top : Math.floor(Math.random() * height / 15) * 15 + top,
	    background : getRandomColor()
		}
    jQuery('#snake_meal').css(meal_position);
  }

  var getRandomColor = function() {
    var letters = '0123456789ABCDE';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 15)];
    }
    return color;
  }

  var getNextPosition = function(elem) {
    var position = {};
    //***
    direction.horizontal && (position.left = Number(jQuery(elem).css('left').replace('px', '')) + (direction.horizontal * 15));
    direction.vertical && (position.top = Number(jQuery(elem).css('top').replace('px', '')) + (direction.vertical * 15));

    if(wall_option == 1){
			position.top && ((position.top + 15> height + top && (position.top = top)) || (position.top < top && (position.top = height + top - 15)));
	    position.left && ((position.left + 15> width + left && (position.left = left)) || (position.left < left && (position.left = width + left -15)));
		}
		else{
			position.top && ((position.top + 15> height + top && (gameOver())) || (position.top < top && (gameOver())));
	    position.left && ((position.left + 15> width + left && (gameOver())) || (position.left < left && (gameOver())));
		}

    return position;
  };

  var elemaniGetir = function() {
    var targetArea = {
      top: Number(jQuery('.snakeBody:first').css('top').replace('px', '')) + (direction.vertical && direction.vertical * 15),
      left: Number(jQuery('.snakeBody:first').css('left').replace('px', '')) + (direction.horizontal && direction.horizontal * 15)
    };
    return jQuery(document.elementFromPoint(targetArea.left, targetArea.top));
  };

  var saveGameData = function() {
    localStorage.setItem('positionList', JSON.stringify(positionList));
    localStorage.setItem('direction', JSON.stringify(direction));
		if(score>high_score){
			localStorage.setItem('high_score', JSON.stringify(score));
		}
  };

  jQuery(document).keydown(function(e) {

    if (jQuery.inArray(e.keyCode, [32, 37, 38, 39, 40]) == -1) return;

    if (e.keyCode == 32) {
      saveGameData();
      elemaniGetir().length > 0 && (elemaniGetir()[0].click());
      e.preventDefault();
      return;
    }

    if (direction.horizontal && direction.horizontal != 0) {
      direction.vertical = (e.keyCode == 38 && -1) || (e.keyCode == 40 && 1) || 0;
      if (direction.vertical && direction.vertical != 0)
        direction.horizontal = 0;
    } else {
      direction.horizontal = (e.keyCode == 37 && -1) || (e.keyCode == 39 && 1) || 0;
      if (direction.horizontal && direction.horizontal != 0)
        direction.vertical = 0;
    }
    //console.log(direction);
    e.preventDefault();

  });

  setInterval(function() {
		if(game_is_over == 1)
			return;
    jQuery('.snakeBody').each(function(key) {
      positionList[key] = {
        top: Number(jQuery(this).css('top').replace('px', '')),
        left: Number(jQuery(this).css('left').replace('px', ''))
      };
      if (key == 0)
        jQuery(this).css(getNextPosition(jQuery(this)));
      else
        jQuery(this).css(positionList[key - 1]);

    });

		if(positionList[0].top <= meal_position.top+7 && positionList[0].top+15 >= meal_position.top+7){
			if(positionList[0].left <= meal_position.left+7 && positionList[0].left+15 >= meal_position.left+7){
				eatMeal();
		}
		}
		checkPosition();

  }, 200);

	setInterval(function() {
    if(game_is_over == 1)
    return;
		score = score + 1;
		updateScore();
  }, 10000);

	generateMeal();
	jQuery('body').append('<style>.snakeBody { z-index:99999999; width: 15px; height: 15px; position: fixed; top: 500; left:500; background: #71777c; border-radius:5px; border: 0.5px solid #71777c} .snakeBody:first-child {background: red;}</style>');

	jQuery('#game_panel').append(snakeBody.clone().css(positionList[0] || {}));
  jQuery('.snakeBody:first').css('background', 'red');


});
