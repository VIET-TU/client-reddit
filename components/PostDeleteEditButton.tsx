import { PaginatedPosts, useDeletePostMutation, useMeQuery } from '@/generated/graphqlclt'
import { Reference } from '@apollo/client'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { Box, IconButton } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface IPostDeleteEditButtonProps {
	postId: string
	postUserId: string
}

const PostDeleteEditButton = ({ postId, postUserId }: IPostDeleteEditButtonProps) => {
	const router = useRouter()
	const { data: meData } = useMeQuery()
	const [deletePost, { loading }] = useDeletePostMutation()
	const onPostDelete = async (postId: string) => {
		await deletePost({
			variables: { id: postId },
			update(cache, { data }) {
				if (data?.deletePost.success) {
					cache.modify({
						fields: {
							posts(
								existing: Pick<
									PaginatedPosts,
									'__typename' | 'hasMore' | 'totalCount' | 'cursor'
								> & { paginatedPosts: Reference[] }
							) {
								const newPostAfterDeletion = {
									...existing,
									totalCount: existing.totalCount - 1,
									paginatedPosts: existing.paginatedPosts.filter(
										(postRefObject: { __ref: string }) => postRefObject.__ref !== `Post:${postId}`
									),
								}
								return newPostAfterDeletion
							},
						},
					})
				}
			},
		})
		if (router.route !== '') router.push('/')
	}

	if (loading) return <>loading</>

	if (meData?.me?.id !== postUserId) return null

	return (
		<Box>
			<Link href={`/post/edit/${postId}`}>
				<IconButton icon={<EditIcon />} aria-label="edit" mr={4} />
			</Link>

			<IconButton
				icon={<DeleteIcon />}
				aria-label="delete"
				colorScheme="red"
				onClick={onPostDelete.bind(this, postId)}
			/>
		</Box>
	)
}

export default PostDeleteEditButton
