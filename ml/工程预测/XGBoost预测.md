[TOC]

# 自己实现

依赖  dump_model，booster格式如下

```xml
booster[0]:
0:[replyCount<3.5] yes=1,no=2,missing=1
        1:[staticScore<16.7780495] yes=3,no=4,missing=3
                3:[status_uid<1.00048115e+09] yes=7,no=8,missing=7
                        7:[time<61080400] yes=15,no=16,missing=15
                                15:[time<60873856] yes=31,no=32,missing=31
                                        31:[contentLength<47.5] yes=61,no=62,missing=61
                                                61:leaf=-0.491739154
                                                62:leaf=-0.554545462
                                        32:[time<60969072] yes=63,no=64,missing=63
                                                63:leaf=-0.0666666701
                                                64:leaf=0.150000006
                                16:leaf=-0.565105617
                        8:[staticScore<10.0133038] yes=17,no=18,missing=17
                                17:[status_uid<1.00948416e+09] yes=33,no=34,missing=33
                                        33:[time<19740952] yes=65,no=66,missing=65
                                                65:leaf=0.150000006
                                                66:leaf=-0.163636371
                                        34:[favCount<20.5] yes=67,no=68,missing=67
                                                67:leaf=-0.530347824
                                                68:leaf=-0.47329843
                                18:[contentLength<13.5] yes=35,no=36,missing=35
                                        35:[contentLength<12.5] yes=69,no=70,missing=69
                                                69:leaf=-0.443478286
                                                70:leaf=-0.0923077017
                                        36:[time<462659840] yes=71,no=72,missing=71
                                                71:leaf=-0.498947412
                                                72:leaf=-0.272727281
```



TreeNode

```java
public class TreeNode {
    private String key;
    private float splitValue;
    private TreeNode lessThanSubTree;
    private TreeNode greatThanSubTree;
    private int leafIndex = -1;
    private float weight;

    public TreeNode() {
        super();
    }

    public float getWeight() {
        return weight;
    }

    public void setWeight(float weight) {
        this.weight = weight;
    }

    public int getLeafIndex() {
        return leafIndex;
    }

    public void setLeafIndex(int leafIndex) {
        this.leafIndex = leafIndex;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public float getSplitValue() {
        return splitValue;
    }

    public void setSplitValue(float splitValue) {
        this.splitValue = splitValue;
    }

    public TreeNode getLessThanSubTree() {
        return lessThanSubTree;
    }

    public void setLessThanSubTree(TreeNode lessThanSubTree) {
        this.lessThanSubTree = lessThanSubTree;
    }

    public TreeNode getGreatThanSubTree() {
        return greatThanSubTree;
    }

    public void setGreatThanSubTree(TreeNode greatThanSubTree) {
        this.greatThanSubTree = greatThanSubTree;
    }

    public void printTree(int level) {
        for (int i = 0; i < level; i++) {
            System.out.print("  ");
        }
        System.out.println(key + "," + splitValue + "," + weight);
        if (null != lessThanSubTree) {
            lessThanSubTree.printTree(level + 1);
        }
        if (null != greatThanSubTree) {
            greatThanSubTree.printTree(level + 1);
        }
    }
}
```



XgboostTreeModel

```java
import com.alibaba.fastjson.JSON;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
public class XgboostTreeModel {
    public static final int TREE_BASE_CNT = 10000;//TREE_BASE_CNT+leaf's index is the key in leafIndexOfVector
    public Map<Integer, Integer> leafIndexOfVectorMap = new HashMap<>();

    public XgboostTreeModel(String path) {
        loadTreeNodes(path);
    }

    @Getter
    private List<TreeNode> treeList = new ArrayList<>();

    public void setLeafIndexToVectorIndex(int treeIndex, int leafIndex, int vectorIndex) {
        leafIndexOfVectorMap.put(leafIndex + TREE_BASE_CNT * treeIndex, vectorIndex);
    }

    public Integer getVectorIndexByLeafIndex(int treeIndex, int leafIndex) {
        return leafIndexOfVectorMap.get(leafIndex + TREE_BASE_CNT * treeIndex);
    }

    public void loadTreeNodes(String modelFilePath) {
        if (StringUtils.isBlank(modelFilePath)) {
            log.error("modelFilePath is null");
            return;
        }
        log.info("loadModelFromFile start: " + modelFilePath);
        treeList = loadModel(modelFilePath);
        log.info("loadModelFromFile end: " + modelFilePath);
    }

    public List<TreeNode> loadModel(String path) {
        BufferedReader reader = null;
        try {
            reader = new BufferedReader(new FileReader(new File(path)));
            String line = "";
            Map<Integer, TreeNode> tmpTreeMap = new HashMap<>();
            int vectorIndex = 0;
            int treeIndex = 0;
            //先从模型解析出来字段
            while (null != (line = reader.readLine())) {
                if (line.startsWith("booster")) {
                    continue;
                }

                TreeNode treeNode = new TreeNode();
                int nodeIdx = 0;
                if (!line.contains("leaf")) {
                    String[] condition = line.split(":");
                    //0:[servicetimes<41] yes=1,no=2,missing=1
                    nodeIdx = Integer.parseInt(condition[0].trim());
                    if (0 == nodeIdx) {
                        treeList.add(treeNode);
                        treeIndex++;
                        tmpTreeMap.clear();
                    }

                    String[] keyAndSplitValue = condition[1].split("\\[|<|\\]");
                    treeNode.setKey(keyAndSplitValue[1].trim());
                    treeNode.setSplitValue(new Float(keyAndSplitValue[2].trim()));

                    String[] subTreeIdxAndWeight = keyAndSplitValue[3].split("=|,");
                    int subIdx = Integer.parseInt(subTreeIdxAndWeight[1].trim());
//					treeNode.setWeight(new Float(subTreeIdxAndWeight[subTreeIdxAndWeight.length - 1].trim()));
                    tmpTreeMap.put(subIdx, treeNode);
                } else {
                    String[] weight = line.split("=|,|:");
                    nodeIdx = Integer.parseInt(weight[0].trim());
                    treeNode.setLeafIndex(nodeIdx);
                    this.setLeafIndexToVectorIndex(treeIndex, nodeIdx, vectorIndex++);
                    treeNode.setWeight(new Float(weight[weight.length - 1].trim()));
                }
                if (nodeIdx > 0) {
                    TreeNode fatherTree = null;
                    if (0 == nodeIdx % 2) {
                        fatherTree = tmpTreeMap.get(nodeIdx - 1);
                        fatherTree.setGreatThanSubTree(treeNode);
                    } else {
                        fatherTree = tmpTreeMap.get(nodeIdx);
                        fatherTree.setLessThanSubTree(treeNode);
                    }
                }
            }
            if (null != reader) {
                reader.close();
            }
        } catch (Exception e) {
            log.info("getDecisionTreeFromFile error, msg:{}, error:{}, path:{}", e.getMessage(), JSON.toJSONString(e.getStackTrace()), path);
        } finally {
            if (null != reader) {
                try {
                    reader.close();
                } catch (IOException e) {
                    log.info("getDecisionTreeFromFile close reader error, msg:{}, error:{}, path:{}", e.getMessage(), JSON.toJSONString(e.getStackTrace()), path);
                }
            }
        }
        return treeList;
    }

    public Map<Integer, Integer> getLeafIndexOfVectorMap() {
        return leafIndexOfVectorMap;
    }

    public void setLeafIndexOfVectorMap(Map<Integer, Integer> leafIndexOfVectorMap) {
        this.leafIndexOfVectorMap = leafIndexOfVectorMap;
    }

    public void setTreeNodes(List<TreeNode> treeNodes) {
        this.treeList = treeNodes;
    }

    public double predict(Map<String, Double> values) {
        try {
            if (CollectionUtils.isEmpty(treeList)) {
                return 0.0;
            }
            double score = 0.0;
            for (int i = 0; i < treeList.size(); i++) {
                TreeNode treeNode = treeList.get(i);
                score += getLeafWeight(treeNode, values);
            }
            return score;
        } catch (Exception e) {
            log.warn("XgboostTreeModel error:" + JSON.toJSONString(values), e);
        }
        return 0.0;
    }

    public double predictProba(Map<String, Double> values) {
        return 1 / (1 + Math.exp(-predict(values)));
    }

    public Integer[] transformFeatureToIntArr(Map<String, Double> values) {
        if (CollectionUtils.isEmpty(getTreeList())) {
            return null;
        }
        List<Integer> featureInt = new ArrayList<>();
        for (int i = 0; i < getTreeList().size(); i++) {
            TreeNode treeNode = getTreeList().get(i);
            int leafIndex = this.getLeafIndex(treeNode, values);
            int vectorIndex = getVectorIndexByLeafIndex(i + 1, leafIndex);
            featureInt.add(vectorIndex);
        }
        return featureInt.toArray(new Integer[featureInt.size()]);
    }

    public int getLeafIndex(TreeNode treeNode, Map<String, Double> features) {
        TreeNode leftNode = getLeaf(treeNode, features);
        if (leftNode != null) {
            return leftNode.getLeafIndex();
        }
        return -1;
    }

    public double getLeafWeight(TreeNode treeNode, Map<String, Double> features) {
        TreeNode leftNode = getLeaf(treeNode, features);
        if (leftNode != null) {
            return leftNode.getWeight();
        }
        return 0.0;
    }

    public TreeNode getLeaf(TreeNode treeNode, Map<String, Double> features) {
        if (treeNode == null) {
            return null;
        }
        String key = treeNode.getKey();
        if (StringUtils.isNotBlank(key) && features.containsKey(key)) {
            Double f = features.get(key);
            if (null == f) {
                f = 0D;
            }
            if (f <= treeNode.getSplitValue()) {
                return getLeaf(treeNode.getLessThanSubTree(), features);
            } else {
                return getLeaf(treeNode.getGreatThanSubTree(), features);
            }
        } else {
            return treeNode;
        }
    }

    private static String convertIndexToVector(int leafSize, String lable, Integer[] result) {
        String[] finalVector = new String[leafSize];
        Arrays.fill(finalVector, "0");
        for (int index : result) {
            finalVector[index] = "1";
        }
        String newLine = lable + "," + String.join(",", finalVector) + "\n";
        return newLine;
    }

    public static String processIndex(String lable, Integer[] result) {
        String newLine = lable + "," + Arrays.stream(result).map(i -> i.toString()).collect(Collectors.joining(",")) + "\n";
        return newLine;
    }
}
```

