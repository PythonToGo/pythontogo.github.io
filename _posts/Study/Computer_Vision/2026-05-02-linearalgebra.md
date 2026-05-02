---
title: Basic Linear Algebra related to Computer Vision
description: 3D Computer Vision 에 필요한 선형대수 개념을 정리합니다. 관련 참조는 Technical University of Munich 의 Prof. Dr. Daniel Cremers 교수님의 3D Computer Vision 수업을 기반으로 작성되었습니다. 
date: 2026-05-02 11:00:00
categories: [Study, Computer_Vision]
author: PythonToGo
tags: [Computer Vision, Linear Algebra]
# pin: true
math: true
mermaid: true
comments: true
---
{% include pdf-viewer.html %}



# Linear Algebra for 3D Computer Vision

> TU Munich, Prof. Dr. Daniel Cremers | Summer Term 2026  
> 강의 내용 정리 + Exercise Sheet 1 풀이

---

## 목차

1. [벡터 공간 (Vector Space)](#1-벡터-공간-vector-space)
2. [선형 독립과 기저 (Linear Independence & Basis)](#2-선형-독립과-기저)
3. [내적 (Inner Product)](#3-내적-inner-product)
4. [Kronecker Product와 행렬 스택](#4-kronecker-product와-행렬-스택)
5. [선형 변환과 행렬 (Linear Transformations & Matrices)](#5-선형-변환과-행렬)
6. [행렬 군 (Matrix Groups)](#6-행렬-군-matrix-groups)
7. [Range, Null Space, Rank](#7-range-null-space-rank)
8. [고유값과 고유벡터 (Eigenvalues & Eigenvectors)](#8-고유값과-고유벡터)
9. [행렬 노름 (Norms of Matrices)](#9-행렬-노름)
10. [대칭 행렬과 왜대칭 행렬](#10-대칭-행렬과-왜대칭-행렬)
11. [특이값 분해 (SVD)](#11-특이값-분해-svd)
12. [유사역행렬 (Moore-Penrose Pseudoinverse)](#12-유사역행렬)
13. [Exercise Sheet 1 풀이](#13-exercise-sheet-1-풀이)

---

## 1. 벡터 공간 (Vector Space)

### 정의

집합 $V$가 체(field) $\mathbb{R}$ 위의 **선형 공간(linear space)** 또는 **벡터 공간(vector space)**이 되려면, 다음 두 연산에 대해 닫혀 있어야 한다.

- **벡터 덧셈:** $+: V \times V \to V$
- **스칼라 곱셈:** $\cdot: \mathbb{R} \times V \to V$

즉,

$$\alpha v_1 + \beta v_2 \in V \quad \forall v_1, v_2 \in V,\ \forall \alpha, \beta \in \mathbb{R}$$

추가로 다음 성질을 만족한다.

- $(V, +)$는 **가환군(commutative group)**: 영벡터 $0$ (항등원), 역벡터 $-v$ (역원) 존재
- 스칼라 곱은 $\mathbb{R}$의 구조를 존중: $\alpha(\beta u) = (\alpha\beta)u$
- **분배법칙:** $(\alpha + \beta)v = \alpha v + \beta v$, $\alpha(v + u) = \alpha v + \alpha u$

**예시:** $V = \mathbb{R}^n$, $v = (x_1, \ldots, x_n)^\top$

### 부분공간 (Subspace)

벡터 공간 $V$의 부분집합 $W \subset V$가 **부분공간**이 되려면:
- $0 \in W$
- $W$가 덧셈과 스칼라 곱에 대해 닫혀 있을 것

---

## 2. 선형 독립과 기저

### Span (생성 부분공간)

벡터 집합 $S = \{v_1, \ldots, v_k\} \subset V$의 **span**은 해당 벡터들의 모든 선형 결합으로 이루어진 부분공간이다.

$$\text{span}(S) = \left\{ v \in V \;\middle|\; v = \sum_{i=1}^k \alpha_i v_i \right\}$$

### 선형 독립 (Linear Independence)

집합 $S$가 **선형 독립**이란:

$$\sum_{i=1}^k \alpha_i v_i = 0 \implies \alpha_i = 0 \quad \forall i$$

즉, 어떤 벡터도 나머지 벡터들의 선형 결합으로 표현될 수 없다. 그렇지 않으면 **선형 종속(linearly dependent)**이라 한다.

### 기저 (Basis)

벡터 집합 $B = \{v_1, \ldots, v_n\}$이 $V$의 **기저**가 되려면:
1. **선형 독립**일 것
2. $V$를 **span**할 것

기저는 선형 독립인 벡터들의 **최대 집합**이다.

### 기저의 성질

두 기저 $B$와 $B'$ 사이에는 다음이 성립한다.

1. $B$와 $B'$는 벡터의 수가 같다. 이 수 $n$을 공간 $V$의 **차원(dimension)**이라 한다.
2. 임의의 벡터 $v \in V$는 기저 벡터들의 선형 결합으로 **유일하게** 표현된다: $v = \sum_{i=1}^n \alpha_i b_i$
3. 두 기저 사이의 변환은 행렬 $A$로 표현된다: $B' = BA \Leftrightarrow B = B'A^{-1}$

---

## 3. 내적 (Inner Product)

### 정의

벡터 공간 위에서 **내적(inner product, dot product)**은 다음 세 성질을 만족하는 함수 $\langle \cdot, \cdot \rangle: V \times V \to \mathbb{R}$이다.

1. **선형성:** $\langle u, \alpha v + \beta w \rangle = \alpha \langle u, v \rangle + \beta \langle u, w \rangle$
2. **대칭성:** $\langle u, v \rangle = \langle v, u \rangle$
3. **양정치성:** $\langle v, v \rangle \geq 0$, 등호는 $v = 0$일 때만

### 유도되는 구조

내적으로부터 다음이 유도된다.

- **노름(norm):** $|v| = \sqrt{\langle v, v \rangle}$
- **거리(metric):** $d(v, w) = |v - w| = \sqrt{\langle v-w, v-w \rangle}$

이로 인해 $V$는 **거리 공간(metric space)**이 되고, 내적으로부터 거리가 유도되므로 **힐베르트 공간(Hilbert space)**이라 한다.

### 표준 내적과 유클리드 노름

$V = \mathbb{R}^n$에서 **표준(canonical) 내적**은

$$\langle x, y \rangle = x^\top y = \sum_{i=1}^n x_i y_i$$

이로부터 **$L_2$-노름(유클리드 노름)**이 유도된다.

$$|x|_2 = \sqrt{x^\top x} = \sqrt{x_1^2 + \cdots + x_n^2}$$

두 벡터 $v$와 $w$는 $\langle v, w \rangle = 0$일 때 **직교(orthogonal)**라 한다.

---

## 4. Kronecker Product와 행렬 스택

### Kronecker Product (크로네커 곱)

$A \in \mathbb{R}^{m \times n}$, $B \in \mathbb{R}^{k \times l}$에 대해 **크로네커 곱** $A \otimes B$는

$$A \otimes B \equiv \begin{pmatrix} a_{11}B & \cdots & a_{1n}B \\ \vdots & \ddots & \vdots \\ a_{m1}B & \cdots & a_{mn}B \end{pmatrix} \in \mathbb{R}^{mk \times nl}$$

$A$의 각 원소 $a_{ij}$를 $B$ 전체로 교체한 **블록 행렬**이다. 크기는 $(mk) \times (nl)$.

```matlab
C = kron(A, B)
```

### 행렬 스택 (Stack of a Matrix)

행렬 $A \in \mathbb{R}^{m \times n}$의 **스택** $A^s$는 $n$개의 열벡터 $a_1, \ldots, a_n \in \mathbb{R}^m$을 위에서 아래로 이어 붙인 벡터다.

$$A^s \equiv \begin{pmatrix} a_1 \\ \vdots \\ a_n \end{pmatrix} \in \mathbb{R}^{mn}$$

### 응용

이 두 표기법을 이용하면 대수식을 선형 형태로 재작성할 수 있다.

$$u^\top A v = (v \otimes u)^\top A^s$$

좌변의 이차 형식을 우변에서 두 벡터의 내적 형태로 변환할 수 있어, 행렬 $A$에 대한 최적화 문제를 선형 문제로 바꿀 때 유용하다.

---

## 5. 선형 변환과 행렬

### 선형 변환의 정의

두 선형 공간 $V$와 $W$ 사이의 함수 $L: V \to W$가 다음 두 조건을 만족하면 **선형 변환(linear transformation)**이라 한다.

- $L(x + y) = L(x) + L(y) \quad \forall x, y \in V$
- $L(\alpha x) = \alpha L(x) \quad \forall x \in V,\ \alpha \in \mathbb{R}$

### 행렬 표현

선형성 덕분에, $L$의 작용은 기저 벡터들에서의 결과만으로 완전히 결정된다. 표준 기저 $\{e_1, \ldots, e_n\}$에 대해

$$L(x) = Ax \quad \forall x \in V$$

여기서 $A$는 기저 벡터들에 대한 $L$의 결과를 열로 모은 행렬이다.

$$A = \bigl(L(e_1),\ \ldots,\ L(e_n)\bigr) \in \mathbb{R}^{m \times n}$$

### ℳ(n)의 환(Ring) 구조

$m = n$인 경우 모든 실수 $n \times n$ 행렬의 집합 $\mathcal{M}(n)$은 행렬 곱셈과 덧셈에 대해 **환(ring)**을 이룬다. 단, 행렬 곱셈은 일반적으로 교환법칙이 성립하지 않는다 ($AB \neq BA$).

---

## 6. 행렬 군 (Matrix Groups)

### 군(Group)의 정의

집합 $G$와 연산 $\circ: G \times G \to G$에 대해 다음 네 조건을 만족하면 **군**이라 한다.

1. **닫혀있음:** $g_1 \circ g_2 \in G \quad \forall g_1, g_2 \in G$
2. **결합법칙:** $(g_1 \circ g_2) \circ g_3 = g_1 \circ (g_2 \circ g_3)$
3. **항등원:** $\exists e \in G: e \circ g = g \circ e = g \quad \forall g \in G$
4. **역원:** $\exists g^{-1} \in G: g \circ g^{-1} = g^{-1} \circ g = e \quad \forall g \in G$

### 일반 선형군 GL(n)

행렬 곱셈에 대해 가역인 $n \times n$ 실수 행렬 전체의 집합.

$$GL(n) = \{A \in \mathcal{M}(n) \mid \det(A) \neq 0\}$$

### 특수 선형군 SL(n)

$$SL(n) = \{A \in GL(n) \mid \det(A) = 1\}$$

역원도 이 군 안에 있다: $\det(A^{-1}) = \det(A)^{-1} = 1$. 부피를 보존하는 선형 변환들의 군이다.

### 직교군 O(n)

내적을 보존하는 행렬들의 집합.

$$O(n) = \{R \in GL(n) \mid R^\top R = I\}$$

$\det(R)^2 = 1$이므로 $\det(R) \in \{+1, -1\}$.

### 특수 직교군 SO(n)

$$SO(n) = O(n) \cap SL(n) = \{R \in O(n) \mid \det(R) = +1\}$$

특히 **$SO(3)$는 3D 회전 행렬 전체의 군**이다.

### 어파인군 A(n)

$A \in GL(n)$, $b \in \mathbb{R}^n$에 의해 정의되는 변환 $L(x) = Ax + b$의 집합.  
동차 좌표계로 선형화하면

$$\begin{pmatrix} x \\ 1 \end{pmatrix} \mapsto \begin{pmatrix} A & b \\ 0 & 1 \end{pmatrix} \begin{pmatrix} x \\ 1 \end{pmatrix}$$

### 유클리드군 E(n)과 특수 유클리드군 SE(n)

$$E(n) = \left\{ \begin{pmatrix} R & T \\ 0 & 1 \end{pmatrix} \;\middle|\; R \in O(n),\ T \in \mathbb{R}^n \right\}$$

$R \in SO(n)$이면 **특수 유클리드군 $SE(n)$**. 특히 **$SE(3)$는 3D 강체 운동(rigid-body motion)**을 나타낸다.

### 군들의 포함 관계

$$SO(n) \subset O(n) \subset GL(n)$$

$$SO(n) \subset SL(n) \subset GL(n)$$

$$SE(n) \subset E(n) \subset A(n) \subset GL(n+1)$$

### 군의 행렬 표현 (Matrix Representation)

군 $G$에 대해 군 구조를 보존하는 단사 동형사상 $R: G \to GL(n)$이 존재하면 $G$는 **행렬 표현**을 가진다.

$$R(e) = I_{n \times n}, \quad R(g \circ h) = R(g)R(h) \quad \forall g, h \in G$$

이러한 $R$을 **군 준동형사상(group homomorphism)**이라 한다.

---

## 7. Range, Null Space, Rank

### Range (치역)

행렬 $A \in \mathbb{R}^{m \times n}$의 **range**는 $A$로 도달 가능한 $\mathbb{R}^m$의 부분공간이다.

$$\text{range}(A) = \{y \in \mathbb{R}^m \mid \exists x \in \mathbb{R}^n: Ax = y\}$$

range(A)는 $A$의 **열벡터들의 span**과 같다.

### Null Space / Kernel (영공간)

$$\text{null}(A) \equiv \ker(A) = \{x \in \mathbb{R}^n \mid Ax = 0\}$$

$\ker(A)$는 $A$의 **행벡터들에 직교하는 벡터들**로 이루어진다.

```matlab
Z = null(A)
```

### 선형 방정식과의 관계

- $Ax = b$의 해가 존재할 필요충분조건: $b \in \text{range}(A)$
- 해가 유일할 필요충분조건: $\ker(A) = \{0\}$
- $x_s$가 해이고 $x_o \in \ker(A)$이면, $x_s + x_o$도 해이다.

### Rank

$$\text{rank}(A) = \dim(\text{range}(A))$$

주요 성질:

1. $\text{rank}(A) = n - \dim(\ker(A))$ ← **Rank-Nullity 정리**
2. $0 \leq \text{rank}(A) \leq \min\{m, n\}$
3. $\text{rank}(A)$는 선형 독립인 열(또는 행) 벡터의 최대 개수
4. Sylvester 부등식: $\text{rank}(A) + \text{rank}(B) - n \leq \text{rank}(AB) \leq \min\{\text{rank}(A), \text{rank}(B)\}$

```matlab
d = rank(A)
```

---

## 8. 고유값과 고유벡터

### 정의

$A \in \mathbb{C}^{n \times n}$에 대해 $Av = \lambda v$ ($v \neq 0$)를 만족하는 $v \in \mathbb{C}^n$을 **우측 고유벡터(right eigenvector)**, $\lambda \in \mathbb{C}$를 **고유값(eigenvalue)**이라 한다.

행렬 $A$의 모든 고유값의 집합을 **스펙트럼(spectrum)** $\sigma(A)$라 한다.

```matlab
[V,D] = eig(A)  % D: 고유값 대각 행렬, V의 열: 고유벡터, AV = VD
```

### 주요 성질

1. $\sigma(A) = \sigma(A^\top)$
2. 서로 다른 고유값에 대응하는 고유벡터들은 **선형 독립**
3. 모든 고유값은 **특성 다항식** $\det(\lambda I - A) = 0$의 근
4. $B = PAP^{-1}$이면 $\sigma(B) = \sigma(A)$ (닮음 변환은 스펙트럼 보존)
5. $\lambda \in \mathbb{C}$가 고유값이면 켤레 $\bar{\lambda}$도 고유값 (실수 행렬의 경우)

---

## 9. 행렬 노름

### 유도 2-노름

$$\|A\|_2 \equiv \max_{|x|_2=1} |Ax|_2 = \sigma_1$$

(최대 특이값)

### Frobenius 노름

$$\|A\|_f \equiv \sqrt{\sum_{i,j} a_{ij}^2} = \sqrt{\text{trace}(A^\top A)} = \sqrt{\sigma_1^2 + \cdots + \sigma_n^2}$$

---

## 10. 대칭 행렬과 왜대칭 행렬

### 대칭 행렬 (Symmetric Matrix)

$S^\top = S$인 행렬. 양반정치(PSD): $x^\top Sx \geq 0$이면 $S \succeq 0$, 양정치(PD): $x^\top Sx > 0\ (\forall x \neq 0)$이면 $S \succ 0$.

실수 대칭 행렬 $S$의 성질:

1. 모든 고유값이 **실수**: $\sigma(S) \subset \mathbb{R}$
2. 서로 다른 고유값의 고유벡터들은 **직교**
3. $n$개의 정규직교 고유벡터가 항상 존재 → **$S = V\Lambda V^\top$** (고유값 분해)
4. $S \succeq 0 \Leftrightarrow$ 모든 고유값 $\geq 0$
5. 최대/최소 고유값: $\lambda_1 = \max_{|x|=1} \langle x, Sx \rangle$, $\lambda_n = \min_{|x|=1} \langle x, Sx \rangle$

### 왜대칭 행렬 (Skew-symmetric Matrix)

$A^\top = -A$인 행렬. 실수 왜대칭 행렬의 성질:

1. 모든 고유값이 **순허수** 또는 0: $i\omega$ 형태 ($\omega \in \mathbb{R}$)
2. $A = V\Lambda V^\top$으로 분해 가능 (블록 대각 구조)
3. 모든 왜대칭 행렬의 rank는 **짝수**

### 모자 연산자 (Hat Operator)

컴퓨터 비전에서 자주 쓰이는 왜대칭 행렬: 벡터 $u \in \mathbb{R}^3$에 대해

$$\hat{u} = \begin{pmatrix} 0 & -u_3 & u_2 \\ u_3 & 0 & -u_1 \\ -u_2 & u_1 & 0 \end{pmatrix} \in \mathbb{R}^{3 \times 3}$$

성질: $\hat{u}v = u \times v$ (벡터 외적). $u \neq 0$이면 $\text{rank}(\hat{u}) = 2$이고 $\ker(\hat{u}) = \text{span}\{u\}$.

---

## 11. 특이값 분해 (SVD)

### 개요

SVD는 rank, range, null space, 행렬 노름 등 행렬의 핵심 성질 대부분을 포착하는 **가장 강력한 분해 도구**다. 고유값 분해의 비정사각 행렬 버전으로 볼 수 있으며, 수치적으로 매우 안정적이다.

응용: 행렬 역행렬, rank 계산, 최소제곱 추정, 투영, 저rank 근사

### 정리 (SVD 존재성)

$A \in \mathbb{R}^{m \times n}$ ($m \geq n$), $\text{rank}(A) = p$이면, 다음이 존재한다.

- $U \in \mathbb{R}^{m \times p}$: 열이 정규직교
- $V \in \mathbb{R}^{n \times p}$: 열이 정규직교
- $\Sigma \in \mathbb{R}^{p \times p}$: $\Sigma = \text{diag}\{\sigma_1, \ldots, \sigma_p\}$, $\sigma_1 \geq \cdots \geq \sigma_p > 0$

$$A = U\Sigma V^\top$$

$\sigma_i$를 **특이값(singular values)**이라 한다.

```matlab
[U,S,V] = svd(A)
```

### SVD 도출 과정

$A^\top A \in \mathbb{R}^{n \times n}$은 대칭이고 양반정치이므로 고유값 분해 가능:

$$A^\top A = V \cdot \text{diag}\{\sigma_1^2, \ldots, \sigma_n^2\} \cdot V^\top$$

$u_i \equiv \frac{1}{\sigma_i} Av_i$로 정의하면 $u_i$들은 정규직교하고 $Av_i = \sigma_i u_i$가 성립한다.

### SVD와 고유값 분해의 비교

| 항목      | SVD              | 고유값 분해   |
| --------- | ---------------- | ------------- |
| 적용 대상 | 임의의 행렬      | 정사각 행렬만 |
| 항상 존재 | 예               | 아니오        |
| 직교 기저 | $U$, $V$ 두 개   | 하나 ($P$)    |
| 분해 형태 | $U\Sigma V^\top$ | $PDP^{-1}$    |

### 기하학적 해석

$A = U\Sigma V^\top$에서 $A$는 단위 구를 **타원체**로 변환한다.

$$U^\top y = \Sigma V^\top x \implies \sum_i \frac{\beta_i^2}{\sigma_i^2} = 1$$

타원체의 반축(semi-axes)이 $\sigma_i u_i$이다.

### SVD로부터 얻는 정보

- $\text{rank}(A) = p$ (0이 아닌 특이값의 수)
- $\text{range}(A) = \text{span}\{u_1, \ldots, u_p\}$ (U의 처음 $p$개 열)
- $\ker(A) = \text{span}\{v_{p+1}, \ldots, v_n\}$ (V의 나머지 열)
- $\|A\|_2 = \sigma_1$
- $\|A\|_f = \sqrt{\sigma_1^2 + \cdots + \sigma_p^2}$
- $\ker(A) = \ker(A^\top A)$

---

## 12. 유사역행렬

### 정의 (Moore-Penrose Pseudoinverse)

$A = U\Sigma V^\top$의 **유사역행렬(pseudoinverse)**:

$$A^\dagger = V\Sigma^\dagger U^\top, \quad \Sigma^\dagger = \begin{pmatrix} \Sigma_1^{-1} & 0 \\ 0 & 0 \end{pmatrix}_{n \times m}$$

여기서 $\Sigma_1$은 0이 아닌 특이값들의 대각 행렬이다.

```matlab
X = pinv(A)
```

### 성질

$$AA^\dagger A = A, \quad A^\dagger A A^\dagger = A^\dagger$$

### 응용

$Ax = b$ ($A \in \mathbb{R}^{m \times n}$)에서 $x_{\min} = A^\dagger b$는 $|Ax - b|^2$을 최소화하는 해 중 **노름이 가장 작은 해**다. 즉, **최소제곱 최소노름 해**이다.

---

## 13. Exercise Sheet 1 풀이

> 각 문제의 전체 내용(수식 포함)은 아래 PDF 파일에서 확인할 수 있습니다.  
> 문제 1개당 슬라이드 1페이지, 총 16페이지로 구성되어 있습니다.
>
> 📄 **[1.exercises.pdf](/assets/img/posts/study-cv/1.exercises.pdf)**

---

### Part A: Groups

---

#### 문제 1. 군의 정의

> **Q.** State the definition of a group.

<div class="pdf-viewer-container" data-pdf="/assets/img/posts/study-cv/1.exercises.pdf" data-page="1"></div>

군 $(M, \cdot)$은 집합 $M$과 연산 $\cdot: M \times M \to M$에 대해 다음을 만족한다.

- **결합법칙:** $\forall a, b, c \in M: (a \cdot b) \cdot c = a \cdot (b \cdot c)$
- **항등원:** $\exists e \in M: \forall a \in M: a \cdot e = a$
- **역원:** $\forall a \in M: \exists a^{-1} \in M: a \cdot a^{-1} = e$

---

#### 문제 2. 오른쪽 항등원·역원이 왼쪽도 됨을 증명

> **Q.** Let $(M, \cdot)$ be a group with right identity $e \in M$ ($a \cdot e = a$) and right inverse $a^{-1} \in M$ ($a \cdot a^{-1} = e$). Show that the right identity is also a left identity and the right inverse is also a left inverse.

<div class="pdf-viewer-container" data-pdf="/assets/img/posts/study-cv/1.exercises.pdf" data-page="2"></div>

**왼쪽 역원 ($a^{-1} \cdot a = e$) 증명:**

$b = a^{-1}$으로 놓으면, $b$의 오른쪽 역원 $b^{-1}$ ($b \cdot b^{-1} = e$)이 존재한다.

$$b \cdot a = (b \cdot a) \cdot e = (b \cdot a) \cdot (b \cdot b^{-1}) = b \cdot (a \cdot b) \cdot b^{-1}$$

$a \cdot b = a \cdot a^{-1} = e$이므로

$$= b \cdot e \cdot b^{-1} = b \cdot b^{-1} = e$$

**왼쪽 항등원 ($e \cdot a = a$) 증명:**

위 결과를 이용하면

$$e \cdot a = (a \cdot a^{-1}) \cdot a = a \cdot (a^{-1} \cdot a) = a \cdot e = a$$

---

#### 문제 3. 역원의 유일성

> **Q.** Let $(M, \cdot)$ be a group. Show that the inverse element $a^{-1}$ of $a \in M$ is unique.

<div class="pdf-viewer-container" data-pdf="/assets/img/posts/study-cv/1.exercises.pdf" data-page="3"></div>

$a \cdot c = e$를 만족하는 $c$가 또 있다고 가정하면

$$c = e \cdot c = (a^{-1} \cdot a) \cdot c = a^{-1} \cdot (a \cdot c) = a^{-1} \cdot e = a^{-1}$$

따라서 $c = a^{-1}$이므로 역원은 유일하다.

---

#### 문제 4. 군 여부 판별

> **Q.** Which of the following sets forms a group under matrix multiplication? Prove or disprove.
> - **(a)** $G_1 := \{A \in \mathbb{R}^{n \times n} \mid \det(A) \neq 0 \text{ and } A^\top = A\}$
> - **(b)** $G_2 := \{A \in \mathbb{R}^{n \times n} \mid \det(A) = -1\}$
> - **(c)** $G_3 := \{A \in \mathbb{R}^{n \times n} \mid \det(A) > 0\}$

<div class="pdf-viewer-container" data-pdf="/assets/img/posts/study-cv/1.exercises.pdf" data-page="4"></div>

**(a) $G_1 = \{A \in \mathbb{R}^{n \times n} \mid \det(A) \neq 0,\ A^\top = A\}$ → 군 아님**

**이유 (닫혀있음 실패):** $A, B \in G_1$이어도 $(AB)^\top = B^\top A^\top = BA \neq AB$ (일반적으로).  
$AB$가 반드시 대칭이라는 보장이 없으므로 닫혀있음이 성립하지 않는다.

**(b) $G_2 = \{A \in \mathbb{R}^{n \times n} \mid \det(A) = -1\}$ → 군 아님**

**이유 두 가지:**
- 항등원 없음: $\det(I) = 1 \neq -1$이므로 $I \notin G_2$
- 닫혀있음 실패: $\det(AB) = (-1)(-1) = 1 \notin G_2$

**(c) $G_3 = \{A \in \mathbb{R}^{n \times n} \mid \det(A) > 0\}$ → 군 맞음** ($GL(n)$의 부분군)

- **항등원:** $\det(I) = 1 > 0$ ✓
- **닫혀있음:** $\det(AB) = \det(A)\det(B) > 0$ ✓
- **역원:** $\det(A^{-1}) = 1/\det(A) > 0$ ✓
- **결합법칙:** 행렬 곱셈은 항상 결합법칙 성립 ✓

---

#### 문제 5. 강의에 나온 군과 포함 관계

> **Q.** Which groups were mentioned in the lecture? Write down the names and correct inclusions (e.g. group $A \subset$ group $B$).

<div class="pdf-viewer-container" data-pdf="/assets/img/posts/study-cv/1.exercises.pdf" data-page="5"></div>

강의에서 언급된 군: $SO(n)$, $O(n)$, $GL(n)$, $SL(n)$, $SE(n)$, $E(n)$, $A(n)$

포함 관계:

$$SO(n) \subset O(n) \subset GL(n)$$

$$SO(n) \subset SL(n) \subset GL(n)$$

$$SE(n) \subset E(n) \subset A(n) \subset GL(n+1)$$

---

### Part B: Vector Spaces and Inner Products

---

#### 문제 6. 벡터 공간의 정의

> **Q.** State the definition of a vector space $V$ over a field $\mathbb{K}$. Does $V$ have to satisfy the group properties? What additional properties does a vector space have?

<div class="pdf-viewer-container" data-pdf="/assets/img/posts/study-cv/1.exercises.pdf" data-page="6"></div>

체 $\mathbb{K}$ 위의 벡터 공간 $V$는:

- $(V, +)$가 **가환군(abelian group)**
- 스칼라 곱셈 $\cdot: \mathbb{K} \times V \to V$에 대해: $1v = v$, $\alpha(\beta v) = (\alpha\beta)v$, $(\alpha+\beta)v = \alpha v + \beta v$, $\alpha(v+w) = \alpha v + \alpha w$

$(V, +)$는 반드시 군의 성질을 만족해야 한다. 추가 구조는 스칼라 곱셈과 그 호환성이다.

---

#### 문제 7. 선형독립, span, 기저의 정의

> **Q.** Let $V$ be a vector space over $\mathbb{K}$. State the definition of: linear independence of pairwise distinct $v_1, \ldots, v_k \in V$; the span of a set $M \subset V$; a basis of a subspace $U \subset V$.

<div class="pdf-viewer-container" data-pdf="/assets/img/posts/study-cv/1.exercises.pdf" data-page="7"></div>

**선형독립:**

$$\sum_{i=1}^k \alpha_i v_i = 0 \implies \alpha_i = 0 \quad \forall i$$

**Span:**

$$\text{span}(M) = \left\{ \sum_{i=1}^k \alpha_i v_i \;\middle|\; v_i \in M,\ \alpha_i \in \mathbb{K} \right\}$$

**기저:** 선형 독립이면서 $\text{span}(B) = U$를 만족하는 부분집합 $B \subset V$

---

#### 문제 8. 선형독립/span/기저 검증

#### 문제 8. 선형독립/span/기저 직접 검증

> **Q.** Show (without using the determinant) for each set whether it is (1) linearly independent, (2) spans $\mathbb{R}^3$, and (3) forms a basis of $\mathbb{R}^3$:
> - **(a)** $M_1 = \{(1,1,1)^\top,\ (0,1,1)^\top,\ (0,0,1)^\top\}$
> - **(b)** $M_2 = \{(2,1,0)^\top,\ (1,1,0)^\top\}$

<div class="pdf-viewer-container" data-pdf="/assets/img/posts/study-cv/1.exercises.pdf" data-page="8"></div>

**(a) $M_1 = \{(1,1,1)^\top,\ (0,1,1)^\top,\ (0,0,1)^\top\}$**

**선형독립 검증:** $\alpha_1 v_1 + \alpha_2 v_2 + \alpha_3 v_3 = 0$을 성분별로 풀면

- 1번째 성분: $\alpha_1 = 0$
- 2번째 성분: $\alpha_1 + \alpha_2 = 0 \Rightarrow \alpha_2 = 0$
- 3번째 성분: $\alpha_1 + \alpha_2 + \alpha_3 = 0 \Rightarrow \alpha_3 = 0$

선형독립 ✓

**$\mathbb{R}^3$ Span 검증:** 임의의 $x = (x_1, x_2, x_3)^\top$에 대해

$$x = x_1(v_1 - v_2) + (x_2 - x_1)v_2 + (x_3 - x_2)v_3$$

$\mathbb{R}^3$ span ✓ → **$M_1$은 $\mathbb{R}^3$의 기저** ✓

**(b) $M_2 = \{(2,1,0)^\top,\ (1,1,0)^\top\}$**

**선형독립 검증:** 연립방정식 풀면 $\alpha_1 = \alpha_2 = 0$ → 선형독립 ✓

**Span 검증:** 두 벡터 모두 세 번째 성분이 0이므로 $(0,0,1)^\top$ 등을 표현 불가.  
$\mathbb{R}^3$를 span하지 못함 → **$M_2$는 $\mathbb{R}^3$의 기저가 아님** ✗

---

#### 문제 9. 내적의 정의

> **Q.** A Hilbert space $H$ is a (finite-dimensional) vector space over $\mathbb{K}$ endowed with an inner product. State the definition of an inner product.

<div class="pdf-viewer-container" data-pdf="/assets/img/posts/study-cv/1.exercises.pdf" data-page="9"></div>

내적 $\langle \cdot, \cdot \rangle: H \times H \to \mathbb{K}$은 다음을 만족한다.

- **대칭성:** $\langle u, w \rangle = \langle w, u \rangle$
- **선형성:** $\langle v, \alpha u \rangle = \alpha \langle v, u \rangle$, $\langle v, u+w \rangle = \langle v, u \rangle + \langle v, w \rangle$
- **양정치성:** $v \neq 0 \Rightarrow \langle v, v \rangle > 0$

---

#### 문제 10. 힐베르트 공간 여부 확인

> **Q.** Do the following form Hilbert spaces with the given inner product?
> - **(a)** $\mathbb{R}^n$ with $\langle x, y \rangle = x^\top y$
> - **(b)** $\mathbb{R}^{n \times m}$ with $\langle A, B \rangle = \mathrm{tr}(A^\top B)$

<div class="pdf-viewer-container" data-pdf="/assets/img/posts/study-cv/1.exercises.pdf" data-page="10"></div>

**(a) $\mathbb{R}^n$, $\langle x, y \rangle = x^\top y$ → 힐베르트 공간 맞음**

- 대칭성: $x^\top y = \sum_i x_i y_i = y^\top x$ ✓
- 선형성: 자명 ✓
- 양정치성: $x^\top x = \sum_i x_i^2 > 0$ ($x \neq 0$) ✓

**(b) $\mathbb{R}^{n \times m}$, $\langle A, B \rangle = \text{tr}(A^\top B)$ → 힐베르트 공간 맞음**

$A = [a_1, \ldots, a_m]$으로 쓰면

$$\text{tr}(A^\top B) = \sum_{k=1}^m a_k^\top b_k$$

이는 표준 내적의 합으로 환원되므로 (a)의 세 성질이 그대로 성립한다. ✓

---

#### 문제 11. Frobenius norm이 내적 $\text{tr}(A^\top B)$로부터 유도됨을 증명

> **Q.** Show that the Frobenius norm $\|A\|_F = \sqrt{\sum_{i,j} a_{ij}^2}$ for $A \in \mathbb{R}^{n \times m}$ is the norm induced by the inner product $\langle A, B \rangle = \mathrm{tr}(A^\top B)$.

<div class="pdf-viewer-container" data-pdf="/assets/img/posts/study-cv/1.exercises.pdf" data-page="11"></div>

$$\langle A, A \rangle = \text{tr}(A^\top A) = \sum_{k=1}^m a_k^\top a_k = \sum_{k=1}^m \sum_{i=1}^n a_{ik}^2 = \sum_{i,j} a_{ij}^2$$

따라서

$$\sqrt{\langle A, A \rangle} = \sqrt{\sum_{i,j} a_{ij}^2} = \|A\|_F \quad \square$$

---

### Part C: Eigenvalues and SVD

---

#### 문제 12. 대칭행렬의 비직교 고유벡터 → 같은 고유값

> **Q.** Let $A$ be a real symmetric matrix with eigenvalues $\lambda_a$, $\lambda_b$ and eigenvectors $v_a$, $v_b$. Prove: if $v_a$ and $v_b$ are not orthogonal, then $\lambda_a = \lambda_b$.  
> *Hint: Consider $\langle Av_a, v_b \rangle$.*

<div class="pdf-viewer-container" data-pdf="/assets/img/posts/study-cv/1.exercises.pdf" data-page="12"></div>

**힌트:** $\langle Av_a, v_b \rangle$를 두 방향으로 계산한다.

**방향 1** (고유값 정의):

$$\langle Av_a, v_b \rangle = \langle \lambda_a v_a, v_b \rangle = \lambda_a \langle v_a, v_b \rangle$$

**방향 2** ($A = A^\top$ 대칭성):

$$\langle Av_a, v_b \rangle = v_b^\top A v_a = (A^\top v_b)^\top v_a = \langle Av_b, v_a \rangle = \lambda_b \langle v_b, v_a \rangle = \lambda_b \langle v_a, v_b \rangle$$

두 결과를 빼면

$$(\lambda_a - \lambda_b)\langle v_a, v_b \rangle = 0$$

$\langle v_a, v_b \rangle \neq 0$ (비직교 가정)이면 $\lambda_a = \lambda_b$ $\square$

---

#### 문제 13. $\ker(A) = \ker(A^\top A)$ 증명

> **Q.** Let $A \in \mathbb{R}^{m \times n}$. Prove that $\ker(A) = \ker(A^\top A)$.  
> *Hint: Show both directions: (a) $x \in \ker(A) \Rightarrow x \in \ker(A^\top A)$ and (b) $x \in \ker(A^\top A) \Rightarrow x \in \ker(A)$.*

<div class="pdf-viewer-container" data-pdf="/assets/img/posts/study-cv/1.exercises.pdf" data-page="13"></div>

**(a) $x \in \ker(A) \Rightarrow x \in \ker(A^\top A)$:**

$Ax = 0$이면 $A^\top A x = A^\top (Ax) = A^\top 0 = 0$ ✓

**(b) $x \in \ker(A^\top A) \Rightarrow x \in \ker(A)$:**

$A^\top A x = 0$이면 양변에 $x^\top$을 곱하면

$$x^\top A^\top A x = 0 \iff (Ax)^\top(Ax) = 0 \iff \|Ax\|^2 = 0 \iff Ax = 0 \quad \square$$

---

#### 문제 14. SVD의 모든 것

> **Q.** Let $A = U\Sigma V^\top$ be the SVD of $A \in \mathbb{R}^{m \times n}$.
> - **(a)** Write down the dimensions of $U$, $\Sigma$, and $V$.
> - **(b)** What are the similarities and differences between the SVD and the eigenvalue decomposition?
> - **(c)** What is the relationship between $U$, $\Sigma$, $V$ and the eigenvalues/eigenvectors of $A^\top A$ and $AA^\top$?
> - **(d)** What is the interpretation of the singular values? What do they tell us about $A$?

<div class="pdf-viewer-container" data-pdf="/assets/img/posts/study-cv/1.exercises.pdf" data-page="14"></div>

**(a) 차원:**

- $U \in \mathbb{R}^{m \times m}$ (또는 thin SVD에서 $\mathbb{R}^{m \times r}$)
- $\Sigma \in \mathbb{R}^{m \times n}$ (대각)
- $V \in \mathbb{R}^{n \times n}$

**(b) SVD vs 고유값 분해:**

|           | SVD                            | 고유값 분해 |
| --------- | ------------------------------ | ----------- |
| 적용 대상 | 임의의 행렬                    | 정사각 행렬 |
| 항상 존재 | 예                             | 아니오      |
| 직교 기저 | $U$, $V$ 두 개                 | 하나 ($P$)  |
| 분해      | $U\Sigma V^\top$               | $PDP^{-1}$  |
| 공통점    | 둘 다 "회전 × 스케일링 × 회전" |

**(c) U, Σ, V와 고유값의 관계:**

- $V$의 열 = $A^\top A$의 고유벡터
- $U$의 열 = $AA^\top$의 고유벡터
- $\sigma_i^2$ = $A^\top A$ (및 $AA^\top$)의 고유값

**(d) 특이값의 해석:**

- 0이 아닌 특이값의 수 = $\text{rank}(A)$
- $\sigma_1 = \|A\|_2$ (연산자 노름)
- $\sum_i \sigma_i^2 = \|A\|_F^2$
- 기하학적으로: $A$가 단위 구를 타원체로 변환할 때 반축의 길이

---

#### 문제 15. SVD로 Rank-Nullity 정리 증명

> **Q.** Let $A \in \mathbb{R}^{m \times n}$ with SVD $A = U\Sigma V^\top$ and $r$ nonzero singular values.
> - **(a)** Using the SVD, show that $\mathrm{rank}(A) = r$ and that the null space of $A$ is spanned by the last $n-r$ columns of $V$.
> - **(b)** Conclude that $\mathrm{rank}(A) + \dim(\ker(A)) = n$ (the rank-nullity theorem).
> - **(c)** Compute the SVD of $A = \begin{pmatrix}1&2\\2&4\\3&6\end{pmatrix}$ and verify the rank-nullity theorem.

<div class="pdf-viewer-container" data-pdf="/assets/img/posts/study-cv/1.exercises.pdf" data-page="15"></div>

**(a) rank(A) = r이고 null space = V의 마지막 n-r열:**

$A = U\Sigma V^\top$에서

- $i = 1, \ldots, r$: $Av_i = \sigma_i u_i \neq 0$ → range(A) = span$\{u_1, \ldots, u_r\}$, rank(A) = r
- $i = r+1, \ldots, n$: $Av_i = 0$ → ker(A) = span$\{v_{r+1}, \ldots, v_n\}$

**(b) Rank-Nullity 정리:**

$$\text{rank}(A) + \dim(\ker(A)) = r + (n - r) = n \quad \square$$

**(c) 구체적 예시:**

$$A = \begin{pmatrix}1&2\\2&4\\3&6\end{pmatrix} = \begin{pmatrix}1\\2\\3\end{pmatrix}(1\;2)$$

- rank = 1 (열 공간 = span$\{(1,2,3)^\top\}$)
- ker(A) = span$\{(-2,1)^\top\}$ → dim = 1

$$\text{rank}(A) + \dim(\ker(A)) = 1 + 1 = 2 = n \quad \checkmark$$

---

#### 문제 16. Low-Rank Approximation (Eckart-Young 정리)

> **Q.** The Eckart–Young theorem states that the best rank-$k$ approximation of $A$ in the Frobenius norm is $A_k = \sum_{i=1}^k \sigma_i u_i v_i^\top$.
> - **(a)** Show that $\|A - A_k\|_F^2 = \sum_{i=k+1}^r \sigma_i^2$.  
>   *Hint: Use the fact that the Frobenius norm is unitarily invariant: $\|UBV^\top\|_F = \|B\|_F$.*
> - **(b)** If $A \in \mathbb{R}^{m \times n}$ has rank $r$, how many numbers do we need to store the full matrix? How many for the rank-$k$ approximation $A_k = U_k\Sigma_k V_k^\top$?
> - **(c)** For what values of $k$ does the rank-$k$ approximation actually save storage?

<div class="pdf-viewer-container" data-pdf="/assets/img/posts/study-cv/1.exercises.pdf" data-page="16"></div>

**(a) $\|A - A_k\|_F^2 = \sum_{i=k+1}^r \sigma_i^2$ 증명:**

$$A - A_k = U\Sigma V^\top - U\Sigma_k V^\top = U(\Sigma - \Sigma_k)V^\top$$

Frobenius norm의 유니터리 불변성 $\|UBV^\top\|_F = \|B\|_F$을 사용하면

$$\|A - A_k\|_F^2 = \|\Sigma - \Sigma_k\|_F^2 = \sigma_{k+1}^2 + \cdots + \sigma_r^2 \quad \square$$

**(b) 저장 공간 비교:**

- 전체 행렬 $A \in \mathbb{R}^{m \times n}$: $mn$개
- Rank-$k$ 근사 $A_k = U_k \Sigma_k V_k^\top$:
  - $U_k \in \mathbb{R}^{m \times k}$: $mk$개
  - $\Sigma_k$: 대각이므로 $k$개
  - $V_k \in \mathbb{R}^{n \times k}$: $nk$개
  - 합계: $k(m + n + 1) \approx k(m + n)$개

**(c) 저장 절약 조건:**

$$k(m + n) < mn \iff k < \frac{mn}{m+n}$$

정사각행렬 ($m = n$)의 경우: $k < \frac{n}{2}$

즉, rank가 행/열 수의 절반 미만일 때 rank-$k$ 근사가 저장 공간을 절약한다.

---
