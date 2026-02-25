import { useEffect, useRef } from 'react';

export type DSType = 'bst' | 'array' | 'hashmap' | 'linkedlist';

interface AlgorithmVisualizerProps {
  dsType: DSType;
  dataset: number[];
  searchTarget: number;
  currentStep: number;
  isRunning: boolean;
}

interface BSTNode {
  value: number;
  left?: BSTNode;
  right?: BSTNode;
  x?: number;
  y?: number;
}

function buildBST(values: number[]): BSTNode | undefined {
  let root: BSTNode | undefined;
  for (const v of values) {
    root = insertBST(root, v);
  }
  return root;
}

function insertBST(node: BSTNode | undefined, value: number): BSTNode {
  if (!node) return { value };
  if (value < node.value) return { ...node, left: insertBST(node.left, value) };
  return { ...node, right: insertBST(node.right, value) };
}

function assignPositions(node: BSTNode | undefined, x: number, y: number, spread: number): void {
  if (!node) return;
  node.x = x;
  node.y = y;
  assignPositions(node.left, x - spread, y + 60, spread / 2);
  assignPositions(node.right, x + spread, y + 60, spread / 2);
}

function getBSTSearchPath(node: BSTNode | undefined, target: number): number[] {
  const path: number[] = [];
  let cur = node;
  while (cur) {
    path.push(cur.value);
    if (target === cur.value) break;
    cur = target < cur.value ? cur.left : cur.right;
  }
  return path;
}

export default function AlgorithmVisualizer({
  dsType,
  dataset,
  searchTarget,
  currentStep,
  isRunning,
}: AlgorithmVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#0f1117';
    ctx.fillRect(0, 0, W, H);

    if (dsType === 'bst') {
      drawBST(ctx, dataset, searchTarget, currentStep, W, H);
    } else if (dsType === 'array') {
      drawArray(ctx, dataset, searchTarget, currentStep, W, H);
    } else if (dsType === 'hashmap') {
      drawHashmap(ctx, dataset, searchTarget, currentStep, W, H);
    } else if (dsType === 'linkedlist') {
      drawLinkedList(ctx, dataset, searchTarget, currentStep, W, H);
    }
  }, [dsType, dataset, searchTarget, currentStep]);

  return (
    <canvas
      ref={canvasRef}
      width={340}
      height={220}
      className="w-full rounded-md border border-border"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}

function drawBST(ctx: CanvasRenderingContext2D, dataset: number[], target: number, step: number, W: number, H: number) {
  const root = buildBST(dataset);
  if (!root) return;
  assignPositions(root, W / 2, 30, W / 4);
  const searchPath = getBSTSearchPath(root, target);
  const visitedUpToStep = new Set(searchPath.slice(0, step + 1));

  function drawEdges(node: BSTNode | undefined) {
    if (!node) return;
    if (node.left && node.x !== undefined && node.y !== undefined && node.left.x !== undefined && node.left.y !== undefined) {
      ctx.beginPath();
      ctx.moveTo(node.x, node.y);
      ctx.lineTo(node.left.x, node.left.y);
      ctx.strokeStyle = '#2a2d3a';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      drawEdges(node.left);
    }
    if (node.right && node.x !== undefined && node.y !== undefined && node.right.x !== undefined && node.right.y !== undefined) {
      ctx.beginPath();
      ctx.moveTo(node.x, node.y);
      ctx.lineTo(node.right.x, node.right.y);
      ctx.strokeStyle = '#2a2d3a';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      drawEdges(node.right);
    }
  }

  function drawNodes(node: BSTNode | undefined) {
    if (!node || node.x === undefined || node.y === undefined) return;
    const isVisited = visitedUpToStep.has(node.value);
    const isCurrent = searchPath[Math.min(step, searchPath.length - 1)] === node.value;
    const isFound = node.value === target && isVisited;

    ctx.beginPath();
    ctx.arc(node.x, node.y, 16, 0, Math.PI * 2);

    if (isFound) {
      ctx.fillStyle = '#4ade80';
      ctx.shadowColor = '#4ade80';
      ctx.shadowBlur = 12;
    } else if (isCurrent) {
      ctx.fillStyle = '#22d3ee';
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 10;
    } else if (isVisited) {
      ctx.fillStyle = '#1e3a2f';
      ctx.shadowBlur = 0;
    } else {
      ctx.fillStyle = '#1a1d2e';
      ctx.shadowBlur = 0;
    }
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.strokeStyle = isFound ? '#4ade80' : isCurrent ? '#22d3ee' : isVisited ? '#4ade8060' : '#2a2d3a';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = isFound || isCurrent ? '#0f1117' : '#e2e8f0';
    ctx.font = 'bold 11px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(node.value), node.x, node.y);

    drawNodes(node.left);
    drawNodes(node.right);
  }

  drawEdges(root);
  drawNodes(root);

  // Label
  ctx.fillStyle = '#4ade80';
  ctx.font = '10px JetBrains Mono, monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`BST Search: target=${target}  steps=${Math.min(step + 1, searchPath.length)}/${searchPath.length}`, 8, H - 8);
}

function drawArray(ctx: CanvasRenderingContext2D, dataset: number[], target: number, step: number, W: number, H: number) {
  const sorted = [...dataset].sort((a, b) => a - b);
  const cellW = Math.min(40, (W - 20) / sorted.length);
  const cellH = 36;
  const startX = (W - cellW * sorted.length) / 2;
  const startY = H / 2 - cellH / 2;

  sorted.forEach((val, i) => {
    const isScanned = i <= step;
    const isFound = val === target && isScanned;
    const isCurrent = i === step;

    ctx.fillStyle = isFound ? '#4ade80' : isCurrent ? '#22d3ee' : isScanned ? '#1e3a2f' : '#1a1d2e';
    ctx.shadowColor = isFound ? '#4ade80' : isCurrent ? '#22d3ee' : 'transparent';
    ctx.shadowBlur = isFound || isCurrent ? 8 : 0;
    ctx.fillRect(startX + i * cellW, startY, cellW - 2, cellH);
    ctx.shadowBlur = 0;

    ctx.strokeStyle = isFound ? '#4ade80' : isCurrent ? '#22d3ee' : '#2a2d3a';
    ctx.lineWidth = 1;
    ctx.strokeRect(startX + i * cellW, startY, cellW - 2, cellH);

    ctx.fillStyle = isFound || isCurrent ? '#0f1117' : '#e2e8f0';
    ctx.font = 'bold 11px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(val), startX + i * cellW + (cellW - 2) / 2, startY + cellH / 2);
  });

  // Arrow pointer
  if (step < sorted.length) {
    const arrowX = startX + step * cellW + (cellW - 2) / 2;
    ctx.fillStyle = '#22d3ee';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('▼', arrowX, startY - 12);
  }

  ctx.fillStyle = '#22d3ee';
  ctx.font = '10px JetBrains Mono, monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`Linear Search: scanned ${Math.min(step + 1, sorted.length)}/${sorted.length} elements`, 8, H - 8);
}

function drawHashmap(ctx: CanvasRenderingContext2D, dataset: number[], target: number, step: number, W: number, H: number) {
  const buckets = 6;
  const bucketH = 28;
  const bucketW = W - 40;
  const startX = 20;
  const startY = 20;

  for (let i = 0; i < buckets; i++) {
    const y = startY + i * (bucketH + 4);
    const val = dataset[i % dataset.length];
    const isTarget = val === target;
    const isActive = step > 0 && i === 0;

    ctx.fillStyle = isTarget && step > 0 ? '#4ade80' : isActive ? '#22d3ee' : '#1a1d2e';
    ctx.shadowColor = isTarget && step > 0 ? '#4ade80' : 'transparent';
    ctx.shadowBlur = isTarget && step > 0 ? 8 : 0;
    ctx.fillRect(startX, y, bucketW, bucketH);
    ctx.shadowBlur = 0;

    ctx.strokeStyle = isTarget && step > 0 ? '#4ade80' : '#2a2d3a';
    ctx.lineWidth = 1;
    ctx.strokeRect(startX, y, bucketW, bucketH);

    ctx.fillStyle = '#6b7280';
    ctx.font = '9px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`[${i}]`, startX + 6, y + bucketH / 2 + 4);

    ctx.fillStyle = isTarget && step > 0 ? '#0f1117' : '#e2e8f0';
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(String(val), startX + bucketW / 2 + 10, y + bucketH / 2 + 4);
  }

  ctx.fillStyle = '#4ade80';
  ctx.font = '10px JetBrains Mono, monospace';
  ctx.textAlign = 'left';
  ctx.fillText(step > 0 ? `HashMap: O(1) direct lookup → found ${target}` : `HashMap: hash(${target}) → bucket index`, 8, H - 8);
}

function drawLinkedList(ctx: CanvasRenderingContext2D, dataset: number[], target: number, step: number, W: number, H: number) {
  const nodeR = 18;
  const spacing = Math.min(60, (W - 40) / dataset.length);
  const startX = 30;
  const y = H / 2;

  dataset.forEach((val, i) => {
    const x = startX + i * spacing;
    const isVisited = i <= step;
    const isCurrent = i === step;
    const isFound = val === target && isVisited;

    // Arrow
    if (i < dataset.length - 1) {
      ctx.beginPath();
      ctx.moveTo(x + nodeR, y);
      ctx.lineTo(x + spacing - nodeR, y);
      ctx.strokeStyle = '#2a2d3a';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#2a2d3a';
      ctx.beginPath();
      ctx.moveTo(x + spacing - nodeR, y - 4);
      ctx.lineTo(x + spacing - nodeR + 6, y);
      ctx.lineTo(x + spacing - nodeR, y + 4);
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(x, y, nodeR, 0, Math.PI * 2);
    ctx.fillStyle = isFound ? '#4ade80' : isCurrent ? '#22d3ee' : isVisited ? '#1e3a2f' : '#1a1d2e';
    ctx.shadowColor = isFound ? '#4ade80' : isCurrent ? '#22d3ee' : 'transparent';
    ctx.shadowBlur = isFound || isCurrent ? 8 : 0;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = isFound ? '#4ade80' : isCurrent ? '#22d3ee' : '#2a2d3a';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = isFound || isCurrent ? '#0f1117' : '#e2e8f0';
    ctx.font = 'bold 10px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(val), x, y);
  });

  ctx.fillStyle = '#22d3ee';
  ctx.font = '10px JetBrains Mono, monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`Linked List: traversed ${Math.min(step + 1, dataset.length)}/${dataset.length} nodes`, 8, H - 8);
}
