import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { useSettingsStore } from '@/stores/useSettingsStore';

export interface ThreeSceneContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  isSoftwareGl: boolean;
  onFrame: (cb: (dt: number, elapsed: number) => void) => void;
  onDispose: (cb: () => void) => void;
  onPointerDown: (cb: (ndcX: number, ndcY: number) => void) => void;
  onPointerMove: (cb: (ndcX: number, ndcY: number) => void) => void;
}

interface ThreeViewportProps {
  className?: string;
  heightClassName?: string;
  ariaLabel: string;
  fallback2D: React.ReactNode;
  setupScene: (ctx: ThreeSceneContext) => void;
  deps?: unknown[];
}

export const ThreeViewport: React.FC<ThreeViewportProps> = ({
  className = '',
  heightClassName = 'h-[360px] md:h-[440px]',
  ariaLabel,
  fallback2D,
  setupScene,
  deps = [],
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { fallback2DMode, graphicsPreset, reducedMotion } = useSettingsStore();
  const [webglError, setWebglError] = useState(false);

  useEffect(() => {
    if (fallback2DMode) return;
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      const antialias = graphicsPreset === 'high' || graphicsPreset === 'ultra';
      renderer = new THREE.WebGLRenderer({ antialias, alpha: false, powerPreference: 'high-performance' });
    } catch {
      setWebglError(true);
      return;
    }

    const gl = renderer.getContext();
    let isSoftwareGl = false;
    try {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      const rendererStr = debugInfo ? String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)) : '';
      isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(rendererStr);
    } catch {
      isSoftwareGl = false;
    }

    const maxDpr =
      graphicsPreset === 'low' || isSoftwareGl
        ? 1
        : graphicsPreset === 'medium'
          ? 1.5
          : Math.min(window.devicePixelRatio || 1, 2);

    const width = Math.max(container.clientWidth, 300);
    const height = Math.max(container.clientHeight, 240);
    renderer.setPixelRatio(maxDpr);
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = graphicsPreset !== 'low' && !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const canvas = renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.setAttribute('aria-label', ariaLabel);
    container.innerHTML = '';
    container.appendChild(canvas);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;

    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 220);
    camera.position.set(0, 6, 14);

    const frameListeners: ((dt: number, elapsed: number) => void)[] = [];
    const disposeListeners: (() => void)[] = [];
    const pointerDownListeners: ((x: number, y: number) => void)[] = [];
    const pointerMoveListeners: ((x: number, y: number) => void)[] = [];

    setupScene({
      scene,
      camera,
      renderer,
      isSoftwareGl,
      onFrame: (cb) => frameListeners.push(cb),
      onDispose: (cb) => disposeListeners.push(cb),
      onPointerDown: (cb) => pointerDownListeners.push(cb),
      onPointerMove: (cb) => pointerMoveListeners.push(cb),
    });

    const getNdc = (ev: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((ev.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((ev.clientY - rect.top) / rect.height) * 2 + 1,
      };
    };

    const handlePointerDown = (ev: PointerEvent) => {
      const { x, y } = getNdc(ev);
      for (const cb of pointerDownListeners) cb(x, y);
    };
    const handlePointerMove = (ev: PointerEvent) => {
      const { x, y } = getNdc(ev);
      for (const cb of pointerMoveListeners) cb(x, y);
    };
    const handleContextLost = (ev: Event) => {
      ev.preventDefault();
      setWebglError(true);
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('webglcontextlost', handleContextLost);

    const resizeObserver = new ResizeObserver(() => {
      const w = Math.max(container.clientWidth, 280);
      const h = Math.max(container.clientHeight, 220);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    let rafId = 0;
    let lastTime = performance.now();
    let elapsed = 0;
    let frameSkip = 0;

    const animate = (now: number) => {
      rafId = requestAnimationFrame(animate);
      const rawDt = Math.min((now - lastTime) / 1000, 0.08);
      lastTime = now;

      if (isSoftwareGl && frameSkip++ % 2 === 1) {
        return;
      }

      const dt = reducedMotion ? rawDt * 0.15 : rawDt;
      elapsed += dt;
      for (const cb of frameListeners) cb(dt, elapsed);
      renderer.render(scene, camera);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      for (const cb of disposeListeners) cb();
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          for (const m of mats) m?.dispose();
        }
      });
      envTarget.dispose();
      pmrem.dispose();
      renderer.dispose();
      container.innerHTML = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fallback2DMode, graphicsPreset, reducedMotion, ...deps]);

  if (fallback2DMode || webglError) {
    return <div className={`relative w-full overflow-hidden rounded-3xl ${heightClassName} ${className}`}>{fallback2D}</div>;
  }

  return (
    <div
      ref={mountRef}
      className={`relative w-full overflow-hidden rounded-3xl bg-[#E0F7FA] ${heightClassName} ${className}`}
      role="region"
      aria-label={ariaLabel}
    />
  );
};
