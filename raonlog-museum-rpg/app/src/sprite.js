// sprite.js — 고양이 그리기. theme.sprites.cat이 있으면 스프라이트 시트, 없으면 임시 픽셀 고양이.
// 스프라이트 시트 규격(theme.json):
//   "cat": { "sheet": "cat.png", "frame": [32, 32],
//            "anim": { "walk": [0,1,2,3], "idle": [4], "sit": [5] },   // 프레임 번호 (왼쪽→오른쪽, 위→아래)
//            "faces": "right",                                        // 그려진 방향. 반대는 뒤집는다
//            "collar": { "y": 16, "x": [6, 25] } }                     // 목걸이 색을 칠할 띠 (선택)

const PIXEL = {
  pal: { k: '#2B2622', o: '#E9A24B', w: '#FFF6E8', p: '#E88080', e: '#2B2622', s: '#C97F2F' },
  stand: ['....kk....kk....', '...kwok..kowk...', '...kooookoook...', '..koooooooook...', '..koeoooooeok...', '..koooowpooook..', '..kooooooooook..', '...kooooooook...', '..kkooooooookkk.', '.koooooooooooosk', '.koooosooooooosk', '.koooooooooooosk', '..koooooooookk..', '..kkoookkkook...', '...ko.....ko....', '...kk.....kk....'],
};
PIXEL.walk = PIXEL.stand.slice(0, 13).concat(['..kkookkkkook...', '..ko.......ko...', '..kk.......kk...']);
PIXEL.sit = PIXEL.stand.slice(0, 10).concat(['.koooooooooooosk', '.koooooooooooosk', '.kooooooooooook.', '..kkkkkkkkkkkk..', '................', '................']);

export class CatSprite {
  constructor(canvas, theme) {
    this.c = canvas; this.ctx = canvas.getContext('2d'); this.theme = theme;
    this.sheet = theme.sprites.catImage || null; this.spec = theme.sprites.cat || null;
    const fw = this.spec ? this.spec.frame[0] : 16, fh = this.spec ? this.spec.frame[1] : 16;
    this.c.width = fw; this.c.height = fh; this.fw = fw; this.fh = fh;
  }
  // pose: 'stand' | 'walk' | 'sit', step: 걸음 번호, dir: 1 오른쪽 / -1 왼쪽, collar: 색 또는 null
  draw(pose, step, dir, collar) {
    const ctx = this.ctx; ctx.clearRect(0, 0, this.fw, this.fh);
    if (this.sheet && this.spec) return this.drawSheet(pose, step, dir, collar);
    const rows = pose === 'sit' ? PIXEL.sit : (pose === 'walk' && step % 2 ? PIXEL.walk : PIXEL.stand);
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      const ch = rows[y][x]; if (ch === '.') continue; ctx.fillStyle = PIXEL.pal[ch] || PIXEL.pal.o; ctx.fillRect(dir < 0 ? 15 - x : x, y, 1, 1);
    }
    if (collar) { ctx.fillStyle = collar; for (let x = 3; x <= 12; x++) ctx.fillRect(dir < 0 ? 15 - x : x, 8, 1, 1); }
  }
  drawSheet(pose, step, dir, collar) {
    const { ctx, sheet, spec, fw, fh } = this;
    const anim = spec.anim[pose] || spec.anim.idle || [0];
    const idx = anim[step % anim.length];
    const cols = Math.floor(sheet.width / fw);
    const sx = (idx % cols) * fw, sy = Math.floor(idx / cols) * fh;
    const flip = (spec.faces === 'right') ? dir < 0 : dir > 0;
    ctx.save(); if (flip) { ctx.translate(fw, 0); ctx.scale(-1, 1); }
    ctx.imageSmoothingEnabled = false; ctx.drawImage(sheet, sx, sy, fw, fh, 0, 0, fw, fh);
    if (collar && spec.collar) { ctx.fillStyle = collar; ctx.fillRect(spec.collar.x[0], spec.collar.y, spec.collar.x[1] - spec.collar.x[0], 1); }
    ctx.restore();
  }
}
