import { FieldError } from '../generated/graphqlclt'

// [
//   {field: 'username', message: 'some error'}
// ]
// {
//   username: 'some error'
// }

export const mapFieldErrors = (errors: FieldError[]): { [key: string]: string } => {
	return errors.reduce(
		(accumulatedErrorsObj, error) => ({
			...accumulatedErrorsObj,
			[error.field]: error.message,
		}),
		{}
	)
}
