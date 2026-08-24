/* eslint-disable react/no-unknown-property */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
'use client';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

extend({ MeshLineGeometry, MeshLineMaterial });

// 1x1 transparent pixel fallback
const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

export default function Lanyard({
  position = [0, 0, 18],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = '/albin-reji_photo_fianal.png',
  backImage = null,
  imageFit = 'cover',
  lanyardWidth = 1.3,
  cardScale = 3.2,
  cardBgColor = '#D7FF00',
}: {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardWidth?: number;
  cardScale?: number;
  cardBgColor?: string;
}) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const responsiveCardScale = isMobile ? cardScale * 0.85 : cardScale;
  const responsiveFov = isMobile ? fov + 2 : fov;

  return (
    <div className="lanyard-wrapper w-full h-full relative overflow-hidden">
      <Canvas
        camera={{ position: position, fov: responsiveFov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent, antialias: true }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI * 0.9} />
        <Suspense fallback={null}>
          <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
            <Band
              isMobile={isMobile}
              frontImage={frontImage}
              backImage={backImage}
              imageFit={imageFit}
              lanyardWidth={lanyardWidth}
              cardScale={responsiveCardScale}
              cardBgColor={cardBgColor}
            />
          </Physics>
          <Environment blur={0.75}>
            <Lightformer
              intensity={2.5}
              color="#D7FF00"
              position={[0, -1, 5]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={3}
              color="white"
              position={[-1, -1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={3}
              color="white"
              position={[1, 1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={8}
              color="#D7FF00"
              position={[-10, 0, 14]}
              rotation={[0, Math.PI / 2, Math.PI / 3]}
              scale={[100, 10, 1]}
            />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardWidth = 1.3,
  cardScale = 3.2,
  cardBgColor = '#D7FF00',
}: {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: string;
  lanyardWidth?: number;
  cardScale?: number;
  cardBgColor?: string;
}) {
  const band = useRef<THREE.Mesh>(null!);
  const fixed = useRef<any>(null!);
  const j1 = useRef<any>(null!);
  const j2 = useRef<any>(null!);
  const j3 = useRef<any>(null!);
  const card = useRef<any>(null!);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps = {
    type: 'dynamic' as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 4,
    linearDamping: 4,
  };
  const { nodes, materials } = useGLTF('/card.glb') as any;

  // 1. Clean minimal lanyard strap texture (no React logos)
  const cleanStrapTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Dark sleek webbing base
    ctx.fillStyle = '#080808';
    ctx.fillRect(0, 0, 512, 64);

    // Subtle edge stitch lines in neon lime
    ctx.fillStyle = '#D7FF00';
    ctx.fillRect(0, 2, 512, 3);
    ctx.fillRect(0, 59, 512, 3);

    // Minimal editorial typography on strap
    ctx.fillStyle = '#D7FF00';
    ctx.font = '900 18px monospace';
    ctx.textBaseline = 'middle';
    ctx.fillText('ALBIN REJI  •  FULL STACK  •  ENGINEER  •  ', 10, 32);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 1);
    tex.anisotropy = 16;
    tex.needsUpdate = true;
    return tex;
  }, []);

  const frontTex = useTexture(frontImage || BLANK_PIXEL) as THREE.Texture;
  const backTex = useTexture(backImage || BLANK_PIXEL) as THREE.Texture;

  const [imageLoadedToggle, setImageLoadedToggle] = useState(0);

  useEffect(() => {
    if (frontTex && (frontTex as any).image) {
      const img = (frontTex as any).image;
      if (!img.complete) {
        img.onload = () => setImageLoadedToggle((v) => v + 1);
      }
    }
    if (backTex && (backTex as any).image) {
      const img = (backTex as any).image;
      if (!img.complete) {
        img.onload = () => setImageLoadedToggle((v) => v + 1);
      }
    }
  }, [frontTex, backTex]);

  // 2. Vibrant Solid Lime Card with Centered Portrait & High-Contrast Dark Text
  const cardMap = useMemo(() => {
    const baseMap = materials.base.map;
    if (!frontImage && !backImage && !cardBgColor) return baseMap;

    const baseImg = baseMap.image;
    if (!baseImg) return baseMap;

    const W = baseImg.width || 1024;
    const H = baseImg.height || 1024;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return baseMap;

    // Draw base card mesh layout
    ctx.drawImage(baseImg, 0, 0, W, H);

    const drawFace = (
      img: HTMLImageElement | null,
      rect: { x: number; y: number; w: number; h: number },
      isFront = true
    ) => {
      const rx = rect.x * W;
      const ry = rect.y * H;
      const rw = rect.w * W;
      const rh = rect.h * H;

      ctx.save();
      ctx.beginPath();
      ctx.rect(rx, ry, rw, rh);
      ctx.clip();

      // Card Background: Vibrant Solid Lime Yellow (#D7FF00)
      ctx.fillStyle = cardBgColor || '#D7FF00';
      ctx.fillRect(rx, ry, rw, rh);

      // Top Header Bar: Solid Black for strong contrast (#050505)
      ctx.fillStyle = '#050505';
      ctx.fillRect(rx, ry, rw, rh * 0.085);

      ctx.fillStyle = '#D7FF00';
      ctx.font = '900 20px monospace';
      ctx.textBaseline = 'middle';
      ctx.fillText('// ACCESS PASS', rx + 24, ry + (rh * 0.085) / 2);

      // Top Punch Hole Indicator
      ctx.fillStyle = '#050505';
      ctx.beginPath();
      ctx.arc(rx + rw / 2, ry + 22, 12, 0, Math.PI * 2);
      ctx.fill();

      // 3. Centered Portrait Image
      if (img && img.width > 0) {
        const photoY = ry + rh * 0.095;
        const photoH = rh * 0.69;
        const photoW = rw * 0.88;

        const pick = imageFit === 'contain' ? Math.min : Math.max;
        const scale = pick(photoW / img.width, photoH / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        // Horizontal centering: (rw - dw) / 2
        const dx = rx + (rw - dw) / 2;
        const dy = photoY + (photoH - dh) / 2;

        ctx.save();
        ctx.beginPath();
        // Crisp rounded rectangular frame inside lime card
        ctx.rect(rx + (rw - photoW) / 2, photoY, photoW, photoH);
        ctx.clip();

        // Dark photo background in case of transparent edges
        ctx.fillStyle = '#050505';
        ctx.fillRect(rx + (rw - photoW) / 2, photoY, photoW, photoH);

        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.restore();
      }

      // 4. High-Contrast Bottom Typography (WCAG Compliant dark badge on lime)
      if (isFront) {
        // Bottom badge container (Solid Black #050505)
        ctx.fillStyle = '#050505';
        ctx.fillRect(rx + 16, ry + rh - 96, rw - 32, 80);

        // Name Header (Crisp White #F5F5F0)
        ctx.fillStyle = '#F5F5F0';
        ctx.font = '900 28px monospace';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText('ALBIN REJI', rx + 30, ry + rh - 56);

        // Subtitle (Neon Lime #D7FF00)
        ctx.fillStyle = '#D7FF00';
        ctx.font = 'bold 15px monospace';
        ctx.fillText('FULL STACK ENGINEER // 2026', rx + 30, ry + rh - 28);
      }

      // Solid Black Outer Perimeter Border
      ctx.strokeStyle = '#050505';
      ctx.lineWidth = 6;
      ctx.strokeRect(rx + 3, ry + 3, rw - 6, rh - 6);

      ctx.restore();
    };

    if (frontImage) drawFace((frontTex as any).image, FRONT_UV_RECT, true);
    if (backImage) drawFace((backTex as any).image, BACK_UV_RECT, false);

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    composite.flipY = baseMap.flipY;
    composite.anisotropy = 16;
    composite.needsUpdate = true;
    return composite;
  }, [frontImage, backImage, imageFit, frontTex, backTex, materials.base.map, cardBgColor, imageLoadedToggle]);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.4 * (cardScale / 2.25), 0],
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = 'chordal';

  const colliderHalfWidth = 0.8 * (cardScale / 2.25);
  const colliderHalfHeight = 1.125 * (cardScale / 2.25);

  return (
    <>
      <group position={[0, 4.5, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[colliderHalfWidth, colliderHalfHeight, 0.02]} />
          <group
            scale={cardScale}
            position={[0, -1.2 * (cardScale / 2.25), -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: any) => (e.target.releasePointerCapture(e.pointerId), drag(false))}
            onPointerDown={(e: any) => (
              e.target.setPointerCapture(e.pointerId),
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
            )}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardMap}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.7}
                metalness={0.3}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={cleanStrapTexture}
          repeat={[-4, 1]}
          lineWidth={lanyardWidth}
        />
      </mesh>
    </>
  );
}

useGLTF.preload('/card.glb');
