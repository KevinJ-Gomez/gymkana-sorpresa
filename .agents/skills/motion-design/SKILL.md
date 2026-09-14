---
name: motion-design
description: Diseña e implementa motion/animación con propósito, accesibilidad y performance.
---
# Motion design

`MOTION_WITHOUT_PURPOSE = NOISE` · `MOTION_DIRECTION != ANIMATION_LIBRARY` · `CHEAPEST_CAPABLE_ANIMATION_PRIMITIVE_FIRST` · `REDUCED_MOTION_IS_PRODUCT_STATE`.

Define problema, continuidad, origen, feedback in-place, frecuencia, reduced-motion y evidencia antes de tecnología.
Escalera: CSS -> WAAPI/View Transitions -> Motion -> GSAP -> Lottie lineal -> Rive interactivo/state machine -> 3D solo si lo requiere. Remotion = vídeo/motion graphics renderizado, no microinteracción normal.

Preferir transform/opacity; no `transition: all`; pausar loops fuera de vista; probar interrupción/touch; motion nunca único portador de estado.
