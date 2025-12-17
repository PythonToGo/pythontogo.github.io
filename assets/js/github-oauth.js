// GitHub OAuth redirect handler
(function() {
  'use strict';

  // Check if we're on the editor page and need to redirect to GitHub OAuth
  function initGitHubOAuth() {
    // Get GitHub OAuth client ID from config or localStorage
    const githubClientId = localStorage.getItem('github-oauth-client-id') || 
                          getGitHubClientIdFromConfig();
    
    // Check if we're on the editor page
    const isEditorPage = window.location.pathname.includes('/editor') || 
                        window.location.pathname.endsWith('/editor/');
    
    if (isEditorPage && githubClientId) {
      // Check if we have a token already
      const existingToken = localStorage.getItem('github-token');
      
      // If no token, redirect to GitHub OAuth
      if (!existingToken) {
        redirectToGitHubOAuth(githubClientId);
        return;
      }
    }
    
    // Handle OAuth callback
    handleOAuthCallback();
  }

  function getGitHubClientIdFromConfig() {
    // Try to get from meta tag or data attribute
    const metaTag = document.querySelector('meta[name="github-oauth-client-id"]');
    if (metaTag) {
      return metaTag.getAttribute('content');
    }
    
    // Try to get from site config (if available in global scope)
    if (window.site && window.site.github && window.site.github.oauth_client_id) {
      return window.site.github.oauth_client_id;
    }
    
    return null;
  }

  function redirectToGitHubOAuth(clientId) {
    // Generate state for CSRF protection
    const state = generateState();
    sessionStorage.setItem('github-oauth-state', state);
    sessionStorage.setItem('github-oauth-redirect', window.location.pathname);
    
    // Build redirect URI - use current page as callback
    const redirectUri = window.location.origin + window.location.pathname;
    
    // GitHub OAuth authorization URL
    const authUrl = `https://github.com/login/oauth/authorize?` +
      `client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent('repo')}` +
      `&state=${encodeURIComponent(state)}` +
      `&allow_signup=false`;
    
    // Redirect to GitHub OAuth
    window.location.href = authUrl;
  }

  function handleOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    
    if (error) {
      console.error('GitHub OAuth error:', error, errorDescription);
      showOAuthError(error, errorDescription);
      return;
    }
    
    if (code && state) {
      // Verify state
      const savedState = sessionStorage.getItem('github-oauth-state');
      if (state !== savedState) {
        console.error('Invalid OAuth state');
        showOAuthError('invalid_state', 'Invalid OAuth state. Please try again.');
        return;
      }
      
      // Note: GitHub OAuth requires a backend server to exchange code for token
      // Since we're on a static site, we'll redirect to token setup
      // The user will need to manually create a Personal Access Token
      showTokenInstructions(code);
      
      // Clean up URL
      const redirectPath = sessionStorage.getItem('github-oauth-redirect') || window.location.pathname;
      const newUrl = redirectPath;
      window.history.replaceState({}, document.title, newUrl);
      sessionStorage.removeItem('github-oauth-state');
      sessionStorage.removeItem('github-oauth-redirect');
    }
  }

  function generateState() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  function showOAuthError(error, errorDescription) {
    const container = document.getElementById('markdown-editor-container');
    if (container) {
      const description = errorDescription ? `<p>${errorDescription}</p>` : '';
      container.innerHTML = `
        <div class="alert alert-danger" role="alert">
          <h4 class="alert-heading">GitHub OAuth Error</h4>
          <p>An error occurred during GitHub authentication: <strong>${error}</strong></p>
          ${description}
          <hr>
          <p class="mb-0">
            <a href="${window.location.pathname}" class="btn btn-primary">Try Again</a>
            <button onclick="location.reload()" class="btn btn-secondary ms-2">Reload Page</button>
          </p>
        </div>
      `;
    }
  }

  function showTokenInstructions(code) {
    const container = document.getElementById('markdown-editor-container');
    if (container) {
      const codeInfo = code ? `<p class="text-muted small">Authorization code received: ${code.substring(0, 10)}...</p>` : '';
      container.innerHTML = `
        <div class="alert alert-info" role="alert">
          <h4 class="alert-heading">GitHub Authentication Successful</h4>
          <p>To use the editor, you need to set up a GitHub Personal Access Token.</p>
          ${codeInfo}
          <ol>
            <li>Go to <a href="https://github.com/settings/tokens" target="_blank">GitHub Settings > Developer settings > Personal access tokens</a></li>
            <li>Click "Generate new token (classic)"</li>
            <li>Give it a name and select the <strong>repo</strong> scope</li>
            <li>Click "Generate token"</li>
            <li>Copy the token and click the "GitHub" button in the editor to paste it</li>
          </ol>
          <hr>
          <p class="mb-0">
            <button onclick="location.reload()" class="btn btn-primary">Continue to Editor</button>
          </p>
        </div>
      `;
    }
  }

  // Intercept sidebar editor link clicks
  function interceptEditorLink() {
    document.addEventListener('DOMContentLoaded', function() {
      // Find all editor links in sidebar
      const editorLinks = document.querySelectorAll('#sidebar a[href*="/editor"]');
      
      editorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
          const githubClientId = localStorage.getItem('github-oauth-client-id') || 
                                getGitHubClientIdFromConfig();
          
          if (githubClientId) {
            const existingToken = localStorage.getItem('github-token');
            
            if (!existingToken) {
              e.preventDefault();
              redirectToGitHubOAuth(githubClientId);
            }
          }
        });
      });
    });
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initGitHubOAuth();
      interceptEditorLink();
    });
  } else {
    initGitHubOAuth();
    interceptEditorLink();
  }
})();

