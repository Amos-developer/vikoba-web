<script setup>
import { computed, onMounted, ref, watch } from "vue";

const props = defineProps({
  transactions: { type: Array, default: () => [] },
  days: { type: Number, default: 14 },
});

const svgRef = ref(null);
const fileName = ref("deposits-chart");

const daysArray = (n) => {
  const arr = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push(d);
  }
  return arr;
};

const formatDay = (date) =>
  date.toLocaleDateString(undefined, { month: "short", day: "numeric" });

const dailyData = computed(() => {
  const days = daysArray(props.days);
  const map = new Map();
  days.forEach((d) => map.set(d.toDateString(), 0));

  props.transactions.forEach((t) => {
    if (!t || t.transaction_type !== "deposit") return;
    const ts = new Date(t.created_at || t.date || t.timestamp || t.createdAt);
    if (isNaN(ts)) return;
    const key = ts.toDateString();
    if (map.has(key)) map.set(key, map.get(key) + Number(t.amount || 0));
  });

  const labels = days.map(formatDay);
  const values = days.map((d) => map.get(d.toDateString()) || 0);
  return { labels, values };
});

const svgWidth = 800;
const svgHeight = 260;
const padding = { top: 18, right: 18, bottom: 36, left: 52 };

const points = computed(() => {
  const { values } = dailyData.value;
  const innerW = svgWidth - padding.left - padding.right;
  const innerH = svgHeight - padding.top - padding.bottom;
  const max = Math.max(1, ...values);
  return values.map((v, i) => {
    const x = padding.left + (i / Math.max(1, values.length - 1)) * innerW;
    const y = padding.top + innerH - (v / max) * innerH;
    return { x, y, v };
  });
});

const pathD = computed(() => {
  const pts = points.value;
  if (!pts.length) return "";
  // smooth cubic bezier via simple algorithm
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const cur = pts[i];
    const cx = (prev.x + cur.x) / 2;
    d += ` Q ${prev.x} ${prev.y} ${cx} ${(prev.y + cur.y) / 2}`;
    d += ` T ${cur.x} ${cur.y}`;
  }
  return d;
});

const areaD = computed(() => {
  const pts = points.value;
  if (!pts.length) return "";
  const last = pts[pts.length - 1];
  const first = pts[0];
  return `${pathD.value} L ${last.x} ${svgHeight - padding.bottom} L ${first.x} ${svgHeight - padding.bottom} Z`;
});

const maxValue = computed(() => Math.max(0, ...dailyData.value.values));

function downloadSVG() {
  const svgEl = svgRef.value;
  if (!svgEl) return;
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svgEl);
  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName.value}.svg`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function downloadPNG() {
  const svgEl = svgRef.value;
  if (!svgEl) return;
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svgEl);
  const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    // scale for crispness
    const scale = 2;
    canvas.width = svgWidth * scale;
    canvas.height = svgHeight * scale;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle =
      getComputedStyle(document.body).backgroundColor || "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      const u = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = u;
      a.download = `${fileName.value}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(u);
      URL.revokeObjectURL(url);
    });
  };
  img.onerror = (e) => {
    console.error("SVG -> PNG conversion failed", e);
    URL.revokeObjectURL(url);
  };
  img.src = url;
}

onMounted(() => {});

watch(
  () => props.transactions,
  () => {},
);
</script>

<template>
  <div class="chart-card">
    <div class="chart-card-header">
      <div>
        <span class="section-kicker">Analytics</span>
        <h3>Deposits — last {{ props.days }} days</h3>
      </div>
      <div class="chart-card-actions">
        <input v-model="fileName" class="chart-input" placeholder="filename" />
        <button class="btn btn-sm btn-outline-secondary" @click="downloadSVG">
          Download SVG
        </button>
        <button class="btn btn-sm btn-primary" @click="downloadPNG">
          Download PNG
        </button>
      </div>
    </div>

    <div class="chart-canvas">
      <svg
        :width="svgWidth"
        :height="svgHeight"
        viewBox="`0 0 ${svgWidth} ${svgHeight}`"
        ref="svgRef"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gradArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#6366F1" stop-opacity="0.18" />
            <stop offset="100%" stop-color="#6366F1" stop-opacity="0.02" />
          </linearGradient>
        </defs>

        <!-- grid lines -->
        <g class="grid">
          <line
            :x1="padding.left"
            :x2="svgWidth - padding.right"
            :y1="padding.top"
            :y2="padding.top"
            stroke="rgba(15,23,42,0.04)"
          />
          <line
            :x1="padding.left"
            :x2="svgWidth - padding.right"
            :y1="
              svgHeight -
              padding.bottom -
              (svgHeight - padding.top - padding.bottom) / 2
            "
            :y2="
              svgHeight -
              padding.bottom -
              (svgHeight - padding.top - padding.bottom) / 2
            "
            stroke="rgba(15,23,42,0.04)"
          />
        </g>

        <!-- area -->
        <path :d="areaD" fill="url(#gradArea)" stroke="none" />

        <!-- line -->
        <path
          :d="pathD"
          fill="none"
          stroke="#6366F1"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <!-- points -->
        <g>
          <circle
            v-for="(p, i) in points"
            :key="i"
            :cx="p.x"
            :cy="p.y"
            r="3.5"
            fill="#fff"
            stroke="#6366F1"
            stroke-width="1.8"
          />
        </g>

        <!-- x labels -->
        <g>
          <text
            v-for="(lab, i) in dailyData.labels"
            :key="i"
            :x="points[i]?.x || 0"
            :y="svgHeight - padding.bottom + 20"
            font-size="11"
            fill="#64748b"
            text-anchor="middle"
          >
            {{ lab }}
          </text>
        </g>

        <!-- y axis labels -->
        <g>
          <text
            :x="padding.left - 12"
            :y="padding.top + 4"
            font-size="11"
            fill="#64748b"
            text-anchor="end"
          >
            {{ maxValue }}
          </text>
          <text
            :x="padding.left - 12"
            :y="svgHeight - padding.bottom"
            font-size="11"
            fill="#64748b"
            text-anchor="end"
          >
            0
          </text>
        </g>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.chart-card {
  border: 1px solid rgba(30, 56, 73, 0.08);
  border-radius: 12px;
  background: #ffffff;
  padding: 1rem;
  box-shadow: 0 18px 40px rgba(25, 48, 65, 0.06);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 260px;
}

.chart-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.chart-card-header h3 {
  font-size: 0.92rem;
  margin: 0.15rem 0 0;
  color: #1f2937;
  font-weight: 700;
}

.chart-card-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.4rem;
  align-items: center;
}

.chart-input {
  padding: 0.35rem 0.65rem;
  border-radius: 10px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  min-width: 140px;
}

.chart-card-actions .btn,
.chart-card-actions .btn-sm {
  padding: 0.32rem 0.65rem !important;
  font-size: 0.8rem !important;
  min-height: 34px;
  line-height: 1.2;
  border-radius: 8px;
}

.chart-canvas {
  width: 100%;
  flex: 1 1 auto;
  min-height: 180px;
}

svg {
  width: 100%;
  height: auto;
}

@media (max-width: 420px) {
  .chart-card {
    padding: 0.75rem;
    min-height: 200px;
  }
  .chart-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  .chart-card-actions {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}
</style>
