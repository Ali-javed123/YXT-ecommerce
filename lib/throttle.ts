// import { useRef, useCallback } from "react"

// export function useThrottle<T extends (...args: any[]) => void>(fn: T, delay = 500) {
//   const lastCall = useRef(0)
//   const fnRef = useRef(fn)
//   fnRef.current = fn // hamesha latest function use ho

//   return useCallback((...args: Parameters<T>) => {
//     const now = Date.now()
//     if (now - lastCall.current >= delay) {
//       lastCall.current = now
//       fnRef.current(...args)
//     }
//   }, [delay])
// }
import { useRef, useCallback, useEffect } from "react"

export function useThrottle<T extends (...args: any[]) => void>(fn: T, delay = 2000) {
  const lastCall = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fnRef = useRef(fn)
  fnRef.current = fn // hamesha latest function use ho

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()
      const remaining = delay - (now - lastCall.current)

      if (remaining <= 0) {
        // delay guzar chuka hai, foran chalao
        if (timer.current) {
          clearTimeout(timer.current)
          timer.current = null
        }
        lastCall.current = now
        fnRef.current(...args)
      } else if (!timer.current) {
        // trailing call: aakhri event miss na ho
        timer.current = setTimeout(() => {
          lastCall.current = Date.now()
          timer.current = null
          fnRef.current(...args)
        }, remaining)
      }
    },
    [delay]
  )
}