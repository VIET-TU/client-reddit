import InputFild from '@/components/InputField'
import { Wrapper } from '@/components/Wrapper'
import {
	ChangePasswordInput,
	MeDocument,
	MeQuery,
	User,
	useChangePasswordMutation,
} from '@/generated/graphqlclt'
import { Form, Formik, FormikHelpers } from 'formik'
import router, { useRouter } from 'next/router'
import { Button, Alert, AlertIcon, AlertTitle } from '@chakra-ui/react'

import React, { useState } from 'react'
import { mapFieldErrors } from '@/helpers/mapFieldErros'
import Link from 'next/link'

const ChangePassword = () => {
	const { query } = useRouter()

	const initialValues: ChangePasswordInput = { newPassword: '' }
	const [changePassword, _] = useChangePasswordMutation()
	const [tokenError, setTokenError] = useState('')

	const onLoginrSubmit = async (
		values: ChangePasswordInput,
		{ setErrors }: FormikHelpers<ChangePasswordInput>
	) => {
		if (query.userId && query.token) {
			const response = await changePassword({
				variables: {
					userId: query.userId as string,
					token: query.token as string,
					changePasswordInput: { newPassword: values.newPassword },
				},
				update(cache, { data }) {
					if (data?.changePassword.success) {
						cache.writeQuery<MeQuery>({
							query: MeDocument,
							data: { me: data.changePassword.user as User },
						})
					}
				},
			})
			if (response.data?.changePassword.errors) {
				const fieldErrors = mapFieldErrors(response.data.changePassword.errors)
				if ('token' in fieldErrors) {
					setTokenError(fieldErrors.token)
				}
				setErrors(fieldErrors)
			} else if (response.data?.changePassword.user) {
				router.push('/')
			}
		}
	}
	return (
		<>
			{!query.token || !query.userId ? (
				<Wrapper>
					<Alert status="error">
						<AlertIcon />
						<AlertTitle>Invalid password change request!</AlertTitle>
					</Alert>
					<div>
						<div>{tokenError}</div>
						<div className="mt-5 font-medium text-blue-600">
							<Link href={'/forgot-password'} legacyBehavior>
								<a>Go to Forgot password</a>
							</Link>
						</div>
					</div>
				</Wrapper>
			) : (
				<Wrapper>
					<Formik initialValues={initialValues} onSubmit={onLoginrSubmit}>
						{(formik: any) => (
							<Form>
								<InputFild
									name="newPassword"
									lable="New password"
									placeholder="New password"
									type="text"
								></InputFild>
								{tokenError && (
									<div>
										<div>{tokenError}</div>
										<div className="mt-5 font-medium text-blue-600">
											<Link href={'/forgot-password'} legacyBehavior>
												<a>Go to Forgot password</a>
											</Link>
										</div>
									</div>
								)}

								<Button
									className="w-full mx-auto"
									type="submit"
									colorScheme="teal"
									mt={4}
									isLoading={formik.isSubmitting}
								>
									Submit
								</Button>
							</Form>
						)}
					</Formik>
				</Wrapper>
			)}
		</>
	)
}

export default ChangePassword
