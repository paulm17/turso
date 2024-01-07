import { Textarea } from "@raikou/client"
import { Control, Controller } from "react-hook-form"

interface textAreaProps {
  name: string
  control: Control<any, any>
  placeholder?: string
  maxLength?: number
}

function FormDescription({
  name,
  control,
  placeholder,
  maxLength,
}: textAreaProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <Textarea
          maxLength={maxLength}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
      defaultValue=""
    />
  )
}

export default FormDescription
