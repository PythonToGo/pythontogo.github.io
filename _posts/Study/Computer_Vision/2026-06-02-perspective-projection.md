---
title: "3D Computer Vision 정리 — Ch3. 원근 투영(Perspective Projection)"
date: 2026-06-03
categories: [Study, Computer_Vision]
tags: [3D Vision, Perspective Projection, Camera Model, Projective Geometry, TUM]
math: true
image:
  /assets/img/posts/study-cv/ch3_fig7.png
---

> Prof. Dr. Daniel Cremers (TUM)의 *3D Computer Vision* 강의 3장 정리.
> "3차원 세계의 점이 어떻게 2차원 이미지의 픽셀(pixel)이 되는가?"를 수학적으로 완전히 기술하는 것이 이 장의 목표다.

## 0. 이 장의 큰 그림

3장은 다음 순서로 진행된다: ① 역사 ② 수학적 표현(mathematical representation) ③ 내부 파라미터(intrinsic parameters) ④ 구면 투영(spherical projection) ⑤ 방사 왜곡(radial distortion) ⑥ 프리이미지/코이미지(preimage/coimage) ⑦ 사영 기하(projective geometry).

핵심 결론을 먼저 박아두자. 세계 좌표 $\boldsymbol{X}_0$ 에서 픽셀 좌표 $\boldsymbol{x}'$ 까지의 전체 변환은

$$
\lambda\,\boldsymbol{x}' = K\,\Pi_0\,g\,\boldsymbol{X}_0
$$

한 줄로 요약된다. 이 글은 이 식을 처음부터 끝까지 쌓아 올린다.

---

## 1. 역사적 배경 (Historic Remarks)

영상 형성(image formation)의 기하학은 멀리 **유클리드(Euclid, 기원전 4세기)** 까지 거슬러 올라가고, 폼페이(Pompeii) 벽화에 부분적으로 올바른 원근법이 보인다. 로마 제국 멸망과 함께 사라졌다가 약 1000년 뒤 **르네상스(Renaissance)** 미술에서 다시 등장한다. 브루넬레스키(Brunelleschi), 도나텔로(Donatello), 알베르티(Alberti)가 대표 주자이며, 최초의 투영 이론서 *Della Pittura*(1435)는 **알베르티(Leon Battista Alberti)** 가 썼다.

라파엘로의 *아테네 학당*, **뒤러의 기계(Dürer's machine, 1525)**, 호가스(Hogarth)의 풍자화, 에셔(Escher)의 작품들은 한 가지를 말한다: **올바른 원근법이란 "눈(중심점)에서 물체로 직선을 긋고, 그 직선이 화면과 만나는 곳에 점을 찍는 것"** 이다. 특히 뒤러의 기계는 실(끈)이 광선(ray)을 그대로 흉내 내는 장치로, 다음에 볼 핀홀 카메라 모델 그 자체다.

---

## 2. 핀홀 카메라와 원근 투영의 수학

### 2.1 핀홀 카메라 (The Pinhole Camera)

핀홀 카메라는 작은 구멍(pinhole) 하나로 빛을 통과시키는 가장 단순한 카메라다. 물체에서 나온 광선이 구멍을 지나 뒷벽에 **거꾸로** 상을 맺는다. 이 "구멍 = 광학 중심(center of projection)"이 모든 광선이 모이는 한 점이다.

핵심 아이디어: **3D 점 → 광학 중심을 잇는 직선 → 그 직선이 상면(image plane)과 만나는 점 = 이미지 점.**

### 2.2 부호 뒤집기와 투영식

![핀홀 카메라: 상면을 앞으로 옮기기](/assets/img/posts/study-cv/ch3_fig1.png)
*상면을 광학 중심 앞으로 옮겨(부호 뒤집기) 상을 똑바로 세운다.*

실제 핀홀에서는 상이 구멍 **뒤(z = −f)** 에 거꾸로 맺힌다. 수식에 마이너스가 붙어 번거로우므로, 관례적으로 $x,y$ 축 부호를 뒤집어 **상면을 중심 앞(z = +f)** 에 둔다. 기하적으로 완전히 동일한 모델이다.

![닮은 삼각형](/assets/img/posts/study-cv/ch3_fig2.png)
*닮은 삼각형(similar triangles)에서 곧바로 투영식이 나온다.*

닮은 삼각형에서 큰 삼각형(밑변 $Z$, 높이 $X$)과 작은 삼각형(밑변 $f$, 높이 $x$)이 닮았으므로

$$
\frac{x}{f}=\frac{X}{Z}\quad\Longrightarrow\quad x=f\,\frac{X}{Z}.
$$

따라서 원근 변환(perspective transformation) $\pi$ 는

$$
\pi:\mathbb{R}^3\to\mathbb{R}^2,\qquad
\boldsymbol{X}\mapsto\boldsymbol{x}=\pi(\boldsymbol{X})=
\begin{pmatrix} f\dfrac{X}{Z}\\[2ex] f\dfrac{Y}{Z}\end{pmatrix}.
$$

> **직관:** 분모에 깊이 $Z$ 가 들어가는 것이 원근법의 전부다. 멀수록 작게 보이고, 이 $Z$ 로 나누는 행위가 비선형(nonlinear)이라 다루기 까다롭다. 그래서 동차좌표로 이를 "선형처럼" 만든다.

---

## 3. 이상적 원근 카메라 (Ideal Perspective Camera)

### 3.1 동차좌표로 선형화

$Z$ 로 나누는 비선형 연산을, 동차좌표(homogeneous coordinates)에서는 **양변에 $Z$ 를 곱한 선형식**으로 숨길 수 있다.

$$
Z\boldsymbol{x}=Z\begin{pmatrix}x\\y\\1\end{pmatrix}
=\begin{pmatrix}f&0&0&0\\0&f&0&0\\0&0&1&0\end{pmatrix}
\begin{pmatrix}X\\Y\\Z\\1\end{pmatrix}
=K_f\,\Pi_0\,\boldsymbol{X}.
$$

두 행렬을 정의한다.

$$
K_f\equiv\begin{pmatrix}f&0&0\\0&f&0\\0&0&1\end{pmatrix},\qquad
\Pi_0\equiv\begin{pmatrix}1&0&0&0\\0&1&0&0\\0&0&1&0\end{pmatrix}.
$$

- $K_f$ : 초점거리(focal length) $f$ 만 담은 행렬.
- $\Pi_0$ : **표준 투영 행렬(standard projection matrix)** — 4D 점에서 4번째 성분을 떼어내 3D로 만드는 "잘라내기".

깊이 $Z$ 를 미지의 상수 $\lambda>0$ 로 두면

$$
\lambda\,\boldsymbol{x}=K_f\,\Pi_0\,\boldsymbol{X}.
$$

이 $\lambda$ 가 우리가 모르는 스케일(scale)이다. "$=$"처럼 보여도 사실은 "스케일 차이를 빼면 같다"는 뜻임을 기억하자.

### 3.2 카메라의 강체 운동 (Rigid Motion)

지금까지 $\boldsymbol{X}$ 는 **카메라 좌표(camera coordinates)** 였다. 물체는 보통 **세계 좌표(world coordinates)** $\boldsymbol{X}_0$ 로 주어지고, 카메라는 세계 속에서 회전·이동(강체 운동, rigid motion)을 한다.

$$
\boldsymbol{X}=R\boldsymbol{X}_0+T
\qquad\Longleftrightarrow\qquad
\boldsymbol{X}=g\,\boldsymbol{X}_0=\begin{pmatrix}R&T\\0&1\end{pmatrix}\boldsymbol{X}_0,\quad g\in SE(3).
$$

여기서 $R$ 은 회전(rotation), $T$ 는 평행이동(translation), $g$ 는 강체변환(rigid-body transformation)이다. 끼워 넣으면 **세계 → 이미지** 전체 변환이 완성된다.

$$
\lambda\,\boldsymbol{x}=K_f\,\Pi_0\,g\,\boldsymbol{X}_0.
$$

$f$ 를 알면 이미지 좌표 단위를 바꿔 $f=1$ 로 정규화(normalize)할 수 있고, 그러면 더 깔끔해진다.

$$
\lambda\,\boldsymbol{x}=\Pi_0\,\boldsymbol{X}=\Pi_0\,g\,\boldsymbol{X}_0.
$$

---

## 4. 내부 파라미터 (Intrinsic Parameters)

### 4.1 실제 카메라가 추가하는 세 가지

이상적 카메라에 실제 센서는 세 가지를 더한다.

1. **주점 이동(principal point offset) $o_x,o_y$** — 이미지 원점이 보통 왼쪽 위 모서리라 평행이동 필요.
2. **픽셀 스케일 $s_x,s_y$** — 픽셀이 미터가 아니므로 단위 변환(정사각형이 아닐 수 있음).
3. **스큐(skew factor) $s_\theta$** — 픽셀의 가로·세로축이 직각이 아닐 때의 비틂.

$$
\lambda\begin{pmatrix}x'\\y'\\1\end{pmatrix}=
\underbrace{\begin{pmatrix}s_x&s_\theta&o_x\\0&s_y&o_y\\0&0&1\end{pmatrix}}_{\equiv\,K_s}
\underbrace{\begin{pmatrix}f&0&0\\0&f&0\\0&0&1\end{pmatrix}}_{\equiv\,K_f}
\underbrace{\begin{pmatrix}1&0&0&0\\0&1&0&0\\0&0&1&0\end{pmatrix}}_{\equiv\,\Pi_0}
\begin{pmatrix}X\\Y\\Z\\1\end{pmatrix}.
$$

순서는 "투영($\Pi_0$, $f=1$ 기준) → 센서·픽셀 변환($K_sK_f$)"이다.

### 4.2 내부 파라미터 행렬 $K$ 와 일반 투영 행렬

$$
K\equiv K_sK_f=
\begin{pmatrix}fs_x&fs_\theta&o_x\\0&fs_y&o_y\\0&0&1\end{pmatrix}.
$$

세계 좌표의 함수로 전체를 쓰면

$$
\lambda\,\boldsymbol{x}'=K\,\Pi_0\,\boldsymbol{X}=K\,\Pi_0\,g\,\boldsymbol{X}_0\equiv\Pi\,\boldsymbol{X}_0,
$$

여기서 정의되는 $3\times4$ 행렬

$$
\Pi\equiv K\,\Pi_0\,g=(KR,\;KT)
$$

가 **일반 투영 행렬(general projection matrix)** 이다. 카메라 한 대를 완전히 기술하는 핵심 행렬이다.

선형처럼 보여도 스케일 $\lambda$ 가 살아 있다. $\lambda$ 로 나누면 비선형 형태가 드러난다.

$$
x'=\frac{\pi_1^{\top}\boldsymbol{X}_0}{\pi_3^{\top}\boldsymbol{X}_0},\qquad
y'=\frac{\pi_2^{\top}\boldsymbol{X}_0}{\pi_3^{\top}\boldsymbol{X}_0},\qquad z'=1,
$$

$\pi_1^{\top},\pi_2^{\top},\pi_3^{\top}\in\mathbb{R}^4$ 은 $\Pi$ 의 세 행(row)이다. 분모 $\pi_3^{\top}\boldsymbol{X}_0$ 가 깊이 $\lambda$ 역할을 한다 — "$Z$ 로 나누기"가 그대로 살아 있는 셈이다.

### 4.3 $K$ 성분의 물리적 의미

| 성분                | 의미                                   |
| ------------------- | -------------------------------------- |
| $o_x$               | 주점(principal point)의 $x$ 좌표(픽셀) |
| $o_y$               | 주점의 $y$ 좌표(픽셀)                  |
| $fs_x=\alpha_x$     | 단위 길이의 가로 방향 픽셀 크기        |
| $fs_y=\alpha_y$     | 단위 길이의 세로 방향 픽셀 크기        |
| $\alpha_x/\alpha_y$ | 종횡비(aspect ratio) $\sigma$          |
| $fs_\theta$         | 픽셀 스큐(skew), 보통 0에 가까움       |

요즘 카메라는 픽셀이 거의 정사각형이라 $s_\theta\approx0$, $\alpha_x\approx\alpha_y$ 인 경우가 많아 $K$ 는 사실상 $f,o_x,o_y$ 세 숫자로 줄어든다.

---

## 5. 구면 투영 (Spherical Projection)

지금까지는 **평면(planar)** 상면이었다. 어안렌즈처럼 화각이 넓으면 단위 구(unit sphere) $\mathbb{S}^2\equiv\{x\in\mathbb{R}^3\mid|x|=1\}$ 위로 투영하는 게 자연스럽다.

![구면 투영](/assets/img/posts/study-cv/ch3_fig3.png)
*3D 점을 광선 방향으로 단위 구 표면까지 끌어당긴다.*

$$
\pi_s:\mathbb{R}^3\to\mathbb{S}^2,\qquad
\boldsymbol{X}\mapsto\boldsymbol{x}=\frac{\boldsymbol{X}}{|\boldsymbol{X}|}.
$$

픽셀 좌표 식은 평면일 때와 **형태가 똑같고** 스케일만 바뀐다.

$$
\lambda\,\boldsymbol{x}'=K\,\Pi_0\,g\,\boldsymbol{X}_0,\qquad
\text{이번엔}\quad\lambda=|\boldsymbol{X}|=\sqrt{X^2+Y^2+Z^2}.
$$

평면이면 $\lambda=Z$, 구면이면 $\lambda=|\boldsymbol{X}|$ 인 것이 유일한 차이다. 그래서 "스케일 차이만 빼면 같다"는 동치 기호 $\sim$ 를 도입한다.

$$
\boldsymbol{x}'\sim\Pi\,\boldsymbol{X}_0=K\,\Pi_0\,g\,\boldsymbol{X}_0.
$$

> **통찰:** 광선이 상면(어떤 모양이든)과 만나기만 하면 이 관계는 성립한다. 상의 본질은 "광학 중심을 지나는 광선의 방향"이고, 상면이 평면이냐 구면이냐는 그 방향에 어떤 좌표를 붙이느냐의 문제일 뿐이다. 이 생각이 곧 사영 기하로 이어진다.

---

## 6. 방사 왜곡 (Radial Distortion)

내부 행렬 $K$ 는 **선형(linear)** 왜곡만 모델링한다. 싼 웹캠이나 광각렌즈에서는 직선이 휘어 보이는 **비선형 방사 왜곡** 이 생긴다.

![방사 왜곡](/assets/img/posts/study-cv/ch3_fig4.png)
*왼쪽(이상적)은 격자가 곧지만, 오른쪽은 가장자리로 갈수록 휜다(barrel).*

간단·효과적 모델(반경 $r$ 의 짝수차 다항식):

$$
x=x_d\,(1+a_1r^2+a_2r^4),\qquad y=y_d\,(1+a_1r^2+a_2r^4),
$$

여기서 $\boldsymbol{x}_d\equiv(x_d,y_d)$ 는 왜곡된 점, $r^2=x_d^2+y_d^2$. 보정판(calibration rig)이 있으면 $a_1,a_2$ 를 추정한다.

더 일반적인 모델(**Devernay & Faugeras 1995**):

$$
\boldsymbol{x}=c+f(r)(\boldsymbol{x}_d-c),\qquad f(r)=1+a_1r+a_2r^2+a_3r^3+a_4r^4,
$$

$r=|\boldsymbol{x}_d-c|$ 는 임의의 왜곡 중심(center of distortion) $c$ 까지의 거리, $f(r)$ 은 임의의 4차 보정 함수다. 파라미터는 "직선은 직선으로 보여야 한다"는 제약이나 3D 복원과 동시에 추정한다(Zhang ’96, Stein ’97, Fitzgibbon ’01).

> **핵심:** 방사 왜곡은 방향과 무관하게 오직 중심으로부터의 거리 $r$ 에만 의존하므로 "radial(방사)"이라 부른다.

---

## 7. 프리이미지와 코이미지 (Preimage and Coimage)

이 절은 개념적으로 가장 중요한 부분이다. 스케일 $\lambda$ 가 미지이므로, 3D 점 하나는 이미지의 단일 점이 아니라 **"$\boldsymbol{y}\sim\boldsymbol{x}$ 인 동치류(equivalence class)"** 에 대응된다.

### 7.1 등장인물 정리

3D 직선 $L$ 은 기준점 $\boldsymbol{X}_0$ 과 방향 벡터 $\boldsymbol{V}=(V_1,V_2,V_3,0)^{\top}$ 로 표현된다(4번째 성분 0은 "방향").

$$
\boldsymbol{X}=\boldsymbol{X}_0+\mu\,\boldsymbol{V},\qquad\mu\in\mathbb{R}.
$$

![Preimage 평면 — 비스듬한 3D 뷰](/assets/img/posts/study-cv/ch3_fig5.png)
*프리이미지 P는 하나의 평평한 시트. 직선 L이 그 위에 있고, 이미지 플레인이 시트를 자른 자리가 L의 상이다.*

- **직선 $L$** = 세계에 실재하는 3D 물체 (철길, 책상 모서리 등).
- **이미지 플레인** = 상이 맺히는 카메라 센서 평면. $o$ 로부터 거리는 초점거리 $f$ 로 **고정**.
- **image of L** = 이미지 플레인 위에 찍힌 $L$ 의 2D 상.
- **프리이미지 $P$** = $o$ 를 지나고 $L$ 을 품은 **무한 평면**. "같은 상을 만들 수 있는 모든 3D 직선의 후보 집합".
- **코이미지 $\ell$** = 평면 $P$ 의 법선(normal) 1D 직선.

### 7.2 프리이미지는 왜 "원점을 지나는 무한 평면"인가

![Preimage 평면 — 옆에서 본 단면](/assets/img/posts/study-cv/ch3_fig6.png)
*평면 P를 모서리 방향으로 보면 원점 o를 지나는 직선처럼 보인다. 교과서의 사다리꼴은 이 무한 평면의 작은 한 조각일 뿐이다.*

직선의 상은

$$
\boldsymbol{x}\sim\Pi_0\boldsymbol{X}=\Pi_0(\boldsymbol{X}_0+\mu\boldsymbol{V})=\Pi_0\boldsymbol{X}_0+\mu\,\Pi_0\boldsymbol{V}.
$$

원점 $o$ 에서 본 모든 상의 점 $\boldsymbol{x}$ 들은 **2D 부분공간(평면) $P$** 를 이룬다. $P=\text{span(image)}$ 이고, span은 정의상 원점을 포함하며 스칼라배를 모두 포함하므로 무한히 뻗는다. 교과서 그림의 사다리꼴은 이 무한 평면의 일부일 뿐이다.

> **정의:** 점 또는 직선의 프리이미지 = 주어진 상과 똑같은 상을 만드는 **3D 점들의 가장 큰 집합(largest set)**.

### 7.3 깊이 모호성 — 무엇이 변하고 무엇이 고정인가

![깊이 모호성](/assets/img/posts/study-cv/ch3_fig7.png)
*깊이가 달라져도(L vs L') 이미지 플레인 거리 f는 고정, 빨간 상도 같은 자리. 변하는 것은 물체가 광선 위 어디 있느냐(λ)뿐이다.*

| 항목                                 | 깊이에 따라 변하나?    |
| ------------------------------------ | ---------------------- |
| $o$ → 이미지 플레인 거리 ($=f$)      | ❌ 고정 (카메라 성질)   |
| 이미지 플레인 위 상의 위치           | ❌ 같은 광선이면 그대로 |
| 물체가 광선 위 놓인 위치 ($\lambda$) | ✅ 이게 미지수          |

카메라는 깊이 $\lambda$ 를 모르므로 같은 광선 위의 가까운 작은 물체와 먼 큰 물체를 구별하지 못한다. 이 모호성을 한데 모은 것이 프리이미지다.

### 7.4 코이미지와 핵심 식

점·직선의 프리이미지는 $\mathbb{R}^3$ 의 부분공간이고, 그 **직교 여공간(orthogonal complement)** 으로도 똑같이 표현할 수 있다. 이 여공간이 **코이미지(coimage)** 다. 셋은 서로를 유일하게 결정하므로 동등하다.

$$
\begin{aligned}
\text{image}&=\text{preimage}\cap\text{image plane}, & \text{preimage}&=\text{span(image)},\\[2pt]
\text{preimage}&=\text{coimage}^{\perp}, & \text{coimage}&=\text{preimage}^{\perp}.
\end{aligned}
$$

직선 $L$ 의 경우, 프리이미지는 2D 평면, 코이미지는 그 법선 $\ell\in\mathbb{R}^3$ 이다. $P$ 위의 모든 점은 $\ell$ 과 직교하므로 이 장 최고의 식이 나온다.

$$
\boxed{\;\ell^{\top}\boldsymbol{x}=0\;}
$$

상수항이 0이라는 점이 곧 "원점을 지나는 평면"임을 보장한다 — 그래서 사다리꼴이 아니라 무한 평면이다. $\ell$ 에 직교하는 공간은 $\widehat{\ell}$ 의 행으로 생성되므로

$$
P=\text{span}(\widehat{\ell}\,).
$$

여기서 $\widehat{\ell}$ 은 $\ell$ 의 **반대칭 행렬(skew-symmetric matrix)**, 즉 외적을 행렬로 쓴 것이다.

$$
\ell=\begin{pmatrix}\ell_1\\[2pt]\ell_2\\[2pt]\ell_3\end{pmatrix}
\quad\Rightarrow\quad
\widehat{\ell}=\begin{pmatrix}0&-\ell_3&\ell_2\\[2pt]\ell_3&0&-\ell_1\\[2pt]-\ell_2&\ell_1&0\end{pmatrix},
\qquad
\widehat{\ell}\,\boldsymbol{v}=\ell\times\boldsymbol{v}.
$$

$\widehat{\ell}\,\boldsymbol{v}=\ell\times\boldsymbol{v}$ 는 항상 $\ell$ 에 수직이므로 $\widehat{\ell}$ 의 행들이 평면 $P$ 를 생성한다.

점 $p$ 의 경우는 쌍대(dual)다. 프리이미지는 광선(1D 직선), 코이미지는 $\boldsymbol{x}$ 에 직교하는 평면($\widehat{x}$ 의 행으로 생성).

|           | Image                                                    | Preimage                                                             | Coimage                                                       |
| --------- | -------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------- |
| **Point** | $\text{span}(\mathbf{x})\cap$ im. plane                  | $\text{span}(\mathbf{x})\subset\mathbb{R}^3$ (직선)                  | $\text{span}(\widehat{\mathbf{x}})\subset\mathbb{R}^3$ (평면) |
| **Line**  | $\text{span}(\widehat{\boldsymbol{\ell}})\cap$ im. plane | $\text{span}(\widehat{\boldsymbol{\ell}})\subset\mathbb{R}^3$ (평면) | $\text{span}(\boldsymbol{\ell})\subset\mathbb{R}^3$ (직선)    |

> **기억법:** 점과 직선은 쌍대다. hat 연산 $\widehat{\cdot}$ 은 "차원을 뒤집어 직교 보를 만드는 스위치"다. 벡터(1D)에 모자를 씌우면 그에 수직인 평면(2D)을 생성한다.

---

## 8. 요약 (Summary)

전체 좌표 변환 사슬:

$$
\underbrace{\text{4D World}}_{\boldsymbol{X}_0}
\xrightarrow{\;g\in SE(3)\;}
\underbrace{\text{4D Camera}}_{\boldsymbol{X}}
\xrightarrow{\;K_f\Pi_0\;}
\underbrace{\text{3D image}}_{}
\xrightarrow{\;K_s\;}
\underbrace{\text{3D pixel}}_{\boldsymbol{x}'}
$$

- 외부 파라미터(extrinsic): $g$ — 카메라가 세계 속 어디서 어떻게 보나($R,T$).
- 내부 파라미터(intrinsic): $K=K_sK_f$ — 렌즈·센서·픽셀 성질($f,s_x,s_y,s_\theta,o_x,o_y$).

마스터 공식:

$$
\boxed{\;\lambda\,\boldsymbol{x}'=K\,\Pi_0\,g\,\boldsymbol{X}_0\;}
$$

$\lambda$ 가 바로 미지의 깊이 스케일이다. 이 때문에 한 이미지 점이 광선 전체에 대응하고, 그 모호성을 정리한 개념이 **프리이미지**(같은 상을 주는 최대 3D 점집합)와 **코이미지**(그 직교 여공간)였다.

---

## 9. 사영 기하 (Projective Geometry)

### 9.1 왜 필요한가

미지 스케일 $\lambda$ 가 식을 계속 따라다녔다. $\boldsymbol{X}$ 와 $2\boldsymbol{X}$ 는 같은 광선 위라 같은 상을 만든다. 그렇다면 "스케일 차이는 처음부터 무시하자"는 것이 사영 기하의 출발점이다.

3D 점을 $(X,Y,Z,1)$ 로 고정할 필요는 없다. 0 아닌 임의의 $W$ 에 대해

$$
\boldsymbol{X}=(XW,\,YW,\,ZW,\,W)\in\mathbb{R}^4
$$

도 같은 점을 나타낸다 — 중요한 것은 **벡터의 방향뿐** 이다. 그래서 "동차좌표의 점"을 "원점을 지나는 직선"과 동일시한다.

> **정의:** $n$ 차원 사영공간(projective space) $\mathbb{P}^n$ 은 $\mathbb{R}^{n+1}$ 의 모든 1차원 부분공간(원점을 지나는 직선)의 집합이다.

점 $p\in\mathbb{P}^n$ 은 동차좌표 $\boldsymbol{X}=(x_1,\dots,x_{n+1})^{\top}$ (적어도 한 성분 0 아님)로 표현되고, 임의의 $\lambda\neq0$ 에 대해 $\boldsymbol{Y}=(\lambda x_1,\dots,\lambda x_{n+1})^{\top}$ 는 **같은 점** 이다($\boldsymbol{X}\sim\boldsymbol{Y}$).

### 9.2 $\mathbb{P}^2$ 의 두 가지 그림

1. 각 점을 **2D 구 $\mathbb{S}^2$** 위의 점으로 보되, 대척점(antipodal points)은 같은 점으로 동일시. (구면 투영과 직결: 광선이 구를 두 곳에서 뚫는데 그 둘이 같은 점.)
2. 0 아닌 $z$ 성분을 가진 점은 **평면 $\mathbb{R}^2$**(보통 동차좌표)로, $z=0$ 인 점(무한원점, point at infinity)은 원 $\mathbb{S}^1$($\cong\mathbb{P}^1$)로 본다.

일반화하면 $\mathbb{P}^n$ 은 "$n$ 차원 구 $\mathbb{S}^n$" 또는 "$\mathbb{R}^n$ 에 무한원선(line at infinity) $\mathbb{P}^{n-1}$ 을 붙인 것"으로 볼 수 있다.

> **왜 결국 중요한가:** 유클리드 기하에서 "평행선은 안 만난다"는 골치 아픈 예외다. 사영공간에서는 평행선이 **무한원점에서 만난다** 고 보아, 평행한 철길이 지평선의 한 점(vanishing point, 소실점)으로 모이는 원근법을 예외 없이 선형대수로 다룰 수 있다. 이 장 전체가 서 있는 수학적 토대가 사영 기하다.

---

## 한 장 요약

- 원근 투영의 본질: $x=f X/Z$ — **깊이로 나누기**.
- 동차좌표로 비선형을 선형 + 스케일 $\lambda$ 로 분리: $\lambda\boldsymbol{x}=K_f\Pi_0\boldsymbol{X}$.
- 외부 $g$ + 내부 $K$ → 마스터 공식 $\lambda\boldsymbol{x}'=K\Pi_0 g\,\boldsymbol{X}_0$, 일반 투영 행렬 $\Pi=(KR,KT)$.
- $K$ 는 내부 파라미터 6개($f,s_x,s_y,s_\theta,o_x,o_y$)를 담는다.
- 평면이든 구면이든 $\sim$ 로 동등, 실제 렌즈는 방사 왜곡 추가.
- 점·직선의 상 ↔ 프리이미지(평면/직선) ↔ 코이미지(법선), 핵심식 $\ell^{\top}\boldsymbol{x}=0$.
- 모든 것의 토대 = 사영 기하 $\mathbb{P}^n$.
