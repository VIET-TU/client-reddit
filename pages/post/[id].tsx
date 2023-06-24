import Layout from '@/components/Layout'
import {
	PostDocument,
	PostIdsDocument,
	PostIdsQuery,
	PostQuery,
	usePostQuery,
} from '@/generated/graphqlclt'
import { useRouter } from 'next/router'
import { Button, Alert, AlertIcon, AlertTitle, Box, Heading, Flex, Spinner } from '@chakra-ui/react'
import { limit } from '@/pages/index'
import React from 'react'
import Link from 'next/link'
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next'
import { addApolloState, initializeApollo } from '@/lib/apolloClient'
import PostDeleteEditButton from '@/components/PostDeleteEditButton'

const Post = () => {
	const router = useRouter()
	const { data, loading, error } = usePostQuery({
		variables: { id: router.query.id as string },
	})

	if (loading)
		return (
			<Layout>
				<Flex justifyContent="center" alignItems="center" minH="100vh">
					<Spinner />
				</Flex>
			</Layout>
		)

	if (error || !data?.post)
		return (
			<Layout>
				<Alert status="error">
					<AlertIcon />
					<AlertTitle>{error ? error.message : 'Post not found'}</AlertTitle>
				</Alert>
				<Box mt={4}>
					<Link href="/" passHref legacyBehavior>
						<Button>Back to Homepage</Button>
					</Link>
				</Box>
			</Layout>
		)

	return (
		<Layout>
			<Heading mb={4}>{data.post.title}</Heading>
			<Box mb={4}>{data.post.text}</Box>
			<Flex justifyContent="space-between" alignItems="center">
				<PostDeleteEditButton postId={data.post.id} postUserId={data.post.userId.toString()} />
				<Link href="/" passHref legacyBehavior>
					<Button>Back to Homepage</Button>
				</Link>
			</Flex>
		</Layout>
	)
}

export const getStaticPaths: GetStaticPaths = async () => {
	const apolloClient = initializeApollo()

	const { data } = await apolloClient.query<PostIdsQuery>({
		query: PostIdsDocument,
		variables: { limit },
	})
	return {
		paths: data.posts!.paginatedPosts.map((post) => ({ params: { id: `${post?.id}` } })),
		fallback: 'blocking',
	}
}

export const getStaticProps: GetStaticProps<{ [key: string]: any }, { id: string }> = async ({
	params,
}: GetStaticPropsContext) => {
	const apolloClient = initializeApollo()

	await apolloClient.query<PostQuery>({
		query: PostDocument,
		variables: { id: params?.id },
	})

	return addApolloState(apolloClient, {
		props: {},
	})
}

export default Post
