import { useMeQuery } from '@/generated/graphqlclt'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function useCheckAuth() {
	const router = useRouter()
	const { data, loading } = useMeQuery()
	useEffect(() => {
		if (!loading) {
			if (
				data?.me &&
				(router.route === '/login' ||
					router.route === '/register' ||
					router.route === '/forgot-password' ||
					router.route === '/change-password')
			) {
				router.replace('/')
			} else if (!data?.me && router.route !== '/login' && router.route !== '/register') {
				router.replace('/login')
			}
		}
	}, [data, loading, router])
	return { data, loading }
}
