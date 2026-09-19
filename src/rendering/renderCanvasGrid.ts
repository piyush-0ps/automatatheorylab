/**
 * Contains native canvas sizing and grid-painting operations.
 *
 * Keeping these operations outside React makes the rendering behavior easier
 * to test and prevents UI components from mixing lifecycle management with
 * pixel-level drawing instructions.
 */

const GRID_SPACING_PX = 24
const GRID_DOT_RADIUS_PX = 1
const GRID_DOT_COLOR = '#cbd5e1'
const MAX_DEVICE_PIXEL_RATIO = 2
const FULL_CIRCLE_RADIANS = Math.PI * 2

/**
 * Paints regularly spaced dots across the logical canvas area.
 *
 * The rendering context is expected to have its transform configured for the
 * current device pixel ratio before this function runs.
 *
 * @param context - The two-dimensional context that receives the grid paths.
 * @param width - The canvas display width in CSS pixels.
 * @param height - The canvas display height in CSS pixels.
 * @returns Nothing. The supplied context is painted as a side effect.
 */
function drawGrid(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  context.fillStyle = GRID_DOT_COLOR

  for (
    let horizontalPosition = 0;
    horizontalPosition <= width;
    horizontalPosition += GRID_SPACING_PX
  ) {
    for (
      let verticalPosition = 0;
      verticalPosition <= height;
      verticalPosition += GRID_SPACING_PX
    ) {
      context.beginPath()
      context.arc(
        horizontalPosition,
        verticalPosition,
        GRID_DOT_RADIUS_PX,
        0,
        FULL_CIRCLE_RADIANS,
      )
      context.fill()
    }
  }
}

/**
 * Sizes a native canvas for its display density and renders its dot grid.
 *
 * The canvas backing buffer is matched to its CSS dimensions and scaled for
 * high-density displays. Pixel ratio is capped to prevent unnecessarily large
 * buffers on very dense screens. Any existing pixels are cleared before the
 * grid is repainted.
 *
 * @param canvas - The native canvas whose displayed bounds determine the
 * logical drawing area and whose backing buffer will be resized.
 * @param context - The two-dimensional context obtained from the same canvas.
 * It is transformed, cleared, and painted by this operation.
 * @returns Nothing. The canvas dimensions and rendered pixels are updated as
 * side effects.
 *
 * @example
 * ```ts
 * const canvas = document.querySelector('canvas')
 * const context = canvas?.getContext('2d')
 *
 * if (canvas && context) {
 *   renderCanvasGrid(canvas, context)
 * }
 * ```
 */
export function renderCanvasGrid(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
): void {
  const { width, height } = canvas.getBoundingClientRect()
  const devicePixelRatio = Math.min(
    window.devicePixelRatio,
    MAX_DEVICE_PIXEL_RATIO,
  )

  canvas.width = Math.max(1, Math.round(width * devicePixelRatio))
  canvas.height = Math.max(1, Math.round(height * devicePixelRatio))

  context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
  context.clearRect(0, 0, width, height)
  drawGrid(context, width, height)
}
