/* eslint-disable react/no-unknown-property */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
'use client';

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Canvas,
  extend,
  useFrame,
} from '@react-three/fiber';

import {
  useGLTF,
  useTexture,
} from '@react-three/drei';

import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from '@react-three/rapier';

import {
  MeshLineGeometry,
  MeshLineMaterial,
} from 'meshline';

import * as THREE from 'three';

extend({
  MeshLineGeometry,
  MeshLineMaterial,
});

/* =========================================================
   FALLBACK IMAGE
   ========================================================= */

const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

/* =========================================================
   CARD UV AREAS
   ========================================================= */

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

/* =========================================================
   DEFAULT DESIGN SETTINGS
   ========================================================= */

const DEFAULT_CARD_SCALE = 4.55;

const DEFAULT_CARD_BG = '#D4FF45';

const STRAP_BLACK = '#080808';

const STRAP_LIME = '#D7FF00';

/* =========================================================
   CARD BORDER SHADOW
   ========================================================= */

const CARD_BORDER_SHADOW_COLOR =
  'rgba(0, 0, 0, 0.75)';

const CARD_BORDER_SHADOW_BLUR = 28;

const CARD_BORDER_SHADOW_OFFSET_X = 0;

const CARD_BORDER_SHADOW_OFFSET_Y = 6;

/* =========================================================
   MAIN LANYARD COMPONENT
   ========================================================= */

export default function Lanyard({
  position = [0, 0, 18],

  gravity = [0, -40, 0],

  fov = 20,

  transparent = true,

  /*
   * Main portrait.
   */
  frontImage =
  '/albin-reji_photo_fianal_1.png',

  /*
   * Optional back image.
   */
  backImage = null,

  /*
   * Portrait sizing.
   */
  imageFit = 'cover',

  /*
   * Lanyard width.
   */
  lanyardWidth = 1.3,

  /*
   * Increased card size.
   */
  cardScale = DEFAULT_CARD_SCALE,

  /*
   * Main card background.
   */
  cardBgColor = DEFAULT_CARD_BG,
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
  /* =======================================================
     RESPONSIVE STATE
     ======================================================= */

  const [isMobile, setIsMobile] =
    useState(
      () =>
        typeof window !== 'undefined' &&
        window.innerWidth < 768
    );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(
        window.innerWidth < 768
      );
    };

    window.addEventListener(
      'resize',
      handleResize
    );

    return () => {
      window.removeEventListener(
        'resize',
        handleResize
      );
    };
  }, []);

  /* =======================================================
     RESPONSIVE CARD SCALE
     ======================================================= */

  const responsiveCardScale =
    isMobile
      ? cardScale * 0.82
      : cardScale;

  const responsiveFov =
    isMobile
      ? fov + 2
      : fov;

  return (
    <div
      className="
        lanyard-wrapper
        w-full
        h-full
        relative
        overflow-hidden
        touch-none
        select-none
      "
      style={{ touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      <Canvas
        camera={{
          position,
          fov: responsiveFov,
        }}

        dpr={[
          1,
          typeof window !== 'undefined'
            ? Math.min(
              window.devicePixelRatio,
              2
            )
            : 2,
        ]}

        style={{ touchAction: 'none' }}

        gl={{
          alpha: transparent,

          antialias: true,

          powerPreference:
            'high-performance',
        }}

        onCreated={({ gl }) => {
          gl.setClearColor(
            new THREE.Color(
              0x000000
            ),
            transparent ? 0 : 1
          );

          gl.outputColorSpace =
            THREE.SRGBColorSpace;

          gl.toneMapping =
            THREE.NoToneMapping;
        }}
      >
        <Suspense fallback={null}>
          <Physics
            gravity={gravity}
            timeStep="vary"
          >
            <Band
              isMobile={isMobile}
              frontImage={frontImage}
              backImage={backImage}
              imageFit={imageFit}
              lanyardWidth={
                lanyardWidth
              }
              cardScale={
                responsiveCardScale
              }
              cardBgColor={
                cardBgColor
              }
            />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
}

/* =========================================================
   BAND
   ========================================================= */

function Band({
  maxSpeed = 50,

  minSpeed = 0,

  isMobile = false,

  frontImage = null,

  backImage = null,

  imageFit = 'cover',

  lanyardWidth = 1.3,

  cardScale = DEFAULT_CARD_SCALE,

  cardBgColor = DEFAULT_CARD_BG,
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
  /* =======================================================
     REFS
     ======================================================= */

  const band =
    useRef<THREE.Mesh>(null!);

  const fixed =
    useRef<any>(null!);

  const j1 =
    useRef<any>(null!);

  const j2 =
    useRef<any>(null!);

  const j3 =
    useRef<any>(null!);

  const card =
    useRef<any>(null!);

  /* =======================================================
     VECTORS
     ======================================================= */

  const vec =
    new THREE.Vector3();

  const ang =
    new THREE.Vector3();

  const rot =
    new THREE.Vector3();

  const dir =
    new THREE.Vector3();

  /* =======================================================
     PHYSICS
     ======================================================= */

  const segmentProps = {
    type: 'dynamic' as const,

    canSleep: true,

    colliders: false as const,

    angularDamping: 4,

    linearDamping: 4,
  };

  /* =======================================================
     LOAD CARD MODEL
     ======================================================= */

  const {
    nodes,
    materials,
  } = useGLTF(
    '/card.glb'
  ) as any;

  /* =======================================================
     LANYARD STRAP TEXTURE
     ======================================================= */

  const cleanStrapTexture =
    useMemo(() => {
      if (
        typeof document ===
        'undefined'
      ) {
        return null;
      }

      const canvas =
        document.createElement(
          'canvas'
        );

      canvas.width = 1024;

      canvas.height = 128;

      const ctx =
        canvas.getContext('2d');

      if (!ctx) {
        return null;
      }

      ctx.imageSmoothingEnabled =
        true;

      ctx.imageSmoothingQuality =
        'high';

      /* ---------------------------------------------------
         STRAP BASE
         --------------------------------------------------- */

      ctx.fillStyle =
        STRAP_BLACK;

      ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      /* ---------------------------------------------------
         LIME EDGE
         --------------------------------------------------- */

      ctx.fillStyle =
        STRAP_LIME;

      ctx.fillRect(
        0,
        4,
        canvas.width,
        5
      );

      ctx.fillRect(
        0,
        119,
        canvas.width,
        5
      );

      /* ---------------------------------------------------
         STRAP TYPOGRAPHY
         --------------------------------------------------- */

      ctx.fillStyle =
        STRAP_LIME;

      ctx.font =
        '900 34px monospace';

      ctx.textBaseline =
        'middle';

      ctx.fillText(
        'ALBIN REJI  •  FULL STACK  •  ENGINEER  •  ',
        20,
        64
      );

      /* ---------------------------------------------------
         THREE TEXTURE
         --------------------------------------------------- */

      const texture =
        new THREE.CanvasTexture(
          canvas
        );

      texture.colorSpace =
        THREE.SRGBColorSpace;

      texture.wrapS =
        THREE.RepeatWrapping;

      texture.wrapT =
        THREE.RepeatWrapping;

      texture.repeat.set(
        3,
        1
      );

      texture.minFilter =
        THREE.LinearFilter;

      texture.magFilter =
        THREE.LinearFilter;

      texture.generateMipmaps =
        false;

      texture.anisotropy = 16;

      texture.needsUpdate = true;

      return texture;
    }, []);

  /* =======================================================
     PORTRAIT TEXTURES
     ======================================================= */

  const frontTex =
    useTexture(
      frontImage ||
      BLANK_PIXEL
    ) as THREE.Texture;

  const backTex =
    useTexture(
      backImage ||
      BLANK_PIXEL
    ) as THREE.Texture;

  /* =======================================================
     IMAGE LOAD STATE
     ======================================================= */

  const [
    imageLoadedToggle,
    setImageLoadedToggle,
  ] = useState(0);

  useEffect(() => {
    const frontImg =
      (frontTex as any)?.image;

    const backImg =
      (backTex as any)?.image;

    const handleLoad = () => {
      setImageLoadedToggle(
        value => value + 1
      );
    };

    if (
      frontImg &&
      !frontImg.complete
    ) {
      frontImg.addEventListener(
        'load',
        handleLoad
      );
    }

    if (
      backImg &&
      !backImg.complete
    ) {
      backImg.addEventListener(
        'load',
        handleLoad
      );
    }

    return () => {
      if (frontImg) {
        frontImg.removeEventListener(
          'load',
          handleLoad
        );
      }

      if (backImg) {
        backImg.removeEventListener(
          'load',
          handleLoad
        );
      }
    };
  }, [
    frontTex,
    backTex,
  ]);

  /* =======================================================
     CARD TEXTURE
     ======================================================= */

  const cardMap =
    useMemo(() => {
      const baseMap =
        materials?.base?.map;

      if (
        !frontImage &&
        !backImage &&
        !cardBgColor
      ) {
        return baseMap;
      }

      /*
       * High resolution.
       */
      const W = 2048;

      const H = 2048;

      const canvas =
        document.createElement(
          'canvas'
        );

      canvas.width = W;

      canvas.height = H;

      const ctx =
        canvas.getContext('2d');

      if (!ctx) {
        return baseMap;
      }

      /*
       * Crisp image rendering.
       */
      ctx.imageSmoothingEnabled =
        true;

      ctx.imageSmoothingQuality =
        'high';

      /* =================================================
         DRAW CARD FACE
         ================================================= */

      const drawFace = (
        img: HTMLImageElement | null,

        rect: {
          x: number;
          y: number;
          w: number;
          h: number;
        },

        isFront = true
      ) => {
        const rx =
          rect.x * W;

        const ry =
          rect.y * H;

        const rw =
          rect.w * W;

        const rh =
          rect.h * H;

        ctx.save();

        /* =================================================
           ROUNDED RECTANGLE HELPER
           ================================================= */

        const drawRoundedRect = (
          x: number,
          y: number,
          w: number,
          h: number,
          r: number
        ) => {
          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(x, y, w, h, r);
          } else {
            ctx.moveTo(x + r, y);
            ctx.arcTo(x + w, y, x + w, y + h, r);
            ctx.arcTo(x + w, y + h, x, y + h, r);
            ctx.arcTo(x, y + h, x, y, r);
            ctx.arcTo(x, y, x + w, y, r);
            ctx.closePath();
          }
        };

        const outerRadius =
          Math.round(rw * 0.058);

        /*
         * Clip card face to smooth curved bounds.
         */
        drawRoundedRect(
          rx,
          ry,
          rw,
          rh,
          outerRadius
        );

        ctx.clip();

        /* =================================================
           OUTER BLACK CARD
           ================================================= */

        ctx.fillStyle =
          '#050505';

        drawRoundedRect(
          rx,
          ry,
          rw,
          rh,
          outerRadius
        );

        ctx.fill();

        /* =================================================
           INNER LIME PANEL
           ================================================= */

        const inset =
          Math.max(
            18,
            Math.round(
              rw * 0.035
            )
          );

        const gx =
          rx + inset;

        const gy =
          ry + inset;

        const gw =
          rw - inset * 2;

        const gh =
          rh - inset * 2;

        const innerRadius =
          Math.max(
            14,
            outerRadius - Math.round(inset * 0.55)
          );

        ctx.fillStyle =
          cardBgColor ||
          DEFAULT_CARD_BG;

        drawRoundedRect(
          gx,
          gy,
          gw,
          gh,
          innerRadius
        );

        ctx.fill();

        /* =================================================
           PORTRAIT
           ================================================= */

        if (
          img &&
          img.width > 0 &&
          img.height > 0
        ) {
          ctx.save();

          /*
           * Portrait clips to the curved inner panel.
           */
          drawRoundedRect(
            gx,
            gy,
            gw,
            gh,
            innerRadius
          );

          ctx.clip();

          const targetHeight =
            gh * 0.95;

          let scale: number;

          if (
            imageFit ===
            'contain'
          ) {
            scale =
              Math.min(
                gw /
                img.width,

                targetHeight /
                img.height
              );
          } else {
            scale =
              targetHeight /
              img.height;
          }

          const drawWidth =
            img.width *
            scale;

          const drawHeight =
            img.height *
            scale;

          const drawX =
            gx;

          const drawY =
            gy +
            gh -
            drawHeight;

          /*
           * Direct original image.
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

        /* =================================================
           CARD ASSET BADGE DETAILS (PUNCH HOLE, CLEARANCE & BARCODE)
           ================================================= */

        /* Top Badge Punch-Hole Slot */
        const holeW = 80;
        const holeH = 20;
        const holeX = gx + (gw - holeW) / 2;
        const holeY = gy + 16;
        ctx.fillStyle = '#050505';
        drawRoundedRect(holeX, holeY, holeW, holeH, 10);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 2;
        ctx.stroke();

        if (isFront) {
          /* Top asset tag header */
          ctx.fillStyle = '#050505';
          ctx.font = '800 18px monospace';
          ctx.textBaseline = 'top';
          ctx.fillText('SYSTEMS ARCHITECT', gx + 24, gy + 44);
          ctx.font = '700 14px monospace';
          ctx.fillText('ACCESS // LVL-04', gx + gw - 175, gy + 46);

          /* Bottom Barcode & Serial Number Strip */
          const barY = gy + gh - 52;
          const barX = gx + 24;
          const barH = 24;
          ctx.fillStyle = '#050505';
          const pattern = [3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 1, 4, 3, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3];
          let curX = barX;
          for (let i = 0; i < pattern.length; i++) {
            const w = pattern[i];
            if (i % 2 === 0) {
              ctx.fillRect(curX, barY, w * 1.8, barH);
            }
            curX += w * 2.8;
          }
          ctx.font = '700 13px monospace';
          ctx.textBaseline = 'top';
          ctx.fillText('SYS.ID: AR-8080 // CLOUD NATIVE', barX, gy + gh - 22);
        }

        /* =================================================
           INNER BORDER SHADOW GRADIENTS (DEPTH EFFECT)
           ================================================= */

        ctx.save();

        drawRoundedRect(
          gx,
          gy,
          gw,
          gh,
          innerRadius
        );

        ctx.clip();

        /* Top edge shadow gradient */
        const shadowTop = ctx.createLinearGradient(
          gx,
          gy,
          gx,
          gy + 32
        );
        shadowTop.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
        shadowTop.addColorStop(0.5, 'rgba(0, 0, 0, 0.18)');
        shadowTop.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = shadowTop;
        ctx.fillRect(gx, gy, gw, 32);

        /* Left edge shadow gradient */
        const shadowLeft = ctx.createLinearGradient(
          gx,
          gy,
          gx + 24,
          gy
        );
        shadowLeft.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
        shadowLeft.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = shadowLeft;
        ctx.fillRect(gx, gy, 24, gh);

        /* Right edge shadow gradient */
        const shadowRight = ctx.createLinearGradient(
          gx + gw,
          gy,
          gx + gw - 24,
          gy
        );
        shadowRight.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
        shadowRight.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = shadowRight;
        ctx.fillRect(gx + gw - 24, gy, 24, gh);

        /* Bottom edge shadow gradient */
        const shadowBottom = ctx.createLinearGradient(
          gx,
          gy + gh,
          gx,
          gy + gh - 24
        );
        shadowBottom.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
        shadowBottom.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = shadowBottom;
        ctx.fillRect(gx, gy + gh - 24, gw, 24);

        ctx.restore();

        /* =================================================
           INNER FRAME STROKE & INNER SHADOW
           ================================================= */

        /* Layer 1: Ambient soft shadow around inner curved frame */
        ctx.save();
        ctx.strokeStyle = '#050505';
        ctx.lineWidth = Math.max(
          8,
          Math.round(rw * 0.009)
        );
        ctx.shadowColor = CARD_BORDER_SHADOW_COLOR;
        ctx.shadowBlur = CARD_BORDER_SHADOW_BLUR;
        ctx.shadowOffsetX = CARD_BORDER_SHADOW_OFFSET_X;
        ctx.shadowOffsetY = CARD_BORDER_SHADOW_OFFSET_Y;
        drawRoundedRect(
          gx,
          gy,
          gw,
          gh,
          innerRadius
        );
        ctx.stroke();
        ctx.restore();

        /* Layer 2: Clean crisp inner curved frame line */
        ctx.strokeStyle = '#050505';
        ctx.lineWidth = Math.max(
          8,
          Math.round(rw * 0.009)
        );
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        drawRoundedRect(
          gx,
          gy,
          gw,
          gh,
          innerRadius
        );
        ctx.stroke();

        /* =================================================
           OUTER CARD BORDER + SHADOW
           ================================================= */

        /*
         * Apply a soft shadow to the outer curved border.
         */
        ctx.save();
        ctx.strokeStyle = '#050505';
        ctx.lineWidth = Math.max(
          12,
          Math.round(rw * 0.014)
        );
        ctx.shadowColor = CARD_BORDER_SHADOW_COLOR;
        ctx.shadowBlur = CARD_BORDER_SHADOW_BLUR;
        ctx.shadowOffsetX = CARD_BORDER_SHADOW_OFFSET_X;
        ctx.shadowOffsetY = CARD_BORDER_SHADOW_OFFSET_Y;
        drawRoundedRect(
          rx + 6,
          ry + 6,
          rw - 12,
          rh - 12,
          outerRadius
        );
        ctx.stroke();
        ctx.restore();

        /*
         * Reset shadow state.
         */
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.restore();
      };

      /* =================================================
         FRONT
         ================================================= */

      if (frontImage) {
        drawFace(
          (frontTex as any).image,
          FRONT_UV_RECT,
          true
        );
      }

      /* =================================================
         BACK
         ================================================= */

      if (backImage) {
        drawFace(
          (backTex as any).image,
          BACK_UV_RECT,
          false
        );
      }

      /* =================================================
         THREE TEXTURE
         ================================================= */

      const composite =
        new THREE.CanvasTexture(
          canvas
        );

      composite.colorSpace =
        THREE.SRGBColorSpace;

      if (baseMap) {
        composite.flipY =
          baseMap.flipY;
      }

      /*
       * Keep texture crisp.
       */
      composite.minFilter =
        THREE.LinearFilter;

      composite.magFilter =
        THREE.LinearFilter;

      composite.generateMipmaps =
        false;

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

  /* =======================================================
     LANYARD CURVE
     ======================================================= */

  const curve =
    useMemo(() => {
      const c =
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(),
          new THREE.Vector3(),
          new THREE.Vector3(),
          new THREE.Vector3(),
        ]);

      c.curveType =
        'chordal';

      return c;
    }, []);

  /* =======================================================
     DRAG
     ======================================================= */

  const [
    dragged,
    drag,
  ] =
    useState<
      false | THREE.Vector3
    >(false);

  /* =======================================================
     HOVER
     ======================================================= */

  const [
    hovered,
    hover,
  ] =
    useState(false);

  /* =======================================================
     PHYSICS JOINTS
     ======================================================= */

  useRopeJoint(
    fixed,
    j1,
    [
      [0, 0, 0],
      [0, 0, 0],
      0.35,
    ]
  );

  useRopeJoint(
    j1,
    j2,
    [
      [0, 0, 0],
      [0, 0, 0],
      0.35,
    ]
  );

  useRopeJoint(
    j2,
    j3,
    [
      [0, 0, 0],
      [0, 0, 0],
      0.35,
    ]
  );

  useSphericalJoint(
    j3,
    card,
    [
      [0, 0, 0],

      [
        0,
        1.4 *
        (cardScale /
          2.25),
        0,
      ],
    ]
  );

  /* =======================================================
     CURSOR
     ======================================================= */

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
  }, [
    hovered,
    dragged,
  ]);

  /* =======================================================
     PHYSICS ANIMATION
     ======================================================= */

  useFrame(
    (
      state,
      delta
    ) => {
      /* ===================================================
         DRAGGING
         =================================================== */

      if (dragged) {
        vec
          .set(
            state.pointer.x,
            state.pointer.y,
            0.5
          )
          .unproject(
            state.camera
          );

        dir
          .copy(vec)
          .sub(
            state.camera.position
          )
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
        ].forEach(
          ref => {
            ref.current?.wakeUp();
          }
        );

        card.current?.setNextKinematicTranslation(
          {
            x:
              vec.x -
              dragged.x,

            y:
              vec.y -
              dragged.y,

            z:
              vec.z -
              dragged.z,
          }
        );
      }

      /* ===================================================
         ROPE
         =================================================== */

      if (fixed.current) {
        [j1, j2].forEach(
          ref => {
            if (
              !ref.current
                .lerped
            ) {
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
              (
                minSpeed +
                clampedDistance *
                (
                  maxSpeed -
                  minSpeed
                )
              )
            );
          }
        );

        /* =================================================
           CURVE POINTS
           ================================================= */

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

        /* =================================================
           UPDATE STRAP
           ================================================= */

        band.current.geometry.setPoints(
          curve.getPoints(
            isMobile
              ? 16
              : 32
          )
        );

        /* =================================================
           CARD ROTATION
           ================================================= */

        ang.copy(
          card.current.angvel()
        );

        rot.copy(
          card.current.rotation()
        );

        card.current.setAngvel({
          x: ang.x,

          y:
            ang.y -
            rot.y * 0.25,

          z: ang.z,
        });
      }
    }
  );

  /* =======================================================
     COLLIDER
     ======================================================= */

  const colliderHalfWidth =
    0.8 *
    (cardScale /
      2.25);

  const colliderHalfHeight =
    1.125 *
    (cardScale /
      2.25);

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <>
      {/* ===================================================
          ROPE + CARD
          =================================================== */}

      <group
        position={[
          0,
          3.6,
          0,
        ]}
      >
        {/* =================================================
            FIXED POINT
            ================================================= */}

        <RigidBody
          ref={fixed}
          {...segmentProps}
          type="fixed"
        />

        {/* =================================================
            ROPE JOINT 1
            ================================================= */}

        <RigidBody
          position={[
            0.2,
            0,
            0,
          ]}
          ref={j1}
          {...segmentProps}
        >
          <BallCollider
            args={[0.1]}
          />
        </RigidBody>

        {/* =================================================
            ROPE JOINT 2
            ================================================= */}

        <RigidBody
          position={[
            0.4,
            0,
            0,
          ]}
          ref={j2}
          {...segmentProps}
        >
          <BallCollider
            args={[0.1]}
          />
        </RigidBody>

        {/* =================================================
            ROPE JOINT 3
            ================================================= */}

        <RigidBody
          position={[
            0.6,
            0,
            0,
          ]}
          ref={j3}
          {...segmentProps}
        >
          <BallCollider
            args={[0.1]}
          />
        </RigidBody>

        {/* =================================================
            CARD
            ================================================= */}

        <RigidBody
          position={[
            0.8,
            0,
            0,
          ]}
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

          {/* ===============================================
              CARD GROUP
              =============================================== */}

          <group
            scale={
              cardScale
            }

            position={[
              0,

              -1.2 *
              (cardScale /
                2.25),

              -0.05,
            ]}

            onPointerOver={() =>
              hover(true)
            }

            onPointerOut={() =>
              hover(false)
            }

            onPointerUp={(
              e: any
            ) => {
              try {
                e.target.releasePointerCapture(
                  e.pointerId
                );
              } catch {}

              drag(false);
            }}

            onPointerCancel={(
              e: any
            ) => {
              try {
                e.target.releasePointerCapture(
                  e.pointerId
                );
              } catch {}

              drag(false);
            }}

            onPointerDown={(
              e: any
            ) => {
              e.stopPropagation();
              try {
                e.target.setPointerCapture(
                  e.pointerId
                );
              } catch {}

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
            {/* =============================================
                FLAT CARD
                ============================================= */}

            <mesh
              geometry={
                nodes.card
                  .geometry
              }
            >
              <meshBasicMaterial
                map={cardMap}
                map-anisotropy={
                  16
                }
                toneMapped={
                  false
                }
              />
            </mesh>

            {/* =============================================
                METAL CLIP
                ============================================= */}

            <mesh
              geometry={
                nodes.clip
                  .geometry
              }
              material={
                materials.metal
              }
              material-roughness={
                0.3
              }
            />

            {/* =============================================
                METAL CLAMP
                ============================================= */}

            <mesh
              geometry={
                nodes.clamp
                  .geometry
              }
              material={
                materials.metal
              }
            />
          </group>
        </RigidBody>
      </group>

      {/* ===================================================
          LANYARD STRAP
          =================================================== */}

      <mesh
        ref={band}
      >
        <meshLineGeometry />

        <meshLineMaterial
          color="white"

          depthTest={
            false
          }

          resolution={
            isMobile
              ? [1000, 2000]
              : [1000, 1000]
          }

          useMap

          map={
            cleanStrapTexture
          }

          repeat={[
            -2,
            1,
          ]}

          lineWidth={
            lanyardWidth
          }
        />
      </mesh>
    </>
  );
}

/* =========================================================
   PRELOAD
   ========================================================= */

useGLTF.preload(
  '/card.glb'
);