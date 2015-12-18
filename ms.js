var mines;
var rows = 16;
var cols = 30;
var num_mines = 99;
var first_x = -1;
var first_y = -1;
var display_built = 0;
var debug = 0;

function init()
{
    var i;
    var els;

    first_x = -1;

    rows = document.getElementById('rows').value;
    cols = document.getElementById('cols').value;

    build_display(cols, rows);

    // clear display
    els = document.getElementsByTagName('td');
    for (i = 0; i < els.length; ++i) {
        els[i].innerHTML = '&#8414;';
    }

    // empty minefield
    mines = array2d(cols, rows, 0);
}

function place_mines()
{
    // note: if num_mines is close to rows*cols, place_mines can be slow
    debug = document.getElementById('debug').checked;
    num_mines = document.getElementById('mines').value;
    if (num_mines > rows*cols-1)
        num_mines = rows*cols-1;
    var to_place = num_mines;
    while (to_place > 0) {
        var x = Math.floor(Math.random() * cols);
        var y = Math.floor(Math.random() * rows);
        if (mines[x][y] != 1 && (x != first_x || y != first_y)) {
            mines[x][y] = 1;
            --to_place;
            if (debug)
                set_square(x, y, '&#128163;');
        }
    }
}

function clicked(evt)
{
    var id = evt.currentTarget.id;
    var xy = id_to_xy(id);

    if (first_x < 0) {
        first_x = xy[0];
        first_y = xy[1];
        place_mines();
    }

    if (evt.metaKey)
        declare_mine(xy[0],xy[1]);
    else
        declare_empty(xy[0],xy[1]);
}

function build_display(cols, rows)
{
    var x, y;
    var old_tbody = document.getElementById('display');
    var new_tbody = document.createElement('tbody');
    old_tbody.parentNode.replaceChild(new_tbody, old_tbody);
    new_tbody.setAttribute('id', 'display');
    for (y = 0; y < rows; ++y) {
        var tr = document.createElement('tr');
        for (x = 0; x < cols; ++x) {
            var td = document.createElement('td');
            td.setAttribute('id', xy_to_id(x,y));
            td.addEventListener("click", clicked, false);
            tr.appendChild(td);
        }
        new_tbody.appendChild(tr);
    }
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
        auto_clear(x, y);
    }
}

function auto_clear(x, y)
{
    var did = 0;
    var i, j;
    var clear_queue = new Array();
    clear_queue.push([x, y]);
    var queued = array2d(cols, rows, 0);
    queued[x][y] = 1;
    while (did < clear_queue.length) {
        x = clear_queue[did][0];
        y = clear_queue[did][1];
        var near = count_mines(x,y);
        set_square(x, y, "" + near);
        if (near == 0) {
            for (i = -1; i < 2; ++i) {
                for (j = -1; j < 2; ++j) {
                    var nx = x + i;
                    var ny = y + j;
                    if (0 <= nx && nx < cols && 0 <= ny && ny < rows) {
                        if ( queued[nx][ny] == 0 && mines[nx][ny] == 0) {
                            clear_queue.push([nx, ny]);
                            queued[nx][ny] = 1;
                        }
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
    var xy = id.split('_');
    return [parseInt(xy[0]), parseInt(xy[1])];
}

function xy_to_id(x, y)
{
    return x + "_" + y;
}

function note(txt)
{
    var el = document.getElementById('log');
    el.innerHTML += '<br/>' + txt;
}
