"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";
import { feature, mesh } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import type { MultiPolygon, Polygon } from "geojson";
import { COUNTRY_PINS, clientsIn } from "@/lib/clients";
import { PIN_ARRIVE, PIN_HOLD, SUMMARY_AT } from "@/lib/worldMapRoute";
import { FLAGS } from "@/components/ui/Flags";
import { cn } from "@/lib/utils";

// World units: 1 unit = 10° — the map plane is 36 × 18, lying in the XZ plane.
const DEG = 0.1;
const MAP_W = 36;
const MAP_H = 18;
const MASK_W = 2048;
const MASK_H = 1024;
const DOT_GRID = new THREE.Vector2(640, 320);
const PITCH = (52 * Math.PI) / 180;
const FOV = 35;
const BG = new THREE.Color("#040b1f");
// Raw sRGB for shaders: ShaderMaterial writes straight to the screen, while THREE.Color is linear.
const BG_SRGB = new THREE.Vector3(4 / 255, 11 / 255, 31 / 255);
const ACCENT = new THREE.Color("#3b86ff");
const CORE = new THREE.Color("#d6e6ff");

const toWorld = (lat: number, lon: number) => new THREE.Vector3(lon * DEG, 0, -lat * DEG);

// ---------- shaders ----------

const surfaceVert = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorld;
  void main() {
    vUv = uv;
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

const surfaceFrag = /* glsl */ `
  uniform sampler2D uMask;
  uniform sampler2D uCoast;
  uniform float uTime;
  uniform vec2 uGrid;
  uniform vec3 uFocus;
  uniform float uFogNear;
  uniform float uFogFar;
  uniform vec3 uBg;
  uniform float uReady;
  uniform sampler2D uBorders;   // r = crisp country borders, g = their soft glow
  uniform sampler2D uCountryId; // r = id of a client country (1..4), nearest-filtered
  uniform vec4 uHighlight;      // ignition of each client country, in COUNTRY_PINS order
  varying vec2 vUv;
  varying vec3 vWorld;

  float highlightAt(vec2 uv) {
    float id = floor(texture2D(uCountryId, uv).r * 255.0 / 60.0 + 0.5);
    if (id < 0.5) return 0.0;
    if (id < 1.5) return uHighlight.x;
    if (id < 2.5) return uHighlight.y;
    if (id < 3.5) return uHighlight.z;
    return uHighlight.w;
  }

  float hgt(vec2 p, float t) {
    float h = sin(p.x * 1.3 + t * 0.9) * 0.5;
    h += sin(p.y * 1.7 - t * 0.7 + p.x * 0.4) * 0.4;
    h += sin((p.x + p.y) * 2.9 + t * 1.6) * 0.18;
    h += sin((p.x - p.y) * 4.7 - t * 2.1) * 0.08;
    return h;
  }

  void main() {
    float t = uTime * 0.35; // calm, slow swell
    vec2 p = vWorld.xz;

    // Glossy ocean: gentle analytic wave normals and a sky reflection — no glints or streaks.
    float e = 0.04;
    float h0 = hgt(p, t);
    float hx = hgt(p + vec2(e, 0.0), t);
    float hz = hgt(p + vec2(0.0, e), t);
    vec3 n = normalize(vec3(-(hx - h0) / e * 0.05, 1.0, -(hz - h0) / e * 0.05));
    vec3 V = normalize(cameraPosition - vWorld);
    float fres = pow(1.0 - max(dot(n, V), 0.0), 5.0);

    float coast = texture2D(uCoast, vUv).r;
    float landSoft = texture2D(uMask, vUv).r;

    vec3 ocean = mix(vec3(0.010, 0.035, 0.10), vec3(0.03, 0.13, 0.34), clamp(coast * 1.5, 0.0, 1.0));
    ocean += vec3(0.02, 0.06, 0.16) * (h0 * 0.5 + 0.5) * 0.6;
    vec3 R = reflect(-V, n);
    ocean += mix(vec3(0.02, 0.05, 0.14), vec3(0.18, 0.36, 0.85), clamp(R.y, 0.0, 1.0)) * fres * 0.35;

    // Land: a matrix of twinkling dots on a dark plate.
    vec2 gp = vUv * uGrid;
    vec2 cell = floor(gp);
    float d = length(fract(gp) - 0.5);
    float aa = fwidth(d) * 1.5;
    float landCell = texture2D(uMask, (cell + 0.5) / uGrid).r;
    float dotM = (1.0 - smoothstep(0.28 - aa, 0.28 + aa, d)) * step(0.5, landCell);
    // Far away a dot shrinks toward a pixel and rows alias into gaps — fade to its average coverage instead.
    float cellPx = max(fwidth(gp.x), fwidth(gp.y));
    dotM = mix(dotM, landSoft * 0.25, smoothstep(0.07, 0.28, cellPx));
    // Random phase per dot — a linear phase (x*a + y*b) lines up into diagonal stripes.
    float phase = fract(sin(dot(cell, vec2(12.9898, 78.233))) * 43758.5453) * 6.2832;
    // Twinkle only where dots are big enough to read; far away it would just be grain.
    float tw = 0.7 + 0.3 * sin(uTime * 1.7 + phase) * (1.0 - smoothstep(0.07, 0.28, cellPx));

    // A client country lights up as a whole territory, not a regional blob.
    float hl = highlightAt(vUv);
    float hlCell = highlightAt((cell + 0.5) / uGrid);
    float pulse = 0.85 + 0.15 * sin(uTime * 2.2);

    vec3 col = mix(ocean, vec3(0.035, 0.08, 0.2) + ocean * 0.25, landSoft * 0.92);
    col += vec3(0.10, 0.28, 0.75) * hl * 0.55 * pulse;
    col += vec3(0.45, 0.68, 1.0) * dotM * tw * 1.1;
    col += vec3(0.55, 0.8, 1.0) * dotM * hlCell * 1.1 * pulse;

    // Glowing white borders; fade with distance so thin lines never shimmer.
    vec2 b = texture2D(uBorders, vUv).rg;
    float far = smoothstep(0.35, 1.2, cellPx);
    float borderLine = b.r * (1.0 - far * 0.7);
    col += vec3(0.80, 0.90, 1.0) * borderLine * (0.45 + hl * 0.9);
    col += vec3(0.30, 0.55, 1.0) * b.g * (0.30 + hl * 0.8);

    float fog = smoothstep(uFogNear, uFogFar, distance(vWorld, uFocus));
    // Dissolve the map's rectangular borders so the world floats in the dark.
    float edge = smoothstep(0.08, 0.22, vUv.y) * smoothstep(0.98, 0.84, vUv.y)
               * smoothstep(0.0, 0.04, vUv.x) * smoothstep(1.0, 0.96, vUv.x);
    col = mix(uBg, mix(col, uBg, fog), edge);
    gl_FragColor = vec4(mix(uBg, col, uReady), 1.0);
  }
`;

const beamVert = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vUv = uv;
    vec4 w = modelMatrix * vec4(position, 1.0);
    vN = normalize(mat3(modelMatrix) * normal);
    vV = normalize(cameraPosition - w.xyz);
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

const beamFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uIntensity;
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float body = pow(abs(dot(normalize(vN), normalize(vV))), 1.5);
    float fade = pow(1.0 - vUv.y, 1.6);
    float band = exp(-pow((fract(uTime * 0.5) - vUv.y) * 10.0, 2.0));
    float a = (body * fade * 0.9 + band * body * 0.6) * uIntensity;
    gl_FragColor = vec4(uColor * (1.0 + band), a);
  }
`;

const flatVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const discFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uIntensity;
  varying vec2 vUv;
  void main() {
    float r = length(vUv - 0.5) * 2.0;
    float core = exp(-r * r * 18.0);
    float halo = exp(-r * r * 4.0) * 0.35;
    float ring = 0.0;
    for (int i = 0; i < 2; i++) {
      float tt = fract(uTime * 0.45 + float(i) * 0.5);
      ring += smoothstep(0.04, 0.0, abs(r - tt)) * (1.0 - tt);
    }
    float a = (core + halo + ring * 0.8) * uIntensity * step(r, 1.0);
    gl_FragColor = vec4(uColor * (1.0 + core), a);
  }
`;

const arcFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uProgress;
  varying vec2 vUv;
  void main() {
    if (vUv.x > uProgress) discard;
    float head = exp(-pow((vUv.x - uProgress) * 25.0, 2.0)) * step(uProgress, 0.999);
    float pulse = exp(-pow((fract(uTime * 0.35) - vUv.x) * 18.0, 2.0));
    float a = 0.35 + pulse * 0.8 + head * 1.5;
    gl_FragColor = vec4(uColor * (1.0 + pulse + head), a);
  }
`;

// ---------- land mask ----------

async function buildLandTextures() {
  const res = await fetch("/data/land-110m.json");
  const topo = (await res.json()) as Topology<{ land: GeometryCollection }>;
  const land = feature(topo, topo.objects.land);

  const mask = document.createElement("canvas");
  mask.width = MASK_W;
  mask.height = MASK_H;
  const ctx = mask.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, MASK_W, MASK_H);
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  for (const f of land.features) {
    const geom = f.geometry as Polygon | MultiPolygon;
    const polygons = geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates;
    for (const poly of polygons) {
      for (const ring of poly) {
        let prevLon = 0;
        ring.forEach(([lon, lat], i) => {
          const x = ((lon + 180) / 360) * MASK_W;
          const y = ((90 - lat) / 180) * MASK_H;
          // Rings that straddle the antimeridian (Fiji, Chukotka) jump from +180 to -180;
          // a lineTo there would paint a stripe across the whole world.
          if (i === 0 || Math.abs(lon - prevLon) > 180) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          prevLon = lon;
        });
        ctx.closePath();
      }
    }
  }
  ctx.fill("evenodd");

  // Blurred copy drives the lighter shallow-water glow along coastlines.
  const coast = document.createElement("canvas");
  coast.width = MASK_W / 2;
  coast.height = MASK_H / 2;
  const cctx = coast.getContext("2d")!;
  cctx.filter = "blur(8px)";
  cctx.drawImage(mask, 0, 0, coast.width, coast.height);

  const maskTex = new THREE.CanvasTexture(mask);
  maskTex.minFilter = THREE.LinearFilter;
  maskTex.generateMipmaps = false;
  const coastTex = new THREE.CanvasTexture(coast);
  return { maskTex, coastTex };
}

// ---------- country borders + client-country id map ----------

type Ring = number[][];

/** Traces rings/lines in equirectangular space, breaking at antimeridian jumps (see above). */
function traceRings(ctx: CanvasRenderingContext2D, rings: Ring[], w: number, h: number, close: boolean) {
  for (const ring of rings) {
    let prevLon = 0;
    ring.forEach(([lon, lat], i) => {
      const x = ((lon + 180) / 360) * w;
      const y = ((90 - lat) / 180) * h;
      if (i === 0 || Math.abs(lon - prevLon) > 180) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      prevLon = lon;
    });
    if (close) ctx.closePath();
  }
}

// ISO 3166 numeric ids, in COUNTRY_PINS order.
const ISO_NUMERIC: Record<string, string> = { UZ: "860", MD: "498", GB: "826", US: "840" };

async function buildCountryTextures(borderW: number) {
  const res = await fetch("/data/countries-110m.json");
  const topo = (await res.json()) as Topology<{ countries: GeometryCollection }>;
  const borderH = borderW / 2;

  // Borders: soft blue-white glow (g) under a crisp line (r), added together.
  const bc = document.createElement("canvas");
  bc.width = borderW;
  bc.height = borderH;
  const b = bc.getContext("2d")!;
  b.fillStyle = "#000";
  b.fillRect(0, 0, borderW, borderH);
  b.globalCompositeOperation = "lighter";
  const lines = mesh(topo, topo.objects.countries).coordinates as Ring[];
  const scale = borderW / 4096;
  b.filter = `blur(${6 * scale}px)`;
  b.strokeStyle = "rgb(0,255,0)";
  b.lineWidth = 5 * scale;
  b.beginPath();
  traceRings(b, lines, borderW, borderH, false);
  b.stroke();
  b.filter = "none";
  b.strokeStyle = "rgb(255,0,0)";
  b.lineWidth = Math.max(1, 1.4 * scale);
  b.beginPath();
  traceRings(b, lines, borderW, borderH, false);
  b.stroke();

  // Id map: each client country filled with a distinct grey level (60, 120, 180, 240).
  const ic = document.createElement("canvas");
  ic.width = MASK_W;
  ic.height = MASK_H;
  const c = ic.getContext("2d")!;
  c.fillStyle = "#000";
  c.fillRect(0, 0, MASK_W, MASK_H);
  const countries = feature(topo, topo.objects.countries);
  COUNTRY_PINS.forEach((pin, i) => {
    const f = countries.features.find((x) => String(x.id) === ISO_NUMERIC[pin.code]);
    if (!f) return;
    const geom = f.geometry as Polygon | MultiPolygon;
    const polygons = geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates;
    const v = (i + 1) * 60;
    c.fillStyle = `rgb(${v},${v},${v})`;
    c.beginPath();
    for (const poly of polygons) traceRings(c, poly as Ring[], MASK_W, MASK_H, true);
    c.fill("evenodd");
  });

  const borderTex = new THREE.CanvasTexture(bc);
  borderTex.minFilter = THREE.LinearFilter;
  borderTex.generateMipmaps = false;
  const idTex = new THREE.CanvasTexture(ic);
  idTex.minFilter = THREE.NearestFilter;
  idTex.magFilter = THREE.NearestFilter;
  idTex.generateMipmaps = false;
  return { borderTex, idTex };
}

function flareTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(150,195,255,0.6)");
  g.addColorStop(1, "rgba(60,130,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

// ---------- camera route ----------

interface Stop {
  p: number;
  lat: number;
  lon: number;
  zoom: number; // 0 = overview, 1 = focused on a country
}

const OVERVIEW_START = { lat: 30, lon: 30 };
const OVERVIEW_END = { lat: 44, lon: -14 };

const STOPS: Stop[] = [
  { p: 0, ...OVERVIEW_START, zoom: 0 },
  ...COUNTRY_PINS.flatMap((pin, i) => [
    { p: PIN_ARRIVE[i], lat: pin.lat, lon: pin.lon, zoom: pin.code === "US" ? 0.8 : 1 },
    { p: PIN_ARRIVE[i] + PIN_HOLD, lat: pin.lat, lon: pin.lon, zoom: pin.code === "US" ? 0.8 : 1 },
  ]),
  { p: SUMMARY_AT, ...OVERVIEW_END, zoom: 0 },
  { p: 1, ...OVERVIEW_END, zoom: 0 },
];

const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function routeAt(progress: number) {
  const p = Math.min(Math.max(progress, 0), 1);
  let k = 0;
  while (k < STOPS.length - 2 && p > STOPS[k + 1].p) k++;
  const a = STOPS[k];
  const b = STOPS[k + 1];
  const t = smooth(Math.min(Math.max((p - a.p) / (b.p - a.p || 1), 0), 1));
  // Long hops (e.g. London → USA) pull the camera up mid-flight, like a plane.
  const lift = Math.sin(Math.PI * t) * Math.min(Math.abs(b.lon - a.lon) * 0.012, 0.6);
  return { lat: lerp(a.lat, b.lat, t), lon: lerp(a.lon, b.lon, t), zoom: Math.max(lerp(a.zoom, b.zoom, t) - lift, 0) };
}

// ---------- component ----------

interface WorldMapCanvasProps {
  progress: MotionValue<number>;
  className?: string;
}

export default function WorldMapCanvas({ progress, className }: WorldMapCanvasProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    } catch {
      return; // No WebGL — the section's dark gradient still reads fine.
    }
    // Phones render at their real (HD) density; if a weak GPU can't keep up, the loop
    // below steps the ratio down instead of letting the map stutter. Desktop is fixed.
    const touch = window.matchMedia("(pointer: coarse)").matches;
    const dpr = window.devicePixelRatio || 1;
    let pixelRatio = Math.min(dpr, touch ? 2.5 : 1.75);
    const MIN_TOUCH_RATIO = Math.min(dpr, 1.5);
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(BG, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 300);
    const disposables: { dispose(): void }[] = [];
    const track = <T extends { dispose(): void }>(x: T) => (disposables.push(x), x);

    // Surface
    const surfaceUniforms = {
      uMask: { value: null as THREE.Texture | null },
      uCoast: { value: null as THREE.Texture | null },
      uTime: { value: 0 },
      uGrid: { value: DOT_GRID },
      uFocus: { value: new THREE.Vector3() },
      uFogNear: { value: 10 },
      uFogFar: { value: 30 },
      uBg: { value: BG_SRGB },
      uReady: { value: 0 },
      uBorders: { value: null as THREE.Texture | null },
      uCountryId: { value: null as THREE.Texture | null },
      uHighlight: { value: new THREE.Vector4() },
    };
    const surface = new THREE.Mesh(
      track(new THREE.PlaneGeometry(MAP_W, MAP_H, 1, 1)),
      track(new THREE.ShaderMaterial({ vertexShader: surfaceVert, fragmentShader: surfaceFrag, uniforms: surfaceUniforms }))
    );
    surface.rotation.x = -Math.PI / 2;
    scene.add(surface);

    let disposed = false;
    buildLandTextures()
      .then(({ maskTex, coastTex }) => {
        if (disposed) return maskTex.dispose(), coastTex.dispose();
        track(maskTex);
        track(coastTex);
        surfaceUniforms.uMask.value = maskTex;
        surfaceUniforms.uCoast.value = coastTex;
      })
      .catch(() => {});
    // Same crisp 4096 borders as desktop wherever the GPU allows it.
    buildCountryTextures(renderer.capabilities.maxTextureSize >= 4096 ? 4096 : 2048)
      .then(({ borderTex, idTex }) => {
        if (disposed) return borderTex.dispose(), idTex.dispose();
        track(borderTex);
        track(idTex);
        surfaceUniforms.uBorders.value = borderTex;
        surfaceUniforms.uCountryId.value = idTex;
      })
      .catch(() => {});

    // Pins: light column (outer glow + bright core), ground disc with rings, top flare.
    const beamGeom = track(new THREE.CylinderGeometry(1, 1, 1, 28, 1, true));
    beamGeom.translate(0, 0.5, 0);
    const discGeom = track(new THREE.PlaneGeometry(1, 1));
    const flare = track(flareTexture());
    const home = toWorld(COUNTRY_PINS[0].lat, COUNTRY_PINS[0].lon);

    const pins = COUNTRY_PINS.map((pin, i) => {
      const pos = toWorld(pin.lat, pin.lon);
      const height = 1.2 + clientsIn(pin.code).length * 0.3;
      const group = new THREE.Group();
      group.position.copy(pos);

      const beamMat = (color: THREE.Color) =>
        track(
          new THREE.ShaderMaterial({
            vertexShader: beamVert,
            fragmentShader: beamFrag,
            uniforms: { uColor: { value: color }, uTime: { value: 0 }, uIntensity: { value: 0 } },
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
          })
        );
      const outer = new THREE.Mesh(beamGeom, beamMat(ACCENT));
      outer.scale.set(0.16, 0.001, 0.16);
      const inner = new THREE.Mesh(beamGeom, beamMat(CORE));
      inner.scale.set(0.045, 0.001, 0.045);

      const discMat = track(
        new THREE.ShaderMaterial({
          vertexShader: flatVert,
          fragmentShader: discFrag,
          uniforms: { uColor: { value: ACCENT }, uTime: { value: i * 0.3 }, uIntensity: { value: 0 } },
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      );
      const disc = new THREE.Mesh(discGeom, discMat);
      disc.rotation.x = -Math.PI / 2;
      disc.position.y = 0.01;
      // Small enough to sit inside the country — the territory itself carries the glow.
      disc.scale.setScalar(1.1);

      const sprite = new THREE.Sprite(
        track(new THREE.SpriteMaterial({ map: flare, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 }))
      );
      sprite.scale.setScalar(0.9);

      group.add(outer, inner, disc, sprite);
      scene.add(group);

      // Arc from home (Tashkent) to every other country.
      let arc: THREE.Mesh | null = null;
      let arcMat: THREE.ShaderMaterial | null = null;
      if (i > 0) {
        const dist = home.distanceTo(pos);
        const curve = new THREE.CubicBezierCurve3(
          home.clone().setY(0.05),
          home.clone().lerp(pos, 0.25).setY(dist * 0.32),
          home.clone().lerp(pos, 0.75).setY(dist * 0.32),
          pos.clone().setY(0.05)
        );
        arcMat = track(
          new THREE.ShaderMaterial({
            vertexShader: flatVert,
            fragmentShader: arcFrag,
            uniforms: { uColor: { value: ACCENT }, uTime: { value: i * 0.25 }, uProgress: { value: 0 } },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          })
        );
        arc = new THREE.Mesh(track(new THREE.TubeGeometry(curve, 96, 0.03, 8, false)), arcMat);
        scene.add(arc);
      }

      return { pos, height, outer, inner, discMat, sprite, arcMat, grow: 0, arcGrow: 0, arrive: PIN_ARRIVE[i] };
    });

    // Sizing
    let width = 1;
    let height = 1;
    const resize = () => {
      width = wrap.clientWidth || 1;
      height = wrap.clientHeight || 1;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // Pointer parallax
    const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    // Only animate while the section is on screen.
    let visible = false;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) frame = requestAnimationFrame(loop);
    });
    io.observe(wrap);

    const focus = new THREE.Vector3();
    const camPos = new THREE.Vector3();
    const projected = new THREE.Vector3();
    let frame = 0;
    let last = performance.now();
    let elapsed = 0;
    let smoothProgress = progress.get();

    const perf = { time: 0, frames: 0 };

    function loop(now: number) {
      frame = 0;
      if (disposed || !visible) return;
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (!reduceMotion) elapsed += dt;

      // Phone safety net: average ~2s of frames; under ~40 fps, drop resolution one step.
      // One-off long frames (texture upload, returning to the tab) are ignored.
      if (touch && pixelRatio > MIN_TOUCH_RATIO && dt < 0.09) {
        perf.time += dt;
        perf.frames += 1;
        if (perf.frames >= 120) {
          if (perf.time / perf.frames > 1 / 40) {
            pixelRatio = Math.max(MIN_TOUCH_RATIO, pixelRatio - 0.5);
            renderer.setPixelRatio(pixelRatio);
            resize();
          }
          perf.time = 0;
          perf.frames = 0;
        }
      }

      smoothProgress += (progress.get() - smoothProgress) * Math.min(1, dt * 6);
      const route = routeAt(smoothProgress);

      // Distances that keep the framing right on any aspect ratio (phones are tall).
      const tanH = Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * camera.aspect;
      // Frame USA → Uzbekistan (~170° of longitude); wide screens get extra margin.
      const span = camera.aspect < 1 ? 19 : 20;
      const overviewDist = Math.max(16, span / tanH / 2 + 2);
      const focusDist = 7.5 * Math.min(Math.max(1.1 / camera.aspect, 1), 2.4);
      const dist = lerp(overviewDist, focusDist, route.zoom);

      pointer.sx += (pointer.x - pointer.sx) * Math.min(1, dt * 3);
      pointer.sy += (pointer.y - pointer.sy) * Math.min(1, dt * 3);

      focus.copy(toWorld(route.lat, route.lon));
      const pitch = PITCH + pointer.sy * 0.05;
      camPos.set(
        focus.x + pointer.sx * dist * 0.06,
        dist * Math.sin(pitch),
        focus.z + dist * Math.cos(pitch)
      );
      camera.position.copy(camPos);
      camera.lookAt(focus);

      surfaceUniforms.uTime.value = elapsed;
      surfaceUniforms.uFocus.value.copy(focus);
      surfaceUniforms.uFogNear.value = dist * 0.8;
      surfaceUniforms.uFogFar.value = dist * 1.9;
      if (surfaceUniforms.uMask.value) {
        surfaceUniforms.uReady.value = Math.min(1, surfaceUniforms.uReady.value + dt * 1.5);
      }

      const k = reduceMotion ? 1 : Math.min(1, dt * 2.5);
      pins.forEach((pin, i) => {
        const on = smoothProgress >= pin.arrive - 0.04 ? 1 : 0;
        pin.grow += (on - pin.grow) * k;
        pin.arcGrow += (on - pin.arcGrow) * (reduceMotion ? 1 : Math.min(1, dt * 1.2));
        const g = pin.grow;
        const h = Math.max(pin.height * g, 0.001);
        pin.outer.scale.y = h;
        pin.inner.scale.y = h;
        for (const m of [pin.outer.material, pin.inner.material] as THREE.ShaderMaterial[]) {
          m.uniforms.uIntensity.value = g;
          m.uniforms.uTime.value = elapsed + i * 0.4;
        }
        pin.discMat.uniforms.uIntensity.value = g;
        surfaceUniforms.uHighlight.value.setComponent(i, g);
        pin.discMat.uniforms.uTime.value = elapsed + i * 0.3;
        pin.sprite.position.y = h;
        pin.sprite.material.opacity = g;
        if (pin.arcMat) {
          pin.arcMat.uniforms.uProgress.value = pin.arcGrow;
          pin.arcMat.uniforms.uTime.value = elapsed + i * 0.25;
        }

        // Float the HTML label above the column top.
        const label = labelRefs.current[i];
        if (label) {
          projected.copy(pin.pos).setY(h + 0.35).project(camera);
          const x = (projected.x * 0.5 + 0.5) * width;
          const y = (-projected.y * 0.5 + 0.5) * height;
          const inFront = projected.z < 1;
          label.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px) scale(${0.85 + g * 0.15})`;
          label.style.opacity = inFront ? String(Math.max(0, g * 1.2 - 0.2)) : "0";
        }
      });

      renderer.render(scene, camera);
      frame = requestAnimationFrame(loop);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };
  }, [progress]);

  return (
    <div ref={wrapRef} className={cn("overflow-hidden", className ?? "relative")}>
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
      {COUNTRY_PINS.map((pin, i) => {
        const Flag = FLAGS[pin.code];
        return (
          <div
            key={pin.code}
            ref={(el) => {
              labelRefs.current[i] = el;
            }}
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 flex items-center gap-1.5 rounded-full border border-white/15 bg-[#0b1a3d]/85 px-2.5 py-1 text-xs font-semibold text-white shadow-[0_0_24px_rgba(59,134,255,0.45)] will-change-transform"
            style={{ opacity: 0 }}
          >
            <Flag className="h-2.5 w-4 rounded-[1px]" />
            {clientsIn(pin.code).length}
          </div>
        );
      })}
    </div>
  );
}
