import React, { forwardRef } from "react"
import { Button, Text } from "@raikou/server"
import { Input, Select, SelectProps } from "@raikou/client"
import { RaikouSize } from "@raikou/system"

export const MantineFormLabel = forwardRef<
  HTMLLabelElement,
  JSX.IntrinsicElements["label"]
  // @ts-ignore
>(({ ...props }, ref) => <Text {...props} ref={ref} />)

export const MantineFormButton = forwardRef<
  HTMLButtonElement,
  Omit<JSX.IntrinsicElements["button"], "size"> & { size: RaikouSize}
>(({ type, ...props }, ref) => <Button type={type} {...props} ref={ref} />)

export const MantineFormInput = forwardRef<
  HTMLInputElement,
  Omit<JSX.IntrinsicElements["input"], "size">
>(({ type = "text", ...props }, ref) => (
  <Input {...props} type={type} ref={ref} />
))

export const MantineFormSelect = forwardRef<
  HTMLSelectElement,
  JSX.IntrinsicElements["select"] &
    SelectProps &
    React.RefAttributes<HTMLInputElement>
    // @ts-ignore
>(({ data, ...props }, ref) => <Select {...props} data={data} ref={ref} />)
