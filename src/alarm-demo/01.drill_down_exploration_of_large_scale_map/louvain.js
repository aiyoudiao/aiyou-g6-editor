import { uniqueId } from '@antv/util';
import { getAdjMatrix } from '@antv/g6/es/util/math';

var getModularity = function getModularity(nodes, adjMatrix, ks, m) {
  var length = adjMatrix.length;
  var param = 2 * m;
  var modularity = 0;

  for (var i = 0; i < length; i++) {
    var clusteri = nodes[i].clusterId;

    for (var j = 0; j < length; j++) {
      var clusterj = nodes[j].clusterId;
      if (clusteri !== clusterj) continue;
      var entry = adjMatrix[i][j] || 0;
      var ki = ks[i] || 0;
      var kj = ks[j] || 0;
      modularity += entry - ki * kj / param;
    }
  }

  modularity *= 1 / param;
  return modularity;
};
/**
 * @param callbacks
 */


var louvain = function louvain(data, directed, weightPropertyName, threshold) {
  if (directed === void 0) {
    directed = false;
  }

  if (weightPropertyName === void 0) {
    weightPropertyName = 'weight';
  }

  if (threshold === void 0) {
    threshold = 0.0001;
  } // the origin data


  var nodes = data.nodes,
      edges = data.edges;
  var clusters = {};
  var nodeMap = {}; // init the clusters and nodeMap

  nodes.forEach(function (node, i) {
    var cid = node.cluster // uniqueId();
    // console.log('cid', cid)
    node.clusterId = cid;
    clusters[cid] = {
      id: cid,
      nodes: [node]
    };
    nodeMap[node.id] = {
      node: node,
      idx: i
    };
  }); // the adjacent matrix of calNodes inside clusters

  var adjMatrix = getAdjMatrix(data, directed); // the sum of each row in adjacent matrix

  var ks = [];
  /**
   * neighbor nodes (id for key and weight for value) for each node
   * neighbors = {
   *  id(node_id): { id(neighbor_1_id): weight(weight of the edge), id(neighbor_2_id): weight(weight of the edge), ... },
   *  ...
   * }
   */

  var neighbors = {}; // the sum of the weights of all edges in the graph

  var m = 0;
  adjMatrix.forEach(function (row, i) {
    var k = 0;
    var iid = nodes[i].id;
    neighbors[iid] = {};
    row.forEach(function (entry, j) {
      if (!entry) return;
      k += entry;
      var jid = nodes[j].id;
      neighbors[iid][jid] = entry;
      m += entry;
    });
    ks.push(k);
  });
  m /= 2;
  var totalModularity = Infinity;
  var previousModularity = Infinity;
  var iter = 0;

  while (true) {
    // whether to terminate the iterations
    totalModularity = getModularity(nodes, adjMatrix, ks, m);
    if (Math.abs(totalModularity - previousModularity) < threshold || iter > 100) break;
    previousModularity = totalModularity;
    iter++; // pre compute some values for current clusters

    Object.keys(clusters).forEach(function (clusterId) {
      // sum of weights of edges to nodes in cluster
      var sumTot = 0;
      edges.forEach(function (edge) {
        var source = edge.source,
            target = edge.target;
        var sourceClusterId = nodeMap[source].node.clusterId;
        var targetClusterId = nodeMap[target].node.clusterId;

        if (sourceClusterId === clusterId && targetClusterId !== clusterId || targetClusterId === clusterId && sourceClusterId !== clusterId) {
          sumTot = sumTot + (edge[weightPropertyName] || 1);
        }
      });
      clusters[clusterId].sumTot = sumTot;
    }); // move the nodes to increase the delta modularity

    nodes.forEach(function (node, i) {
      var selfCluster = clusters[node.clusterId];
      var bestIncrease = 0;
      var bestCluster;
      var commonParam = ks[i] / (2 * m); // sum of weights of edges from node to nodes in cluster

      var kiin = 0;
      var selfClusterNodes = selfCluster.nodes;
      selfClusterNodes.forEach(function (scNode) {
        var scNodeIdx = nodeMap[scNode.id].idx;
        kiin += adjMatrix[i][scNodeIdx] || 0;
      }); // the modurarity for **removing** the node i from the origin cluster of node i

      var removeModurarity = kiin - selfCluster.sumTot * commonParam; // the neightbors of the node

      var nodeNeighborIds = neighbors[node.id];
      Object.keys(nodeNeighborIds).forEach(function (neighborNodeId) {
        var neighborNode = nodeMap[neighborNodeId].node;
        var neighborClusterId = neighborNode.clusterId; // if the node and the neighbor of node are in the same cluster, reutrn

        if (neighborClusterId === node.clusterId) return;
        var neighborCluster = clusters[neighborClusterId];
        var clusterNodes = neighborCluster.nodes; // if the cluster is empty, remove the cluster and return

        if (!clusterNodes || !clusterNodes.length) return; // sum of weights of edges from node to nodes in cluster

        var neighborClusterKiin = 0;
        clusterNodes.forEach(function (cNode) {
          var cNodeIdx = nodeMap[cNode.id].idx;
          neighborClusterKiin += adjMatrix[i][cNodeIdx] || 0;
        }); // modurarity for **adding** node i into this neighbor cluster

        var addModurarity = neighborClusterKiin - neighborCluster.sumTot * commonParam; // the increase modurarity is the difference between addModurarity and removeModurarity

        var increase = addModurarity - removeModurarity; // find the best cluster to move node i into

        if (increase > bestIncrease) {
          bestIncrease = increase;
          bestCluster = neighborCluster;
        }
      }); // if found a best cluster to move into

      if (bestIncrease > 0) {
        bestCluster.nodes.push(node);
        var previousClusterId_1 = node.clusterId;
        node.clusterId = bestCluster.id; // move the node to the best cluster

        var nodeInSelfClusterIdx = selfCluster.nodes.indexOf(node); // remove from origin cluster

        selfCluster.nodes.splice(nodeInSelfClusterIdx, 1); // update sumTot for clusters
        // sum of weights of edges to nodes in cluster

        var neighborClusterSumTot_1 = 0;
        var selfClusterSumTot_1 = 0;
        edges.forEach(function (edge) {
          var source = edge.source,
              target = edge.target;
          var sourceClusterId = nodeMap[source].node.clusterId;
          var targetClusterId = nodeMap[target].node.clusterId;

          if (sourceClusterId === bestCluster.id && targetClusterId !== bestCluster.id || targetClusterId === bestCluster.id && sourceClusterId !== bestCluster.id) {
            neighborClusterSumTot_1 = neighborClusterSumTot_1 + (edge[weightPropertyName] || 1);
          }

          if (sourceClusterId === previousClusterId_1 && targetClusterId !== previousClusterId_1 || targetClusterId === previousClusterId_1 && sourceClusterId !== previousClusterId_1) {
            selfClusterSumTot_1 = selfClusterSumTot_1 + (edge[weightPropertyName] || 1);
          }
        }); // the nodes of the clusters to move into and remove are changed, update their sumTot

        bestCluster.sumTot = neighborClusterSumTot_1;
        selfCluster.sumTot = selfClusterSumTot_1;
      }
    });
  } // delete the empty clusters


  Object.keys(clusters).forEach(function (clusterId) {
    var cluster = clusters[clusterId];

    if (!cluster.nodes || !cluster.nodes.length) {
      delete clusters[clusterId];
    }
  }); // get the cluster edges

  var clusterEdges = [];
  var clusterEdgeMap = {};
  edges.forEach(function (edge) {
    var source = edge.source,
        target = edge.target;
    var weight = edge[weightPropertyName] || 1;
    var sourceClusterId = nodeMap[source].node.clusterId;
    var targetClusterId = nodeMap[target].node.clusterId;
    var newEdgeId = sourceClusterId + "---" + targetClusterId;

    if (clusterEdgeMap[newEdgeId]) {
      clusterEdgeMap[newEdgeId].weight += weight;
      clusterEdgeMap[newEdgeId].count++;
    } else {
      var newEdge = {
        source: sourceClusterId,
        target: targetClusterId,
        id: edge.id,
        weight: weight,
        count: 1
      };
      clusterEdgeMap[newEdgeId] = newEdge;
      clusterEdges.push(newEdge);
    }
  });
  var clustersArray = [];
  Object.keys(clusters).forEach(function (clusterId) {
    clustersArray.push(clusters[clusterId]);
  });
  return {
    clusters: clustersArray,
    clusterEdges: clusterEdges
  };
};

export default louvain;