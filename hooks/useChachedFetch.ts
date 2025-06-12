import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from "react"


type FetchFunction<T> = () => Promise<T>
type UseCachedRequestResult<T> = {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => void
}

type UseCachedRequestOptions<T> = {
  onSuccess?: (data: T) => void
}

export function useCachedRequest<T>(
  key: string,
  fetchFn: FetchFunction<T>,
  options: UseCachedRequestOptions<T> = {}
): UseCachedRequestResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  console.log("🚀 ~ error:", error)

  const loadData = async () => {
    setLoading(true)
    try {
      const result = await fetchFn()
      setData(result)
      await AsyncStorage.setItem(key, JSON.stringify(result))
      setError(null)
            const cached = await AsyncStorage.getItem(key)
      console.log("🚀 ~ loadData ~ cached:", cached)
      options.onSuccess?.(result) // panggil onSuccess jika disediakan
    } catch (err: any) {
      setError(err)
      const cached = await AsyncStorage.getItem(key)
      console.log("🚀 ~ loadData ~ cached:", cached)
      if (cached) {
        const parsed = JSON.parse(cached)
        setData(parsed)
        options.onSuccess?.(parsed) // panggil juga saat fallback ke cache
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [key])

  return { data, loading, error, refetch: loadData }
}
