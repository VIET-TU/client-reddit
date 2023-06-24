import InputFild from '@/components/InputField'
import { Wrapper } from '@/components/Wrapper'
import { MeDocument, MeQuery, RegisterInput, useRegisterMutation } from '@/generated/graphqlclt'
import { mapFieldErrors } from '@/helpers/mapFieldErros'
import useCheckAuth from '@/utils/useCheckAuth'

import { Button, FormControl, Spinner, Toast } from '@chakra-ui/react'
import { Form, Formik, FormikHelpers } from 'formik'
import { useRouter } from 'next/router'

function Register() {
	const router = useRouter()
	const { data: _authData, loading: authLoading } = useCheckAuth()

	const initialValues: RegisterInput = {
		username: '',
		password: '',
		email: '',
	}
	const [registerUser, { data, error, loading: _registerUserLoading }] = useRegisterMutation()

	const onRegisterSubmit = async (
		value: RegisterInput,
		{ setErrors }: FormikHelpers<RegisterInput>
	) => {
		const response = await registerUser({
			variables: {
				registerInput: value,
			},
			update(cache, { data }) {
				if (data?.register.success) {
					cache.writeQuery<MeQuery>({
						query: MeDocument,
						data: { me: data.register.user },
					})
				}
			},
		})
		if (response.data?.register.errors) {
			return setErrors(mapFieldErrors(response.data.register.errors))
		} else if (response.data?.register.user) {
			Toast({
				title: 'Welcome',
				description: `${response.data.register.user.username}`,
				status: 'success',
				duration: 9000,
				isClosable: true,
			})
			return router.push('/')
		}
	}
	return (
		<>
			{authLoading ? (
				<div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 ">
					<Spinner className="!w-[80px] !h-[80px] !border-[4px]"></Spinner>
				</div>
			) : (
				<Wrapper>
					{error && <p>Faidl to register </p>}
					{data && data.register.success && <p>Register successfully</p>}
					<Formik initialValues={initialValues} onSubmit={onRegisterSubmit}>
						{(formik: any) => (
							<Form>
								<FormControl>
									<InputFild
										name="username"
										lable="username"
										placeholder="Username"
										type="text"
									></InputFild>
									<InputFild
										name="email"
										lable="email"
										placeholder="Email"
										type="email"
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
										Register
									</Button>
								</FormControl>
							</Form>
						)}
					</Formik>
				</Wrapper>
			)}
		</>
	)
}

export default Register
