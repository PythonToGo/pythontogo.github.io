/**
 * Edit/Create 버튼 추가 및 처리
 * GitHub 인증 후에만 버튼이 표시되고, 클릭 시 GitHub의 파일 편집 페이지로 이동
 */

(function() {
  'use strict';

  // 설정
  const GITHUB_REPO = 'PythonToGo/PythonToGo.github.io';
  const GITHUB_BRANCH = 'main'; // 또는 'master'
  const GITHUB_USERNAME = 'PythonToGo';

  // GitHub 파일 편집 URL 생성
  function getEditUrl(filePath) {
    return `https://github.com/${GITHUB_REPO}/edit/${GITHUB_BRANCH}/${filePath}`;
  }

  // 새 포스트 생성 URL
  function getCreatePostUrl() {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const filename = `${dateStr}-new-post.md`;
    return `https://github.com/${GITHUB_REPO}/new/${GITHUB_BRANCH}/_posts?filename=${encodeURIComponent(filename)}&value=${encodeURIComponent(getDefaultPostContent())}`;
  }

  // 기본 포스트 내용
  function getDefaultPostContent() {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const timeStr = today.toTimeString().split(' ')[0].substring(0, 5);
    
    return `---
title: "새 포스트"
date: ${dateStr} ${timeStr}:00
categories: []
tags: []
pin: false
math: false
mermaid: false
comments: true
---

여기에 포스트 내용을 작성하세요.
`;
  }

  // 현재 포스트의 파일 경로 찾기
  function getCurrentPostPath() {
    // Jekyll의 permalink 구조: /posts/:title/
    const path = window.location.pathname;
    const match = path.match(/\/posts\/([^\/]+)\/?$/);
    
    if (!match) {
      return null;
    }
    
    const urlTitle = match[1];
    let dateStr = null;
    
    // 방법 1: 페이지의 메타데이터에서 날짜 가져오기
    const metaDate = document.querySelector('meta[property="article:published_time"]');
    if (metaDate) {
      dateStr = metaDate.getAttribute('content').split('T')[0];
    }
    
    // 방법 2: time 요소에서 날짜 가져오기
    if (!dateStr) {
      const timeElement = document.querySelector('time[datetime]');
      if (timeElement) {
        dateStr = timeElement.getAttribute('datetime').split('T')[0];
      }
    }
    
    // 방법 3: post-meta에서 날짜 찾기
    if (!dateStr) {
      const postMeta = document.querySelector('.post-meta time, .post-meta .time');
      if (postMeta) {
        const datetime = postMeta.getAttribute('datetime') || postMeta.textContent;
        if (datetime) {
          const dateMatch = datetime.match(/(\d{4}-\d{2}-\d{2})/);
          if (dateMatch) {
            dateStr = dateMatch[1];
          }
        }
      }
    }
    
    // 방법 4: 페이지 제목 근처에서 날짜 찾기
    if (!dateStr) {
      const pageTitle = document.querySelector('h1.post-title, h1.page-title, h1');
      if (pageTitle) {
        const parent = pageTitle.parentElement;
        if (parent) {
          const dateElement = parent.querySelector('time[datetime]');
          if (dateElement) {
            dateStr = dateElement.getAttribute('datetime').split('T')[0];
          }
        }
      }
    }
    
    // 날짜를 찾지 못한 경우 null 반환 (GitHub에서 파일을 찾을 수 없을 수 있음)
    if (!dateStr) {
      console.warn('포스트 날짜를 찾을 수 없습니다. URL title만 사용합니다:', urlTitle);
      // 날짜 없이 시도 (실제 파일명과 다를 수 있음)
      const filename = urlTitle.toLowerCase().replace(/[^a-z0-9-]/g, '-');
      return `_posts/${filename}.md`;
    }
    
    // URL title을 파일명으로 변환 (특수문자 제거, 하이픈으로 변환)
    const filename = urlTitle.toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    return `_posts/${dateStr}-${filename}.md`;
  }

  // Edit 버튼 추가 (포스트 페이지)
  function addEditButton() {
    // 이미 버튼이 있으면 추가하지 않음
    if (document.getElementById('post-edit-button')) {
      return;
    }

    const postPath = getCurrentPostPath();
    if (!postPath) {
      console.warn('포스트 경로를 찾을 수 없습니다.');
      return;
    }

    // Chirpy 테마의 포스트 헤더 구조에 맞게 버튼 추가
    // 여러 가능한 위치를 시도
    let targetContainer = null;
    
    // 방법 1: post-title 클래스를 가진 요소 찾기
    const postTitle = document.querySelector('.post-title, h1.post-title, header .post-title');
    if (postTitle) {
      // 제목 다음에 버튼 추가
      const titleContainer = postTitle.parentElement;
      if (titleContainer) {
        targetContainer = titleContainer;
      }
    }
    
    // 방법 2: post-header 또는 page-header 찾기
    if (!targetContainer) {
      targetContainer = document.querySelector('.post-header, .page-header, header.post-header, .post-meta');
    }
    
    // 방법 3: main 또는 content 영역 찾기
    if (!targetContainer) {
      targetContainer = document.querySelector('main, .content, .page');
    }

    if (!targetContainer) {
      console.warn('버튼을 추가할 컨테이너를 찾을 수 없습니다.');
      return;
    }

    const editButton = document.createElement('a');
    editButton.id = 'post-edit-button';
    editButton.href = getEditUrl(postPath);
    editButton.target = '_blank';
    editButton.rel = 'noopener noreferrer';
    editButton.className = 'btn btn-sm btn-outline-primary';
    editButton.innerHTML = '<i class="fas fa-edit"></i> Edit';
    editButton.style.marginLeft = '10px';
    editButton.style.marginTop = '10px';
    editButton.style.marginBottom = '10px';
    editButton.style.display = 'inline-block';

    // 제목이 있으면 제목 다음에, 없으면 컨테이너 시작 부분에 추가
    if (postTitle && postTitle.nextSibling) {
      targetContainer.insertBefore(editButton, postTitle.nextSibling);
    } else if (postTitle) {
      postTitle.parentNode.insertBefore(editButton, postTitle.nextSibling);
    } else {
      // 제목이 없으면 컨테이너의 첫 번째 자식으로 추가
      if (targetContainer.firstChild) {
        targetContainer.insertBefore(editButton, targetContainer.firstChild);
      } else {
        targetContainer.appendChild(editButton);
      }
    }
  }

  // Create 버튼 추가 (홈 페이지)
  function addCreateButton() {
    // 이미 버튼이 있으면 추가하지 않음
    if (document.getElementById('post-create-button')) {
      return;
    }

    // 홈 페이지인지 확인
    const isHomePage = window.location.pathname === '/' || 
                      window.location.pathname === '/index.html' ||
                      document.body.classList.contains('home');

    if (!isHomePage) {
      return;
    }

    // 적절한 위치에 버튼 추가
    const mainContent = document.querySelector('main') || 
                       document.querySelector('.content') ||
                       document.body;

    if (!mainContent) {
      return;
    }

    const createButton = document.createElement('a');
    createButton.id = 'post-create-button';
    createButton.href = getCreatePostUrl();
    createButton.target = '_blank';
    createButton.rel = 'noopener noreferrer';
    createButton.className = 'btn btn-primary';
    createButton.innerHTML = '<i class="fas fa-plus"></i> 새 포스트 작성';
    createButton.style.position = 'fixed';
    createButton.style.bottom = '20px';
    createButton.style.right = '20px';
    createButton.style.zIndex = '1000';
    createButton.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';

    mainContent.appendChild(createButton);
  }

  // 인증 확인 후 버튼 표시
  async function showButtonsIfAuthenticated() {
    // GitHub 인증 확인
    if (window.GitHubAuth) {
      const isAuth = await window.GitHubAuth.isAuthenticated();
      if (isAuth) {
        const username = await window.GitHubAuth.getUsername();
        if (username === GITHUB_USERNAME) {
          // 포스트 페이지인 경우 Edit 버튼 추가
          if (window.location.pathname.includes('/posts/')) {
            addEditButton();
          }
          // 홈 페이지인 경우 Create 버튼 추가
          addCreateButton();
          return;
        }
      }
    }
    
    // 인증되지 않은 경우, 로그인 버튼 표시
    showLoginButton();
  }

  // 로그인 버튼 표시
  function showLoginButton() {
    // 이미 로그인 버튼이 있으면 추가하지 않음
    if (document.getElementById('github-login-button') || 
        document.getElementById('github-login-button-home')) {
      return;
    }

    const loginButton = document.createElement('button');
    loginButton.id = 'github-login-button';
    loginButton.className = 'btn btn-sm btn-outline-secondary';
    loginButton.innerHTML = '<i class="fab fa-github"></i> GitHub로 로그인';
    loginButton.onclick = function() {
      if (window.GitHubAuth) {
        window.GitHubAuth.login();
      } else {
        alert('GitHub 인증이 초기화되지 않았습니다.');
      }
    };
    loginButton.style.marginLeft = '10px';
    loginButton.style.marginTop = '10px';
    loginButton.style.marginBottom = '10px';

    // 포스트 페이지인 경우
    if (window.location.pathname.includes('/posts/')) {
      // Edit 버튼과 같은 위치에 로그인 버튼 추가
      let targetContainer = null;
      const postTitle = document.querySelector('.post-title, h1.post-title, header .post-title');
      if (postTitle) {
        const titleContainer = postTitle.parentElement;
        if (titleContainer) {
          targetContainer = titleContainer;
        }
      }
      
      if (!targetContainer) {
        targetContainer = document.querySelector('.post-header, .page-header, header.post-header, .post-meta, main, .content, .page');
      }

      if (targetContainer) {
        if (postTitle && postTitle.nextSibling) {
          targetContainer.insertBefore(loginButton, postTitle.nextSibling);
        } else if (postTitle) {
          postTitle.parentNode.insertBefore(loginButton, postTitle.nextSibling);
        } else {
          if (targetContainer.firstChild) {
            targetContainer.insertBefore(loginButton, targetContainer.firstChild);
          } else {
            targetContainer.appendChild(loginButton);
          }
        }
      }
    }
    
    // 홈 페이지인 경우에도 로그인 버튼 표시 (하단 고정)
    const isHomePage = window.location.pathname === '/' || 
                      window.location.pathname === '/index.html' ||
                      document.body.classList.contains('home');
    
    if (isHomePage) {
      const mainContent = document.querySelector('main') || 
                         document.querySelector('.content') ||
                         document.body;
      if (mainContent) {
        const homeLoginButton = loginButton.cloneNode(true);
        homeLoginButton.id = 'github-login-button-home';
        homeLoginButton.style.position = 'fixed';
        homeLoginButton.style.bottom = '20px';
        homeLoginButton.style.right = '20px';
        homeLoginButton.style.zIndex = '1000';
        homeLoginButton.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        mainContent.appendChild(homeLoginButton);
      }
    }
  }

  // 페이지 로드 시 실행
  function init() {
    // DOM이 완전히 로드될 때까지 대기
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        // Chirpy 테마의 스크립트가 로드될 시간을 주기 위해 약간의 지연
        setTimeout(showButtonsIfAuthenticated, 1000);
      });
    } else {
      setTimeout(showButtonsIfAuthenticated, 1000);
    }
  }
  
  // 초기화 실행
  init();
  
  // 페이지 전환 시에도 작동하도록 (SPA나 AJAX 네비게이션 대응)
  window.addEventListener('popstate', function() {
    setTimeout(showButtonsIfAuthenticated, 500);
  });

  // 전역 함수로 export
  window.EditButtons = {
    showButtons: showButtonsIfAuthenticated,
    addEditButton: addEditButton,
    addCreateButton: addCreateButton
  };

})();
