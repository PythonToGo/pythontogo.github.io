/**
 * GitHub 인증 처리
 * GitHub API를 사용하여 현재 사용자가 로그인했는지 확인
 * Personal Access Token을 사용하거나, GitHub의 파일 편집 링크를 직접 사용
 */

(function() {
  'use strict';

  // 설정 - _config.yml에서 가져올 값들
  const GITHUB_USERNAME = 'PythonToGo'; // _config.yml의 github.username과 일치해야 함
  const GITHUB_REPO = 'PythonToGo/PythonToGo.github.io'; // _config.yml의 comments.utterances.repo와 일치

  // GitHub Personal Access Token (선택사항 - 설정하면 API로 사용자 확인 가능)
  // 사용자가 브라우저 콘솔에서 설정할 수 있음: localStorage.setItem('github_pat', 'your_token')
  // 또는 GitHub의 파일 편집 링크를 직접 사용 (GitHub에 로그인한 사용자만 접근 가능)

  // GitHub API를 사용하여 사용자 정보 가져오기
  async function fetchUserInfo(token) {
    try {
      // 최신 GitHub API는 Bearer 토큰을 사용합니다
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });

      if (!response.ok) {
        // token 방식도 시도 (하위 호환성)
        const fallbackResponse = await fetch('https://api.github.com/user', {
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        
        if (!fallbackResponse.ok) {
          throw new Error('Failed to fetch user info');
        }
        
        const user = await fallbackResponse.json();
        return user;
      }

      const user = await response.json();
      return user;
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  }

  // 인증된 사용자인지 확인
  async function checkAuthStatus() {
    const token = localStorage.getItem('github_pat');
    
    if (!token) {
      return false;
    }

    const user = await fetchUserInfo(token);
    if (!user || user.login !== GITHUB_USERNAME) {
      // 토큰이 유효하지 않거나 사용자가 일치하지 않음
      localStorage.removeItem('github_pat');
      return false;
    }

    return true;
  }

  // GitHub Personal Access Token 설정
  function setPersonalAccessToken(token) {
    localStorage.setItem('github_pat', token);
    window.location.reload();
  }

  // 로그아웃
  function logout() {
    localStorage.removeItem('github_pat');
    window.location.reload();
  }

  // GitHub Personal Access Token 입력 프롬프트
  function promptForToken() {
    const token = prompt('GitHub Personal Access Token을 입력하세요.\n\n토큰 생성 방법:\n1. GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)\n2. "Generate new token" 클릭\n3. "repo" 권한 선택\n4. 생성된 토큰을 복사하여 여기에 붙여넣기');
    
    if (token && token.trim()) {
      setPersonalAccessToken(token.trim());
    }
  }

  // 전역 함수로 export
  window.GitHubAuth = {
    isAuthenticated: checkAuthStatus,
    login: promptForToken,
    logout: logout,
    getUsername: async function() {
      const token = localStorage.getItem('github_pat');
      if (!token) return null;
      const user = await fetchUserInfo(token);
      return user ? user.login : null;
    },
    setToken: setPersonalAccessToken
  };

})();
