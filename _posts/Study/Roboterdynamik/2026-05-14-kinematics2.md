---
title: "Robotics 01: Rigid Body Kinematics 기초 2/2"
description: 로보틱스 강의 두 번째 내용 정리. Rotation Matrix 부터 Acceleration in Moving Frame 까지.
date: 2026-05-14 4:00:00
categories: [Study, Roboterdynamik]
author: PythonToGo
tags: [Rotation Matrix, Euler Angles, rigid-body, angular-velocity, coriolis]
math: true
mermaid: true
comments: true
# image: 
#     path: assets/img/posts/study-rd/kinematics/front.jpg
#     alt: <div class="pdf-viewer-container" data-pdf="/assets/img/posts/study-ai/ch7-LogicalAgents.pdf" data-page="2"></div>
---

{% include pdf-viewer.html %}

3D 강체 운동학의 핵심 개념들을 정리한다. Elemental rotation부터 시작해 Euler angles, rigid body formula, rotating frame에서의 미분, 그리고 acceleration 분해까지 다룬다.

---

## 1. Elemental Rotations

임의의 3D 회전은 세 개의 기본 회전(elemental rotation)으로 분해할 수 있다. 각 축에 대한 rotation matrix는 다음과 같다.

$$A_x(\varphi) = \begin{bmatrix}1&0&0\\0&c\varphi&s\varphi\\0&-s\varphi&c\varphi\end{bmatrix}, \quad A_y(\beta) = \begin{bmatrix}c\beta&0&-s\beta\\0&1&0\\s\beta&0&c\beta\end{bmatrix}, \quad A_z(\gamma) = \begin{bmatrix}c\gamma&s\gamma&0\\-s\gamma&c\gamma&0\\0&0&1\end{bmatrix}$$

**핵심 성질:** rotation matrix는 orthonormal이므로 역행렬 = 전치행렬.

$$A^{-1} = A^T \implies {}_1A_2 = ({}_2A_1)^T$$

**부호 직관:** $x$축 기준 양의 회전(오른손 법칙)에서 $_2\vec{e}_{y_1}$의 $z_2$ 성분이 $-\sin\varphi$인 이유 — 프레임 1이 φ만큼 회전하면 $\vec{e}_{y_1}$이 $-z_2$ 방향으로 기울어지기 때문이다.

---

## 2. Euler Angles (z-x-z)

임의의 3D 회전을 세 번의 elemental rotation으로 표현한다.

$$\boxed{0} \xrightarrow{\psi,\,z} \boxed{1} \xrightarrow{\theta,\,x} \boxed{2} \xrightarrow{\varphi,\,z} \boxed{b}$$

$$_2A_1 = A_z(\varphi)\cdot A_x(\theta)\cdot A_z(\psi)$$

역방향은 순서가 뒤집히고 각 행렬이 transpose된다.

$$_1A_2 = A_z(\psi)^T \cdot A_x(\theta)^T \cdot A_z(\varphi)^T$$

**Singularity:** $\theta = 0$이면 첫 번째와 세 번째 회전이 동일한 축이 되어 구별 불가 → Jacobian rank 감소.

---

## 3. Rigid Body Formula

### 2D

길이 불변 조건 $\vec{r}_{AB}\cdot\vec{r}_{AB} = \text{const}$를 미분하면 $\vec{V}_{AB} \perp \vec{r}_{AB}$. Cross product 특성으로:

$$\boxed{\vec{V}_B = \vec{V}_A + \vec{\omega}\times\vec{r}_{AB}}$$

**one $\vec{\omega}$ for the entire body** — 임의의 두 점 사이에도 동일한 $\vec{\omega}$가 성립함을 벡터 체인으로 증명할 수 있다.

**Instantaneous center of rotation:** 속도가 0인 점 P가 항상 존재한다.

$$\exists\, P : \vec{V}_A + \vec{\omega}\times\vec{r}_{AP} = 0$$

### 3D

$\vec{\omega}$가 임의의 방향을 가져도 동일한 공식이 성립한다. 핵심 논증: $\vec{\omega}$ 축 방향 성분 $V_\parallel$은 cross product에 기여하지 않으므로, 평행한 평면 간 이동 시 회전 기여분이 동일하게 유지된다.

$$\boxed{\vec{V}_B = \vec{V}_A + \vec{\omega}\times\vec{r}_{AB}}$$

3D rigid body의 완전한 kinematics는 **한 점의 속도** + **$\vec{\omega}$** (총 6 scalar)로 결정된다.

---

## 4. Time Derivation in Rotating Frames

### Angular velocity approach

회전 프레임 b에서 표현된 벡터를 시간 미분할 때, 기저벡터 자체도 회전하므로 추가 항이 생긴다.

$$\boxed{\frac{d\vec{v}}{dt} = \left(\frac{d\vec{v}}{dt}\right)_b + \vec{\omega}_b\times\vec{v}}$$

| 항                            | 의미                                    |
| ----------------------------- | --------------------------------------- |
| $(d\vec{v}/dt)_b$             | 프레임 b 안에서 본 변화율 (성분만 미분) |
| $\vec{\omega}_b\times\vec{v}$ | 프레임 자체가 회전하기 때문에 생기는 항 |

### Rotation matrix approach

$${}_{b}V_P = {}_{b}A_0\cdot{}_{0}V_P = {}_{b}\dot{r}_P + \underbrace{\,{}_{b}A_0\cdot{}_{0}\dot{A}_b}_{=\,{}_{b}\tilde{\omega}_b}\cdot{}_{b}r_P$$

${}_{b}A_0\cdot{}_{0}\dot{A}_b$는 skew-symmetric임을 증명할 수 있다 (orthonormality 조건 미분).

$${}_{b}A_0\cdot{}_{0}A_b = I \implies {}_{b}A_0\cdot{}_{0}\dot{A}_b = -\left({}_{b}A_0\cdot{}_{0}\dot{A}_b\right)^T$$

이 행렬이 ${}_{b}\tilde{\omega}_b$ (skew-symmetric matrix)이며, 벡터로 표현하면 ${}_{b}\omega_b$.

$${}_{b}\tilde{\omega}_b\cdot{}_{b}r = {}_{b}\omega_b\times{}_{b}r$$

---

## 5. Base Transformation of Angular Velocity Matrix

$${}_{0}\tilde{\omega}_b = {}_{0}A_b\cdot{}_{b}\tilde{\omega}_b\cdot({}_{0}A_b)^T$$

이는 2차 텐서(tensor of 2nd order)의 변환 법칙이다. 벡터는 $A$를 한 번 곱하지만, 행렬(텐서)은 $A(\cdot)A^T$ 형태로 양쪽에서 변환한다.

---

## 6. Angular Velocities are Vectors

세 프레임 0 → b → c에서:

$${}_{c}\tilde{\omega}_{oc} = {}_{c}\tilde{\omega}_{ob} + {}_{c}\tilde{\omega}_{bc}$$

벡터로 쓰면:

$${}_{c}\vec{\omega}_{oc} = {}_{c}\vec{\omega}_{ob} + {}_{c}\vec{\omega}_{bc}$$

Angular velocity는 벡터이므로 **더할 수 있다**. 로봇에서 각 joint의 $\omega$를 누적해 end-effector의 총 $\omega$를 구하는 원리가 바로 이것이다.

---

## 7. Angular Velocities and Euler Angles — Jacobian

Euler angles (z-x-z)에서 angular velocity를 각도 미분으로 표현하면:

$${}_{b}\omega_b = \underbrace{\begin{bmatrix}s\varphi\,s\theta & c\varphi & 0\\c\varphi\,s\theta & -s\varphi & 0\\c\theta & 0 & 1\end{bmatrix}}_{\,{}_{b}J(q)}\begin{pmatrix}\dot{\psi}\\\dot{\theta}\\\dot{\varphi}\end{pmatrix}$$

이 행렬 ${}_{b}J(q)$가 **Jacobian**이다. $\dot{q} \mapsto \omega$의 선형 매핑.

**Singularity:** $s\theta = 0$이면 rank 감소 → $\omega$로부터 $\dot{q}$ 역산 불가.

### Tait-Bryan angles (z-y-x, 항공 관례)

$${}_{p}\omega_{op} = \begin{pmatrix}-\sin\theta & 0 & 1\\\cos\theta\sin\varphi & \cos\varphi & 0\\\cos\theta\cos\varphi & -\sin\varphi & 0\end{pmatrix}\begin{pmatrix}\dot{\psi}\\\dot{\theta}\\\dot{\varphi}\end{pmatrix}$$

Singularity: $\theta = \pi/2$ 또는 $3\pi/2$ → **Gimbal lock** (마지막 회전축 $x_p$가 첫 번째 축 $z_0$과 평행).

| 방향 (forward)   | $(\psi,\theta,\varphi),\,\dot{q}$ → $\omega$ | 항상 가능 (행렬 곱)  |
| ---------------- | -------------------------------------------- | -------------------- |
| 역방향 (inverse) | $\omega$ → $\dot{q}$                         | singularity에서 불가 |

---

## 8. Accelerations in Moving Frames

Velocity 공식을 한 번 더 시간 미분하면:

$$\boxed{\,{}_{b}a_P = \underbrace{\,{}_{b}\ddot{r}_P}_{\text{relative acc.}} + \underbrace{\,{}_{b}\dot{\omega}_b\times{}_{b}r_P}_{\text{rotational acc.}} + \underbrace{2\,{}_{b}\omega_b\times{}_{b}\dot{r}_P}_{\text{Coriolis}} + \underbrace{\,{}_{b}\omega_b\times({}_{b}\omega_b\times{}_{b}r_P)}_{\text{centripetal acc.}}}$$

관성계($\omega = 0$)에서는 모든 추가 항이 사라진다.

### 예시: Archimedean Spiral

$${}_{b}\omega_b = \begin{pmatrix}0\\0\\\omega_0\end{pmatrix}, \quad {}_{b}r_P = \begin{pmatrix}V_0 t\\0\\0\end{pmatrix}$$

**Velocity:**

$${}_{b}V_P = \begin{pmatrix}V_0\\\omega_0 V_0 t\\0\end{pmatrix}$$

**Acceleration:**

$${}_{b}a_P = \begin{pmatrix}-\omega_0^2 V_0 t\\2\omega_0 V_0\\0\end{pmatrix}$$

- $-x$ 방향: centripetal (회전 중심 방향, 거리에 비례해 증가)
- $+y$ 방향: Coriolis (시간에 무관하게 일정)

---

## 핵심 공식 요약

| 공식                                                                                                                                            | 의미                              |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| $A^{-1} = A^T$                                                                                                                                  | Rotation matrix의 직교성          |
| $_2A_1 = {}_2A_b\cdot{}_bA_a\cdot{}_aA_1$                                                                                                       | 회전 체인 합성                    |
| $\vec{V}_B = \vec{V}_A + \vec{\omega}\times\vec{r}_{AB}$                                                                                        | Rigid body velocity formula       |
| $\frac{d\vec{v}}{dt} = \dot{\vec{v}}_b + \vec{\omega}_b\times\vec{v}$                                                                           | Rotating frame 미분               |
| ${}_{b}\tilde{\omega}_b = {}_{b}A_0\cdot{}_{0}\dot{A}_b$                                                                                        | Skew-symmetric = angular velocity |
| ${}_{b}\omega_b = {}_{b}J(q)\,\dot{q}$                                                                                                          | Jacobian mapping                  |
| ${}_{b}a_P = {}_{b}\ddot{r}_P + {}_{b}\dot{\omega}_b\times{}_{b}r_P + 2\omega_b\times{}_{b}\dot{r}_P + \omega_b\times(\omega_b\times{}_{b}r_P)$ | Acceleration 분해                 |
