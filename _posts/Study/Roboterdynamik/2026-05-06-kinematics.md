---
title: "Robotics 01: Rigid Body Kinematics 기초"
description: 로보틱스 강의 첫 번째 내용 정리. Rigid Body Kinematics의 기본 가정부터 Rodrigues 회전 공식까지.
date: 2026-05-06 12:00:00
categories: [Study, Roboterdynamik]
author: PythonToGo
tags: [Roboterdynamik, rigid-body, rotation-matrix, rodrigues, euler]
math: true
mermaid: true
comments: true
image: 
    path: assets/img/posts/study-rd/kinematics/front.jpg
#     alt: <div class="pdf-viewer-container" data-pdf="/assets/img/posts/study-ai/ch7-LogicalAgents.pdf" data-page="2"></div>
---
{% include pdf-viewer.html %}


로보틱스 강의 첫 번째 내용 정리. Rigid Body Kinematics의 기본 가정부터 Rodrigues 회전 공식까지.

---

## 1. Assumptions (가정)

### 1-1. Rigid Body vs Elastic Body

로봇 링크를 모델링할 때 **rigid body(강체)** 를 가정한다.

![Rigid vs Elastic Body](/assets/img/posts/study-rd/kinematicsrigid_vs_elastic.svg)
*그림 1. Rigid body는 두 점 사이 거리가 항상 일정하고, elastic body는 힘에 의해 변형된다.*

- **Rigid body**: 어떤 두 점 사이의 거리가 운동 중에도 변하지 않음
  $$|P - Q| = \text{const} \quad \forall\, t$$
- **Elastic body**: 힘이 가해지면 형상이 변형됨 → 유연 로봇팔 등에서 고려

강체 가정 덕분에 링크 하나의 자세(pose)를 **6 DOF** (position 3 + orientation 3)로 완전히 기술 가능.

### 1-2. Earth-Fixed Inertial Frame

지구에 고정된 기준 좌표계를 **관성계(inertial frame)** 로 가정:

$$\mathbf{v}_{\text{earth}} = 0, \quad \boldsymbol{\omega}_{\text{earth}} = 0$$

지구 자전 효과는 로봇 스케일에서 무시 가능 → Newton 2nd law를 fictitious force 없이 그대로 적용.

---

## 2. Vectors and Representation

### 2-1. Observation

점 P의 위치벡터와 속도:

$$\vec{r}_{OP} = \vec{r}_P, \qquad \vec{V}_P = \frac{d}{dt}\vec{r}_P = \lim_{dt\to 0}\frac{\vec{r}_P(t+dt)-\vec{r}_P(t)}{dt}$$

### 2-2. Representation

벡터 $\vec{V}_P$를 좌표계 $b$의 기저벡터로 분해하면:

$$\vec{V}_P = x_{vb}\,\vec{e}_{x_b} + y_{vb}\,\vec{e}_{y_b} + z_{vb}\,\vec{e}_{z_b}$$

숫자 표현(representation):

$${}^b V_P = \begin{bmatrix} x_{vb} \\ y_{vb} \\ z_{vb} \end{bmatrix} \quad \leftarrow \text{representation of } \vec{V}_P \text{ in coord. sys. } b$$

> **핵심**: 벡터 자체는 좌표계와 무관. 숫자 표현만 프레임에 따라 달라진다.

---

## 3. Base Transformation — Rotation Matrix

![Rotation Matrix Transformation](/assets/img/posts/study-rd/kinematicsrotation_matrix_transform.svg)
*그림 2. 같은 벡터를 Frame 0, i, b에서 표현할 때 rotation matrix로 변환한다. 역변환은 transpose.*

같은 벡터 $\vec{r}_{PQ}$를 Frame 1과 Frame 2에서 각각 표현하면:

$${}_{1}r_{PQ} = \begin{bmatrix}x_1\\y_1\\z_1\end{bmatrix}, \qquad {}_{2}r_{PQ} = {}_{2}A_1 \cdot {}_{1}r_{PQ} = \begin{bmatrix}x_2\\y_2\\z_2\end{bmatrix}$$

Rotation matrix ${}_{2}A_1$의 열(column)은 **Frame 1의 기저벡터를 Frame 2로 표현한 것**:

$${}_{2}A_1 = \begin{bmatrix} \mid & \mid & \mid \\ {}_{2}e_{x_1} & {}_{2}e_{y_1} & {}_{2}e_{z_1} \\ \mid & \mid & \mid \end{bmatrix}$$

---

## 4. Properties of Rotation Matrices

| 성질               | 수식                                                       |
| ------------------ | ---------------------------------------------------------- |
| 체인 곱            | ${}_{1}A_3 = {}_{1}A_2 \cdot {}_{2}A_3$                    |
| 비교환             | ${}_{1}A_2 \cdot {}_{2}A_3 \neq {}_{2}A_3 \cdot {}_{1}A_2$ |
| 역행렬 = Transpose | ${}_{2}A_1^{-1} = {}_{2}A_1^T = {}_{1}A_2$                 |
| 길이 불변          | $\|{}_{1}r\| = \|{}_{2}r\|$                                |

---

## 5. Euler's Rotation Theorem

> **임의의 3D 회전은 어떤 하나의 축 $\vec{n}$ 주위로 각도 $\varphi$ 만큼 회전한 것으로 표현 가능하다.**

- $\vec{n}$: 회전축 (unit vector), 회전 전후 불변
- $\varphi$: 회전 각도

---

## 6. Rodrigues' Rotation Formula

### 6-1. 벡터 분해

![Rodrigues Decomposition](/assets/img/posts/study-rd/kinematicsrodrigues_decomposition.svg)
*그림 3. r1을 축 방향(평행) 성분과 수직 성분으로 분해. 평행 성분은 불변, 수직 성분만 phi만큼 회전.*

벡터 $\vec{r}_1$을 $\vec{n}$ 기준으로 분해:

$$\vec{r}_1 = r_\parallel \vec{n} + r_\perp \vec{v}$$

- $r_\parallel \vec{n}$: 축 방향 성분 → 회전해도 불변
- $r_\perp \vec{v}$: 수직 성분 → $\varphi$ 만큼 회전

### 6-2. 유도

회전 후:

$$\vec{r}_2 = r_\parallel \vec{n} + \cos\varphi\, r_\perp \vec{v} + \sin\varphi\, r_\perp \vec{w}$$

여기서 $\vec{w} = \tilde{n}\vec{r}_1 = \vec{n} \times \vec{r}_1$.

정리하면:

{% raw %}
$$\boxed{{}_{1}A_2 = I + \sin\varphi\,\tilde{n} + (1-\cos\varphi)\,\tilde{n}^2}$$
{% endraw %}

### 6-3. 다른 버전 ($\tilde{n}^2 = nn^T - I$ 활용)

{% raw %}
$$\boxed{{}_{1}A_2 = nn^T + \cos\varphi\,(I - nn^T) + \sin\varphi\,\tilde{n}}$$
{% endraw %}

| 항                        | 의미                        |
| ------------------------- | --------------------------- |
| $nn^T$                    | 축 방향 투영 — 불변 성분    |
| $\cos\varphi\,(I - nn^T)$ | 수직 성분 × cosφ            |
| $\sin\varphi\,\tilde{n}$  | 수직 성분 × sinφ (90° 방향) |

### 6-4. $\tilde{n}$ vs $nn^T$

| 표기               | 의미                                                             | 크기 |
| ------------------ | ---------------------------------------------------------------- | ---- |
| $\vec{n}\vec{n}^T$ | outer product                                                    | 3×3  |
| $\tilde{n}$        | cross product matrix ($\tilde{n}\vec{r} = \vec{n}\times\vec{r}$) | 3×3  |

$\tilde{n}$의 정의:

$$\tilde{n} = \begin{bmatrix}0&-n_z&n_y\\n_z&0&-n_x\\-n_y&n_x&0\end{bmatrix}$$

$\tilde{n}^2 = nn^T - I$는 정의가 아니라 **계산으로 증명되는 항등식**.

### 6-5. 예시 — x축 회전

{% include x_axis_rotation_interactive.html %}

![x-axis Rotation Matrix](/assets/img/posts/study-rd/kinematicsx_axis_rotation.svg)
*그림 4. x축 회전에서 φ를 바꾸면 행렬 원소와 y-z 평면 벡터가 어떻게 달라지는지 보여준다.*

$\vec{n} = [1,0,0]^T$ 대입:

$$\tilde{n} = \begin{bmatrix}0&0&0\\0&0&-1\\0&1&0\end{bmatrix}, \qquad \tilde{n}^2 = \begin{bmatrix}0&0&0\\0&-1&0\\0&0&-1\end{bmatrix}$$

$${}_{1}A_2 = \begin{bmatrix}1&0&0\\0&\cos\varphi&-\sin\varphi\\0&\sin\varphi&\cos\varphi\end{bmatrix} \checkmark$$

---

## 7. Difference Velocities (상대속도 표기법)

![Difference Velocity Chain](/assets/img/posts/study-rd/kinematicsdifference_velocity_chain.svg)
*그림 5. Body 0(지구) → Body 1(기차) → Body 2(자동차)의 속도 체인. 절대속도는 차이속도의 합.*

표기 규칙: ${}_{frame}\mathbf{v}_{body}$

| 위치        | 의미                     |
| ----------- | ------------------------ |
| 아래 왼쪽   | 어느 **좌표계**에서 표현 |
| 아래 오른쪽 | 어느 **body의 속도**     |

절대속도는 difference velocity의 합:

$${}_{0}\mathbf{v}_{02} = {}_{0}\mathbf{v}_{01} + {}_{0}\mathbf{v}_{12} = {}_{0}\mathbf{v}_{1} + {}_{0}\mathbf{v}_{12}$$

> 이 chain rule이 kinematic chain의 핵심.
