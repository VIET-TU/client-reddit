import InputFild from '@/components/InputField'
import { Wrapper } from '@/components/Wrapper'
import { ForgotPasswordInput, useForGotPasswordMutation } from '@/generated/graphqlclt'
import useCheckAuth from '@/utils/useCheckAuth'
import { Button, Box, Flex, Spinner } from '@chakra-ui/react'
import { Form, Formik } from 'formik'

const ForgotPassword = () => {
	const initialValues = {
		email: '',
	}
	const { data: authData, loading: authLoading } = useCheckAuth()
	const [forgotPassword, { loading, data }] = useForGotPasswordMutation()
	const onForgotPasswordSubmit = async (values: ForgotPasswordInput) => {
		await forgotPassword({
			variables: { forgotPassowrdInput: values },
		})
	}
	if (authLoading || (!authLoading && authData?.me)) {
		return (
			<Flex justifyContent="center" alignItems="center" minH="100vh">
				<Spinner />
			</Flex>
		)
	} else {
		return (
			<Wrapper>
				<Formik initialValues={initialValues} onSubmit={onForgotPasswordSubmit}>
					{(formik: any) => {
						return !loading && data ? (
							<Box>Please check your inbox</Box>
						) : (
							<Form>
								<InputFild name="email" lable="Email" placeholder="email" type="email"></InputFild>

								<Button
									className="w-full mx-auto"
									type="submit"
									colorScheme="teal"
									mt={4}
									isLoading={formik.isSubmitting}
								>
									Send reset password email
								</Button>
							</Form>
						)
					}}
				</Formik>
			</Wrapper>
		)
	}
}

export default ForgotPassword
