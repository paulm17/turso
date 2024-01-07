import { Controller } from "react-hook-form"
import { TextInput } from "@raikou/client"
import { ControlProps } from "../types"

interface FormInput
  extends ControlProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  name: string
}

function FormInput({ control, name, ...props }: FormInput) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur, ref } }) => (
        <TextInput
          autoComplete="off"
          ref={ref}
          name={name}
          value={value}
          onBlur={onBlur}
          onChange={event => onChange(event.currentTarget.value)}
          {...props}
        />
      )}
      defaultValue=""
    />
  )
}

export default FormInput
