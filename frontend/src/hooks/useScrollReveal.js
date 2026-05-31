import { useEffect } from 'react'

export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )

    // Observe existing elements
    const observe = () =>
      document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el))

    observe()

    return () => observer.disconnect()
  }, [])
}
