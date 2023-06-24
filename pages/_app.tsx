import { useApollo } from '@/lib/apolloClient'
import { ApolloProvider } from '@apollo/client'
import { ChakraProvider } from '@chakra-ui/react'
import { AppProps } from 'next/app'
import './index.css'

// const client = new ApolloClient({
// 	uri: 'http://localhost:4000/graphql',
// 	cache: new InMemoryCache(),
// 	credentials: 'include',
// })

export default function MyApp({ Component, pageProps }: AppProps) {
	const apolloClient = useApollo(pageProps)
	return (
		<ApolloProvider client={apolloClient}>
			<ChakraProvider resetCSS>
				<div className="relative min-h-screen">
					<Component {...pageProps} />
				</div>
			</ChakraProvider>
		</ApolloProvider>
	)
}
