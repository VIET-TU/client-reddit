import InputFild from '@/components/InputField'
import { Wrapper } from '@/components/Wrapper'
import { LoginInput, useLoginMutation, MeDocument, MeQuery } from '@/generated/graphqlclt'
import { mapFieldErrors } from '@/helpers/mapFieldErros'
import { initializeApollo } from '@/lib/apolloClient'
import useCheckAuth from '@/utils/useCheckAuth'

import { Button, Spinner, useToast } from '@chakra-ui/react'
import { Form, Formik, FormikHelpers } from 'formik'
import Link from 'next/link'
import { useRouter } from 'next/router'

function Login() {
	const router = useRouter()
	const toast = useToast()
	const { data: _authData, loading: authLoading } = useCheckAuth()

	const initialValues: LoginInput = {
		usernameOrEmail: '',
		password: '',
	}
	const [loginUser, { error, loading: _loginUserLoading }] = useLoginMutation()

	const onLoginrSubmit = async (
		value: LoginInput,
		{ setErrors }: FormikHelpers<LoginInput>
	): Promise<boolean | void> => {
		const response = await loginUser({
			variables: {
				loginInput: value,
			},
			update(cache, { data }) {
				if (data?.login.success) {
					cache.writeQuery<MeQuery>({
						query: MeDocument,
						data: { me: data.login.user },
					})
				}
			},
		})
		if (response.data?.login.errors) {
			return setErrors(mapFieldErrors(response.data.login.errors))
		} else if (response.data?.login.user) {
			toast({
				title: 'Welcome',
				description: `${response.data.login.user.username}`,
				status: 'success',
				duration: 9000,
				isClosable: true,
			})

			const apolloClient = initializeApollo()
			apolloClient.resetStore()

			return router.push('/')
		}
	}

	return (
		<div>
			{authLoading ? (
				<div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 ">
					<Spinner className="!w-[80px] !h-[80px] !border-[4px]"></Spinner>
				</div>
			) : (
				<Wrapper>
					{error && <p>Faild to Login </p>}

					<Formik initialValues={initialValues} onSubmit={onLoginrSubmit}>
						{(formik: any) => (
							<Form>
								<InputFild
									name="usernameOrEmail"
									lable="Username Or email"
									placeholder="Username Or email"
									type="text"
								></InputFild>

								<InputFild
									name="password"
									lable="password"
									placeholder="Password"
									type="password"
								></InputFild>
								<Button
									className="w-full mx-auto"
									type="submit"
									colorScheme="teal"
									mt={4}
									isLoading={formik.isSubmitting}
								>
									Login
								</Button>

								<div className="mt-5 font-medium text-blue-600">
									<Link href={'/forgot-password'} legacyBehavior>
										<a>Forgot password</a>
									</Link>
								</div>
							</Form>
						)}
					</Formik>
				</Wrapper>
			)}
		</div>
	)
}

export default Login
