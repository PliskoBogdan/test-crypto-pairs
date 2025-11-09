export function useImgFallback(fallback = '/images/wallet.png') {
  return (event: Event) => {
    const target = event.target as HTMLImageElement
    if (target && target.src !== fallback) {
      target.src = fallback
    }
  }
}