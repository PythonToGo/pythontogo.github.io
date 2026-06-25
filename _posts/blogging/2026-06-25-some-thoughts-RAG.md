---
title: some Idea notes for Working RAG
description: some concept brainstroming
date: 2026-06-25 112:40:00 +0800
categories: [blogging]
tags: [RAG, GraphRAG, ]
# pin: true
math: true
mermaid: true
comments: true
image: 
    path:
    lqip: 
    alt: 
---


## 1. PDF Chunking 이 페이지 단위로 안 맞을 때 / PDF 를 어떻게 청킹할 것인가

표가 페이지를 넘어가거나, 한 문단이 잘리거나, 한 페이지에 무관한 섹션이 섞이기 때문에 거의 항상 나쁜 선택이다. 대안으로:

- Semantic Chunking : 연속하는 문장들의 Embeddig similarity 계산 후 급격히 떨어지는 지점에서 자른다. == 주제가 바뀌는 경계를 찾을 수 있다. LlamaIndex, `SemanticSplitterNodeParser` >> 만약 텍스트 자체가 readable 하지 않은 경우에도 가능한지 생각해볼것. 

- Layout-aware: 시각적 구조, 레이아웃을 parse한 후, 그 단위로 자른다. 페이지 번호가 아니라 문서 구조 따르기. > marketing magazine 이나 broschure 같은거는 잘 안 될 수 있음. 설계도도 안될 확률 매우 높음. 제도 스케치 빡셀듯?
    - `unstructured` Liberary: 제목/본문/표/리스트를 element 단위로 분리
    - `Docling` (IBM) : PDF를 tree structure 로 변환. 강제로 변환하는거라 표나 수식은 굿  > 만약 표가 이미지일 경우에도 가능할지?

- Recursive: 냅다 구조로 잘라버리겟다. `\n\n` > `\n` > `. ` > ` ` 우선순위로 자르되, 청크 크기 한계는 고려할 것.  하이브리드로 사용할 것 이건 preprocess strategy 로 미리 넣어두는게 좋을것 같음. 


## 2. embedding selection

임베딩 selection 이랄게 없는게 방식이 하나이긴 한데,.. 


| Strategy | Description | Strong at | Weak at |
|--|--|--|--|
|Dense(벡터) | 의미(meaning)를 벡터 변환, cosine similarity | 의미유사성, 동의어, 패러프레이즈 | 정확한 키워드/고유명사/코드/부품번호 X |
|Sparse(BM25/Keyword) | word frequency, classical, Elasticsearch, BM25 | 정확한 용어 부품번호 약어 매칭 x | "차량" , "자동차" 매칭 불가 |
| Hybrid | 둘 결합 후 RRF 로 믹스 | 양쪽 장점 | complexity high |
| Learned Sparser(SPLADE) | 신경망 sparse vector | 의미 + 키워드 절충 | 모델 필요 |


-  부품번호, DBC Signal, 약어, 모델 명 등 : 정확성 중요 , Hybrid + Reranker...

> Reranker (ex. BGE-reranker, Cohere Rerank) : 1차 검색 후 후보 30-50개 뽑아서 질문/문서쌍 채점애 상위5개 추려내기, 검색 품질은 이론적으론 좋아야함 


조금 더 써치 필요할 듯. 우선 데이터포맷 자체가 혼선이 많아 그때 그대 맞는 stsrategy 사용해야할듯
 
## 3. Will it really need Embedding? / 정말 이 task 에 임베딩이 필요한가? 

#### 1. w/o Embedding - only keyword search (BM25)
#### 2. w/o Embedding - Long-context 전체 주입

문서가 작을 경우 search 없이 통째로 LLM 컨텍스트에 넣는 방법도 있는데 문서가 너무 heavy 하면 어려울 수도 있음. 근데 지금 들고 있는 information 이 얼마 안되서 이렇게 하는게 더 나을 수도 있겟다.

#### 3. with Embedding : searching meaning

대규모 문서 > 얼마나 대 규모인지, 임베딩없이도 사용 가능한지, 얼마나 오래 사용가능한지, 어느정도 context 까지 가능한지 등 실험 필요


우선 텍스트 부분은 term 이 중요한 부분과 아닌 부분으로 나누어 판별할것. 



