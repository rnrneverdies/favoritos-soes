#!/bin/bash

SRC_PATH=es.stackoverflow.com
DST_PATH=tmp
MINPOSTFAV=3
MINUSERFAV=5

rm -rf $DST_PATH

node ingest/pre.js $SRC_PATH $DST_PATH $MINPOSTFAV $MINUSERFAV

matlab -nodisplay -nojvm -nosplash -nodesktop -r "addpath('v1'); cd $DST_PATH; process(); quit"

node ingest/post.js $DST_PATH
