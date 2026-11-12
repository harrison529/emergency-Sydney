// Keep the city playable when WebGL is disabled or unavailable on a device.
export class CompatibilityRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    if (!this.context) throw new Error('This browser does not support canvas rendering.');
    this.shadowMap = {};
    this.pixelRatio = 1;
  }
  setPixelRatio(value) { this.pixelRatio = Math.min(value, 1.5); }
  setSize(width, height) {
    this.width = width; this.height = height;
    this.canvas.width = width * this.pixelRatio;
    this.canvas.height = height * this.pixelRatio;
  }
  render(scene, camera) {
    const ctx = this.context;
    ctx.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
    ctx.fillStyle = '#19343c';
    ctx.fillRect(0, 0, this.width, this.height);
    const active = document.body.classList.contains('playing');
    const direction = camera.getWorldDirection(camera.position.clone());
    const distance = Math.abs(camera.position.y / direction.y);
    const centerX = active ? camera.position.x + direction.x * distance : 0;
    const centerZ = active ? camera.position.z + direction.z * distance : -70;
    const scale = active ? 2.4 : Math.min(this.width, this.height) / 850;
    ctx.save();
    ctx.translate(this.width / 2, this.height / 2);
    ctx.scale(scale, scale);
    ctx.translate(-centerX, -centerZ);
    scene.updateMatrixWorld();
    const objects = [];
    scene.traverseVisible(object => { if (object.isMesh) objects.push(object); });
    // Ground, roads, roofs, and players draw in height order.
    objects.sort((a, b) => a.matrixWorld.elements[13] - b.matrixWorld.elements[13]);
    for (const object of objects) {
      const p = object.geometry.parameters;
      if (!p.width || !p.depth) continue;
      const e = object.matrixWorld.elements;
      ctx.save();
      ctx.translate(e[12], e[14]);
      ctx.rotate(-Math.atan2(e[2], e[0]));
      ctx.fillStyle = '#' + object.material.color.getHexString();
      ctx.fillRect(-p.width / 2, -p.depth / 2, p.width, p.depth);
      ctx.restore();
    }
    ctx.restore();
  }
}
