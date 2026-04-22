---
title: "Probabilistic Inference : MLE, MAP, and Bayesian Estimation"
description: MLE, MAP, and Bayesian Estimation
date: 2025-12-27
categories: [Study, Machine_Learning]
tags: [Machine Learning, Probabilistic Inference, MLE, MAP, Bayesian Estimation]
# pin: true
math: true
mermaid: true
comments: true
# image: 
#     path: 
#     lqip: 
#     alt: 
---

# Probabilistic Inference

## 1. Introduction & Model Assumptions

목적: 관찰한 데이터 $$D$$를 바탕으로 모델 파라미터 $$\theta$$를 추론하거나, 새로운 데이터 $$x_{new}$$의 발생 확률을 예측하는 것이다.

### i.i.d. Assumptions

데이터 분석을 위해 각 관찰값들이 **independent and identically distributed** 되어 있다고 가정한다. (확률이니까)

- **Identical distribution**: 모든 데이터가 동일한 파라미터 $$\theta$$를 가진다
- **Independence**: 각 데이터 포인트는 서로 영향을 주지 않으므로 전체 확률을 개별 확률의 곱으로 나타낼 수 있다:
  $$
  p(D \mid \theta) = \prod_{i=1}^N p(x_i \mid \theta)
  $$

---

## 2. Maximum Likelihood Estimation (MLE)

MLE는 관찰된 데이터의 발생 확률인 **Likelihood** $$p(D \mid \theta)$$를 최대화하는 파라미터 $$\theta$$를 찾는 기법이다.

### Objective

$$
\theta_{MLE} = \arg\max_{\theta} p(D \mid \theta)
$$

### Log-likelihood

계산의 편의성과 수치적 안정성을 위해 Likelihood 대신, **Log-likelihood** $$\log p(D \mid \theta)$$를 최대화한다. Logarithm은 Monotonic transform이므로 최댓값의 위치를 보존하고, 곱셈을 덧셈으로 변환해서 더 쉬움.

### Coin Flip 예시

동전 던지기에서 T와 H의 개수를 각각 $$\lvert T \rvert$$, $$\lvert H\rvert$$라 할 때:

$$
\theta_{MLE} = \frac{\left|T\right|}{\left|T\right|+\left|H\right|}
$$

### Gaussian 예시

평균 $$\mu$$를 추정할 때:

$$
\mu_{MLE} = \frac{1}{N} \sum_{i=1}^N x_i
$$

이는 데이터의 산술 평균과 같다. 


> 💡 **추가 설명**
> 
> MLE는 데이터가 적을 때 직관과 어긋나는 결과를 낼 수 있다. 예를 들어 동전을 두 번 던져 모두 H가 나오면, MLE는 뒷면이 나올 확률 $$\theta$$를 0으로 추정하지만, 이는 우리의 일반 상식 Prior belief와 다르다. 그래서 여기서 (아래에 나올) MAP는 데이터를 관찰하기 전에, 우리가 가진 주관적 믿음인 **Prior distribution** $$p(\theta)$$를 먼저 수학적으로 결합한다. 그리고, 단순히 데이터의 가능성 $$p(D \mid \theta)$$을 높이는 것보다는, **데이터가 주어졌을 때 파라미터가 실제로 존재할 확률**인 **Posterior distribution** $$p(\theta \mid D)$$를 고려한다. 아래 나오는 MAP의 목적은 Posterior distribution에서 가장 확률이 높은 값, 즉 최빈값(Mode)을 찾는 것이다. 


## Bayesian Inference

Bayesian 관점에서 파라미터 $$\theta$$를 고정된 값이 아닌, 확률 분포를 가진 확률 변수로 취급한다.

### Prior Distribution $$p(\theta)$$

데이터를 관찰하기 전에, 파라미터에 대해 가지고 있는 주관적인 믿음을 의미한다.

### Posterior Distribution $$p(\theta \mid D)$$

데이터를 관찰한 후 업데이트된 믿음이다. Bayes' Rule에 의해 다음과 같이 정의된다:

$$
p(\theta \mid D) = \frac{p(D \mid \theta)p(\theta)}{p(D)}
$$

- **Likelihood** $$p(D \mid \theta)$$: 데이터가 주어졌을 때 파라미터의 가능성
- **Evidence** $$p(D)$$: Normalizing constant로, posterior distribution의 합이 1이 되도록 한다

> ⚠️ **중요**: 관계식: Posterior $$\propto$$ Likelihood $$\times$$ Prior



## Maximum a Posteriori (MAP) Estimation

MAP은 Posterior distribution을 최대화하는 파라미터 값을 찾는 방식이다.

### Objective

$$
\theta_{MAP} = \arg\max_{\theta} p(\theta \mid D) = \arg\max_{\theta} [\log p(D \mid \theta) + \log p(\theta)]
$$

### Prior의 영향

데이터가 적을 때 Prior의 영향이 강하고, MLE가 가지는 데이터 부족에 따른 편향 문제를 완화해준다. 데이터가 많아질수록 Prior의 영향력은 줄어들고, MAP은 MLE에 수렴하게 된다. 

### Coin Flip에서 Beta Prior를 사용했을 때

$$
\theta_{MAP} = \frac{|T| + a - 1}{|H| + |T| + a + b - 2}
$$

#### Beta Prior

Beta Prior는 Bernoulli or Binomial distribution을 따르는 데이터를 분석할 때 가장 널리 사용되는 prior distribution이다.

**수학적 정의**:

$$
\text{Beta}(\theta | a, b) = \frac{\Gamma(a+b)}{\Gamma(a)\Gamma(b)} \theta^{a-1}(1 - \theta)^{b-1}
$$

- 여기서 $$a, b > 0$$는 분포의 형태를 결정하는 파라미터이다
- $$\Gamma(n)$$은 Gamma function으로, 자연수 $$n$$에 대해 $$(n-1)!$$과 같다

**Conjugate Prior**: Beta distribution은 Bernoulli likelihood에 대해 conjugate prior이다.

- 이는, Prior가 Beta 분포일 때, 데이터를 반영한 후의 Posterior도 반드시 Beta 분포가 됨을 의미한다
- 이 성질에 의해 복잡한 적분 계산 없이 단순히 파라미터를 더하는 것만으로 posterior distribution을 구할 수 있다

**Pseudo-counts 해석**: $$a$$와 $$b$$는 과거에 관찰한 데이터의 횟수로 해석한다. 코인 플립에 다시 적용하면:

- $$a$$: 과거에 관찰한 T의 횟수
- $$b$$: 과거에 관찰된 H의 횟수
- 만약 $$a=1, b=1$$이라면, 이는 Uniform distribution이 되어 아무런 정보가 없는 상태이고, 이때 MAP은 MLE와 동일한 결과를 나타낸다


### Gaussian 예시

정규분포 Prior $$N(\mu \mid 0, \alpha^{-1})$$를 가질 때:

$$
\mu_{MAP} = \frac{1}{N+\alpha} \sum_{i=1}^N x_i
$$

이는 $$\alpha > 0$$일 때, $$\mu_{MLE}$$보다 항상 0에 더 가까운 값(**Shrinkage**)을 가진다.



## Conjugate Priors

Prior와 Posterior가 동일한 Family의 분포를 따를 때, 해당 Prior를 **Conjugate Prior**라고 한다. 이 성질을 통해 Posterior distribution의 형태를 적분 없이 pattern matching을 통해 쉽게 도출 가능하다.

### 주요 조합

- Bernoulli Likelihood & Beta Prior → Beta Posterior
- Binomial Likelihood & Beta Prior → Beta Posterior
- Poisson Likelihood & Gamma Prior → Gamma Posterior

### Posterior mean

**Posterior mean**은 대체로 Prior mean과 MLE estimate 사이의 Compromise(절충안)으로 나타낸다.



## Posterior Predictive Distribution

새로운 데이터 $$x_{new}$$를 예측할 때, 단순히 하나의 점 추정치(MLE, MAP)를 사용하는 것이 아니라, Posterior distribution 전체를 고려하는 방식이다.

### Definition

$$
p(x_{new} \mid D, a, b) = \int p(x_{new} \mid \theta) p(\theta \mid D, a, b) d\theta
$$

### Marginalization

파라미터 $$\theta$$에 대해 적분해서 $$\theta$$를 제거하고 데이터에 대한 직접적인 확률을 구하는 과정이다.

### Fully Bayesian Analysis

이 방식은 파라미터에 대한 불확실성을 모두 고려하기 때문에 점 추정 방식(MLE, MAP)보다 더 포괄적인 분석이 가능하다.


## 결론

| 구분 | Maximum Likelihood (MLE) | Maximum a Posteriori (MAP) | Fully Bayesian |
|------|-------------------------|---------------------------|----------------|
| 목표 | $$\max p(D \mid \theta)$$ | $$\max p(\theta \mid D)$$ | $$p(\theta \mid D)$$ 전체 추정 |
| 결과 | Point estimate | Point estimate | Full distribution |
| Prior 사용 | 없음 (Uniform과 유사) | 사용 | 사용 |

Probabilistic Inference는 데이터(Likelihood)라는 새로운 증거와 기존의 지식(Prior) 사이에서 균형을 맞춰 나가는 과정과 같다. 데이터가 쌓일수록 우리의 믿음(Posterior)은 더 샤프해지고(peaky), 즉 다시 말해 더 확신에 찬 예측을 할 수 있다.


---
---
