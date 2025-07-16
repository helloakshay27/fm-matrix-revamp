import { useMemo } from 'react'
import { API_CONFIG, getFullUrl, getAuthHeader } from '@/config/apiConfig'

export const useApiConfig = () => {
  const config = useMemo(() => ({
    baseUrl: API_CONFIG.BASE_URL,
    token: API_CONFIG.TOKEN,
    endpoints: API_CONFIG.ENDPOINTS,
    getFullUrl,
    getAuthHeader,
  }), [])

  return config
}

export default useApiConfig