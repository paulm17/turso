import { Box } from "@raikou/server"
import { TextInput } from "@raikou/client"
import { Controller } from "react-hook-form"
import { NumericFormat } from "react-number-format"
import { ControlProps } from "../types"

interface formInputNumberProps extends ControlProps {
  decimalScale?: number
  placeholder?: string
}

function FormInputNumber({
  name,
  control,
  decimalScale,
  placeholder,
}: formInputNumberProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onBlur, onChange, ref } }) => (
        <Box className="relative">
          <NumericFormat
            value={value}
            onValueChange={values => {
              const { floatValue } = values
              onChange(`${floatValue}`)
            }}
            onBlur={onBlur}
            decimalScale={decimalScale || 0}
            fixedDecimalScale
            thousandSeparator={true}
            allowNegative={false}
            placeholder={placeholder}
            customInput={TextInput}
            getInputRef={ref}
          />
        </Box>
      )}
      defaultValue=""
    />
  )
}

export default FormInputNumber
