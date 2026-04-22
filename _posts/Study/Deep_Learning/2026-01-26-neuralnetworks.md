<!-- ---
title: Neural Networks
description: Summary of Logical Agents
date: 2026-01-12 05:00:00
categories: [Study, Deep_Learning]
author: PythonToGo
tags: [Deep Learning, Neural Networks, ]
# pin: true
math: true
mermaid: true
comments: true
image: 
#     # type: pdf
    # path: assets/img/posts/study-ai/ch7-re-proof.png

#     # page: 7
#     alt: 
---
{% include pdf-viewer.html %}

# Neural Networks

## Overview

**Neural Networks**는 여러 개의 함수 $$f(x), g(x), h(x), ...$$ 가 결합 된 형태 $$ y = h(g(f(x))) ... $$ 로 정의된다. 


기본적을 Input layer, Hidden layer, Output layer 로 구성되며, hidden layer 의 갯수와 각 층의 neurons 수는 유저가 튜닝해야하는 **hyperparameter** 이다.

실제 컴퓨터연산 할땐, 여러개의 입력을 **batch** 단위로 묶어 병렬/독립 적으로 처리 가능하게 함.! 


## Fully Connected Layer (FC Layer/Affine Layer)

보통 가장 기본적인 연산이고, **Dense layer** 라고도 부른다. 기본적으로 affine graph 를 생각하면 되므로, 수식으로 표현 하면 $$y = XW + b$$ 이다. 

디멘션, 범위들을 조금 더 자세히 보자면, 

| Symbol | Desc |
|---|---|
| $$X \in R^{N \times D}$$ | 입력 데이터, $$N$$ batch size, $$D$$ num of feature|
| $$W \in R{D \times M}$$ | Weight matrix 학습가능변수(!)
| $$b \in R{M}$$ | Bias vector 학습가능변수(!)
 -->
