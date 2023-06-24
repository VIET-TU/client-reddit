import { MeDocument, MeQuery, useLogoutMutation, useMeQuery } from '@/generated/graphqlclt'
import { Reference, gql } from '@apollo/client'
import { Button, Flex } from '@chakra-ui/react'
import Link from 'next/link'

export interface INavbarProps {}

export default function Navbar(props: INavbarProps) {
	const { data, loading: useMeQueryLoading } = useMeQuery()
	const [logout, { loading: logoutLoading }] = useLogoutMutation()

	const logoutUser = async () => {
		await logout({
			update(cache, { data }) {
				if (data?.logout) {
					cache.writeQuery<MeQuery>({
						query: MeDocument,
						data: { me: null },
					})
					cache.modify({
						fields: {
							posts(existing) {
								existing.paginatedPosts.forEach((post: Reference) => {
									cache.writeFragment({
										id: post.__ref, // Post:17
										fragment: gql`
											fragment VoteType on Post {
												voteType
											}
										`,
										data: {
											voteType: 0,
										},
									})
								})
								return existing
							},
						},
					})
				}
			},
		})
	}

	let body
	if (useMeQueryLoading) {
		body = null
	} else if (!data?.me) {
		body = (
			<>
				<Link passHref href="/register" legacyBehavior>
					<Button>Register</Button>
				</Link>
				<Link passHref href="/login" legacyBehavior>
					<Button>Login</Button>
				</Link>
			</>
		)
	} else {
		body = (
			<Flex>
				<Link href={'/create-post'} legacyBehavior passHref>
					<Button mr={4}>Create Post</Button>
				</Link>
				<Button onClick={logoutUser} isLoading={logoutLoading}>
					Logout
				</Button>
			</Flex>
		)
	}
	return (
		<div className="bg-yellow-500 ">
			<div className="w-[60%] flex justify-between mx-auto h-[60px] items-center px-[20px]">
				<div>
					<Link passHref href="/" legacyBehavior>
						<a className="text-[40px] font-bold">Reddit</a>
					</Link>
				</div>
				<div className="text-[18px]  flex gap-[10px] font-medium">{body}</div>
			</div>
		</div>
	)
}
