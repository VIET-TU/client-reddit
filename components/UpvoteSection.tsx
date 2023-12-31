import { PostWithUserInfoFragment, VoteType, useVoteMutation } from '@/generated/graphqlclt'
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { Flex, IconButton } from '@chakra-ui/react'
import { useState } from 'react'

interface UpvoteSectionProps {
	post: PostWithUserInfoFragment
}

enum VoteTypeValues {
	Upvote = 1,
	Downvote = -1,
}

const UpvoteSection = ({ post }: UpvoteSectionProps) => {
	const [loadingState, setLoadingState] = useState<
		'upvote-loading' | 'downvote-loading' | 'not-loading'
	>('not-loading')
	const [vote, { loading }] = useVoteMutation()

	const upvote = async (postId: string) => {
		setLoadingState('upvote-loading')
		try {
			await vote({
				variables: { inputVoteValue: VoteType.Upvote, postId: parseInt(postId) },
			})
			setLoadingState('not-loading')
		} catch (error) {}
	}

	const downvote = async (postId: string) => {
		setLoadingState('downvote-loading')
		try {
			await vote({
				variables: { inputVoteValue: VoteType.Downvote, postId: parseInt(postId) },
			})

			setLoadingState('not-loading')
		} catch (error) {}
	}

	return (
		<Flex direction="column" alignItems="center" mr={4}>
			<IconButton
				icon={<ChevronUpIcon />}
				aria-label="upvote"
				onClick={post.voteType === VoteTypeValues.Upvote ? undefined : upvote.bind(this, post.id)}
				colorScheme={post.voteType === VoteTypeValues.Upvote ? 'green' : undefined}
				isLoading={loading && loadingState === 'upvote-loading'}
			/>
			{post.points}
			<IconButton
				icon={<ChevronDownIcon />}
				aria-label="downvote"
				onClick={
					post.voteType === VoteTypeValues.Downvote ? undefined : downvote.bind(this, post.id)
				}
				colorScheme={post.voteType === VoteTypeValues.Downvote ? 'red' : undefined}
				isLoading={loading && loadingState === 'downvote-loading'}
			/>
		</Flex>
	)
}

export default UpvoteSection
