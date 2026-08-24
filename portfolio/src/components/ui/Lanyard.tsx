/* eslint-disable react/no-unknown-property */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

extend({ MeshLineGeometry, MeshLineMaterial });

/**
 * 1x1 transparent pixel fallback.
 * Used when no back image is supplied.
 */
const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

/**
 * UV areas inside card.glb.
 *
 * The GLB texture contains two card faces:
 * - front = left half
 * - back  = right half
 */
const FRONT_UV_RECT = {
  x: 0,
  y: 0,
  w: 0.5,
  h: 0.755,
};

const BACK_UV_RECT = {
  x: 0.5,
  y: 0,
  w: 0.5,
  h: 0.757,
};

export default function Lanyard({
  position = [0, 0, 18],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,

  /**
   * Main portrait.
   */
  frontImage = '/albin-reji_photo_fianal_1.png',

  /**
   * Optional back-side image.
   */
  backImage = null,

  /**
   * Image sizing mode.
   *
   * cover:
   *   keeps the portrait large and fills the available height.
   *
   * contain:
   *   keeps the complete image visible.
   */
  imageFit = 'cover',

  /**
   * Lanyard strap width.
   */
  lanyardWidth = 1.3,

  /**
   * Overall card size.
   */
  cardScale = 3.2,

  /**
   * Exact flat card background color.
   */
  cardBgColor = '#D4FF45',
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
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  /**
   * Slightly reduce card size on mobile.
   */
  const responsiveCardScale = isMobile
    ? cardScale * 0.85
    : cardScale;

  /**
   * Slightly increase FOV on mobile.
   */
  const responsiveFov = isMobile
    ? fov + 2
    : fov;

  return (
    <div className="lanyard-wrapper w-full h-full relative overflow-hidden">
      <Canvas
        camera={{
          position,
          fov: responsiveFov,
        }}
        dpr={[
          1,
          typeof window !== 'undefined'
            ? Math.min(window.devicePixelRatio, 2.5)
            : 2,
        ]}
        gl={{
          /**
           * Transparent canvas when requested.
           */
          alpha: transparent,

          /**
           * Anti-aliasing keeps the card and strap edges clean.
           */
          antialias: true,

          /**
           * High-performance GPU preference.
           */
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          /**
           * Transparent canvas.
           */
          gl.setClearColor(
            new THREE.Color(0x000000),
            transparent ? 0 : 1
          );

          /**
           * Use normal sRGB color space.
           */
          gl.outputColorSpace = THREE.SRGBColorSpace;

          /**
           * IMPORTANT:
           *
           * No cinematic ACES tone mapping.
           *
           * This prevents the portrait/card texture from
           * getting additional color processing.
           */
          gl.toneMapping = THREE.NoToneMapping;
        }}
      >
        <Suspense fallback={null}>
          <Physics
            gravity={gravity}
            timeStep={isMobile ? 1 / 30 : 1 / 60}
          >
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
  cardBgColor = '#D4FF45',
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
  /**
   * Lanyard mesh.
   */
  const band = useRef<THREE.Mesh>(null!);

  /**
   * Physics bodies.
   */
  const fixed = useRef<any>(null!);
  const j1 = useRef<any>(null!);
  const j2 = useRef<any>(null!);
  const j3 = useRef<any>(null!);
  const card = useRef<any>(null!);

  /**
   * Reusable vectors.
   */
  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  /**
   * Physics configuration.
   */
  const segmentProps = {
    type: 'dynamic' as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 4,
    linearDamping: 4,
  };

  /**
   * Load the existing GLB card.
   */
  const { nodes, materials } =
    useGLTF('/card.glb') as any;

  /**
   * ---------------------------------------------------------
   * LANYARD STRAP TEXTURE
   * ---------------------------------------------------------
   *
   * Keeps the existing black + lime visual style.
   */
  const cleanStrapTexture = useMemo(() => {
    if (typeof document === 'undefined') {
      return null;
    }

    const canvas = document.createElement('canvas');

    canvas.width = 1024;
    canvas.height = 128;

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return null;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    /**
     * Black strap base.
     */
    ctx.fillStyle = '#080808';
    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    /**
     * Lime edge lines.
     */
    ctx.fillStyle = '#D7FF00';

    ctx.fillRect(
      0,
      4,
      canvas.width,
      6
    );

    ctx.fillRect(
      0,
      118,
      canvas.width,
      6
    );

    /**
     * Strap text.
     */
    ctx.fillStyle = '#D7FF00';
    ctx.font = '900 36px monospace';
    ctx.textBaseline = 'middle';

    ctx.fillText(
      'ALBIN REJI  •  FULL STACK  •  ENGINEER  •  ',
      20,
      64
    );

    const tex = new THREE.CanvasTexture(canvas);

    tex.colorSpace = THREE.SRGBColorSpace;

    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;

    tex.repeat.set(3, 1);

    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;

    /**
     * Do not generate mipmaps for the strap.
     */
    tex.generateMipmaps = false;

    tex.anisotropy = 16;
    tex.needsUpdate = true;

    return tex;
  }, []);

  /**
   * ---------------------------------------------------------
   * PORTRAIT TEXTURES
   * ---------------------------------------------------------
   */
  const frontTex = useTexture(
    frontImage || BLANK_PIXEL
  ) as THREE.Texture;

  const backTex = useTexture(
    backImage || BLANK_PIXEL
  ) as THREE.Texture;

  /**
   * Forces the card canvas texture to rebuild once
   * the image has actually finished loading.
   */
  const [imageLoadedToggle, setImageLoadedToggle] =
    useState(0);

  useEffect(() => {
    /**
     * Front image loading.
     */
    if (
      frontTex &&
      (frontTex as any).image
    ) {
      const img = (frontTex as any).image;

      if (!img.complete) {
        img.onload = () => {
          setImageLoadedToggle(
            (value) => value + 1
          );
        };
      }
    }

    /**
     * Back image loading.
     */
    if (
      backTex &&
      (backTex as any).image
    ) {
      const img = (backTex as any).image;

      if (!img.complete) {
        img.onload = () => {
          setImageLoadedToggle(
            (value) => value + 1
          );
        };
      }
    }
  }, [frontTex, backTex]);

  /**
   * ---------------------------------------------------------
   * FLAT CARD TEXTURE
   * ---------------------------------------------------------
   *
   * IMPORTANT:
   *
   * This is deliberately a simple 2D canvas.
   *
   * There is:
   * - no blur
   * - no glow
   * - no gradient
   * - no shadow
   * - no black footer
   * - no text
   * - no frame
   * - no image overlay
   * - no opacity
   *
   * The PNG is drawn directly onto the lime background.
   */
  const cardMap = useMemo(() => {
    const baseMap = materials?.base?.map;

    /**
     * If there is no custom content, keep the original map.
     */
    if (
      !frontImage &&
      !backImage &&
      !cardBgColor
    ) {
      return baseMap;
    }

    /**
     * High-resolution canvas.
     *
     * 2048x2048 provides enough resolution for
     * the card texture.
     */
    const W = 2048;
    const H = 2048;

    const canvas =
      document.createElement('canvas');

    canvas.width = W;
    canvas.height = H;

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return baseMap;
    }

    /**
     * Keep image rendering sharp.
     */
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    /**
     * -------------------------------------------------------
     * DRAW FACE
     * -------------------------------------------------------
     */
    const drawFace = (
      img: HTMLImageElement | null,
      rect: {
        x: number;
        y: number;
        w: number;
        h: number;
      }
    ) => {
      const rx = rect.x * W;
      const ry = rect.y * H;
      const rw = rect.w * W;
      const rh = rect.h * H;

      ctx.save();

      /**
       * Limit drawing to this card face.
       */
      ctx.beginPath();

      ctx.rect(
        rx,
        ry,
        rw,
        rh
      );

      ctx.clip();

      /**
       * -----------------------------------------------------
       * FLAT LIME BACKGROUND
       * -----------------------------------------------------
       */
      ctx.fillStyle =
        cardBgColor || '#D4FF45';

      ctx.fillRect(
        rx,
        ry,
        rw,
        rh
      );

      /**
       * -----------------------------------------------------
       * PORTRAIT
       * -----------------------------------------------------
       *
       * The supplied PNG is drawn directly.
       *
       * No filters are applied.
       */
      if (
        img &&
        img.width > 0 &&
        img.height > 0
      ) {
        ctx.save();

        /**
         * Keep portrait inside the lime card.
         */
        ctx.beginPath();

        ctx.rect(
          rx,
          ry,
          rw,
          rh
        );

        ctx.clip();

        /**
         * Target portrait height.
         *
         * The person should reach almost
         * to the bottom of the card.
         */
        const targetHeight =
          rh * 0.93;

        let scale: number;

        if (imageFit === 'contain') {
          /**
           * Show the entire source image.
           */
          scale = Math.min(
            rw / img.width,
            targetHeight / img.height
          );
        } else {
          /**
           * Default:
           *
           * Scale based on height.
           *
           * This keeps the person's natural
           * proportions while making the
           * portrait large.
           */
          scale =
            targetHeight /
            img.height;
        }

        const drawWidth =
          img.width * scale;

        const drawHeight =
          img.height * scale;

        /**
         * LEFT ALIGNMENT.
         */
        const drawX = rx;

        /**
         * BOTTOM ALIGNMENT.
         */
        const drawY =
          ry +
          rh -
          drawHeight;

        /**
         * ---------------------------------------------------
         * DIRECT IMAGE DRAW
         * ---------------------------------------------------
         *
         * No:
         * filter
         * blur
         * shadow
         * glow
         * opacity
         * color overlay
         * blend mode
         */
        ctx.drawImage(
          img,
          drawX,
          drawY,
          drawWidth,
          drawHeight
        );

        ctx.restore();
      }

      /**
       * IMPORTANT:
       *
       * Do not add anything on top of the portrait.
       *
       * No footer.
       * No typography.
       * No frame.
       * No border.
       * No shadow.
       * No overlay.
       */

      ctx.restore();
    };

    /**
     * Front card.
     */
    if (frontImage) {
      drawFace(
        (frontTex as any).image,
        FRONT_UV_RECT
      );
    }

    /**
     * Back card.
     */
    if (backImage) {
      drawFace(
        (backTex as any).image,
        BACK_UV_RECT
      );
    }

    /**
     * Create Three.js texture.
     */
    const composite =
      new THREE.CanvasTexture(canvas);

    /**
     * Correct color space.
     */
    composite.colorSpace =
      THREE.SRGBColorSpace;

    /**
     * Keep GLB UV orientation.
     */
    if (baseMap) {
      composite.flipY =
        baseMap.flipY;
    }

    /**
     * High-quality texture filtering.
     */
    composite.minFilter =
      THREE.LinearFilter;

    composite.magFilter =
      THREE.LinearFilter;

    /**
     * Disable mipmaps.
     *
     * This helps prevent the card texture
     * becoming soft at certain distances.
     */
    composite.generateMipmaps = false;

    /**
     * Maximum available texture anisotropy.
     */
    composite.anisotropy = 16;

    composite.needsUpdate = true;

    return composite;
  }, [
    frontImage,
    backImage,
    imageFit,
    frontTex,
    backTex,
    materials?.base?.map,
    cardBgColor,
    imageLoadedToggle,
  ]);

  /**
   * ---------------------------------------------------------
   * LANYARD CURVE
   * ---------------------------------------------------------
   */
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );

  /**
   * Drag state.
   */
  const [dragged, drag] =
    useState<false | THREE.Vector3>(
      false
    );

  /**
   * Hover state.
   */
  const [hovered, hover] =
    useState(false);

  /**
   * ---------------------------------------------------------
   * PHYSICS JOINTS
   * ---------------------------------------------------------
   */
  useRopeJoint(
    fixed,
    j1,
    [
      [0, 0, 0],
      [0, 0, 0],
      1,
    ]
  );

  useRopeJoint(
    j1,
    j2,
    [
      [0, 0, 0],
      [0, 0, 0],
      1,
    ]
  );

  useRopeJoint(
    j2,
    j3,
    [
      [0, 0, 0],
      [0, 0, 0],
      1,
    ]
  );

  useSphericalJoint(
    j3,
    card,
    [
      [0, 0, 0],
      [
        0,
        1.4 * (cardScale / 2.25),
        0,
      ],
    ]
  );

  /**
   * ---------------------------------------------------------
   * CURSOR
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (hovered) {
      document.body.style.cursor =
        dragged
          ? 'grabbing'
          : 'grab';

      return () => {
        document.body.style.cursor =
          'auto';
      };
    }
  }, [hovered, dragged]);

  /**
   * ---------------------------------------------------------
   * PHYSICS ANIMATION
   * ---------------------------------------------------------
   */
  useFrame((state, delta) => {
    /**
     * -------------------------------------------------------
     * DRAGGING
     * -------------------------------------------------------
     */
    if (dragged) {
      vec
        .set(
          state.pointer.x,
          state.pointer.y,
          0.5
        )
        .unproject(state.camera);

      dir
        .copy(vec)
        .sub(state.camera.position)
        .normalize();

      vec.add(
        dir.multiplyScalar(
          state.camera.position.length()
        )
      );

      [
        card,
        j1,
        j2,
        j3,
        fixed,
      ].forEach((ref) => {
        ref.current?.wakeUp();
      });

      card.current?.setNextKinematicTranslation(
        {
          x: vec.x - dragged.x,
          y: vec.y - dragged.y,
          z: vec.z - dragged.z,
        }
      );
    }

    /**
     * -------------------------------------------------------
     * ROPE INTERPOLATION
     * -------------------------------------------------------
     */
    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) {
          ref.current.lerped =
            new THREE.Vector3().copy(
              ref.current.translation()
            );
        }

        const clampedDistance =
          Math.max(
            0.1,
            Math.min(
              1,
              ref.current.lerped.distanceTo(
                ref.current.translation()
              )
            )
          );

        ref.current.lerped.lerp(
          ref.current.translation(),
          delta *
            (minSpeed +
              clampedDistance *
                (maxSpeed - minSpeed))
        );
      });

      /**
       * Update rope curve.
       */
      curve.points[0].copy(
        j3.current.translation()
      );

      curve.points[1].copy(
        j2.current.lerped
      );

      curve.points[2].copy(
        j1.current.lerped
      );

      curve.points[3].copy(
        fixed.current.translation()
      );

      /**
       * Update lanyard geometry.
       */
      band.current.geometry.setPoints(
        curve.getPoints(
          isMobile ? 16 : 32
        )
      );

      /**
       * Card angular velocity.
       */
      ang.copy(
        card.current.angvel()
      );

      /**
       * Card rotation.
       */
      rot.copy(
        card.current.rotation()
      );

      /**
       * Reduce excessive Y-axis spinning.
       */
      card.current.setAngvel({
        x: ang.x,
        y:
          ang.y -
          rot.y * 0.25,
        z: ang.z,
      });
    }
  });

  /**
   * Rope curve type.
   */
  curve.curveType = 'chordal';

  /**
   * Card collider dimensions.
   */
  const colliderHalfWidth =
    0.8 * (cardScale / 2.25);

  const colliderHalfHeight =
    1.125 * (cardScale / 2.25);

  return (
    <>
      {/* --------------------------------------------------- */}
      {/* PHYSICAL LANYARD + CARD                             */}
      {/* --------------------------------------------------- */}

      <group position={[0, 4.5, 0]}>
        {/* Fixed attachment point */}
        <RigidBody
          ref={fixed}
          {...segmentProps}
          type="fixed"
        />

        {/* Rope segment 1 */}
        <RigidBody
          position={[0.5, 0, 0]}
          ref={j1}
          {...segmentProps}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>

        {/* Rope segment 2 */}
        <RigidBody
          position={[1, 0, 0]}
          ref={j2}
          {...segmentProps}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>

        {/* Rope segment 3 */}
        <RigidBody
          position={[1.5, 0, 0]}
          ref={j3}
          {...segmentProps}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>

        {/* ------------------------------------------------- */}
        {/* ID CARD                                           */}
        {/* ------------------------------------------------- */}

        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={
            dragged
              ? 'kinematicPosition'
              : 'dynamic'
          }
        >
          <CuboidCollider
            args={[
              colliderHalfWidth,
              colliderHalfHeight,
              0.02,
            ]}
          />

          <group
            scale={cardScale}
            position={[
              0,
              -1.2 *
                (cardScale / 2.25),
              -0.05,
            ]}
            onPointerOver={() =>
              hover(true)
            }
            onPointerOut={() =>
              hover(false)
            }
            onPointerUp={(e: any) => {
              e.target.releasePointerCapture(
                e.pointerId
              );

              drag(false);
            }}
            onPointerDown={(e: any) => {
              e.target.setPointerCapture(
                e.pointerId
              );

              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(
                    vec.copy(
                      card.current.translation()
                    )
                  )
              );
            }}
          >
            {/* ------------------------------------------------ */}
            {/* FLAT CARD FACE                                   */}
            {/* ------------------------------------------------ */}
            {/*
              MeshBasicMaterial is intentional.

              Unlike MeshPhysicalMaterial:
              - no clearcoat
              - no reflections
              - no environment lighting
              - no glossy highlight
              - no physically based shading

              The PNG therefore stays visually clean.
            */}
            <mesh
              geometry={nodes.card.geometry}
            >
              <meshBasicMaterial
                map={cardMap}
                map-anisotropy={16}
                toneMapped={false}
              />
            </mesh>

            {/* ------------------------------------------------ */}
            {/* METAL CLIP                                      */}
            {/* ------------------------------------------------ */}
            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3}
            />

            {/* ------------------------------------------------ */}
            {/* METAL CLAMP                                     */}
            {/* ------------------------------------------------ */}
            <mesh
              geometry={nodes.clamp.geometry}
              material={materials.metal}
            />
          </group>
        </RigidBody>
      </group>

      {/* ----------------------------------------------------- */}
      {/* LANYARD STRAP                                        */}
      {/* ----------------------------------------------------- */}

      <mesh ref={band}>
        <meshLineGeometry />

        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={
            isMobile
              ? [1000, 2000]
              : [1000, 1000]
          }
          useMap
          map={cleanStrapTexture}
          repeat={[-4, 1]}
          lineWidth={lanyardWidth}
        />
      </mesh>
    </>
  );
}

/**
 * Preload card model.
 */
useGLTF.preload('/card.glb');