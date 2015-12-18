var mines;
var rows = 20;
var cols = 20;
var num_mines = 50;
var clear_queue;
var cleared;

function init()
{
    var i;
    var els;

    // clear display
    els = document.getElementsByTagName('td');
    for (i = 0; i < els.length; ++i) {
        els[i].innerHTML = '_';
    }

    // empty minefield
    mines = array2d(cols, rows, 0);

    // place mines
    for (i = 0; i < num_mines; ++i) {
        var x = Math.floor(Math.random() * cols);
        var y = Math.floor(Math.random() * rows);
        mines[x][y] = 1;
    }
}

function clicked(evt)
{
    var id = evt.currentTarget.id;
    var xy = id_to_xy(id);

    if (evt.metaKey)
        declare_mine(xy[0],xy[1]);
    else
        declare_empty(xy[0],xy[1]);
}

function array2d(cols, rows, val)
{
    var i, j;
    var ar = new Array();
    for (i = 0; i < cols; ++i) {
        var r = Array();
        for (j = 0; j < rows; ++j) {
            r.push(val);
        }
        ar.push(r);
    }
    return ar;
}

function declare_mine(x,y)
{
    if (mines[x][y] != 1) {
        alert("You declared a mine on an empty square. You lose!");
        init();
    } else
        set_square(x, y, 'M');
}

function declare_empty(x,y)
{
    if (mines[x][y] == 1) {
        alert("You stepped on a mine! You lose!");
        init();
    } else {
        var near = count_mines(x,y);
        set_square(x, y, "" + near);
        auto_clear(x, y);
    }
}

function auto_clear(x, y)
{
    var did = 0;
    var i, j;
    clear_queue = new Array();
    clear_queue.push([x, y]);
    cleared = array2d(cols, rows, 0);
    while (did < clear_queue.length) {
        x = clear_queue[did][0];
        y = clear_queue[did][1];
        alert("auto_clear " + x + ", " + y);
        var near = count_mines(x,y);
        set_square(x, y, "" + near);
        cleared[x][y] = 1;
        for (i = -1; i < 2; ++i) {
            for (j = -1; j < 2; ++j) {
                var nx = x + i;
                var ny = y + j;
                if (0 <= nx && nx < cols && 0 <= ny && ny < rows) {
                    if ( cleared[nx][ny] == 0) {
                        clear_queue.push([nx, ny]);
                    }
                }
            }
        }
        ++did;
    }
}

function set_square(x, y, val)
{
    var el = document.getElementById(xy_to_id(x,y));
    el.innerHTML = val;
}

function count_mines(x,y)
{
    var count = mine_at(x-1, y-1) + mine_at(x, y-1) + mine_at(x+1, y-1) +
                mine_at(x-1, y)                     + mine_at(x+1, y) +
                mine_at(x-1, y+1) + mine_at(x, y+1) + mine_at(x+1, y+1);
    return count;
}

function mine_at(x,y)
{
    if (x < 0 || x >= cols) return 0;
    if (y < 0 || y >= rows) return 0;
    return mines[x][y];
}

function id_to_xy(id)
{
    return id.split('_');
}

function xy_to_id(x, y)
{
    return x + "_" + y;
}
