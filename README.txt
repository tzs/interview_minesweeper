I saw a story on HN [1] about using implementing as much of Minesweeper as you
can in JavaScript in an hour as an interview question. The story said no
one had every completed it in an hour.

I decided to give it a try, although my JavaScript level of competence is
at best dabbler.

It was an interesting exercise. I failed to finish in an hour. The first
commit in this repository was made one hour after starting. The code was
mostly done, but a bug in the part that reveals neighboring cells after
an empty cell is revealed had bugs, and I was debugging that when the
time ran out.

It took another 20 minutes to figure out what was going on. After that
it worked as I intended. However, it reveals many more squares than I
remember real Minesweeper on Windows 3.x and Windows 95 doing, making
the game much easier than it should be, so it seems I don't actually
remember the correct rules for what gets revealed.

I then changed the display from being static HTML to being generated
in the JavaScript, so that changing the playfield size no longer
required editing the HTML, and fixed some variable scope errors.

Things needed to make this reasonably playable:

1. Find out the actual rules and make it conform.

2. Detect when the player has identified all the mines and
revealed all the empty squares and announce that they won.

3. Better display.

Addendum: as of commit b141ed919347aff219780a0b9233c9bf1c091aea this is
reasonably playable and looks reasonably not too crappy. The wall
time between starting and that was about 7.5 hours, but I was doing
other stuff during that time. Time on this was probably about 4 hours,
with about an hour of that on non-coding things, mainly testing to see
if the look and feel was satisfactory, and way too much time in the
character viewer on my Mac trying to decide what symbols to use to
mark various cell states.

[1] https://news.ycombinator.com/item?id=10752564
