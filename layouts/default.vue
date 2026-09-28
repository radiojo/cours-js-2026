<template>
  <div class="slidev-layout default">
    <slot />
    <div class="slide-number" aria-label="numéro de la diapositive">
      <SlideCurrentNo /> / <SlidesTotal />
    </div>
  </div>
</template>

<style>
.slide-number {
  position: absolute;
  right: 1.5rem;
  bottom: 1rem;
  z-index: 10;
  color: rgb(244 247 251 / 60%);
  font-family: 'Atkinson Hyperlegible Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.04em;
}
</style>

