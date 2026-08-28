'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const Hero3DScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasWebGlError, setHasWebGlError] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    let animationFrameId: number;
    let isVisible = true;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    // Renderer setup with safe WebGL initialization
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch (err) {
      console.warn('WebGL initialization failed, using fallback:', err);
      setHasWebGlError(true);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.4, 7.2);


    // ----------------------------------------------------
    // LIGHTING SYSTEM
    // ----------------------------------------------------
    // Soft ambient studio light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Key directional light (soft studio lighting)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    // Fill Light (soft bluish white)
    const fillLight = new THREE.DirectionalLight(0xecfdf5, 1.0);
    fillLight.position.set(-5, 3, 3);
    scene.add(fillLight);

    // Brand Green Accent Spotlight (glowing on washing machine & steam)
    const greenAccentLight = new THREE.PointLight(0x16a34a, 4.0, 10);
    greenAccentLight.position.set(0.5, 0.2, 2.5);
    scene.add(greenAccentLight);

    // Top Rim Light
    const rimLight = new THREE.PointLight(0xffffff, 2.5, 8);
    rimLight.position.set(0, 4, -2);
    scene.add(rimLight);

    // ----------------------------------------------------
    // MATERIALS
    // ----------------------------------------------------
    const whitePlasticMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.2,
      metalness: 0.1,
    });

    const silverMetalMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.15,
      metalness: 0.85,
    });

    const chromeRingMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.05,
      metalness: 0.95,
    });

    const darkBezelMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.8,
    });

    const transparentGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });

    const greenBrandMat = new THREE.MeshStandardMaterial({
      color: 0x16a34a,
      roughness: 0.3,
      metalness: 0.2,
    });

    const whiteShirtMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.7,
    });

    const blueShirtMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      roughness: 0.6,
    });

    const denimMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      roughness: 0.8,
    });

    const towelEmeraldMat = new THREE.MeshStandardMaterial({
      color: 0x059669,
      roughness: 0.9,
    });

    // ----------------------------------------------------
    // 3D MESHES & COMPOSITION
    // ----------------------------------------------------
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. WASHING MACHINE BODY
    const machineGroup = new THREE.Group();
    machineGroup.position.set(-0.6, -0.2, 0);
    mainGroup.add(machineGroup);

    // Chassis Box
    const chassisGeo = new THREE.BoxGeometry(2.2, 2.7, 2.0);
    const chassisMesh = new THREE.Mesh(chassisGeo, whitePlasticMat);
    chassisMesh.castShadow = true;
    chassisMesh.receiveShadow = true;
    machineGroup.add(chassisMesh);

    // Front Panel Inset
    const frontPanelGeo = new THREE.BoxGeometry(2.1, 2.6, 0.1);
    const frontPanelMesh = new THREE.Mesh(frontPanelGeo, whitePlasticMat);
    frontPanelMesh.position.set(0, 0, 1.01);
    machineGroup.add(frontPanelMesh);

    // Top Digital Display Panel (Navy Strip)
    const displayPanelGeo = new THREE.BoxGeometry(1.9, 0.45, 0.05);
    const displayPanelMesh = new THREE.Mesh(displayPanelGeo, darkBezelMat);
    displayPanelMesh.position.set(0, 1.0, 1.06);
    machineGroup.add(displayPanelMesh);

    // Glowing LED Screen
    const ledGeo = new THREE.PlaneGeometry(0.5, 0.25);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
    const ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.position.set(0.5, 1.0, 1.09);
    machineGroup.add(ledMesh);

    // Program Dial Knob
    const dialGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.1, 32);
    const dialMesh = new THREE.Mesh(dialGeo, chromeRingMat);
    dialMesh.rotation.x = Math.PI / 2;
    dialMesh.position.set(-0.5, 1.0, 1.1);
    machineGroup.add(dialMesh);

    // Outer Door Frame (Chrome Ring)
    const doorFrameGeo = new THREE.TorusGeometry(0.85, 0.1, 16, 50);
    const doorFrameMesh = new THREE.Mesh(doorFrameGeo, chromeRingMat);
    doorFrameMesh.position.set(0, -0.2, 1.05);
    doorFrameMesh.castShadow = true;
    machineGroup.add(doorFrameMesh);

    // Transparent Glass Door
    const doorGlassGeo = new THREE.SphereGeometry(0.82, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.45);
    const doorGlassMesh = new THREE.Mesh(doorGlassGeo, transparentGlassMat);
    doorGlassMesh.rotation.x = -Math.PI / 2;
    doorGlassMesh.position.set(0, -0.2, 1.06);
    machineGroup.add(doorGlassMesh);

    // Inner Metallic Drum (Rotates)
    const drumGroup = new THREE.Group();
    drumGroup.position.set(0, -0.2, 0.3);
    machineGroup.add(drumGroup);

    const drumGeo = new THREE.CylinderGeometry(0.78, 0.78, 1.2, 32, 1, true);
    const drumMesh = new THREE.Mesh(drumGeo, silverMetalMat);
    drumMesh.rotation.x = Math.PI / 2;
    drumGroup.add(drumMesh);

    // Clothes inside drum
    const shirt1Geo = new THREE.DodecahedronGeometry(0.35, 1);
    const shirt1Mesh = new THREE.Mesh(shirt1Geo, whiteShirtMat);
    shirt1Mesh.position.set(0.15, 0.1, 0.1);
    drumGroup.add(shirt1Mesh);

    const shirt2Geo = new THREE.IcosahedronGeometry(0.3, 1);
    const shirt2Mesh = new THREE.Mesh(shirt2Geo, blueShirtMat);
    shirt2Mesh.position.set(-0.15, -0.1, 0.2);
    drumGroup.add(shirt2Mesh);

    // Bubbles inside drum
    const bubbleGroup = new THREE.Group();
    drumGroup.add(bubbleGroup);
    const bubbleGeo = new THREE.SphereGeometry(0.06, 12, 12);
    const bubbleMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.75,
      roughness: 0.05,
    });
    for (let i = 0; i < 15; i++) {
      const bMesh = new THREE.Mesh(bubbleGeo, bubbleMat);
      bMesh.position.set(
        (Math.random() - 0.5) * 0.9,
        (Math.random() - 0.5) * 0.9,
        (Math.random() - 0.5) * 0.6
      );
      bubbleGroup.add(bMesh);
    }

    // 2. LAUNDRY BASKET & FOLDED GARMENTS (Right Side Platform)
    const basketGroup = new THREE.Group();
    basketGroup.position.set(1.5, -0.7, 0.3);
    mainGroup.add(basketGroup);

    // Modern Pedestal Stand
    const pedestalGeo = new THREE.CylinderGeometry(1.6, 1.7, 0.2, 32);
    const pedestalMesh = new THREE.Mesh(pedestalGeo, whitePlasticMat);
    pedestalMesh.position.set(-0.3, -0.85, 0);
    pedestalMesh.receiveShadow = true;
    mainGroup.add(pedestalMesh);

    // Laundry Basket Container
    const basketGeo = new THREE.CylinderGeometry(0.75, 0.6, 0.7, 24, 1, true);
    const basketMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.4,
      side: THREE.DoubleSide,
    });
    const basketMesh = new THREE.Mesh(basketGeo, basketMat);
    basketMesh.castShadow = true;
    basketGroup.add(basketMesh);

    // Folded Towels & Garments inside Basket
    const foldedStackGroup = new THREE.Group();
    basketGroup.add(foldedStackGroup);

    const f1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.15, 0.6), whiteShirtMat);
    f1.position.set(0, 0.25, 0);
    f1.rotation.y = 0.2;
    foldedStackGroup.add(f1);

    const f2 = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.14, 0.55), blueShirtMat);
    f2.position.set(0, 0.38, 0);
    f2.rotation.y = -0.15;
    foldedStackGroup.add(f2);

    const f3 = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.15, 0.52), denimMat);
    f3.position.set(0, 0.51, 0);
    f3.rotation.y = 0.1;
    foldedStackGroup.add(f3);

    const f4 = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.16, 0.5), towelEmeraldMat);
    f4.position.set(0, 0.65, 0);
    f4.rotation.y = -0.05;
    foldedStackGroup.add(f4);

    // 3. STEAMER / STEAM PRESS VISUAL
    const steamerGroup = new THREE.Group();
    steamerGroup.position.set(2.2, 0.3, -0.4);
    mainGroup.add(steamerGroup);

    // Steamer Base & Handle
    const steamerBaseGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.6, 16);
    const steamerBaseMesh = new THREE.Mesh(steamerBaseGeo, silverMetalMat);
    steamerGroup.add(steamerBaseMesh);

    const steamerHeadGeo = new THREE.BoxGeometry(0.35, 0.15, 0.25);
    const steamerHeadMesh = new THREE.Mesh(steamerHeadGeo, greenBrandMat);
    steamerHeadMesh.position.set(0, 0.35, 0.1);
    steamerGroup.add(steamerHeadMesh);

    // Steam Particle Effect (Rising Steam)
    const steamParticleCount = 40;
    const steamGeo = new THREE.BufferGeometry();
    const steamPos = new Float32Array(steamParticleCount * 3);
    for (let i = 0; i < steamParticleCount; i++) {
      steamPos[i * 3] = (Math.random() - 0.5) * 0.3;
      steamPos[i * 3 + 1] = Math.random() * 1.2;
      steamPos[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }
    steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPos, 3));
    const steamMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.08,
      transparent: true,
      opacity: 0.45,
      blur: 1,
    } as any);
    const steamPoints = new THREE.Points(steamGeo, steamMat);
    steamerGroup.add(steamPoints);

    // 4. FLOATING CLEAN DELIVERY BAG WITH GREEN BRAND RIBBON
    const deliveryBagGroup = new THREE.Group();
    deliveryBagGroup.position.set(-2.0, 0.6, 0.5);
    mainGroup.add(deliveryBagGroup);

    const bagGeo = new THREE.BoxGeometry(0.9, 1.0, 0.4);
    const bagMesh = new THREE.Mesh(bagGeo, whitePlasticMat);
    bagMesh.castShadow = true;
    deliveryBagGroup.add(bagMesh);

    const ribbonGeo = new THREE.BoxGeometry(0.92, 0.25, 0.42);
    const ribbonMesh = new THREE.Mesh(ribbonGeo, greenBrandMat);
    ribbonMesh.position.set(0, 0.1, 0);
    deliveryBagGroup.add(ribbonMesh);

    // 5. FLOATING CLEAN FOLDED TOWEL
    const floatingTowel = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.2, 0.5),
      towelEmeraldMat
    );
    floatingTowel.position.set(-1.8, -0.8, 1.0);
    floatingTowel.rotation.set(0.2, 0.4, -0.1);
    mainGroup.add(floatingTowel);

    // 6. AMBIENT GLOWING ECO PARTICLES CLOUD
    const particleCount = 70;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 8;
      particlePos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x22c55e,
      size: 0.06,
      transparent: true,
      opacity: 0.6,
    });
    const particleCloud = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particleCloud);

    // ----------------------------------------------------
    // MOUSE PARALLAX LISTENERS
    // ----------------------------------------------------
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      targetMouseX = (x / rect.width - 0.5) * 0.4;
      targetMouseY = (y / rect.height - 0.5) * 0.4;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // ----------------------------------------------------
    // INTERSECTION OBSERVER FOR PERFORMANCE
    // ----------------------------------------------------
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // ----------------------------------------------------
    // RESIZE HANDLER
    // ----------------------------------------------------
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // ----------------------------------------------------
    // ANIMATION LOOP (60 FPS)
    // ----------------------------------------------------
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Subtle camera tilt
      camera.position.x = mouseX * 1.2;
      camera.position.y = 0.4 - mouseY * 0.8;
      camera.lookAt(0, 0, 0);

      // Drum & clothes inside washing machine continuous slow rotation
      drumGroup.rotation.z = elapsedTime * 0.8;
      shirt1Mesh.rotation.x = elapsedTime * 1.2;
      shirt2Mesh.rotation.y = elapsedTime * 1.5;

      // Bubble bobbing inside drum
      bubbleGroup.children.forEach((b, idx) => {
        b.position.y += Math.sin(elapsedTime * 3 + idx) * 0.002;
      });

      // Steamer steam rising particle animation
      const positions = steamGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < steamParticleCount; i++) {
        positions[i * 3 + 1] += 0.015;
        if (positions[i * 3 + 1] > 1.2) {
          positions[i * 3 + 1] = 0;
        }
      }
      steamGeo.attributes.position.needsUpdate = true;

      // Floating Delivery Package bobbing animation
      deliveryBagGroup.position.y = 0.6 + Math.sin(elapsedTime * 1.8) * 0.08;
      deliveryBagGroup.rotation.y = Math.sin(elapsedTime * 0.9) * 0.1;

      // Floating Towel bobbing animation
      floatingTowel.position.y = -0.8 + Math.cos(elapsedTime * 1.5) * 0.06;
      floatingTowel.rotation.z = Math.sin(elapsedTime * 1.2) * 0.05;

      // Basket gentle rotation
      basketGroup.rotation.y = Math.sin(elapsedTime * 0.5) * 0.08;

      // Eco particles slow swirl
      particleCloud.rotation.y = elapsedTime * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // ----------------------------------------------------
    // CLEANUP
    // ----------------------------------------------------
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();

      // Dispose Three.js objects
      scene.clear();
      renderer.dispose();
    };
  }, []);

  if (hasWebGlError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50/50 to-slate-100 rounded-3xl p-8 border border-emerald-100 shadow-inner text-center">
        <div className="space-y-3 max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-white text-[#16A34A] flex items-center justify-center text-3xl mx-auto shadow-md">
            🧺
          </div>
          <h3 className="font-extrabold text-lg text-[#241A21]">Premium 3D Laundry Hub</h3>
          <p className="text-xs text-[#6F626A]">
            Automated Ozone Washing • Hydrocarbon Dry Cleaning • Express Doorstep Return
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-[420px] sm:h-[500px] lg:h-[580px] relative">
      <canvas ref={canvasRef} className="w-full h-full block touch-none" />
    </div>
  );
};
