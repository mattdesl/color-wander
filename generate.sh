#!/bin/sh

a=1
limit=10 # add number +1 
while [ "$a" -lt "$limit" ]    # this is loop1
do
   node print "$a"
   a=`expr $a + 1`
done
