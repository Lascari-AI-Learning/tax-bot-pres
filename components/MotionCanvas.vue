<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount} from 'vue';

const props = withDefaults(
  defineProps<{
    src: string;
    width?: number;
    height?: number;
    variables?: Record<string, any>;
  }>(),
  {
    width: 1920,
    height: 1080,
  },
);

const container = ref<HTMLDivElement>();
let player: HTMLElement | null = null;
let blobUrl: string | null = null;
let readyObserver: MutationObserver | null = null;
let visibilityObserver: IntersectionObserver | null = null;
let playerReady = false;
let hasPlayedOnce = false;

function clickToPlay() {
  if (!player) return;
  const sr = player.shadowRoot;
  if (!sr) return;
  const overlay = sr.querySelector('.overlay');
  if (!overlay) return;
  overlay.dispatchEvent(new MouseEvent('click', {bubbles: true}));
}

function resetAndPlay() {
  if (!player || !playerReady) return;
  const mcPlayer = (player as any)?.player;
  if (mcPlayer) {
    mcPlayer.requestSeek(0);
    mcPlayer.togglePlayback(true);
  }
}

function pause() {
  if (!player || !playerReady) return;
  const mcPlayer = (player as any)?.player;
  if (mcPlayer) {
    mcPlayer.togglePlayback(false);
  }
}

onMounted(async () => {
  await import('@motion-canvas/player');

  if (!container.value) return;

  const base = import.meta.env.BASE_URL || '/';
  const resolvedSrc = /^(https?:)?\/\//.test(props.src)
    ? props.src
    : props.src.startsWith('/')
      ? base.replace(/\/$/, '') + props.src
      : props.src;
  const response = await fetch(resolvedSrc);
  const text = await response.text();
  const blob = new Blob([text], {type: 'application/javascript'});
  blobUrl = URL.createObjectURL(blob);

  player = document.createElement('motion-canvas-player');

  if (props.variables) {
    player.setAttribute('variables', JSON.stringify(props.variables));
  }

  player.style.width = '100%';
  player.style.display = 'block';

  container.value.appendChild(player);

  // Inject CSS into shadow DOM to hide controls unless hovered
  const shadowRoot = player.shadowRoot;
  if (shadowRoot) {
    const style = document.createElement('style');
    style.textContent = `
      .overlay {
        opacity: 0 !important;
        transition: opacity 0.2s ease !important;
        pointer-events: none;
      }
      :host(:hover) .overlay {
        opacity: 1 !important;
        pointer-events: auto;
      }
    `;
    shadowRoot.appendChild(style);
  }
  if (shadowRoot) {
    const overlay = shadowRoot.querySelector('.overlay');
    if (overlay) {
      readyObserver = new MutationObserver(() => {
        if (overlay.classList.contains('state-ready')) {
          readyObserver?.disconnect();
          readyObserver = null;

          const mcPlayer = (player as any)?.player;
          if (mcPlayer?.toggleLoop) {
            mcPlayer.toggleLoop(false);
          }

          playerReady = true;
          // Don't auto-play — let the visibility observer handle it
        }
      });
      readyObserver.observe(overlay, {attributes: true, attributeFilter: ['class']});
    }
  }

  player.setAttribute('src', blobUrl);

  // Use IntersectionObserver to detect when the slide is actually visible.
  // Slidev uses a horizontal scroll/transform layout — threshold 0.5 means
  // the animation container must be at least 50% visible to trigger.
  visibilityObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          // Slide became visible
          if (!playerReady) {
            // Player not ready yet — wait for it, then play
            const waitForReady = setInterval(() => {
              if (playerReady) {
                clearInterval(waitForReady);
                if (hasPlayedOnce) {
                  resetAndPlay();
                } else {
                  hasPlayedOnce = true;
                  clickToPlay();
                }
              }
            }, 50);
            // Safety: stop polling after 10s
            setTimeout(() => clearInterval(waitForReady), 10000);
          } else if (hasPlayedOnce) {
            resetAndPlay();
          } else {
            hasPlayedOnce = true;
            clickToPlay();
          }
        } else {
          // Slide left viewport — pause
          pause();
        }
      }
    },
    {threshold: 0.5},
  );
  visibilityObserver.observe(container.value);
});

onBeforeUnmount(() => {
  readyObserver?.disconnect();
  readyObserver = null;
  visibilityObserver?.disconnect();
  visibilityObserver = null;
  if (player && container.value) {
    container.value.removeChild(player);
    player = null;
  }
  if (blobUrl) {
    URL.revokeObjectURL(blobUrl);
    blobUrl = null;
  }
});
</script>

<template>
  <div ref="container" class="motion-canvas-wrapper" />
</template>

<style scoped>
.motion-canvas-wrapper {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  background: #0f0f0f;
  aspect-ratio: 16 / 9;
}
</style>
