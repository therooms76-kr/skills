// projection.js — 복도의 1점 투시. t = 깊이(0 가까움 .. 1 소실점), lat = 좌우(0 왼벽 .. 1 오른벽).

export function makeProjection({ vx = 0.5, vy = 0.42, depth = 5.5 } = {}) {
  const proj = (t, lat) => { const s = 1 / (1 + t * depth); return { x: vx + (lat - 0.5) * s * 1.15, y: vy + (1 - vy) * s, s }; };
  const unproj = (x, y) => {
    const s = Math.max(0.12, (y - vy) / (1 - vy));
    const t = (1 / s - 1) / depth; const lat = 0.5 + (x - vx) / (s * 1.15);
    return { t: Math.min(0.92, Math.max(0, t)), lat: Math.min(0.95, Math.max(0.05, lat)) };
  };
  // 벽 위의 점: h = 0 바닥 .. 1 천장선. 결과는 1600x900 좌표.
  const P = (t, lat, h) => { const q = proj(t, lat); return [q.x * 1600, (q.y - h * (q.y - vy)) * 900]; };
  return { vx, vy, depth, proj, unproj, P };
}
