import InputFild from '@/components/InputField'
import Layout from '@/components/Layout'
import { CreatePostInput, useCreatePostMutation } from '@/generated/graphqlclt'
import useCheckAuth from '@/utils/useCheckAuth'
import { Box, Button, Flex, Spinner } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import Link from 'next/link'
import router from 'next/router'

const CreatePost = () => {
	const { data: authData, loading: authLoading } = useCheckAuth()

	const initialValues = { title: '', text: '' }

	const [createPost, _] = useCreatePostMutation()

	const onCreatePostSubmit = async (values: CreatePostInput) => {
		await createPost({
			variables: { createPostInput: values },
			update(cache, { data }) {
				// cu dam quyen nang nhat khi lam viec voi cache
				// vuot qua tat ca moi thu - modify de len ham cache
				cache.modify({
					fields: {
						posts(existing) {
							console.log('existing :>> ', existing)
							if (data?.createPost.success && data.createPost.post) {
								// Post:new_id
								const newPostRef = cache.identify(data.createPost.post)
								console.log('NEW POST REF :>> ', newPostRef)

								const newPostsAfterCreation = {
									...existing,
									totalCount: existing.totalCount + 1,
									paginatedPosts: [
										{ __ref: newPostRef },
										...existing.paginatedPosts, // [{__ref: 'Post:1'}, {__ref: 'Post:2'}]
									],
								}
								console.log('NEW POSTS AFTER CREATION :>> ', newPostsAfterCreation)
								return newPostsAfterCreation
							}
						},
					},
				})
			},
		})
		router.push('/')
	}

	if (authLoading || (!authLoading && !authData?.me)) {
		return (
			<Flex justifyContent="center" alignItems="center" minH="100vh">
				<Spinner />
			</Flex>
		)
	} else {
		return (
			<Layout>
				<Formik initialValues={initialValues} onSubmit={onCreatePostSubmit}>
					{({ isSubmitting }) => (
						<Form>
							<InputFild name="title" placeholder="Title" lable="Title" type="text" />

							<Box mt={4}>
								<InputFild
									textarea={true}
									name="text"
									placeholder="Text"
									lable="Text"
									type="textarea"
								/>
							</Box>

							<Flex justifyContent="space-between" alignItems="center" mt={4}>
								<Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
									Create Post
								</Button>
								<Link href="/" passHref legacyBehavior>
									<Button>Go back to Homepage</Button>
								</Link>
							</Flex>
						</Form>
					)}
				</Formik>
			</Layout>
		)
	}
}

export default CreatePost
