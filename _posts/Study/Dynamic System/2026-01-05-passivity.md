---
title: Passivity
description: Summary of Passivity
date: 2026-01-05 22:00:00
categories: [Study, Machine Learning]
author: PythonToGo
tags: [Dynamic System, Passivity, Dissipativity, Passivity-Based Regulation]
# pin: true
math: true
mermaid: true
comments: true
image: 
#     # type: pdf
    path: assets/img/posts/study-ds/ds6_front.png

#     # page: 7
#     alt: 
---
{% include pdf-viewer.html %}


# Passivity

Passivity는 시스템의 안정성 분석과 복잡한 non-linear 시스템의 컨트롤러 설계를 위한 도구로, 시스템을 에너지 보존, 소산의 관점에서 해석한다.

**Dissipativity**와 **Passivity**는 시스템의 입력과 출력 사이의 관계를 **Storage Function $$V(x)$$**과 **Supply Rate $$s(u, y)$$**를 통해 설명하는 성질이다.


<div class="pdf-viewer-container" data-pdf="/assets/img/posts/study-ds/ds6.pdf" data-page="2"></div>

## Generalized Energy Balance and Supply Rate

시스템 $S: \dot{x} = f(x,u), \  y=h(x,u)$에 대해 에너지는 다음처럼 보존된다.

$$
\int_0^t s(u,y) d\tau + V(x(0)) = \int_0^t g(\tau) d\tau + V(x(t))
$$

이 식은 **[순수 에너지 유입] + [초기 저장 에너지] = [손실 에너지] + [현재 저장 에너지]** 라는 물리적 보존 법칙을 의미한다. 

| Symbol | Name | Desc |
|---|---|
| $$s(u,y)$$ | Supply Rate | 유입되는 에너지 비율 |
| $$V(x)$$ | Storage Function | 시스템 내 부에 저장된 에너지 |
| $$g(\tau)$$ | Dissipated Energy | 손실된 에너지; (마찰이나 저항에 의해)|


### Definition of Dissipativity

시스템 $S$가 **psdf**한 Storage function $V(x)$와 Supply Rate $s$에 대해 다음 중 하나를 만족하면 **Dissipative**라고 한다:

> **Integral Form**
> 
> $$\int^t_0 s(u, y) d\tau + V(x(0)) \geq V(x(t))$$


> 유입된 에너지와 처음 있던 에너지의 합은 항상 현재 저장된 에너지보다 크거나 같다. (에너지가 스스로 생겨날 수 없으니까)
{: .prompt-info }


> **Differential Form**
> 
> $$s(u, y) \geq \dot{V}(x)$$


> 단위 시간당 들어오는 에너지량($$s$$)은 시스템 내부 에너지 변화량($$\dot{V}$$)보다 항상 크거나 같아야 함.
{: .prompt-info }

---

<div class="pdf-viewer-container" data-pdf="/assets/img/posts/study-ds/ds6.pdf" data-page="3"></div>

<div class="pdf-viewer-container" data-pdf="/assets/img/posts/study-ds/ds6.pdf" data-page="4"></div>


### Definition of Passivity

#### Passivity 
Supply Rate가 입력과 출력의 내적인 $$s(u,y) = y^T u$$인 특수한 경우이다. 수식 조건을 보면 다음과 같다.

> **Integral Form**
>
> $$\int^t_0 y^T u d\tau + V(x(0)) \geq V(x(t))$$
>
> **Differential Form**
>
> $$ y^Tu \geq \dot{V}(x(t))$$


#### Lossless (무손실)

에너지가 외부로 전혀 새나가지 않는 상태로 $$\dot{V}(x(t)) = y^T u$$를 만족한다. (현실세계에서는 불가능)



#### State Strict Passivity
에너지 손실이 시스템의 **상태 $x$**에 의존하는 경우로, **Positive Definite Function(pdf) $$\Psi(x)$$**에 대해 $$y^T u \geq \dot{V}(x(t)) + \Psi(x)$$를 만족한다.

#### Output Strict Passivity
에너지 손실이 **출력$$y$$**에 의존하는 경우로, $$y^T \rho (y) > 0$$인 함수 $$\rho(y)$$에대해,  **$$y^T u \geq \dot{V}(x(t)) + y^T \rho(y)$$**를 만족한다.

<div class="pdf-viewer-container" data-pdf="/assets/img/posts/study-ds/ds6.pdf" data-page="6"></div>



---

## Synthesis of a Complex Passive System
<div class="pdf-viewer-container" data-pdf="/assets/img/posts/study-ds/ds6.pdf" data-page="7"></div>
Passive System들은 서로 결합되어도 전체 시스템의 Passivity가 유지되는 아주 편리한 성질이 있다. 이 성질은 우리가 Controller를 설계할때 병렬 결합, 피드백 결합 등이 가능하다는 것.


### Parallel Interconnection


![Parallel](/assets/img/posts/study-ds/ds6_parallel.png)

For two passive systems, $S_1$ and $S_2$, connected in parallel:

- Inputs & Outputs:
  - $$u = u_1 = u_2$$
  - $$y = y_1 + y_2$$

- Storage Function: The total stored energy is the sum of the individual energies
  - $$V_{\text{total}}(x) = V_1(x_1) + V_2(x_2)$$

> Proof Logic
> The total supply rate for the interconnected system is $$y^T u = (y_1 + y_2)^T u = y^T_1 u_1 + y^T_2$$ Since each subsystem satisfies the passivity inequality, their sum does too, proving the overall system is passive
{: .prompt-tip}


###  Feedback Interconnection

![Feedback](/assets/img/posts/study-ds/ds6_feedback.png)

For two passive systems, $S_1$ and $S_2$, in a negative feedback loop:

- Inputs & Outputs:
  - $$u = u_1 + y_2$$
  - $$y = y_1 = u_2$$

- Storage Function: The total stored energy remains the sum of the parts.
  - $$V_{\text{total}}(x) = V_1(x_1) + V_2(x_2)$$

> Proof Logic
> The total supply rate is $$y^T u = y^T_1(u_1 + y_2) = y^T_1 u_ 1 + y^T_1 y_2 = y^T_1 u_1 + u^T_2 y_2$$. The sum of individual supply rates again satisfies the passivity inequality for the composite system.

{: .prompt-tip}



## Passivity and Stability Properties

시스템이 에너지를 계속 소모한다는 것은 결국 움직임이 멈추고 안정한 평형점으로 수렴(!)한다는 것이다.

### Passivity and Lyapunov Stability

시스템이 Passive하고, Storage Function $V(x)$가 pdf 이고, 연속 미분 가능하면, 입력이 없을떄($u=0$) 평형점 $x^{*} = 0$은 **Lyapunov stable**하다. 이는 에너지가 늘어나지 않으므로 상태가 발산하지 않고 일정 범위 내에 머무름을 보장한다.

> **Theorem**
>
> An equilibrium point $$x^* = 0$$ of an unforced system ($u = 0$) is **Lyapunov stable** if:
>
> a) the system is passive, and
>
> b) $$V(x)$$ is cont. diff and pdf
>
> ![Stable](/assets/img/posts/study-ds/ds6_stable.png)


> 1. The diff. passivity inequality: $$\dot{V}(x) \leq y^T u$$
> 2. For the unforced system, we set the input $$u = 0$$
> 3. The inequality simplifies to: $$\dot{V}(x) \leq 0$$
> 4. pdf $V(x)$ with a nsdf derivative $$\dot{V}(x)$$ is the definition of a Lypunov function that proves stability
{: .prompt-tip}


## Passivity-Based Regulation

시스템의 수동성 성질을 능동적으로 활용해서 시스템을 평형점으로 안정화하는 기법.

### Zero-State Observability

입력이 0일때 ($u=0$), 출력이 계속 0 이면 ($y \equiv 0$) 반드시 시스템의 상태도 0이어야 한다. ($x(t) \equiv 0$). 즉 에너지가 소모되어 출력이 사라졌따면, 시스템의 내부 움직임도 완전히 멈춤을 보장한다. 

<div class="pdf-viewer-container" data-pdf="/assets/img/posts/study-ds/ds6.pdf" data-page="12"></div>

### Asymptotic Stability

단순한 안정성을 넘어 평형점으로 완전히 수렴하기 위해, 다음 중 하나를 만족해야한다.

> **Asymptotic stability requires strict energy disspation and observability**
>
> The equilibrium is asymptotically stable if any onf the following hold:
>
> a) The system is **state strictly passive**.
> - $$\dot{V}(x(t)) \leq y^T u - \Psi (x(t))$$, where $$\Psi(\cdot)$$ is pdf.
>
> b) The system is **output strictly passive** AND **zero-state observable**.
> - $$\dot{V}(x(t)) \leq y^T u - y^T \rho(y)$$, where $$y^T \rho(y))$$ is pdf
>
> c) The system is **passive, zero-state observable**, $$V(x)$$ is pdf, and $$\dot{V}(x)=0$$ only if $$y=0$$.


> 만약 $V(x)$가 **Radially unbounded**이면, 즉 $x$가 커질때 $V$도 무한히 커진다면, 이는 **Global Aysmptotic Stability**이다.
{: .prompt-tip}



## Principle of Passivity-Based Regulation

시스템이 passive하고 zero-state observable하며 $V(x)$가 pdf, radially unbounded인 경우, 다음과 같은 피드백 제어 법칙을 통해 평형점을 전역적으로 안정화 할 수 있다. 

$$ u = - \Phi(y) \text{      단, } y^T \Phi(y) > 0 \text{ 인 pdf}$$

이것은 시스템에 일종의 Damping(가상의 마찰)을 추가해서 에너지를 계속 뽑아내서 결국 멈추게 만드는 원리이다. 

<div class="pdf-viewer-container" data-pdf="/assets/img/posts/study-ds/ds6.pdf" data-page="13"></div>



## Feedback Passivation

본래 passive하지 않은 *Control-Affien System ($$\dot{x} = f(x) + G(x)u $$)*를 제어기를 통해 passive하게 만드는 기법이다. 

> **Strategy**
>
> 1. State Feedback $$u = \alpha(x) + \beta(x)v$$를 설계해서 시스템의 에너지 변화량($$\dot{V}$$)이 0이하가 되도록 만든다.
> 2. 새로운 출력함수를 **$$y =  h(x) := [\frac{\partial V(x)}{\partial x} G(x)\beta(x)]^T$$**로 정의해서, 새로운 입력 $v$와 출력 $y$ 사이의 관계를 passive 하게 바꾼다. 


<div class="pdf-viewer-container" data-pdf="/assets/img/posts/study-ds/ds6.pdf" data-page="14"></div>

