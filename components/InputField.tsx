import { useField } from 'formik'
import { FormControl, FormErrorMessage, FormLabel, Input, Textarea } from '@chakra-ui/react'
import * as React from 'react'

export interface IInputFildProps {
	name: string
	lable: string
	placeholder: string
	type: string
	textarea?: boolean
}

export default function InputFild({ textarea, ...props }: IInputFildProps) {
	const [field, { error }] = useField(props)
	return (
		<>
			<FormControl isInvalid={!!error} className="mt-4">
				<FormLabel htmlFor={field.name}>{props.lable}</FormLabel>
				{textarea ? (
					<Textarea {...field} {...props} id={field.name} />
				) : (
					<Input {...field} {...props} id={field.name} />
				)}
				{error && <FormErrorMessage>{error}</FormErrorMessage>}
			</FormControl>
		</>
	)
}
