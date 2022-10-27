```python
#-------------------------------------------------------------------------------
# Name:        K-Means
# Purpose:
#
# Author:      dongyifeng
#
# Created:     26/10/2013
# Copyright:   (c) dongyifeng 2013
# Licence:     <your licence>
#-------------------------------------------------------------------------------
import os
import math
import time

dataFilePath='data'
stopwordFileName='StopWord.txt'
trainResultFileName='trainResult.txt'
maxFeatureNum=50
wordSet={}
articleSet={}
articleFea=[]
stopWordSet={}
classSet=[]
centroidSet=[None for i in range(5)]
articleActualClass={}  # evaluate
articleDataFileName='dataFileName'  # evaluate
includTheWordArticleNum={} # Optimization

def loadData():
    loadStopWordSet()
    for fileName in os.listdir(dataFilePath):
        articleId=len(articleSet)
        articleSet[articleId]=fileName
        iscontinue=False
        if fileName.find('business')>-1:
            tag=0
        elif fileName.find('yule')>-1:
            tag=1
        elif fileName.find('it')>-1:
            tag=2
        elif fileName.find('sports')>-1:
            tag=3
        elif fileName.find('auto')>-1:
            tag=4
        articleActualClass[articleId]=tag

        words= open(dataFilePath+'/'+fileName,'r',encoding='utf-8').read().strip().split(' ')
        fea={}
        for word in words:
            if stopWordSet.get(word):continue
            if not wordSet.get(word):
                wordSet[word]=len(wordSet)
            wordId=wordSet[word]
            if not fea.get(wordId):
                fea[wordId]=1
                if not includTheWordArticleNum.get(wordId):includTheWordArticleNum[wordId]=0
                includTheWordArticleNum[wordId]+=1
            else:
                fea[wordId]+=1
        #normalized(fea)
        articleFea.append(fea)
        if centroidSet[tag] is None:
            centroidSet[tag]=articleId
    for i in range(len(articleFea)):
        articleFea[i]=featrueSelection(articleFea[i])
    for i in range(len(centroidSet)):
        centroidSet[i]=articleFea[centroidSet[i]]

def loadStopWordSet():
    words= open(stopwordFileName,'r',encoding='utf-8').read().strip().split(' ')
    for word in words:
        if not stopWordSet.get(word):
            stopWordSet[word]=1

def featrueSelection(featureVector):
    tfidfArray={}

    vectorTotal=0
    articleTotality=len(articleFea)

    # Statistics word number in the article
    for wordId in featureVector.keys():
        vectorTotal+=featureVector[wordId]

    # Calculate term frequency and invertion document frequency
    for word in featureVector:
        tf=featureVector[word]/float(vectorTotal)
        includWordArticleCount=0
        idf=math.log(articleTotality/float(includTheWordArticleNum[word]+1))
        tfidfArray[word]=tf*idf

    keyWords=sorted(tfidfArray.items(), key=lambda d:d[1], reverse=True)
    newFeatureVetor={}
    for i in range(len(featureVector)):
        if i>maxFeatureNum:break
        newFeatureVetor[keyWords[i][0]]=featureVector[keyWords[i][0]]

    normalized(newFeatureVetor)
    return newFeatureVetor

def normalized(featureVector):
    mold=0
    for wordId in featureVector.keys():
        mold+=math.pow(featureVector[wordId],2)
    mold=math.sqrt(mold)
    for wordId in featureVector.keys():
        featureVector[wordId]=float(featureVector[wordId]/mold)


def train():
    lastWCSS=0
    while(True):
        classSet.clear()
        for i in range(len(centroidSet)):classSet.append([])
        wcss=0
        for articleId in range(len(articleFea)):
            minSimilarty=0
            for centroidId in range(len(centroidSet)):
                similarty=calcSimilarity(articleFea[articleId],centroidSet[centroidId])
                if minSimilarty>similarty:
                    minSimilarty=similarty
                    tempCentroid=centroidId
            classSet[tempCentroid].append(articleId)
            wcss+=minSimilarty

        print('wcss:',wcss)

        # Modify Centroid
        for centroidId in range(len(classSet)):
            centroidSet[centroidId]= clacCentriod(classSet[centroidId])

        if lastWCSS==wcss:break
        lastWCSS=wcss

def calcSimilarity(featrueVector,centriod):
    result=0.0
    for featrue in featrueVector.keys():
        if centriod.get(featrue):
            result+=featrueVector[featrue]*centriod[featrue]
    return -result

def clacCentriod(articleArray):
    start=time.time()
    centriod={}

    for articleId in articleArray:
        for wordId in articleFea[articleId].keys():
            if centriod.get(wordId) is None:centriod[wordId]=0
            centriod[wordId]+=articleFea[articleId].get(wordId)
    aritlceCount=len(articleArray)
    for key in centriod.keys():
        centriod[key]=centriod[key]/float(aritlceCount)

    normalized(centriod)
    return centriod

def saveTrainResult():
    file= open(trainResultFileName,'w')
    for centoridId in range(len(classSet)):
        file.write(str(classSet[centoridId]).strip('[').strip(']')+'\n')
    file.close()

    file=open(articleDataFileName,'w')
    for articleId in articleActualClass.keys():
        file.write(str(articleId)+':'+str( articleActualClass[articleId])+';')
    file.close()


def loadTrainResult():
    file= open(trainResultFileName,'r')
    for line in file.readlines():
        classSet.append([int(i) for i in line.split(',')])
    file.close()

    file=open(articleDataFileName,'r')
    content= file.read().split(';')
    for item in content:
        if len(item.strip())==0:continue
        temp=item.split(':')
        articleActualClass[int(temp[0])]=int(temp[1])

def evaluate():
    confusionTable=[]
    # Statistics
    for centoridId in range(len(classSet)):
        confusionTable.append({})
        for articleId in classSet[centoridId]:
            actual= articleActualClass[articleId]
            if not confusionTable[centoridId].get(actual):confusionTable[centoridId][actual]=0
            confusionTable[centoridId][actual]+=1
    # Analysis
    for centoridId in range(len(confusionTable)):
        print('centoridId',centoridId)
        for actual in confusionTable[centoridId].keys():
            print('actual:',actual,'sum',confusionTable[centoridId][actual],end='\t')
        print('')

def main():
    #loadData()
    #train()
    #saveTrainResult()
    loadTrainResult()
    evaluate()
    '''
    for centoridId in range(len( classSet)):
        print('')
        print('--'*30,centoridId,'--'*30)
        print('')
        for articleId in classSet[centoridId]:
            print(articleSet[articleId])
            '''

if __name__ == '__main__':
    main()

```

