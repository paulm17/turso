import { Controller } from "react-hook-form"
import { Switch } from "@raikou/client"
import { ControlProps } from "../types"

interface formSwitchProps extends ControlProps {
  name: string
  label?: string
  size?: any
}

function FormSwitch({ name, label, size, control }: formSwitchProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value: checked, onChange: setChecked } }) => (
        <Switch
          label={label}
          checked={checked}
          size={size}
          onChange={event => setChecked(event.currentTarget.checked)}
        />
      )}
      defaultValue={false}
    />
  )
}

export default FormSwitch
