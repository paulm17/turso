import { Controller } from "react-hook-form"
import { Select } from "@raikou/client"
import { ControlProps } from "../types"

interface formSelectProps extends ControlProps {
  data: any
}

function FormSelect({ control, data }: formSelectProps) {
  return (
    <Controller
      control={control}
      name="active"
      render={({ field: { value, onChange } }) => (
        <Select value={value} onChange={onChange} data={data} />
      )}
    />
  )
}

export default FormSelect
