<script lang="ts">
	// 基板の配線パターンを描き、その上をランダムに電気 (光のパルス) が流れる背景。
	import { onMount } from 'svelte';

	type Pt = { x: number; y: number };
	type Trace = { pts: Pt[]; len: number; segLen: number[] };
	type Pulse = { trace: Trace; dist: number; speed: number; dir: 1 | -1; life: number; hue: number };

	let canvas: HTMLCanvasElement;

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const CELL = 28; // 格子の間隔
		let W = 0,
			H = 0,
			dpr = 1;
		let traces: Trace[] = [];
		let pulses: Pulse[] = [];
		let raf = 0;
		let last = 0;
		let spawnAcc = 0;

		const rnd = (a: number, b: number) => a + Math.random() * (b - a);
		// 左は紫、右は緑。横位置 0..1 で色相を混ぜる
		const HUE_L = 275,
			HUE_R = 150;
		const hueAt = (x: number) => {
			const k = Math.max(0, Math.min(1, x / Math.max(1, W)));
			const e = k * k * (3 - 2 * k); // 中央は緩やかに
			return HUE_L + (HUE_R - HUE_L) * e;
		};
		const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

		// 格子上をランダムに歩いて配線を作る。曲がるのは 45° か 90°。
		function makeTrace(occupied: Set<string>): Trace | null {
			const cols = Math.ceil(W / CELL) + 2;
			const rows = Math.ceil(H / CELL) + 2;
			let cx = Math.floor(rnd(-1, cols));
			let cy = Math.floor(rnd(-1, rows));
			if (occupied.has(`${cx},${cy}`)) return null;
			const dirs: Pt[] = [
				{ x: 1, y: 0 },
				{ x: -1, y: 0 },
				{ x: 0, y: 1 },
				{ x: 0, y: -1 },
				{ x: 1, y: 1 },
				{ x: -1, y: -1 },
				{ x: 1, y: -1 },
				{ x: -1, y: 1 }
			];
			let d = pick(dirs);
			const pts: Pt[] = [{ x: cx * CELL, y: cy * CELL }];
			occupied.add(`${cx},${cy}`);
			const steps = Math.floor(rnd(6, 22));
			let run = 0;
			for (let i = 0; i < steps; i++) {
				const nx = cx + d.x,
					ny = cy + d.y;
				if (occupied.has(`${nx},${ny}`) || nx < -1 || ny < -1 || nx > cols || ny > rows) break;
				cx = nx;
				cy = ny;
				occupied.add(`${cx},${cy}`);
				run++;
				// 直進が続いたら確率で曲がる
				if (run >= 2 && Math.random() < 0.35) {
					const turn = pick([-1, 1]);
					const idx = dirs.findIndex((v) => v.x === d.x && v.y === d.y);
					// 45° 回転: 8 方向を角度順に並べ替えた表を使う
					const order = [0, 4, 2, 7, 1, 5, 3, 6];
					const pos = order.indexOf(idx);
					d = dirs[order[(pos + turn + 8) % 8]];
					pts.push({ x: cx * CELL, y: cy * CELL });
					run = 0;
				}
			}
			pts.push({ x: cx * CELL, y: cy * CELL });
			if (pts.length < 2) return null;
			const segLen: number[] = [];
			let len = 0;
			for (let i = 1; i < pts.length; i++) {
				const l = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
				segLen.push(l);
				len += l;
			}
			if (len < CELL * 3) return null;
			return { pts, len, segLen };
		}

		function build() {
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			W = window.innerWidth;
			H = window.innerHeight;
			canvas.width = W * dpr;
			canvas.height = H * dpr;
			canvas.style.width = `${W}px`;
			canvas.style.height = `${H}px`;
			ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

			traces = [];
			pulses = [];
			const occupied = new Set<string>();
			const target = Math.floor((W * H) / 14000);
			for (let i = 0; i < target * 4 && traces.length < target; i++) {
				const t = makeTrace(occupied);
				if (t) traces.push(t);
			}
			drawStatic();
		}

		// 配線本体は動かないので一度だけ描いて保持する
		let staticLayer: HTMLCanvasElement | null = null;
		function drawStatic() {
			staticLayer = document.createElement('canvas');
			staticLayer.width = W * dpr;
			staticLayer.height = H * dpr;
			const s = staticLayer.getContext('2d')!;
			s.setTransform(dpr, 0, 0, dpr, 0, 0);
			const dark = matchMedia('(prefers-color-scheme: dark)').matches;
			const lineA = dark ? 0.24 : 0.22;
			const padA = dark ? 0.42 : 0.38;
			const light = dark ? 65 : 38;
			s.lineWidth = 1.5;
			s.lineJoin = 'round';
			s.lineCap = 'round';
			for (const t of traces) {
				const mid = pointAt(t, t.len / 2);
				s.strokeStyle = `hsla(${hueAt(mid.x)}, 60%, ${light}%, ${lineA})`;
				s.beginPath();
				s.moveTo(t.pts[0].x, t.pts[0].y);
				for (let i = 1; i < t.pts.length; i++) s.lineTo(t.pts[i].x, t.pts[i].y);
				s.stroke();
			}
			// 端子 (パッド)
			for (const t of traces) {
				for (const p of [t.pts[0], t.pts[t.pts.length - 1]]) {
					s.fillStyle = `hsla(${hueAt(p.x)}, 60%, ${light}%, ${padA})`;
					s.beginPath();
					s.arc(p.x, p.y, 3.2, 0, Math.PI * 2);
					s.fill();
				}
			}
		}

		function pointAt(t: Trace, dist: number): Pt {
			let d = Math.max(0, Math.min(t.len, dist));
			for (let i = 0; i < t.segLen.length; i++) {
				if (d <= t.segLen[i]) {
					const a = t.pts[i],
						b = t.pts[i + 1];
					const k = t.segLen[i] === 0 ? 0 : d / t.segLen[i];
					return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
				}
				d -= t.segLen[i];
			}
			return t.pts[t.pts.length - 1];
		}

		function spawn() {
			if (!traces.length) return;
			const trace = pick(traces);
			const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
			pulses.push({
				trace,
				dir,
				dist: dir === 1 ? 0 : trace.len,
				speed: rnd(160, 380),
				life: 1,
				hue: 0
			});
		}

		function frame(now: number) {
			const dt = Math.min(0.05, (now - last) / 1000 || 0);
			last = now;

			// ランダムな間隔で発生させる (平均 1 秒に数本)
			spawnAcc += dt;
			const rate = 2.5 + traces.length / 60;
			while (spawnAcc > 0) {
				spawnAcc -= rnd(0.2, 1.6) / rate;
				if (pulses.length < 40) spawn();
			}

			ctx!.clearRect(0, 0, W, H);
			if (staticLayer) ctx!.drawImage(staticLayer, 0, 0, W, H);

			ctx!.globalCompositeOperation = 'lighter';
			for (const p of pulses) {
				p.dist += p.speed * p.dir * dt;
				if (p.dist < 0 || p.dist > p.trace.len) p.life -= dt * 4;
				const TAIL = 70;
				p.hue = hueAt(pointAt(p.trace, p.dist).x);
				// 尾を引く光
				const n = 10;
				for (let i = 0; i < n; i++) {
					const k = i / n;
					const q = pointAt(p.trace, p.dist - p.dir * TAIL * k);
					const a = (1 - k) * 0.9 * p.life;
					ctx!.fillStyle = `hsla(${p.hue}, 90%, 70%, ${a})`;
					ctx!.beginPath();
					ctx!.arc(q.x, q.y, 1.4 + (1 - k) * 1.2, 0, Math.PI * 2);
					ctx!.fill();
				}
				// 先端の輝き
				const head = pointAt(p.trace, p.dist);
				const g = ctx!.createRadialGradient(head.x, head.y, 0, head.x, head.y, 14);
				g.addColorStop(0, `hsla(${p.hue}, 100%, 85%, ${0.9 * p.life})`);
				g.addColorStop(1, `hsla(${p.hue}, 100%, 70%, 0)`);
				ctx!.fillStyle = g;
				ctx!.beginPath();
				ctx!.arc(head.x, head.y, 14, 0, Math.PI * 2);
				ctx!.fill();
			}
			ctx!.globalCompositeOperation = 'source-over';
			pulses = pulses.filter((p) => p.life > 0);

			raf = requestAnimationFrame(frame);
		}

		build();
		if (reduce) {
			// 動きを減らす設定なら配線だけ描く
			ctx.drawImage(staticLayer!, 0, 0, W, H);
		} else {
			raf = requestAnimationFrame(frame);
		}

		let resizeTimer = 0;
		const onResize = () => {
			clearTimeout(resizeTimer);
			resizeTimer = window.setTimeout(build, 150);
		};
		window.addEventListener('resize', onResize);
		const mq = matchMedia('(prefers-color-scheme: dark)');
		mq.addEventListener('change', build);
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('resize', onResize);
			mq.removeEventListener('change', build);
		};
	});
</script>

<canvas class="circuit-bg" bind:this={canvas} aria-hidden="true"></canvas>

<style>
	.circuit-bg {
		position: fixed;
		inset: 0;
		z-index: -1;
		pointer-events: none;
		background:
			radial-gradient(ellipse at 0% 30%, var(--bg-glow) 0%, transparent 55%),
			radial-gradient(ellipse at 100% 70%, var(--bg-glow-2) 0%, transparent 55%),
			var(--bg);
	}
</style>
