---
title: Transformer architecture and GPTs
description: Transformer architecture and GPTs
date: 2026-04-15 19:00:00
categories: [Study, Foundation_Models]
author: PythonToGo
tags: [Foundation Models]
# pin: true
math: true
mermaid: true
comments: true
image: 
    # path: assets/img/posts/study-ml/ch12-front.png
#     alt: <div class="pdf-viewer-container" data-pdf="" data-page="2"></div>
---
{% include pdf-viewer.html %}

# Transformer architecture and GPTs

## Fundamentals of GPT

GPT 는 크게 세 부분으로 나뉜다. 

> Token Sequence -> [Input Embedding] -> 
>
> [Transformer Blocks x n_layers] -> [Output Embedding] 
>
> -> Probability Distribution
<!-- {: .prompt-info } -->


Parameter 의 아키텍쳐는 아래와 같다. (구성 요소)

| Parameter        | Symbol | Description                       |
| ---------------- | ------ | --------------------------------- |
| `dim_embd`       | $d$    | 각 토큰의 벡터 차원               |
| `vocab_size`     | $v$    | size of words                     |
| `context_length` | $$c$$  | 한 번에 볼 수 있는 최대 토큰 수   |
| `n_heads`        |        | Multi-head Attention의 head 의 수 |
| `n_layers`       |        | Transformer block 반복 수         |


## Input Embedding

Token 은 먼저 정수 인덱스(Token ID)로 표현된다. 이 정수 인덱스를 연속적인 벡터 표현으로 바꾸는 과정을 embedding 이라고 한다.

> Token IDs
> $\rightarrow$ Token Embedding $+$ Positional Embedding
> $= X$
>
> $[5, 23, 7, \dots]$
> $\rightarrow (c \times d)$ matrix $+ (c \times d)$ matrix
> $= (c \times d)$ matrix
{: .prompt-tip} 

### Token Embedding

**단어 ID $\rightarrow d$차원 벡터, 파라미터 수 = $v \times d$**

토큰 임베딩은 lookup table이다.

```text
어휘 전체 (v개 단어)
       ↓
┌─────────────────────────┐
│  "I"     → [0.2, 0.5, 0.1, ...]  ← d차원 벡터
│  "love"  → [0.8, 0.1, 0.9, ...]  ← d차원 벡터
│  "you"   → [0.3, 0.7, 0.2, ...]  ← d차원 벡터
│  ...                              (총 v개 행)
└─────────────────────────┘
           이 테이블 = (v × d) 행렬
```

- 단어가 v개 있고
- 각 단어마다 d개의 숫자(파라미터)가 필요하니까
- 총 파라미터 수는 $v \times d$

토큰 ID가 들어오면 이 테이블에서 해당 행을 꺼내면 된다.

```text
입력: [5, 23, 7]
→ 테이블 5번째 행, 23번째 행, 7번째 행을 꺼냄
→ 결과: (3 × d) 행렬, 일반적으로 (c × d)
```


### Positional Embedding

**위치 정보 $\rightarrow d$차원 벡터, 파라미터 수 = $c \times d$**

"I love you"에서 love가 2번째 위치라는 정보이다.

왜 필요한가? Attention은 위치 정보를 직접 알지 못하기 때문이다. 토큰 임베딩만 쓰면 "I love you"와 "you love I"는 같은 벡터 집합으로 보일 수 있다.

```text
위치 임베딩도 룩업 테이블:

위치 0 → [0.1, 0.3, 0.5, ...]  ← d차원 벡터
위치 1 → [0.9, 0.2, 0.4, ...]  ← d차원 벡터
위치 2 → [0.6, 0.8, 0.1, ...]  ← d차원 벡터
...
위치 c-1 → [...]               (총 c개 행)

이 테이블 = (c × d) 행렬  → 파라미터 수 = c × d
```

최대 $c$개 위치가 있고, 각 위치마다 $d$차원 벡터가 있으므로 총 파라미터 수는 $c \times d$이다.

Token Embedding과 Positional Embedding을 합산하면 입력 행렬 $X \in \mathbb{R}^{c \times d}$를 만든다. 총 파라미터 수는 $dv + dc$이다.

두 테이블이 완전히 별개이기 때문.

```text
Token Embedding Table    : v × d 파라미터  (단어 수 × 차원)
Positional Embedding Table: c × d 파라미터  (위치 수 × 차원)
                           ─────────────────
합계                      : dv + dc
```

그리고 실제로 $X$를 만들 때는 두 테이블에서 꺼낸 벡터를 더한다.

```text
"love" (위치 1에 있음)
    토큰 임베딩["love"] = [0.8, 0.1, 0.9, ...]
  + 위치 임베딩[1]      = [0.9, 0.2, 0.4, ...]
  ─────────────────────────────────────────────
  = X의 2번째 행        = [1.7, 0.3, 1.3, ...]
```

"love"라는 단어 정보와 "2번째 위치"라는 정보가 하나의 벡터로 합쳐지는 것이다.


## Attention Layer

입력 $X$로부터 $Q$, $K$, $V$를 생성한다.

```text
Q = X · W_Q     (c × d) · (d × d) = (c × d)
K = X · W_K     (c × d) · (d × d) = (c × d)
V = X · W_V     (c × d) · (d × d) = (c × d)
```

참고로 여기서 $W_Q$, $W_K$, $W_V$를 곱하는 이유는, 같은 단어라도 역할에 따라 다르게 표현해야 하기 때문이다.

```text
Q = X · W_Q    ← "질문하는 역할"로 변환
K = X · W_K    ← "검색 태그 역할"로 변환
V = X · W_V    ← "내용 역할"로 변환
```

그리고 최종 attention 출력은 다음과 같다.

$$
\mathrm{Attention}(Q, K, V) = \mathrm{softmax}\left(\frac{QK^T}{\sqrt{d}}\right)V
$$

- $QK^T \in \mathbb{R}^{c \times c}$: 토큰 간 유사도 행렬
- $\sqrt{d}$: 값이 너무 커지는 것을 막기 위한 scaling
- Masked Attention: 미래 토큰을 $-\infty$로 마스킹하여 GPT처럼 autoregressive 생성이 가능하게 함

> Q, K, V를 직관적으로 이해해보자.
>
> 클로드는 도서관 검색으로 비유하라고 한다.
>
> ```text
> Q (Query) = 내가 찾고 싶은 것     "파이썬 관련 책"
> K (Key)   = 각 책의 라벨/태그     "파이썬", "자바", "머신러닝", ...
> V (Value) = 책의 실제 내용        (실제로 읽고 싶은 정보)
> ```
>
> 1. Q와 K를 비교해서 얼마나 관련 있는지 점수를 낸다. ($QK^T$)
> 2. 점수를 softmax로 확률(가중치)로 변환한다.
> 3. 그 가중치로 V를 가중합하여 최종 출력을 만든다.
>
> 다시 원래 문장으로 돌아와서, "love"가 다른 단어들을 얼마나 참고해야 하는지 계산한다고 가정하자.
>
> ```text
> Q: "love"가 묻는다 → "나와 관련 있는 단어가 뭐야?"
>
> K: 각 단어가 답한다
>     "I"    → 나는 이런 단어야 [키 벡터]
>     "love" → 나는 이런 단어야 [키 벡터]
>     "you"  → 나는 이런 단어야 [키 벡터]
>
> Q · K^T = 유사도 점수
>     love ↔ I    = 0.8  (주어이므로 중요)
>     love ↔ love = 1.0  (자기 자신)
>     love ↔ you  = 0.9  (목적어이므로 중요)
>
> softmax → 가중치
>     I    = 0.28
>     love = 0.36
>     you  = 0.36
>
> 최종 출력 = 0.28 × V["I"] + 0.36 × V["love"] + 0.36 × V["you"]
> ```
>
> 즉, "love"의 출력 벡터는 I, love, you의 정보를 섞은 것이다.
{: .prompt-info}


## Output Embedding

Transformer의 최종 출력 $\tilde{X} \in \mathbb{R}^{c \times d}$는 아직 단어 확률이 아니라, 각 위치의 hidden representation이다. 다음 토큰의 확률 분포를 얻으려면 이를 어휘 공간으로 다시 투영해야 한다.

```text
X_tilde (c × d)
→ 출력 행렬 (d × v)
→ logits (c × v)
→ softmax
→ 확률 분포
```

수식으로 쓰면 다음과 같다.

$$
\mathrm{logits} = \tilde{X} W_{\mathrm{out}}, \qquad W_{\mathrm{out}} \in \mathbb{R}^{d \times v}
$$

즉, 각 위치의 $d$차원 벡터를 길이 $v$의 벡터로 바꾸는 것이다. 여기서 $v$는 vocabulary size이며, 각 원소는 해당 단어가 다음 토큰일 점수(logit)를 의미한다.

```text
예: 어떤 위치의 logits = [2.1, 0.3, -1.2, ...]
→ softmax
→ 확률 분포 = [0.78, 0.13, 0.02, ...]
```

### Weight Tying

많은 GPT 계열 모델은 출력 임베딩 행렬을 입력 임베딩 행렬과 공유한다. 이를 weight tying이라고 한다.

입력 임베딩 행렬을 $E \in \mathbb{R}^{v \times d}$라고 하면, 출력 projection에서는 보통 그 전치행렬 $E^T \in \mathbb{R}^{d \times v}$를 사용한다.

```text
입력 임베딩 테이블: E    ∈ R^(v × d)
출력 projection    : E^T  ∈ R^(d × v)
```

이렇게 하면 출력용 행렬을 별도로 새로 학습하지 않아도 되므로 추가 파라미터 수는 0이다. 즉, 입력 임베딩과 출력 임베딩이 같은 파라미터를 공유한다.
