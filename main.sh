#!/usr/bin/env bash
src="the-data-lab--GraphOne"
out="$HOME/Logs/$src.log"
ulimit -s unlimited
printf "" > "$out"

# Download source code
if [[ "$DOWNLOAD" != "0" ]]; then
  rm -rf $src
  git clone https://github.com/wolfram77/$src
fi
cd $src

# Build and run
mkdir build && cd build
cmake ..
make -j32
