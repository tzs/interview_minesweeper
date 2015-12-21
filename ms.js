var mines;
var rows = 16;
var cols = 30;
var num_mines = 99;
var first_x = -1;
var first_y = -1;
var display_built = 0;
var debug = 0;
var game_state = 0;
var settled;
var mines_flagged = 0;

function init()
{
    var i;
    var els;


    first_x = -1;
    mines_flagged = 0;

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

    settled = array2d(cols, rows, 0);

    set_result('');

    game_state = 1;
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
                set_square(x, y, '&#x25CE;');
        }
    }
}

function clicked(evt)
{
    if (game_state == 0)
        return;
    var src = evt.currentTarget;
    if (! src) {    //IE8 does not have currentTarget
        src = evt.srcElement;
        while (src.tagName != "TD")
            src = src.parentNode;
    }
    var id = src.id;
    var xy = id_to_xy(id);

    if (settled[xy[0]][xy[1]])
        return;

    if (first_x < 0) {
        first_x = xy[0];
        first_y = xy[1];
        place_mines();
    }

    if (evt.metaKey || evt.altKey || evt.ctrlKey || evt.shiftKey)
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
            if (td.addEventListener)
                td.addEventListener("click", clicked, false);
            else
                td.attachEvent("onclick", clicked);
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
        set_square(x, y, '&#x2205;');
        set_result("You declared a mine on an empty square. <b>You lose</b>.");
        game_state = 0;
    } else {
        set_square(x, y, '&#x1F6A9;');
        ++mines_flagged;
    }
}

function declare_empty(x,y)
{
    if (mines[x][y] == 1) {
        set_square(x, y, '&#x1F4A3;');
        set_result("You stepped on a mine! <b>You lose</b>.");
        game_state = 0;
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
    settled[x][y] = 1;
    while (did < clear_queue.length) {
        x = clear_queue[did][0];
        y = clear_queue[did][1];
        var near = count_mines(x,y);
        set_square(x, y, near ? "" + near : '&nbsp;');
        if (near == 0) {
            for (i = -1; i < 2; ++i) {
                for (j = -1; j < 2; ++j) {
                    var nx = x + i;
                    var ny = y + j;
                    if (0 <= nx && nx < cols && 0 <= ny && ny < rows) {
                        if ( settled[nx][ny] == 0 && mines[nx][ny] == 0) {
                            clear_queue.push([nx, ny]);
                            settled[nx][ny] = 1;
                        }
                    }
                }
            }
        }
        ++did;
    }
}

function claim()
{
    if (game_state == 0)
        return;
    if (mines_flagged == num_mines) {
        set_result("<b>You win!</b>");
    } else {
        set_result("Wrong-o, moosebreath. <b>You lose</b>");
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

function set_result(txt)
{
    var el = document.getElementById('result');
    el.innerHTML = txt;
}

function note(txt)
{
    var el = document.getElementById('log');
    el.innerHTML += '<br/>' + txt;
}
