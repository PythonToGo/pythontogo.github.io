---
title: Representing a Moving Scene
description: 3D Computer Vision 에 필요한 강체 운동(rigid-body motion)과 Lie 군/대수 개념을 정리합니다. 관련 참조는 Technical University of Munich 의 Prof. Dr. Daniel Cremers 교수님의 3D Computer Vision 수업을 기반으로 작성되었습니다.
date: 2026-06-01 11:00:00
categories: [Study, Computer_Vision]
author: PythonToGo
tags: [Computer Vision, Rigid Body Motion, Lie Group]
# pin: true
math: true
mermaid: true
comments: true
image:
 /assets/img/posts/study-cv/ch2_fig2_lie.png
---
{% include pdf-viewer.html %}

## 들어가며

1장(선형대수 기초 — vector space, SVD, 그리고 군 $GL(n) \supset O(n) \supset SO(3)$, $SE(3)$)의 마지막에 잠깐 등장했던 **$SO(3)$ (특수직교군, special orthogonal group)** 과 **$SE(3)$ (특수유클리드군, special Euclidean group)** 이 이번 2장의 주인공입니다. 1장에서는 "이런 군이 있다"고 정의만 하고 지나갔지만, 이번 장에서는 이 군들이 **왜 카메라/물체의 움직임을 표현하는 자연스러운 언어인지**, 그리고 그것을 어떻게 미분하고 지수화(exponential)하는지를 깊이 다룹니다.

이번 장은 하나의 질문으로 묶여 있습니다: **"움직이는 장면(moving scene)을 수학으로 어떻게 적을까?"**

1. 3D 재구성의 역사 (origins of 3D reconstruction)
2. 3D 공간과 강체 운동 (3D space & rigid-body motion)
3. Lie 군 $SO(3)$ — 회전
4. Lie 군 $SE(3)$ — 회전 + 이동
5. 카메라 운동 표현 (representing the camera motion)
6. Euler angles와 그 한계 → quaternion

---

## 1. The Origins of 3D Reconstruction

핵심 메시지부터: 2D 사진들로부터 3D를 복원하는 것은 **ill-posed problem (불량설정 문제)** 입니다. 같은 이미지들을 만들어낼 수 있는 3D 장면이 유일하지 않기 때문입니다. 그래서 항상 **추가 가정(additional assumptions)** 이 필요합니다.

수학적으로 이 분야는 두 종류의 변환(transformation)에 기반합니다.

- **Euclidean / rigid-body motion (유클리드 운동 / 강체 운동)** — 카메라가 한 프레임에서 다음 프레임으로 움직이는 것 → **이번 장의 주제**
- **Perspective projection (원근 투영)** — 3D가 2D 이미지로 맺히는 과정 → 다음 장(3장, pinhole camera)의 주제

역사적으로 원근 투영은 고대 그리스(Euclid, ~400 B.C.)와 르네상스(Brunelleschi & Alberti, 1435)에서 시작해 **projective geometry (사영기하학)** 으로 발전했습니다.

기억해둘 인물·연도:

- **Kruppa (1913)**: 두 시점에서 점 5개면 motion과 structure를 유한 개 해까지 결정할 수 있음을 증명.
- **Longuet-Higgins (1981)**: **epipolar constraint (에피폴라 제약)** 기반 선형 알고리즘 — 이후 강의의 핵심 도구.
- camera motion과 3D 위치를 함께 추정하는 것을 **structure and motion**, 요즘 말로는 **visual SLAM (Simultaneous Localization and Mapping)** 이라 부릅니다.

> Cremers 교수가 공동 저자인 *SLAM Handbook* (2025)이 추천도서에 있는 건 우연이 아닙니다. 이 장의 수학($SE(3)$)이 SLAM의 뼈대입니다.

---

## 2. 3D Euclidean Space와 Cross Product

### 2.1 Euclidean space $\mathbb{E}^3$

점(point) $p \in \mathbb{E}^3$를 좌표 $\boldsymbol{X} = (X_1, X_2, X_3)^\top \in \mathbb{R}^3$와 동일시합니다. 두 점으로 만든 벡터

$$v = \boldsymbol{X} - \boldsymbol{Y} \in \mathbb{R}^3$$

는 기준점 $\boldsymbol{Y}$에 묶이면 **bound vector (속박 벡터)**, 기준점을 떼면 **free vector (자유 벡터)** 입니다. 이렇게 $\mathbb{E}^3 \cong \mathbb{R}^3$로 동일시하면 내적·노름·거리를 정의할 수 있어 곡선 길이

$$l(\gamma) = \int_0^1 |\dot{\gamma}(s)|\,ds, \qquad \gamma:[0,1] \to \mathbb{R}^3,$$

넓이, 부피를 잴 수 있게 됩니다.

### 2.2 Cross product와 skew-symmetric matrix

이번 장에서 가장 중요한 도구입니다.

$$u \times v = \begin{pmatrix} u_2 v_3 - u_3 v_2 \\ u_3 v_1 - u_1 v_3 \\ u_1 v_2 - u_2 v_1 \end{pmatrix} \in \mathbb{R}^3$$

이것은 $u$, $v$ 둘 다에 직교하는 벡터이고, $u \times v = -v \times u$ 이므로 **방향(orientation)** 을 만들어냅니다.

핵심 트릭: $u$를 고정하면 사상 $v \mapsto u \times v$ 는 **선형 사상**이고, 따라서 행렬로 표현됩니다. 그 행렬이 **hat 연산자** $\hat{u}$ 입니다.

$$\hat{u} = \begin{pmatrix} 0 & -u_3 & u_2 \\ u_3 & 0 & -u_1 \\ -u_2 & u_1 & 0 \end{pmatrix} \in \mathbb{R}^{3\times3}, \qquad u \times v = \hat{u}\,v$$

이것은 **skew-symmetric matrix (반대칭 행렬)**, 즉 $\hat{u} = -\hat{u}^\top$ 입니다. 반대로 모든 $3\times3$ 반대칭 행렬은 어떤 벡터 $u$로 환원됩니다. 그래서 hat 연산자는 $\mathbb{R}^3$와 모든 반대칭 행렬의 공간 $so(3)$ 사이의 **isomorphism (동형사상)** 이고, 역연산은 $\vee: so(3) \to \mathbb{R}^3$ 입니다.

이 $\hat{\cdot}$ 와 $so(3)$ 라는 이름표를 꼭 기억하세요. 잠시 후 $so(3)$가 "$SO(3)$의 Lie algebra"라는 정체를 드러냅니다.

![Cross product and skew-symmetric matrix](/assets/img/posts/study-cv/ch2_fig1_cross_skew.png)
_(a) cross product는 두 벡터에 직교하며 오른손 법칙으로 방향이 정해진다. (b) 벡터를 반대칭 행렬로 바꾸는 hat 연산자._

---

## 3. Rigid-body Motion

### 3.1 정의

**Rigid-body motion (강체 운동)** 은 시간에 따라 변하는 사상 $g_t: \mathbb{R}^3 \to \mathbb{R}^3$의 족(family)인데, 두 성질을 보존합니다.

- 노름 보존: $|g_t(v)| = |v|, \quad \forall v \in \mathbb{R}^3$
- cross product 보존: $g_t(u) \times g_t(v) = g_t(u \times v), \quad \forall u, v \in \mathbb{R}^3$

**polarization identity**

$$\langle u,v\rangle = \tfrac14\big(|u+v|^2 - |u-v|^2\big)$$

때문에, 노름을 보존하면 내적(inner product)도 자동으로 보존됩니다. 결과적으로 강체 운동은 **triple product** $\langle u, v\times w\rangle$ 도 보존하므로 **volume-preserving (부피 보존)** 입니다.

> 직관: 강체는 휘거나 늘어나지 않으니 거리·각도·부피·방향(손잡이)이 다 그대로여야 한다 — 이 물리적 직관을 수학 조건으로 옮긴 것입니다.

### 3.2 표현 (representation) — $SO(3)$의 등장

강체에 좌표 프레임(원점 + 정규직교 벡터 $e_1, e_2, e_3$)을 붙이면, 운동은 그 프레임의 움직임만으로 완전히 결정됩니다.

- 원점의 이동 → **translation** $T \in \mathbb{R}^3$
- 축들의 변환 → 새 벡터 $r_i = g_t(e_i)$

내적·cross product 보존에서:

$$r_i^\top r_j = g_t(e_i)^\top g_t(e_j) = e_i^\top e_j = \delta_{ij}, \qquad r_1 \times r_2 = r_3$$

첫 조건은 $R = (r_1, r_2, r_3)$ 이 **orthogonal matrix**라는 뜻 ($R^\top R = R R^\top = I$), 둘째 조건은 $\det(R) = +1$ 을 의미합니다. 즉 $R$은 1장에서 본 그 군의 원소입니다.

$$SO(3) = \{ R \in \mathbb{R}^{3\times3} \mid R^\top R = I,\ \det(R) = +1 \}$$

그래서 강체 운동은 깔끔하게 다음과 같이 쓸 수 있습니다.

$$g_t(x) = R x + T$$

> 1장에서 "$SO(3)$는 3D 회전 전부, $SE(3)$는 회전+이동"이라고 정의만 했던 것이, 여기서 물리적 조건(노름·외적 보존)으로부터 *유도*되었습니다.

---

## 4. Lie 군 $SO(3)$ — 회전을 미분하기

이 파트가 이번 장의 수학적 심장입니다.

### 4.1 Exponential coordinates: 무한소 회전

회전들의 연속 족 $R(t) \in SO(3)$, 단 $R(0) = I$ 를 생각합니다. $R R^\top = I$ 를 시간 미분하면:

$$\frac{d}{dt}(R R^\top) = \dot{R}R^\top + R\dot{R}^\top = 0 \;\Rightarrow\; \dot{R}R^\top = -(\dot{R}R^\top)^\top$$

즉 $\dot{R}R^\top$ 는 **반대칭 행렬**입니다. 그러면 앞서 본 hat 연산자로 어떤 벡터 $w(t)$가 존재해서

$$\dot{R}R^\top = \hat{w} \;\Leftrightarrow\; \dot{R} = \hat{w}R$$

$R(0)=I$ 이므로 $\dot{R}(0) = \hat{w}(0)$. 따라서 회전의 1차 근사(first-order approximation)는:

$$R(dt) = R(0) + dR = I + \hat{w}(0)\,dt$$

> 핵심 통찰: **회전을 미분하면 반대칭 행렬이 나온다.** 회전군 위의 "속도"는 항상 $so(3)$에 산다.

### 4.2 Lie 군과 Lie 대수

- **$SO(3)$는 Lie group** — 매끄러운 다양체(smooth manifold)이면서 군이고, 곱셈·역원이 매끄러운 사상.
- **$so(3) = \{\hat{w} \mid w \in \mathbb{R}^3\}$ 는 그 Lie algebra** — $SO(3)$의 **항등원에서의 접공간(tangent space at identity)**.

Lie algebra는 곱셈을 갖춘 벡터 공간인데, 그 곱셈은 일반 행렬곱이 아니라 **Lie bracket (commutator)** 입니다.

$$[\,\cdot\,,\,\cdot\,]: so(3) \times so(3) \to so(3); \qquad [\hat{w}, \hat{v}] = \hat{w}\hat{v} - \hat{v}\hat{w}$$

$\hat{w}\hat{v} \neq \hat{v}\hat{w}$ (회전은 순서가 중요!)이기 때문에 이 bracket이 0이 아니고, 이것이 회전의 비가환성을 담습니다. 이 이론을 만든 사람이 노르웨이 수학자 **Sophus Lie (1841–1899)** 입니다 — 연속 변환군은 그 *선형화 버전*으로 이해하는 게 낫다는 통찰이 핵심입니다.

![Lie group and Lie algebra schematic](/assets/img/posts/study-cv/ch2_fig2_lie.png)
_굽은 파란 곡선이 Lie group $SO(3)$ (곡면), 빨간 직선이 항등원에서의 접선 = Lie algebra $so(3)$ (평평한 벡터공간). 평평한 곳에서 계산한 뒤 $\exp$로 곡면 위로 올리고, $\log$로 다시 내려온다._

### 4.3 The Exponential Map

$\hat{w}$ 가 시간에 대해 일정하다고 가정하면, 미분방정식

$$\dot{R}(t) = \hat{w}R(t), \quad R(0) = I$$

의 해는 **matrix exponential**입니다.

$$R(t) = e^{\hat{w}t} = \sum_{n=0}^{\infty} \frac{(\hat{w}t)^n}{n!} = I + \hat{w}t + \frac{(\hat{w}t)^2}{2!} + \cdots$$

이것은 축 $w$ 주위로 각도 $t$ 만큼 ($\|w\|=1$ 일 때) 도는 회전입니다. $t$를 $\hat{w}$ 안으로 흡수하면 $R = e^{\hat{v}}$, $\hat v = \hat w t$. 그래서 지수사상은 Lie 대수 → Lie 군 사상입니다.

$$\exp: so(3) \to SO(3); \quad \hat{w} \mapsto e^{\hat{w}}$$

> 직관: 각속도 벡터 $w$(축 + 속도)를 주면, 지수함수가 그것을 실제 회전 행렬로 "적분"해줍니다.

### 4.4 The Logarithm

역방향입니다. 임의의 $R \in SO(3)$에 대해 $R = \exp(\hat w)$ 인 $w$가 존재하고, $\hat w = \log(R)$. $R \neq I$ 이면:

$$|w| = \cos^{-1}\!\left(\frac{\operatorname{trace}(R)-1}{2}\right), \qquad \frac{w}{|w|} = \frac{1}{2\sin(|w|)}\begin{pmatrix} r_{32}-r_{23} \\ r_{13}-r_{31} \\ r_{21}-r_{12} \end{pmatrix}$$

해석: **모든 회전은 어떤 축 $w/|w|$ 주위로 각도 $|w|$ 만큼 도는 것**이다 (Euler의 회전 정리). 단 표현은 유일하지 않습니다 — 각도에 $2\pi$를 더해도 같은 회전. 이 비유일성이 나중에 quaternion의 "이중 덮개"와 연결됩니다.

### 4.5 Rodrigues' Formula

무한급수를 닫힌 형태로 만든 것입니다. 복소수의 Euler 공식 $e^{i\phi} = \cos\phi + i\sin\phi$ 에 대응하는 행렬 버전입니다.

$$e^{\hat{w}} = I + \frac{\hat{w}}{|w|}\sin(|w|) + \frac{\hat{w}^2}{|w|^2}\big(1 - \cos(|w|)\big)$$

증명의 열쇠는 반대칭 행렬의 특별한 성질 $\hat v^2 = vv^\top - I$, $\hat v^3 = -\hat v$ (단위벡터 $v = w/|w|$, $t = |w|$)입니다.

$$e^{\hat w} = e^{\hat v t} = I + \underbrace{\left(t - \frac{t^3}{3!} + \frac{t^5}{5!} - \cdots\right)}_{\sin(t)}\hat v + \underbrace{\left(\frac{t^2}{2!} - \frac{t^4}{4!} + \frac{t^6}{6!} - \cdots\right)}_{1-\cos(t)}\hat v^2$$

이 때문에 거듭제곱이 주기적으로 반복되면서 $\sin$, $\cos$ 급수로 깔끔하게 모입니다. **실무에서 회전행렬을 실제로 계산할 때 쓰는 공식**입니다 — 무한급수 대신 이 한 줄.

---

## 5. Lie 군 $SE(3)$ — 회전 + 이동

### 5.1 $SE(3)$의 정의

회전 $R$과 이동 $T$를 합치면 **special Euclidean group**입니다.

$$SE(3) = \{ g = (R,T) \mid R \in SO(3),\ T \in \mathbb{R}^3 \}$$

**Homogeneous coordinates (동차좌표)** 로 쓰면 $4\times4$ 행렬 하나로 곱셈이 처리됩니다.

$$SE(3) = \left\{ g = \begin{pmatrix} R & T \\ 0 & 1 \end{pmatrix} \;\Big|\; R \in SO(3),\ T \in \mathbb{R}^3 \right\} \subset \mathbb{R}^{4\times4}$$

여기서 중요한 개념 구분: **점(point)** 은 회전+이동되지만, **벡터(vector)** 는 회전만 됩니다. 동차좌표에서 점은 끝이 1 $(X,1)^\top$, 자유벡터는 끝이 0 $(v,0)^\top$ — 그래서 $g$를 곱하면 점에만 $T$가 더해집니다.

### 5.2 The Lie Algebra of Twists

$SO(3)$에서 했던 것을 $SE(3)$에서 반복합니다. 연속 족 $g(t)$에 대해

$$\dot{g}(t)g^{-1}(t) = \begin{pmatrix} \dot{R}R^\top & \dot{T} - \dot{R}R^\top T \\ 0 & 0 \end{pmatrix} \in \mathbb{R}^{4\times4}$$

$\dot{R}R^\top = \hat{w} \in so(3)$ (앞과 동일), 그리고 $v = \dot T - \hat w T$ 로 정의하면:

$$\dot{g}(t)g^{-1}(t) = \begin{pmatrix} \hat{w}(t) & v(t) \\ 0 & 0 \end{pmatrix} \equiv \hat{\xi}(t) \in \mathbb{R}^{4\times4}$$

$g(t)$를 오른쪽에서 곱하면 $\dot g = \hat\xi g$. 이 $\hat\xi$ 를 **twist (트위스트)** 라 부르고, 곡선 $g(t)$를 따르는 접벡터로 볼 수 있습니다. 모든 twist의 집합이 $SE(3)$의 Lie algebra입니다.

$$se(3) = \left\{ \hat{\xi} = \begin{pmatrix} \hat{w} & v \\ 0 & 0 \end{pmatrix} \;\Big|\; \hat w \in so(3),\ v \in \mathbb{R}^3 \right\} \subset \mathbb{R}^{4\times4}$$

$\wedge$ / $\vee$ 연산자로 6차원 **twist coordinates** 와 행렬 형태를 오갑니다.

$$\hat\xi = \begin{pmatrix} v \\ w \end{pmatrix}^{\wedge} = \begin{pmatrix} \hat w & v \\ 0 & 0 \end{pmatrix} \in \mathbb{R}^{4\times4}, \qquad \begin{pmatrix} \hat w & v \\ 0 & 0 \end{pmatrix}^{\vee} = \begin{pmatrix} v \\ w \end{pmatrix} \in \mathbb{R}^6$$

여기서 $w$ 는 angular velocity(회전), $v$ 는 translation에 관련된 부분입니다.

### 5.3 Exponential Coordinates for $SE(3)$

twist coordinates $\xi = \begin{pmatrix} v \\ w \end{pmatrix}$ 는 linear velocity $v \in \mathbb{R}^3$ 와 angular velocity $w \in \mathbb{R}^3$ 를 쌓은 것입니다. 미분방정식 $\dot g = \hat\xi g,\ g(0)=I$ 의 해 역시 지수입니다.

$$g(t) = e^{\hat\xi t} = \sum_{n=0}^\infty \frac{(\hat\xi t)^n}{n!}$$

- $w = 0$ (순수 이동): $e^{\hat\xi} = \begin{pmatrix} I & v \\ 0 & 1 \end{pmatrix}$
- $w \neq 0$ :

$$e^{\hat\xi} = \begin{pmatrix} e^{\hat w} & \dfrac{(I - e^{\hat w})\hat w v + w w^\top v}{|w|^2} \\ 0 & 1 \end{pmatrix}$$

그래서 $\exp: se(3) \to SE(3)$. 거꾸로 모든 $g \in SE(3)$ 는 어떤 twist $\xi$로 $g = \exp(\hat\xi)$ 표현 가능합니다 (단 비유일). 이때 회전 부분은 $e^{\hat w}=R$ 로 풀고, 다음 식을 $T$에 대해 풀어 $v$를 얻습니다.

$$\frac{(I - e^{\hat w})\hat w v + w w^\top v}{|w|^2} = T$$

> **핵심 패턴 (장 전체를 관통):** "운동의 미분 = Lie 대수의 원소 → 지수사상으로 다시 군으로." $SO(3)$이든 $SE(3)$이든 완전히 같은 레시피입니다.

---

## 6. 카메라 운동 표현 (Representing the Camera Motion)

### 6.1 좌표 변환

카메라가 움직이면 점의 카메라-좌표가 변합니다. $g(t) \in SE(3)$ 가 고정된 world frame → 시각 $t$의 camera frame 변환이고, $g(0)=I$ 로 둡니다. world 좌표 $\boldsymbol{X}_0$ 인 점은:

$$\boldsymbol{X}(t) = R(t)\boldsymbol{X}_0 + T(t), \qquad \text{(동차)} \quad \boldsymbol{X}(t) = g(t)\boldsymbol{X}_0$$

### 6.2 프레임 합성 (concatenation)

$g(t_2, t_1)$ 을 프레임 $t_1 \to t_2$ 변환이라 하면:

$$g(t_3,t_1) = g(t_3,t_2)\,g(t_2,t_1), \qquad g^{-1}(t_2,t_1) = g(t_1,t_2)$$

즉 운동들은 행렬곱으로 **합성(compose)** 되고, 역운동은 역행렬입니다. 이것이 군 구조의 실용적 가치입니다 — SLAM에서 프레임 간 변환을 줄줄이 곱해 누적합니다.

### 6.3 속도 변환 규칙 (rules of velocity transformation)

$\boldsymbol{X}(t) = g(t)\boldsymbol{X}_0$ 를 미분합니다.

$$\dot{\boldsymbol{X}} = \dot g(t)\boldsymbol{X}_0 = \dot g g^{-1}\boldsymbol{X} = \hat V(t)\boldsymbol{X}, \qquad \hat V = \dot g g^{-1} = \begin{pmatrix} \hat w & v \\ 0 & 0 \end{pmatrix} \in se(3)$$

3D 좌표로 풀면:

$$\dot{\boldsymbol{X}}(t) = \hat w(t)\boldsymbol{X}(t) + v(t)$$

$\hat V$ 는 카메라 프레임에서 본 world의 상대 속도 twist입니다.

### 6.4 Adjoint Map

다른 프레임 $\boldsymbol{Y} = g_{xy}\boldsymbol{X}$ 에서 본 속도는:

$$\dot{\boldsymbol{Y}} = g_{xy}\dot{\boldsymbol{X}} = g_{xy}\hat V g_{xy}^{-1}\boldsymbol{Y}, \qquad \hat V_y = g_{xy}\,\hat V\,g_{xy}^{-1} \equiv \mathrm{ad}_{g_{xy}}(\hat V)$$

**adjoint map**

$$\mathrm{ad}_g: se(3) \to se(3); \quad \hat\xi \mapsto g\hat\xi g^{-1}$$

은 twist를 다른 프레임으로 옮기는 변환입니다. 한 좌표계에서 측정한 속도를 다른 좌표계로 번역하는 사전 역할을 합니다.

---

## 7. Summary

|                 | Rotation $SO(3)$                              | Rigid-body $SE(3)$                                                  |
| --------------- | --------------------------------------------- | ------------------------------------------------------------------- |
| Matrix repres.  | $R^\top R = I,\ \det R = 1$                   | $g = \begin{pmatrix} R & T \\ 0 & 1\end{pmatrix}$                   |
| 3-D coordinates | $\boldsymbol{X} = R\boldsymbol{X}_0$          | $\boldsymbol{X} = R\boldsymbol{X}_0 + T$                            |
| Inverse         | $R^{-1} = R^\top$                             | $g^{-1} = \begin{pmatrix} R^\top & -R^\top T \\ 0 & 1\end{pmatrix}$ |
| Exp. repres.    | $R = \exp(\hat w)$                            | $g = \exp(\hat\xi)$                                                 |
| Velocity        | $\dot{\boldsymbol{X}} = \hat w\boldsymbol{X}$ | $\dot{\boldsymbol{X}} = \hat w\boldsymbol{X} + v$                   |
| Adjoint map     | $\hat w \mapsto R\hat w R^\top$               | $\hat\xi \mapsto g\hat\xi g^{-1}$                                   |

이 표에서 $SE(3)$ 열은 $SO(3)$ 열에 "이동 $T$, 속도 $v$"가 더해진 확장판이라는 게 한눈에 보입니다. $g^{-1}$ 공식만 잠깐 확인하면:

$$\begin{pmatrix} R & T \\ 0 & 1\end{pmatrix}\begin{pmatrix} R^\top & -R^\top T \\ 0 & 1\end{pmatrix} = \begin{pmatrix} I & 0 \\ 0 & 1\end{pmatrix} \;\checkmark$$

---

## 8. Euler Angles와 그 함정

### 8.1 Lie–Cartan 좌표

지수사상 말고도 회전을 매개변수화하는 방법이 있습니다. $so(3)$ 의 기저 $(\hat w_1, \hat w_2, \hat w_3)$ 에 대해:

- **제1종 (first kind):** $\alpha: (\alpha_1,\alpha_2,\alpha_3) \mapsto \exp(\alpha_1\hat w_1 + \alpha_2\hat w_2 + \alpha_3\hat w_3)$ — 한 번에 지수화
- **제2종 (second kind):** $\beta: (\beta_1,\beta_2,\beta_3) \mapsto \exp(\beta_1\hat w_1)\exp(\beta_2\hat w_2)\exp(\beta_3\hat w_3)$ — 축별로 따로 곱

$z$-, $y$-, $x$-축 기저 $w_1 = (0,0,1)^\top$, $w_2 = (0,1,0)^\top$, $w_3 = (1,0,0)^\top$ 를 쓰면 제2종 좌표 $\beta_1,\beta_2,\beta_3$ 가 바로 **Euler angles**입니다. 이건 **local coordinates** — $SO(3)$의 일부에서만 올바릅니다.

### 8.2 세 개의 축 회전

$$R = \exp(\beta_1\hat w_1)\exp(\beta_2\hat w_2)\exp(\beta_3\hat w_3)$$

각 인자는 한 축 주위 회전입니다.

$$R_x(\beta_1) = \begin{pmatrix} 1 & 0 & 0 \\ 0 & \cos\beta_1 & -\sin\beta_1 \\ 0 & \sin\beta_1 & \cos\beta_1 \end{pmatrix}, \quad
R_y(\beta_2) = \begin{pmatrix} \cos\beta_2 & 0 & \sin\beta_2 \\ 0 & 1 & 0 \\ -\sin\beta_2 & 0 & \cos\beta_2 \end{pmatrix}, \quad
R_z(\beta_3) = \begin{pmatrix} \cos\beta_3 & -\sin\beta_3 & 0 \\ \sin\beta_3 & \cos\beta_3 & 0 \\ 0 & 0 & 1 \end{pmatrix}$$

순서에 따라 **convention**이 갈립니다: 항공우주는 ZYX (yaw–pitch–roll), 고전역학은 ZXZ, 로봇은 ZYZ. **항상 어떤 convention인지 명시할 것** — 같은 각도라도 순서가 다르면 다른 회전입니다.

### 8.3 Gimbal Lock

ZYX convention $R(\psi,\theta,\phi) = R_z(\psi)R_y(\theta)R_x(\phi)$ 에서 $\theta = \pi/2$ 를 넣으면, 행렬이 $\psi - \phi$ 의 차이에만 의존하게 됩니다.

$$R(\psi, \tfrac{\pi}{2}, \phi) = \begin{pmatrix} 0 & -\sin(\psi-\phi) & \cos(\psi-\phi) \\ 0 & \cos(\psi-\phi) & \sin(\psi-\phi) \\ -1 & 0 & 0 \end{pmatrix}$$

**자유도 하나가 사라집니다 (gimbal lock).** $\psi$와 $\phi$를 따로 움직여도 차이만 같으면 똑같은 회전입니다. 아래 세 triple은 모두 $\psi-\phi = 30°$ 라 **같은 회전 행렬**을 줍니다.

| $\phi$ | $\theta$ | $\psi$ | $\psi - \phi$ |
| ------ | -------- | ------ | ------------- |
| 30°    | 90°      | 60°    | 30°           |
| 50°    | 90°      | 80°    | 30°           |
| 0°     | 90°      | 30°    | 30°           |

기하학적으로는 $R_y(\pi/2)$ 가 첫 축을 셋째 축 위로 포개버려, $R_z$와 $R_x$가 같은 평면에서 작동하기 때문입니다.

![Gimbal lock](/assets/img/posts/study-cv/ch2_fig3_gimbal.png)
_세 그림의 좌표축(frame)이 완전히 똑같다. 세 개의 다른 각도 조합이 같은 회전이 되어버리는 것이 gimbal lock이다._

---

## 9. Quaternions — 탈출구

### 9.1 왜 quaternion인가

이것은 ZYX만의 문제가 아닙니다. **$SO(3)$를 단 3개의 매개변수로 매끄럽게 전역(global) 표현하는 것은 위상수학적으로 불가능**합니다 (topological obstruction). 어떤 3-parameter chart든 특이점(singularity)이 생기고, 그 근처에서 작은 방향 변화가 매개변수의 큰 점프를 만들어 계산이 불안정해집니다. 컴퓨터 애니메이션에서 물체가 갑자기 엉뚱하게 도는 현상이 이것입니다. **Quaternion은 매개변수를 하나 더 써서(4개) 이를 피합니다.**

### 9.2 Quaternion 정의

복소수에 허수단위 두 개($j, k$)를 더 추가합니다.

$$\mathbb{H} = \{ q = w + xi + yj + zk \mid w,x,y,z \in \mathbb{R}\}$$

정의 관계식 (이것만 알면 나머지가 다 따라옴):

$$i^2 = j^2 = k^2 = ijk = -1$$

곱셈은 결합법칙은 성립하지만 **비가환(not commutative)** — 순서가 중요합니다 (회전이 비가환인 것과 같은 맥락). conjugate, norm, inverse는 복소수와 같습니다.

$$q^* = w - xi - yj - zk, \qquad |q|^2 = qq^* = w^2+x^2+y^2+z^2, \qquad q^{-1} = \frac{q^*}{|q|^2}$$

### 9.3 Unit Quaternion으로 회전

$|q| = 1$, 즉 $w^2+x^2+y^2+z^2 = 1$ 인 **unit quaternion**이 회전을 표현합니다. 특이점도 gimbal lock도 없고, 보간(interpolation)·합성(compose)이 쉽습니다.

3D 벡터 회전 방법:

1. 벡터를 **pure quaternion**으로 임베드: $p = v_x i + v_y j + v_z k$
2. **sandwich product**: $p' = q p q^*$
3. 결과의 허수부를 읽으면 회전된 벡터.

축 $(u_x, u_y, u_z)$ 주위로 각도 $\theta$ 회전은:

$$q = \cos\frac{\theta}{2} + \sin\frac{\theta}{2}\big(u_x i + u_y j + u_z k\big)$$

> 여기서 $\theta/2$ 가 핵심입니다. $q$와 $-q$가 같은 회전을 주는 **double cover (이중 덮개)** — 4.4절에서 $\log$가 비유일했던 것($2\pi$ 모호성)과 깊이 연결됩니다. quaternion은 단위구 $S^3$에 살고, $S^3$가 $SO(3)$를 2:1로 덮습니다.

---

## 마치며

> **물체/카메라의 움직임은 군 $SE(3)$의 원소이고, 그 미분은 Lie 대수 $se(3)$의 twist이며, exponential map이 둘을 잇는다. 회전 $SO(3)$를 매개변수화할 때 3개로는 항상 특이점이 생기므로(gimbal lock), quaternion이 4번째 변수로 이를 해결한다.**

다음 3장은 이 카메라 운동 $g(t)$ 위에 **perspective projection** ($3D \to 2D$, pinhole camera)을 얹어서, 드디어 "이미지가 어떻게 만들어지는가"로 갑니다.
