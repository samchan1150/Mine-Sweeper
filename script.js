function Mine(tr, td, mineNum) {
  this.tr = tr;   // row number
  this.td = td;   // column number
  this.mineNum = mineNum;  // mine number

  this.squares = [];  // Initialize the array to store the status of each square
  this.tds = [];  // Initialize the array to store the dom object of each square
  this.surplusMine = mineNum;  // remaining mine number

  this.parent = document.querySelector('.gameBox');
}

// Randomly generate mine numbers
Mine.prototype.randomNum = function () {
  var square = new Array(this.tr * this.td);
  for(var i = 0; i < square.length; i++) {
    square[i] = i;
  }

  // Randomly sort the array
  square.sort(function() {
    return 0.5 - Math.random()
  });

  return square.slice(0, this.mineNum);
}

// Initialize
Mine.prototype.init = function () {
  var rn = this.randomNum();  // Get the mine number
  var n = 0;
  for(var i = 0; i < this.tr; i++) {
    this.squares[i] = [];
    for(var j = 0; j < this.td; j++) {
      if(rn.indexOf(n++) != -1) {
        this.squares[i][j] = {
          type: 'mine',
          x: j,   
          y: i
        };
      }else {
        this.squares[i][j] = {
          type: 'number',
          x: j,
          y: i,
          value: 0
        };
      }

    }
  }

  this.parent.oncontextmenu = function() {
    return false;
  }
  this.updateNum();
  this.createDom();

  // remaining mine number
  this.mineNumDom = document.querySelector('.mineNum');
  this.surplusMine = this.mineNum;
  this.mineNumDom.innerHTML = this.surplusMine;

  document.querySelector(".tips").style.display = 'none';
}

// Create dom
Mine.prototype.createDom = function () {
  var This = this;
  var table = document.createElement('table');
  
  for (var i = 0; i < this.tr; i++) {
    var domTr = document.createElement('tr');
    this.tds[i] = [];

    for (var j = 0; j < this.td; j++) {
      var domTd = document.createElement('td');

      domTd.pos = [i,j];
      domTd.onmousedown = function() {
        This.play(event, this); 
      };
      
      this.tds[i][j] = domTd;

      domTr.appendChild(domTd);
    }

    table.appendChild(domTr);
  }

  this.parent.innerHTML = '';  // Clear the previous table
  this.parent.appendChild(table);
}

// Get the square around the mine
Mine.prototype.getAround = function(square) {
  var x = square.x;
  var y = square.y;
  var result = [];

  /**
   * x-1,y-1    x,y-1     x+1,y-1
   * x-1,y      x,y       x+1,y
   * x-1,y+1    x,y+1     x+1,y+1
   */
  for(var i = x-1; i <= x+1; i++) {
    for(var j = y-1; j <= y+1; j++) {
      if(
        i < 0 ||  // 
        j < 0 ||  // 
        i > this.td - 1 ||  // 
        j > this.tr - 1 ||  // 
        (i == x && j == y) ||     // is itself
        this.squares[j][i].type == 'mine'    // is mine
      ) {
        continue;
      }

      result.push([j,i]);   // push data, [y,x]
    }
  }

  return result;
}

// Update the number of mines around the square
Mine.prototype.updateNum = function() {
  for(var i = 0; i < this.tr; i++) {
    for(var j = 0; j < this.td; j ++) {
      // Only update the number of squares that are not mines
      if(this.squares[i][j].type == 'number') {
        continue;
      }

      var num = this.getAround(this.squares[i][j]);   // Obtain the number of mines around the square

      for(var k = 0; k < num.length; k++) {
        /**
         * num[i] == [0,1]
         * num[i][0] == 0
         * num[i][1] == 1
         */
        this.squares[num[k][0]][num[k][1]].value += 1;  // Update the number of mines around the square
      }
    }
  }
}

Mine.prototype.play = function(ev, obj) {
  var This = this;

  // Only the left mouse button can be clicked if the square is not marked with a flag
  if(ev.which == 1 && obj.className != 'flag') {

    var curSquare = this.squares[obj.pos[0]][obj.pos[1]];
    var cl = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];

    if(curSquare.type == 'number') {
      obj.innerHTML = curSquare.value;
      obj.className = cl[curSquare.value];

      // when the number is 0, recursively display the surrounding numbers
      if(curSquare.value == 0) {
        obj.innerHTML = '';   // Not display 0


        function getAllZero(square) {
          var around = This.getAround(square);  // Obtain the square around the square

          // Traverse the surrounding squares
          for(var i = 0; i < around.length; i++) {
            var x = around[i][0];
            var y = around[i][1];

            This.tds[x][y].className = cl[This.squares[x][y].value];  // Display the number of surrounding squares

            // If the square around the square is 0, continue to display the surrounding numbers
            if(This.squares[x][y].value == 0) {

              // If the square has not been clicked, click it
              if(!This.tds[x][y].check) {
                This.tds[x][y].check = true;
                getAllZero(This.squares[x][y]);  // Recursively display the surrounding numbers
              }
            }else {
              // If the square around the square is not 0, display the number
              This.tds[x][y].innerHTML = This.squares[x][y].value;
            }
          }
        }

        getAllZero(curSquare);
        
      }
    }else {
      this.gameOver(obj);
    }
  }

  // if the right mouse button is clicked
  if(ev.which == 3) {

    if(obj.className && obj.className != 'flag') return;

    obj.className = obj.className ? '' : 'flag';    // right click to mark the flag

    // If the square is marked with a flag, the remaining mine number is reduced by 1, otherwise it is increased by 1
    if(obj.className == 'flag') {
      this.mineNumDom.innerHTML = --this.surplusMine;
    } else {
      this.mineNumDom.innerHTML = ++this.surplusMine; 
    }

    // when the remaining mine number is 0, judge whether the game is over
    if(this.surplusMine == 0) {
      for(var i = 0; i < this.tr; i++) {
        for(var j = 0; j < this.td; j++) {
          if(this.tds[i][j].className == 'flag') {
            if(this.squares[i][j].type != 'mine') {
              this.gameOver();   
              return;
            }
          }
        }
      }

      alert("Congratulations, you win!");
      this.init();
    }

  }
}

// Game over
Mine.prototype.gameOver = function(clickTd) {
  /**
   * 1、Show all mines
   * 2、Cancel the click event of all squares
   * 3、If the square is clicked, mark it as red
   */

   for(var i = 0; i < this.tr; i++) {
     for(var j = 0; j < this.td; j++) {
       if(this.squares[i][j].type == 'mine') {
         this.tds[i][j].className = 'mine';
       }

       this.tds[i][j].onmousedown = null;
     }
   }

   if(clickTd) {
     clickTd.className = 'redMine';
   }

   var tips = document.querySelector(".tips");
   tips.style.display = 'block';
}


var btns = document.querySelectorAll(".level button");
var mine = null;
var li = 0;  // Record the last click
var levelArr = [[9, 9, 10], [16, 16, 40], [28, 28, 99]];  // Record the level of the game

for(let i = 0; i < btns.length - 1; i++) {
  btns[i].onclick = function() {
    btns[li].className = '';  // Remove the active class
    this.className = 'active';

    mine = new Mine(...levelArr[i]);
    mine.init();

    li = i; // Record the current click
  }
}

btns[0].onclick();   // Initialize the game when the page is loaded
btns[3].onclick = function() {
  mine.init();
}
