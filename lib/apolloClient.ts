import { useMemo } from 'react'
import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject, from } from '@apollo/client'
import merge from 'deepmerge'
import isEqual from 'lodash/isEqual'
import { Post } from '@/generated/graphqlclt'
import { IncomingHttpHeaders } from 'http'
import fetch from 'isomorphic-unfetch'
import { onError } from '@apollo/client/link/error'
import Router from 'next/router'

// Trong thư viện "isomorphic-unfetch", fetch là một phương thức được sử dụng để thực hiện các yêu cầu HTTP từ phía máy khách (client) hoặc máy chủ (server) trong môi trường "isomorphic" (cùng hoạt động trên cả hai môi trường). Điều này cho phép viết mã JavaScript chung có thể chạy trên cả trình duyệt và máy chủ mà không cần thay đổi.

// Sự khác biệt chính giữa isomorphic-unfetch và fetch tiêu chuẩn của trình duyệt là isomorphic-unfetch cho phép chạy trên cả môi trường máy chủ và môi trường trình duyệt, trong khi fetch tiêu chuẩn chỉ hoạt động trên trình duyệt. Điều này rất hữu ích khi bạn muốn chia sẻ code HTTP giữa phía máy khách và máy chủ trong ứng dụng web đa nền tảng.

// >>> feth mac dinh chi chay tren mt client
// >>> fetch cua isomorphic-unfetch chay ca tren moi truowng client va server

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

let apolloClient: ApolloClient<NormalizedCacheObject>

const errorLink = onError((errors) => {
	console.log('errors :>> ', errors)
	if (
		errors.graphQLErrors &&
		errors.graphQLErrors[0].extensions?.code === 'UNAUTHENTICATED' &&
		errors.response
	) {
		errors.response = undefined
		Router.push('/login')
	}
})

function createApolloClient(headers: IncomingHttpHeaders | null = null) {
	const enhancedFetch = (url: RequestInfo, init: RequestInit) => {
		return fetch(url, {
			...init,
			headers: {
				...init.headers,
				'Access-Control-Allow-Origin': '*',
				// here we pass the cookie along for each request
				Cookie: headers?.cookie ?? '',
			},
		})
	}

	const httpLink = new HttpLink({
		uri: 'https://reddit-4kd0.onrender.com/graphql', // Server URL (must be absolute)
		credentials: 'include', // Additional fetch() options like `credentials` or `headers`
		fetch: enhancedFetch,
	})

	return new ApolloClient({
		ssrMode: typeof window === 'undefined',
		link: from([errorLink, httpLink]),
		cache: new InMemoryCache({
			typePolicies: {
				Query: {
					fields: {
						posts: {
							keyArgs: false,
							// dc goi moi khi posts nhan dc data moi(vi no ko luu vao cache len phai dung ham merger)
							// merge thay doi cache khi co them post moi
							merge(existing, incoming) {
								console.log('existing :>> ', existing)
								console.log('incoming :>> ', incoming)
								let paginatedPosts: Post[] = []
								if (existing && existing.paginatedPosts) {
									paginatedPosts = paginatedPosts.concat(existing?.paginatedPosts)
								}
								if (incoming && incoming.paginatedPosts) {
									paginatedPosts = paginatedPosts.concat(incoming?.paginatedPosts)
								}

								return { ...incoming, paginatedPosts }
							},
						},
					},
				},
			},
		}),
	})
}

export function initializeApollo(
	{
		headers,
		initialState,
	}: {
		headers?: IncomingHttpHeaders | null
		initialState?: NormalizedCacheObject | null
	} = { headers: null, initialState: null }
) {
	const _apolloClient = apolloClient ?? createApolloClient(headers)

	// If your page has Next.js data fetching methods that use Apollo Client, the initial state
	// gets hydrated here
	if (initialState) {
		// Get existing cache, loaded during client side data fetching
		const existingCache = _apolloClient.extract()

		// Merge the existing cache into data passed from getStaticProps/getServerSideProps
		const data = merge(initialState, existingCache, {
			// combine arrays using object equality (like in sets)
			arrayMerge: (destinationArray, sourceArray) => [
				...sourceArray,
				...destinationArray.filter((d) => sourceArray.every((s) => !isEqual(d, s))),
			],
		})

		// Restore the cache with the merged data
		_apolloClient.cache.restore(data)
	}
	// For SSG and SSR always create a new Apollo Client
	if (typeof window === 'undefined') return _apolloClient
	// Create the Apollo Client once in the client
	if (!apolloClient) apolloClient = _apolloClient

	return _apolloClient
}

export function addApolloState(
	client: ApolloClient<NormalizedCacheObject>,
	pageProps: { props: { [x: string]: NormalizedCacheObject } }
) {
	if (pageProps?.props) {
		pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
	}

	return pageProps
}

export function useApollo(pageProps: { [x: string]: NormalizedCacheObject }) {
	const state = pageProps[APOLLO_STATE_PROP_NAME]
	const store = useMemo(() => initializeApollo({ initialState: state }), [state])
	return store
}
