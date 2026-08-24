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

// 1x1 transparent pixel — lets useTexture be called unconditionally when a
// front/back image isn't supplied.
const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

export default function Lanyard({
  position = [0, 0, 20],
  gravity = [0, -40, 0],
  fov = 22,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1.2,
  cardScale = 2.7,
  cardBgColor = '#080808',
}: {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardImage?: string | null;
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

  return (
    <div className="lanyard-wrapper">
      <Canvas
        camera={{ position: position, fov: fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent, antialias: true }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI * 0.8} />
        <Suspense fallback={null}>
          <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
            <Band
              isMobile={isMobile}
              frontImage={frontImage}
              backImage={backImage}
              imageFit={imageFit}
              lanyardImage={lanyardImage}
              lanyardWidth={lanyardWidth}
              cardScale={cardScale}
              cardBgColor={cardBgColor}
            />
          </Physics>
          <Environment blur={0.75}>
            <Lightformer
              intensity={2}
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
  lanyardImage = null,
  lanyardWidth = 1.2,
  cardScale = 2.7,
  cardBgColor = '#080808',
}: {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: string;
  lanyardImage?: string | null;
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

  const segmentProps = { type: 'dynamic' as const, canSleep: true, colliders: false as const, angularDamping: 4, linearDamping: 4 };
  const { nodes, materials } = useGLTF('/card.glb') as any;
  const texture = useTexture(lanyardImage || '/lanyard.png');

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

  // Composite the front/back images into the card's texture atlas
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

    // Draw baked metallic background
    ctx.drawImage(baseImg, 0, 0, W, H);

    const drawFace = (img: HTMLImageElement | null, rect: { x: number; y: number; w: number; h: number }, isFront = true) => {
      const rx = rect.x * W;
      const ry = rect.y * H;
      const rw = rect.w * W;
      const rh = rect.h * H;

      ctx.save();
      ctx.beginPath();
      ctx.rect(rx, ry, rw, rh);
      ctx.clip();

      // Card Background fill
      ctx.fillStyle = cardBgColor || '#0a0a0a';
      ctx.fillRect(rx, ry, rw, rh);

      // Top Accent stripe (Lime #D7FF00)
      ctx.fillStyle = '#D7FF00';
      ctx.fillRect(rx, ry, rw, rh * 0.08);

      // Draw portrait photo if available
      if (img && img.width > 0) {
        const photoY = ry + rh * 0.09;
        const photoH = rh * 0.78;
        const pick = imageFit === 'contain' ? Math.min : Math.max;
        const scale = pick(rw / img.width, photoH / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        const dx = rx + (rw - dw) / 2;
        const dy = photoY + (photoH - dh) / 2;

        ctx.drawImage(img, dx, dy, dw, dh);
      }

      // Editorial badge details at bottom
      if (isFront) {
        // Bottom overlay gradient
        const grad = ctx.createLinearGradient(rx, ry + rh * 0.65, rx, ry + rh);
        grad.addColorStop(0, 'rgba(8, 8, 8, 0)');
        grad.addColorStop(0.5, 'rgba(8, 8, 8, 0.75)');
        grad.addColorStop(1, 'rgba(8, 8, 8, 0.95)');
        ctx.fillStyle = grad;
        ctx.fillRect(rx, ry + rh * 0.65, rw, rh * 0.35);

        // Badge text
        ctx.fillStyle = '#F5F5F0';
        ctx.font = 'bold 28px monospace';
        ctx.fillText('ALBIN REJI', rx + 24, ry + rh - 48);

        ctx.fillStyle = '#D7FF00';
        ctx.font = 'bold 16px monospace';
        ctx.fillText('FULL STACK ENGINEER // 2026', rx + 24, ry + rh - 22);
      }

      // Border outline inside badge area
      ctx.strokeStyle = 'rgba(215, 255, 0, 0.3)';
      ctx.lineWidth = 4;
      ctx.strokeRect(rx + 4, ry + 4, rw - 8, rh - 8);

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
    [0, 1.4 * (cardScale / 2.25), 0]
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
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current) {
      [j1, j2].forEach(ref => {
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
  (texture as THREE.Texture).wrapS = (texture as THREE.Texture).wrapT = THREE.RepeatWrapping;

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
                roughness={0.8}
                metalness={0.5}
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
          color="#D7FF00"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={lanyardWidth}
        />
      </mesh>
    </>
  );
}

useGLTF.preload('/card.glb');
useTexture.preload('/lanyard.png');
