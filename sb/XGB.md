```java
package com.xueqiu.search.rank.common.model.xgboost;

import com.alibaba.fastjson.JSON;
import com.xueqiu.search.rank.common.dto.XGBDebugItemDto;
import com.xueqiu.search.rank.common.dto.XGBTreePathDto;
import com.xueqiu.search.rank.common.dto.XGBTreePathNodeDto;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
public class XGBTreeModelDebug {

    private List<TreeNode> treeList;

    public XGBTreeModelDebug(List<TreeNode> treeList) {
        this.treeList = treeList;
    }


    public XGBDebugItemDto predictDebug(Map<String, Double> values) {
        XGBDebugItemDto result = new XGBDebugItemDto();
        try {
            if (CollectionUtils.isEmpty(treeList)) {
                result.setDesc("treeList is null");
                return result;
            }
            double score = 0.0;
            List<XGBTreePathDto> treePath = new ArrayList<>();
            for (int i = 0; i < treeList.size(); i++) {
                XGBTreePathDto treePathDto = XGBTreePathDto.builder().id(i).build();
                TreeNode treeNode = treeList.get(i);
                List<XGBTreePathNodeDto> path = new ArrayList<>();
                TreeNode leafNode = getLeafDebug(treeNode, values, path);
                treePathDto.setTreePathList(path);

                if (leafNode != null) {
                    score += leafNode.getWeight();
                    treePathDto.setLeafIndex(leafNode.getLeafIndex());
                    treePathDto.setWeight(leafNode.getWeight());
                } else {
                    treePathDto.setDesc("leafNode is null");
                }
                treePath.add(treePathDto);
            }
            result.setTreePath(treePath);
            result.setScore(score);
            result.setProba(predictProba(score));

            return result;
        } catch (Exception e) {
            log.warn("XgboostTreeModel error:" + JSON.toJSONString(values), e);
            result.setDesc("error" + e.getMessage());
        }
        return result;
    }

    public TreeNode getLeafDebug(TreeNode treeNode, Map<String, Double> features, List<XGBTreePathNodeDto> path) {
        if (treeNode == null) {
            return null;
        }

        String key = treeNode.getKey();
        if (StringUtils.isNotBlank(key) && features.containsKey(key)) {
            Double f = features.get(key);
            if (null == f) {
                f = 0D;
            }

            XGBTreePathNodeDto pathItem = XGBTreePathNodeDto
                    .builder()
                    .key(key)
                    .splitValue(treeNode.getSplitValue())
                    .leafIndex(treeNode.getLeafIndex())
                    .weight(treeNode.getWeight())
                    .featureValue(f)
                    .build();

            path.add(pathItem);

            if (treeNode.getLessThanSubTree() != null) {
                pathItem.setLessThanSubTree(treeNode.getLessThanSubTree().getKey());
            }
            if (treeNode.getGreatThanSubTree() != null) {
                pathItem.setGreatThanSubTree(treeNode.getGreatThanSubTree().getKey());
            }

            if (f <= treeNode.getSplitValue()) {
                pathItem.setLessThanSub(true);
                return getLeafDebug(treeNode.getLessThanSubTree(), features, path);
            } else {
                pathItem.setLessThanSub(false);
                return getLeafDebug(treeNode.getGreatThanSubTree(), features, path);
            }
        } else {
            return treeNode;
        }
    }

    public double predictProba(double score) {
        return 1 / (1 + Math.exp(-score));
    }
}

```

