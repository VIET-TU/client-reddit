import InputFild from '@/components/InputField'
import Layout from '@/components/Layout'
import {
	UpdatePostInput,
	useMeQuery,
	usePostQuery,
	useUpdatePostMutation,
} from '@/generated/graphqlclt'
import { Flex, Spinner, Alert, AlertTitle, AlertIcon, Box, Button } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import Link from 'next/link'
import { useRouter } from 'next/router'

const PostEdit = () => {
	const router = useRouter()
	const postId = router.query.id as string
	const { data: meData, loading: meLoading } = useMeQuery()

	const { data: postData, loading: postLoading } = usePostQuery({
		variables: { id: postId },
		// fetchPolicy: 'no-cache',
	})

	const [updatePost, _] = useUpdatePostMutation()

	const onUpdatePostSubmit = async (values: Omit<UpdatePostInput, 'id'>) => {
		await updatePost({
			variables: {
				updatePostInput: {
					id: postId,
					...values,
				},
			},
		})
		router.back()
	}

	if (meLoading || postLoading)
		return (
			<Layout>
				<Flex justifyContent="center" alignItems="center" minH="100vh">
					<Spinner />
				</Flex>
			</Layout>
		)

	if (!postData?.post)
		return (
			<Layout>
				<Alert status="error">
					<AlertIcon />
					<AlertTitle>Post not found</AlertTitle>
				</Alert>
				<Box mt={4}>
					<Link href="/">
						<Button>Back to Homepage</Button>
					</Link>
				</Box>
			</Layout>
		)

	if (meData?.me?.id !== postData?.post?.userId.toString())
		return (
			<Layout>
				<Alert status="error">
					<AlertIcon />
					<AlertTitle>Unauthozation</AlertTitle>
				</Alert>
				<Box mt={4}>
					<Link href="/" passHref legacyBehavior>
						<Button>Back to Homepage</Button>
					</Link>
				</Box>
			</Layout>
		)

	const initialValues = {
		title: postData.post.title,
		text: postData.post.text,
	}

	return (
		<Layout>
			<Formik initialValues={initialValues} onSubmit={onUpdatePostSubmit}>
				{({ isSubmitting }) => (
					<Form>
						<InputFild name="title" placeholder="Title" lable="Title" type="text" />

						<Box mt={4}>
							<InputFild textarea name="text" placeholder="Text" lable="Text" type="textarea" />
						</Box>

						<Flex justifyContent="space-between" alignItems="center" mt={4}>
							<Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
								Update Post
							</Button>
							<Link href="/" passHref legacyBehavior>
								<Button>Back to Homepage</Button>
							</Link>
						</Flex>
					</Form>
				)}
			</Formik>
		</Layout>
	)
}

export default PostEdit
