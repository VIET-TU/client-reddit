import Layout from '@/components/Layout'
import PostDeleteEditButton from '@/components/PostDeleteEditButton'
import UpvoteSection from '@/components/UpvoteSection'
import { PostsDocument, usePostsQuery } from '@/generated/graphqlclt'
import { addApolloState, initializeApollo } from '@/lib/apolloClient'
import { NetworkStatus } from '@apollo/client'
import { Box, Button, Flex, Heading, Spinner, Stack, Text } from '@chakra-ui/react'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Link from 'next/link'

export const limit = 3
const Main = () => {
	// re-render when delete

	// goi ra tu trong catch
	const { data, loading, fetchMore, networkStatus } = usePostsQuery({
		variables: { limit },
		// componet nao render boi cai Posts query, se render lai khi networkStatus thay doi, tuc la fethMore
		notifyOnNetworkStatusChange: true,
	})

	const loadingMorePosts = networkStatus === NetworkStatus.fetchMore

	const loadMorePosts = () =>
		//	fetchMore la ham goi dung lai postQuery() (bd no se goi vao cache de xem da ton tai data neu chua no se goi xuong apollo server)
		fetchMore({
			variables: { cursor: data?.posts?.cursor },
		})

	return (
		<Layout>
			{loading && !loadingMorePosts ? (
				<Flex justifyContent="center" alignItems="center" minH="100vh">
					<Spinner />
				</Flex>
			) : (
				<Stack spacing={8}>
					{data?.posts?.paginatedPosts?.map((post) => {
						return (
							<Flex key={post.id} p={5} shadow="md" borderWidth="1px">
								<UpvoteSection post={post} />
								<Box flex={1}>
									<Link href={`/post/${post.id}`} passHref legacyBehavior>
										<Heading className="cursor-pointer" fontSize="xl">
											{post.title}
										</Heading>
									</Link>

									<Text>posted by {post.user.username}</Text>
									<Flex align="center">
										<Text mt={4}>{post.textSnippet}</Text>
										<Box ml="auto">
											<PostDeleteEditButton postId={post.id} postUserId={post.user.id} />
										</Box>
									</Flex>
								</Box>
							</Flex>
						)
					})}
				</Stack>
			)}
			{data?.posts?.hasMore && (
				<Flex>
					<Button m="auto" my={8} isLoading={loadingMorePosts} onClick={loadMorePosts}>
						{loadingMorePosts ? 'Loading' : 'Show more'}
					</Button>
				</Flex>
			)}
		</Layout>
	)
}

// export async function getStaticProps() {
// 	const apolloClient = initializeApollo()

// 	// no gui request den sever va   lua gia tri tra ve luu  vao trong catch cua apollo client
// 	await apolloClient.query({
// 		query: PostsDocument,
// 		variables: { limit },
// 	})

// 	return addApolloState(apolloClient, {
// 		props: {},
// 	})
// }

export const getServerSideProps: GetServerSideProps = async (
	context: GetServerSidePropsContext
) => {
	const apolloClient = initializeApollo({ headers: context.req.headers })

	// no gui request den sever va   lua gia tri tra ve luu  vao trong catch cua apollo client
	await apolloClient.query({
		query: PostsDocument,
		variables: { limit },
	})

	return addApolloState(apolloClient, {
		props: {},
	})
}

export default Main
