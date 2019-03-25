# GraphOne
This repository is for following FAST'19 paper: "GraphOne: A Data Store for Real-time Analytics on Evolving Graphs"

The repository is a storage engine (i.e. Data Store) for dynamic/evolving/streaming graph data. 

## Data Visibility:
GraphOne offers a fine-grained ingestion, but leaves the visibility of data ingestion to analytics writer, called data visibility. That is within the same system an analytics can choose to work on fine-grained ingestion or coarse-grained ingestion.

## GraphView:
GraphOne offers a set of vertex-centric API to access the data. However different analytics may need different access pattern. We provide many access patterns. But two access patterns are highlighted. One is data access over whole data (Batch analytics), and anohter over a time window (Streaming analytics).  GraphView simplifies this access pattern. Kindly read the paper for different kind of APIs.


This piece of code is an academic prototype, and currently does not have a full-fledged query engine integrated. Your query or analytics need to use the GraphView APIs. We are working to improve the code quality, as well as support more type of analytics and Data. Please let us know if you have found any bug, or need a new feature. You can also contribute to the code. 

# Input Graph Data
GraphOne is designed to work with variety of input graph data. I have listed few types here:

## Text Edge Data (With or Without Weights):
If you have downloaded some popular Graph Data sets from the Internet, it is possbily in this format. 

### Examaple 1: Data already contains IDs 
If you have downloaded subdomain graph, the data will look like following:
```
  0       28724358
  2       32513855
  2       33442782
  2       39494429
  2       49244790
```
This data already contains the ID, so we can directly use these as vertex IDs. We do have this option.

### Example 2: Data is in completely raw format
If you have downloaded LANL netflow data, the data will look like following:
```
172800,0,Comp348305,Comp370444,6,Port02726,80,0,5,0,784
172800,0,Comp817584,Comp275646,17,Port97545,53,1,0,77,0
172800,0,Comp654013,Comp685925,6,Port26890,Port94857,6,5,1379,1770
172800,0,Comp500631,Comp275646,17,Port62938,53,1,0,64,0
172800,0,Comp500631,Comp275646,17,Port52912,53,1,0,64,0
```

Here the vertices are in string format, and also have a complex weight. We do provide interface to convert these string to ID. We do support such graphs. We have written many plug-in to parse the text file and ingest one edge at a time.

## Binary Edge Data (With or Without Weights): 
It is same as above, but data is not in text format, but in binary format. This is not much different than handling above data. The parsing code is much simplified. 

# Input Graph Data (With Variable Size Weight)
Discription will be updated later.
