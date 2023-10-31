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

# Build
mkdir build && cd build
cmake ..
make -j32
cd ..

# Convert graph to edgelist and run.
perform() {
inp="$1"  # Input graph name
dir="$2"  # Is the graph directed?
# If edgelist is not present, convert mtx to edgelist.
if [ ! -f "$1.edgelist" ]; then
  echo "Converting $1.mtx to $1.edgelist ..."
  node process.js convert-mtx-to-edgelist "$1.mtx" "$1.edgelist"
  echo "Done." && echo ""
fi
# Get the vertex count.
n=$(node process.js read-mtx-rows "$1.mtx")
echo "$1.mtx has $n vertices." && echo ""
# Copy file to temporary location.
rm -rf /tmp/$src
mkdir -p /tmp/$src
cp "$1.edgelist" /tmp/$src/0.txt
# Run the program, and save the output.
echo "Running program on $1.edgelist ..."
stdbuf --output=L build/graphone64 -v $n -i /tmp/$src -d $2 2>&1 | tee -a "$out"
echo "Done." && echo ""
# Clean up.
rm -rf /tmp/$src
}

# Run on all graphs.
perform-all() {
perform $HOME/Data/indochina-2004  0
perform $HOME/Data/arabic-2005     0
perform $HOME/Data/uk-2005         0
perform $HOME/Data/webbase-2001    0
perform $HOME/Data/it-2004         0
perform $HOME/Data/sk-2005         0
perform $HOME/Data/com-LiveJournal 1
perform $HOME/Data/com-Orkut       1
perform $HOME/Data/asia_osm        1
perform $HOME/Data/europe_osm      1
perform $HOME/Data/kmer_A2a        1
perform $HOME/Data/kmer_V1r        1
}
perform-all
perform-all
perform-all
perform-all
perform-all
