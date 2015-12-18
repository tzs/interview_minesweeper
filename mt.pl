#!/usr/bin/env perl
use strict;

my $width = shift || 20;
my $height = shift || 20;

for (my $row = 0; $row < $height; ++$row) {
    print "<tr>\n";
    for (my $col = 0; $col < $width; ++$col) {
        print "\t<td id=\"$col\_$row\"onclick=\"clicked(event)\">&nbsp;</td>\n";
    }
    print "</tr>\n";
}
