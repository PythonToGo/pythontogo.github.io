// Euler-Winkel 3D Rotation Animation
(function () {
  'use strict';

  // Initialize Three.js
  function initEulerWinkelAnimation(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Each animation instance has its own state
    let scene, camera, renderer;
    let axesHelper, coordinateSystem;
    let animationId = null;
    let isAnimating = false;
    let currentStep = 0;
    let phi = 0,
      theta = 0,
      psi = 0; // Euler angles
    let targetPhi = 0,
      targetTheta = 0,
      targetPsi = 0;
    let angleLabels = { phi: null, theta: null, psi: null };

    const canvasWrapper = container.querySelector(
      '.euler-winkel-canvas-wrapper'
    );
    if (!canvasWrapper) return;

    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);

    // Camera setup
    const width = canvasWrapper.clientWidth;
    const height = canvasWrapper.clientHeight;
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    canvasWrapper.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create coordinate system
    createCoordinateSystem();

    // Setup controls
    setupControls(container);

    // Initial rotation update
    updateRotation();

    // Handle window resize
    window.addEventListener('resize', () => {
      const newWidth = canvasWrapper.clientWidth;
      const newHeight = canvasWrapper.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    });

    // Start animation loop
    animate();

    function createCoordinateSystem() {
      // Clear existing
      if (axesHelper) scene.remove(axesHelper);
      if (coordinateSystem) scene.remove(coordinateSystem);

      // Axes helper (fixed reference frame)
      axesHelper = new THREE.AxesHelper(2);
      scene.add(axesHelper);

      // Create rotating coordinate system
      coordinateSystem = new THREE.Group();

      // X-axis (red)
      const xGeometry = new THREE.CylinderGeometry(0.06, 0.06, 2, 8);
      const xMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
      const xAxis = new THREE.Mesh(xGeometry, xMaterial);
      xAxis.rotation.z = -Math.PI / 2;
      xAxis.position.x = 1;
      coordinateSystem.add(xAxis);

      // Y-axis (green)
      const yGeometry = new THREE.CylinderGeometry(0.06, 0.06, 2, 8);
      const yMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
      const yAxis = new THREE.Mesh(yGeometry, yMaterial);
      yAxis.rotation.z = -Math.PI / 2;
      yAxis.rotation.x = Math.PI / 2;
      yAxis.position.y = 1;
      coordinateSystem.add(yAxis);

      // Z-axis (blue)
      const zGeometry = new THREE.CylinderGeometry(0.06, 0.06, 2, 8);
      const zMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
      const zAxis = new THREE.Mesh(zGeometry, zMaterial);
      zAxis.position.z = 1;
      coordinateSystem.add(zAxis);

      // Helper function to create text sprite
      function createTextSprite(
        text,
        color = '#ffffff',
        backgroundColor = 'rgba(0,0,0,0.7)'
      ) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 64;

        // Draw background
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Draw text
        context.fillStyle = color;
        context.font = 'Bold 32px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(0.5, 0.25, 1);

        return sprite;
      }

      // Add axis labels
      const xLabel = createTextSprite('x', '#ff0000');
      xLabel.position.set(2.3, 0, 0);
      coordinateSystem.add(xLabel);

      const yLabel = createTextSprite('y', '#00ff00');
      yLabel.position.set(0, 2.3, 0);
      coordinateSystem.add(yLabel);

      const zLabel = createTextSprite('z', '#0000ff');
      zLabel.position.set(0, 0, 2.3);
      coordinateSystem.add(zLabel);

      // Add angle labels (will be updated in updateRotation)
      angleLabels.phi = createTextSprite('φ = 0°', '#ffff00');
      angleLabels.phi.position.set(-1.5, 1.5, 0);
      scene.add(angleLabels.phi);

      angleLabels.theta = createTextSprite('θ = 0°', '#ffff00');
      angleLabels.theta.position.set(-1.5, 1.2, 0);
      scene.add(angleLabels.theta);

      angleLabels.psi = createTextSprite('ψ = 0°', '#ffff00');
      angleLabels.psi.position.set(-1.5, 0.9, 0);
      scene.add(angleLabels.psi);

      // Add semi-transparent rigid body (box) to visualize rotation
      const boxGeometry = new THREE.BoxGeometry(1.2, 0.8, 0.6);
      const boxMaterial = new THREE.MeshPhongMaterial({
        color: 0x8888ff,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      });
      const rigidBody = new THREE.Mesh(boxGeometry, boxMaterial);
      rigidBody.position.set(0.3, 0.2, 0.1); // Offset slightly to show rotation better
      coordinateSystem.add(rigidBody);

      // Add edges to the box for better visibility
      const edgesGeometry = new THREE.EdgesGeometry(boxGeometry);
      const edgesMaterial = new THREE.LineBasicMaterial({
        color: 0x4444ff,
        linewidth: 2,
      });
      const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
      edges.position.set(0.3, 0.2, 0.1);
      coordinateSystem.add(edges);

      scene.add(coordinateSystem);
    }

    function setupControls(container) {
      const phiSlider = container.querySelector('#phi-slider');
      const thetaSlider = container.querySelector('#theta-slider');
      const psiSlider = container.querySelector('#psi-slider');
      const phiValue = container.querySelector('#phi-value');
      const thetaValue = container.querySelector('#theta-value');
      const psiValue = container.querySelector('#psi-value');
      const stepIndicator = container.querySelector(
        '.euler-winkel-step-indicator'
      );
      const playButton = container.querySelector('#play-animation');
      const resetButton = container.querySelector('#reset-animation');
      const stepButton = container.querySelector('#step-animation');

      // Update sliders
      if (phiSlider && phiValue) {
        phiSlider.addEventListener('input', (e) => {
          phi = (parseFloat(e.target.value) * Math.PI) / 180;
          targetPhi = phi;
          phiValue.textContent = e.target.value + '°';
          updateRotation();
        });
      }

      if (thetaSlider && thetaValue) {
        thetaSlider.addEventListener('input', (e) => {
          theta = (parseFloat(e.target.value) * Math.PI) / 180;
          targetTheta = theta;
          thetaValue.textContent = e.target.value + '°';
          updateRotation();
        });
      }

      if (psiSlider && psiValue) {
        psiSlider.addEventListener('input', (e) => {
          psi = (parseFloat(e.target.value) * Math.PI) / 180;
          targetPsi = psi;
          psiValue.textContent = e.target.value + '°';
          updateRotation();
        });
      }

      // Play animation
      if (playButton) {
        playButton.addEventListener('click', () => {
          if (isAnimating) {
            stopAnimation();
            playButton.textContent = 'Play Animation';
          } else {
            startAnimation();
            playButton.textContent = 'Stop Animation';
          }
        });
      }

      // Reset
      if (resetButton) {
        resetButton.addEventListener('click', () => {
          resetAnimation();
        });
      }

      // Step through
      if (stepButton) {
        stepButton.addEventListener('click', () => {
          stepAnimation();
        });
      }

      updateStepIndicator(stepIndicator);
    }

    function updateRotation() {
      if (!coordinateSystem) return;

      // Update angle labels
      function updateAngleLabel(sprite, text, color = '#ffff00') {
        if (!sprite) return;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;

        context.fillStyle = 'rgba(0,0,0,0.7)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = color;
        context.font = 'Bold 28px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        sprite.material.map.dispose();
        sprite.material.map = new THREE.CanvasTexture(canvas);
        sprite.material.needsUpdate = true;
      }

      const phiDeg = Math.round((phi * 180) / Math.PI);
      const thetaDeg = Math.round((theta * 180) / Math.PI);
      const psiDeg = Math.round((psi * 180) / Math.PI);

      updateAngleLabel(angleLabels.phi, `φ = ${phiDeg}°`, '#ffff00');
      updateAngleLabel(angleLabels.theta, `θ = ${thetaDeg}°`, '#ffff00');
      updateAngleLabel(angleLabels.psi, `ψ = ${psiDeg}°`, '#ffff00');

      // Calculate rotation matrix for z-x-z Euler angles
      // R = R_z(psi) * R_x(theta) * R_z(phi)

      // R_z(phi) - rotation around z-axis by phi
      const Rz1 = new THREE.Matrix4();
      Rz1.makeRotationZ(phi);

      // R_x(theta) - rotation around x-axis by theta
      const Rx = new THREE.Matrix4();
      Rx.makeRotationX(theta);

      // R_z(psi) - rotation around z-axis by psi
      const Rz2 = new THREE.Matrix4();
      Rz2.makeRotationZ(psi);

      // Old manual matrix code (replaced with makeRotation methods above)
      /*
    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);
    const cosPsi = Math.cos(psi);
    const sinPsi = Math.sin(psi);

    // R_z(phi)
    const Rz1 = new THREE.Matrix4().set(
      cosPhi,
      -sinPhi,
      0,
      0,
      sinPhi,
      cosPhi,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    );

    // R_x(theta)
    const Rx = new THREE.Matrix4().set(
      1,
      0,
      0,
      0,
      0,
      cosTheta,
      -sinTheta,
      0,
      0,
      sinTheta,
      cosTheta,
      0,
      0,
      0,
      0,
      1
    );

    // R_z(psi)
    const Rz2 = new THREE.Matrix4().set(
      cosPsi,
      -sinPsi,
      0,
      0,
      sinPsi,
      cosPsi,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    );
    */

      // Combined: R = R_z(psi) * R_x(theta) * R_z(phi)
      // First: R_temp = R_x(theta) * R_z(phi)
      const R_temp = new THREE.Matrix4();
      R_temp.multiplyMatrices(Rx, Rz1);
      // Then: R = R_z(psi) * R_temp
      const R = new THREE.Matrix4();
      R.multiplyMatrices(Rz2, R_temp);

      // Apply rotation matrix
      coordinateSystem.rotation.setFromRotationMatrix(R);
    }

    function startAnimation() {
      if (isAnimating) return;
      isAnimating = true;
      currentStep = 0;
      phi = 0;
      theta = 0;
      psi = 0;
      animateSteps();
    }

    function stopAnimation() {
      isAnimating = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    }

    function resetAnimation() {
      stopAnimation();
      phi = 0;
      theta = 0;
      psi = 0;
      targetPhi = 0;
      targetTheta = 0;
      targetPsi = 0;
      currentStep = 0;
      if (container) {
        const phiSlider = container.querySelector('#phi-slider');
        const thetaSlider = container.querySelector('#theta-slider');
        const psiSlider = container.querySelector('#psi-slider');
        const phiValue = container.querySelector('#phi-value');
        const thetaValue = container.querySelector('#theta-value');
        const psiValue = container.querySelector('#psi-value');

        if (phiSlider) phiSlider.value = 0;
        if (thetaSlider) thetaSlider.value = 0;
        if (psiSlider) psiSlider.value = 0;
        if (phiValue) phiValue.textContent = '0°';
        if (thetaValue) thetaValue.textContent = '0°';
        if (psiValue) psiValue.textContent = '0°';
      }

      updateRotation();
      updateStepIndicator();
    }

    function stepAnimation() {
      stopAnimation();
      currentStep = (currentStep + 1) % 4;
      if (container) {
        const phiSlider = container.querySelector('#phi-slider');
        const thetaSlider = container.querySelector('#theta-slider');
        const psiSlider = container.querySelector('#psi-slider');

        if (currentStep === 0) {
          phi = 0;
          theta = 0;
          psi = 0;
          if (phiSlider) phiSlider.value = 0;
          if (thetaSlider) thetaSlider.value = 0;
          if (psiSlider) psiSlider.value = 0;
        } else if (currentStep === 1) {
          phi = (45 * Math.PI) / 180;
          theta = 0;
          psi = 0;
          if (phiSlider) phiSlider.value = 45;
          if (thetaSlider) thetaSlider.value = 0;
          if (psiSlider) psiSlider.value = 0;
        } else if (currentStep === 2) {
          phi = (45 * Math.PI) / 180;
          theta = (30 * Math.PI) / 180;
          psi = 0;
          if (phiSlider) phiSlider.value = 45;
          if (thetaSlider) thetaSlider.value = 30;
          if (psiSlider) psiSlider.value = 0;
        } else if (currentStep === 3) {
          phi = (45 * Math.PI) / 180;
          theta = (30 * Math.PI) / 180;
          psi = (60 * Math.PI) / 180;
          if (phiSlider) phiSlider.value = 45;
          if (thetaSlider) thetaSlider.value = 30;
          if (psiSlider) psiSlider.value = 60;
        }

        const phiValue = container.querySelector('#phi-value');
        const thetaValue = container.querySelector('#theta-value');
        const psiValue = container.querySelector('#psi-value');
        if (phiValue)
          phiValue.textContent = Math.round((phi * 180) / Math.PI) + '°';
        if (thetaValue)
          thetaValue.textContent = Math.round((theta * 180) / Math.PI) + '°';
        if (psiValue)
          psiValue.textContent = Math.round((psi * 180) / Math.PI) + '°';
      }

      updateRotation();
      updateStepIndicator();
    }

    function animateSteps() {
      if (!isAnimating) return;

      const duration = 2000; // 2 seconds per step
      const startTime = Date.now();
      let stepStartTime = startTime;

      function animate() {
        if (!isAnimating) return;

        const now = Date.now();
        const elapsed = now - stepStartTime;

        if (currentStep === 0 && elapsed < duration) {
          // Initial state
          phi = 0;
          theta = 0;
          psi = 0;
        } else if (currentStep === 0 && elapsed >= duration) {
          currentStep = 1;
          stepStartTime = now;
        } else if (currentStep === 1 && elapsed < duration) {
          // Step 1: Rotate around z by phi
          const progress = elapsed / duration;
          phi = (45 * Math.PI * progress) / 180;
          theta = 0;
          psi = 0;
        } else if (currentStep === 1 && elapsed >= duration) {
          currentStep = 2;
          stepStartTime = now;
          phi = (45 * Math.PI) / 180;
        } else if (currentStep === 2 && elapsed < duration) {
          // Step 2: Rotate around new x by theta
          const progress = elapsed / duration;
          phi = (45 * Math.PI) / 180;
          theta = (30 * Math.PI * progress) / 180;
          psi = 0;
        } else if (currentStep === 2 && elapsed >= duration) {
          currentStep = 3;
          stepStartTime = now;
          theta = (30 * Math.PI) / 180;
        } else if (currentStep === 3 && elapsed < duration) {
          // Step 3: Rotate around new z by psi
          const progress = elapsed / duration;
          phi = (45 * Math.PI) / 180;
          theta = (30 * Math.PI) / 180;
          psi = (60 * Math.PI * progress) / 180;
        } else if (currentStep === 3 && elapsed >= duration) {
          // Loop back
          currentStep = 0;
          stepStartTime = now;
        }

        updateRotation();
        updateStepIndicator();
        renderer.render(scene, camera);

        animationId = requestAnimationFrame(animate);
      }

      animate();
    }

    function updateStepIndicator(element) {
      if (!element) {
        element = container.querySelector('.euler-winkel-step-indicator');
      }
      if (!element) return;

      const steps = [
        'initial state',
        `Step 1: z-axis basis $\\varphi$ = ${Math.round(
          (phi * 180) / Math.PI
        )}° rotation`,
        `Step 2: new x-axis basis $\\vartheta$ = ${Math.round(
          (theta * 180) / Math.PI
        )}° rotation`,
        `Step 3: new z-axis basis $\\phi$ = ${Math.round(
          (psi * 180) / Math.PI
        )}° rotation`,
      ];

      element.innerHTML = `<strong>${steps[currentStep]}</strong>`;

      // Re-render MathJax if available
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([element]).catch(function (err) {
          console.error('MathJax rendering error:', err);
        });
      } else if (window.MathJax && window.MathJax.Hub) {
        // Fallback for older MathJax versions
        window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, element]);
      }
    }

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
  }

  // Initialize when DOM is ready
  function initAllAnimations() {
    document
      .querySelectorAll('.euler-winkel-container')
      .forEach((container, index) => {
        const containerId = container.id || `euler-winkel-${index}`;
        if (!container.id) container.id = containerId;
        initEulerWinkelAnimation(containerId);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllAnimations);
  } else {
    initAllAnimations();
  }

  // Expose for manual initialization
  window.initEulerWinkelAnimation = initEulerWinkelAnimation;
})();
