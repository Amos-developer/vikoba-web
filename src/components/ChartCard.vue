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

  const demoSeries = [
    120000, 180000, 240000, 310000, 280000, 360000, 420000, 390000, 460000,
    520000, 470000, 610000, 590000, 670000,
  ];

  const isDevelopment = import.meta.env.DEV;
  const shouldUseDemo =
    isDevelopment && (!props.transactions || props.transactions.length === 0);

  if (shouldUseDemo) {
    days.forEach((day, index) => {
      const key = day.toDateString();
      const amount = demoSeries[index] ?? demoSeries[demoSeries.length - 1];
      if (map.has(key)) map.set(key, amount);
    });
  } else {
    props.transactions.forEach((t) => {
      if (!t || t.transaction_type !== "deposit") return;
      const ts = new Date(t.created_at || t.date || t.timestamp || t.createdAt);
      if (isNaN(ts)) return;
      const key = ts.toDateString();
      if (map.has(key)) map.set(key, map.get(key) + Number(t.amount || 0));
    });
  }

  const labels = days.map(formatDay);
  const values = days.map((d) => map.get(d.toDateString()) || 0);
  return { labels, values };
});

const svgWidth = 480;
const svgHeight = 280;
const padding = { top: 24, right: 18, bottom: 56, left: 50 };

const chartData = computed(() => {
  const { labels, values } = dailyData.value;
  const innerW = svgWidth - padding.left - padding.right;
  const innerH = svgHeight - padding.top - padding.bottom;
  const max = Math.max(1, ...values);
  const gap =
    labels.length <= 1
      ? 0
      : Math.max(8, Math.min(18, innerW / labels.length / 4));
  const barWidth =
    labels.length <= 1
      ? innerW
      : (innerW - gap * (labels.length - 1)) / labels.length;

  const bars = values.map((value, i) => {
    const height = max === 0 ? 0 : (value / max) * innerH;
    const x = padding.left + i * (barWidth + gap);
    const y = padding.top + innerH - height;
    return { x, y, height, width: barWidth, value, label: labels[i] };
  });

  return { bars, labels, maxValue: max, innerH };
});

const maxValue = computed(() => chartData.value.maxValue);

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
          SVG
        </button>
        <button class="btn btn-sm btn-primary" @click="downloadPNG">PNG</button>
      </div>
    </div>

    <div class="chart-canvas">
      <svg
        :width="svgWidth"
        :height="svgHeight"
        viewBox="0 0 480 280"
        preserveAspectRatio="xMidYMid meet"
        ref="svgRef"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gradBar" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#6366F1" stop-opacity="0.95" />
            <stop offset="100%" stop-color="#4F46E5" stop-opacity="0.78" />
          </linearGradient>
        </defs>

        <g class="grid">
          <line
            :x1="padding.left"
            :x2="svgWidth - padding.right"
            :y1="padding.top"
            :y2="padding.top"
            stroke="rgba(15,23,42,0.06)"
          />
          <line
            :x1="padding.left"
            :x2="svgWidth - padding.right"
            :y1="padding.top + chartData.innerH / 2"
            :y2="padding.top + chartData.innerH / 2"
            stroke="rgba(15,23,42,0.05)"
          />
          <line
            :x1="padding.left"
            :x2="svgWidth - padding.right"
            :y1="padding.top + chartData.innerH"
            :y2="padding.top + chartData.innerH"
            stroke="rgba(15,23,42,0.08)"
          />
        </g>

        <g v-if="chartData.bars.length">
          <rect
            v-for="(bar, index) in chartData.bars"
            :key="index"
            :x="bar.x"
            :y="bar.y"
            :width="bar.width"
            :height="bar.height"
            rx="8"
            fill="url(#gradBar)"
            opacity="0.92"
          />
        </g>

        <g>
          <text
            v-for="(bar, index) in chartData.bars"
            :key="`${index}-label`"
            :x="bar.x + bar.width / 2"
            :y="svgHeight - padding.bottom + 20"
            font-size="10"
            fill="#64748b"
            text-anchor="middle"
          >
            {{ bar.label }}
          </text>
        </g>

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
            :y="padding.top + chartData.innerH"
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
  border-radius: 14px;
  background: #ffffff;
  padding: 0.9rem;
  box-shadow: 0 16px 36px rgba(25, 48, 65, 0.06);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 240px;
}

.chart-card-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.65rem;
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
  gap: 0.4rem;
  align-items: center;
  width: 100%;
}

.chart-input {
  padding: 0.35rem 0.65rem;
  border-radius: 10px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  min-width: 120px;
  flex: 1 1 120px;
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
  min-height: 200px;
}

svg {
  display: block;
  width: 100%;
  height: auto;
}

@media (min-width: 768px) {
  .chart-card {
    padding: 1rem;
  }

  .chart-card-header {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }

  .chart-card-actions {
    width: auto;
    justify-content: flex-end;
  }

  .chart-input {
    min-width: 140px;
    flex: 0 0 140px;
  }
}
</style>
