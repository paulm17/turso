import * as React from "react"
import type { SomeZodObject, TypeOf, z, ZodTypeAny } from "zod"
import {
  ComponentOrTagName,
  FormSchema,
  KeysOfStrings,
  ObjectFromSchema,
  parseDate,
} from "./prelude"
import { objectFromSchema, mapObject, browser } from "./prelude"
import type {
  UseFormReturn,
  FieldError,
  Path,
  ValidationMode,
  DeepPartial,
  UseFormProps,
} from "react-hook-form"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { FormErrors, FormValues } from "./mutations"
import type {
  ComponentMappings,
  FieldComponent,
  FieldType,
  Option,
} from "./createField"
import { createField } from "./createField"
import { mapChildren, reduceElements } from "./childrenTraversal"
import { defaultRenderField } from "./defaultRenderField"
import { inferLabel } from "./inferLabel"
import type { ShapeInfo, ZodTypeName } from "./shapeInfo"
import { shapeInfo } from "./shapeInfo"
import { RegularIcons } from "@golfcart/fontawesomeicon"

type FormMethod = "get" | "post" | "put" | "patch" | "delete"

type BaseFormProps = {
  method?: FormMethod
  onSubmit?: React.FormEventHandler<HTMLFormElement>
  children: React.ReactNode
}

type BaseFormPropsWithHTMLAttributes =
  React.FormHTMLAttributes<HTMLFormElement> & BaseFormProps

type Field<SchemaType> = {
  shape: ZodTypeAny
  fieldType: FieldType
  name: keyof SchemaType
  required: boolean
  dirty: boolean
  label?: string
  options?: Option[]
  errors?: string[]
  autoFocus?: boolean
  value?: any
  hidden?: boolean
  multiline?: boolean
  radio?: boolean
  placeholder?: string
}

type RenderFieldProps<Schema extends SomeZodObject> = Field<z.infer<Schema>> & {
  Field: FieldComponent<Schema>
}

type RenderField<Schema extends SomeZodObject> = (
  props: RenderFieldProps<Schema>,
) => JSX.Element

type Options<SchemaType> = Partial<Record<keyof SchemaType, Option[]>>

type Children<Schema extends SomeZodObject> = (
  helpers: {
    Field: FieldComponent<Schema>
    Errors: ComponentOrTagName<"div">
    Error: ComponentOrTagName<"div">
    Button: ComponentOrTagName<"button">
    flattenErrors?: (errors: any) => any[]
  } & UseFormReturn<z.infer<Schema>, any>,
) => React.ReactNode

type OnTransition<Schema extends SomeZodObject> = (
  helpers: UseFormReturn<z.infer<Schema>, any>,
) => void

interface OnSubmitResult {
  FORM_ERROR?: string
  [prop: string]: any
}

export const FORM_ERROR = "FORM_ERROR"

type FormProps<Schema extends FormSchema> = ComponentMappings & {
  mode?: keyof ValidationMode
  reValidateMode?: keyof Pick<
    ValidationMode,
    "onBlur" | "onChange" | "onSubmit"
  >
  renderField?: RenderField<ObjectFromSchema<Schema>>
  globalErrorsComponent?: ComponentOrTagName<"div">
  buttonComponent?: ComponentOrTagName<any>
  buttonLabel?: string
  pendingButtonLabel?: string
  schema: Schema
  errors?: FormErrors<z.infer<Schema>>
  values?: FormValues<z.infer<Schema>>
  labels?: Partial<Record<keyof z.infer<Schema>, string>>
  placeholders?: Partial<Record<keyof z.infer<Schema>, string>>
  options?: Options<z.infer<Schema>>
  hiddenFields?: (keyof z.infer<Schema>)[]
  multiline?: (keyof z.infer<Schema>)[]
  radio?: KeysOfStrings<z.infer<ObjectFromSchema<Schema>>>[]
  autoFocus?: keyof z.infer<Schema>
  beforeChildren?: React.ReactNode
  onTransition?: OnTransition<ObjectFromSchema<Schema>>
  ref?: React.RefObject<HTMLFormElement>
  isNested?: boolean
  onSubmit: (
    values: z.infer<Schema>,
    form: UseFormReturn<z.TypeOf<Schema>, any>,
    e?: Event,
  ) => Promise<void | OnSubmitResult>
  children?: Children<ObjectFromSchema<Schema>>
} & Omit<BaseFormPropsWithHTMLAttributes, "children"> &
  Omit<BaseFormPropsWithHTMLAttributes, "onSubmit">

// interface FormProps2<S extends z.ZodType<any, any>>
//   extends Omit<
//     React.PropsWithoutRef<JSX.IntrinsicElements["form"]>,
//     "onSubmit"
//   > {
//   /** Icon, Text to display in the submit button */
//   submitIcon?: RegularIcons
//   submitText?: string
//   schema?: S
//   onSubmit: (values: z.infer<S>) => Promise<void | OnSubmitResult>
//   onCancel?: (values: z.infer<S>) => void
//   initialValues?: UseFormProps<z.infer<S>>["defaultValues"]
// }

const fieldTypes: Record<ZodTypeName, FieldType> = {
  ZodString: "string",
  ZodNumber: "number",
  ZodBoolean: "boolean",
  ZodDate: "date",
  ZodEnum: "string",
}

function coerceToForm(value: unknown, shape: ShapeInfo) {
  const { typeName } = shape
  if (typeName === "ZodBoolean") {
    return Boolean(value) ?? false
  }

  if (typeName === "ZodDate") {
    return parseDate(value as Date | undefined)
  }

  if (
    typeName === "ZodEnum" ||
    typeName === "ZodString" ||
    typeName === "ZodNumber"
  ) {
    if (shape.nullable) {
      return null
    }

    return String(value ?? "")
  }

  return value ?? ""
}

function Form<Schema extends FormSchema>(
  {
    mode = "onBlur",
    reValidateMode = "onChange",
    renderField = defaultRenderField,
    fieldComponent,
    globalErrorsComponent: Errors = "div",
    errorComponent: Error = "div",
    fieldErrorsComponent,
    labelComponent,
    inputComponent,
    multilineComponent,
    selectComponent,
    checkboxComponent,
    radioComponent,
    checkboxWrapperComponent,
    radioGroupComponent,
    radioWrapperComponent,
    buttonComponent: Button = "button",
    buttonLabel: rawButtonLabel = "OK",
    pendingButtonLabel = "OK",
    method = "post",
    schema,
    beforeChildren,
    onTransition,
    children: childrenFn,
    labels,
    placeholders,
    options,
    hiddenFields,
    multiline,
    radio,
    isNested,
    autoFocus: autoFocusProp,
    errors: errorsProp,
    values: valuesProp,
    ...props
  }: FormProps<Schema>,
  // @ts-ignore
  ref,
) {
  type SchemaType = z.infer<Schema>
  const actionErrors = [] as FormErrors<SchemaType>
  const actionValues = [] as FormValues<SchemaType>
  const errors = { ...errorsProp, ...actionErrors }
  const values = { ...valuesProp, ...actionValues }

  const schemaShape = objectFromSchema(schema).shape
  const defaultValues = mapObject(schemaShape, (key, fieldShape) => {
    const shape = shapeInfo(fieldShape as z.ZodTypeAny)

    const defaultValue = coerceToForm(
      values[key] ?? shape?.getDefaultValue?.(),
      shape,
    )

    return [key, defaultValue]
  }) as DeepPartial<SchemaType>

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    mode,
    reValidateMode,
    defaultValues,
  })

  const { formState, reset } = form
  const { errors: formErrors, isValid } = formState

  const { onSubmit, ...newProps } = props

  const forwardSave = async (values: any) => {
    await onSubmit(values, form)
  }

  const handleSubmitWithoutPropagation = async (e: any) => {
    e.preventDefault()
    e.stopPropagation()

    await form.handleSubmit(forwardSave)(e)
  }

  const onSubmitAction = async (values: any) => {
    await onSubmit(values, form)
  }

  const Field = React.useMemo(
    () =>
      createField<ObjectFromSchema<Schema>>({
        register: form.register,
        fieldComponent,
        labelComponent,
        inputComponent,
        multilineComponent,
        selectComponent,
        checkboxComponent,
        radioComponent,
        checkboxWrapperComponent,
        radioGroupComponent,
        radioWrapperComponent,
        fieldErrorsComponent,
        errorComponent: Error,
      }),
    [
      fieldComponent,
      labelComponent,
      inputComponent,
      multilineComponent,
      selectComponent,
      checkboxComponent,
      radioComponent,
      checkboxWrapperComponent,
      radioGroupComponent,
      radioWrapperComponent,
      fieldErrorsComponent,
      Error,
      form.register,
    ],
  )

  const fieldErrors = (key: keyof SchemaType) => {
    const message = (formErrors[key] as unknown as FieldError)?.message

    return browser() ? message && [message] : errors?.[key]
  }
  
  const fieldArrayErrors = (key: keyof SchemaType) => {
    const [newKey, index, name] = String(key).split(".")

    // @ts-ignore
    function getMessageByIndexAndName(obj, index, name) {
      const keys = Object.keys(obj)
      const key = keys[index]

      // @ts-ignore
      if (key && obj[key].hasOwnProperty(name)) {
        return obj[key][name].message
      }

      return undefined
    }

    // @ts-ignore
    const message = formErrors[newKey] !== undefined && getMessageByIndexAndName(formErrors[newKey], index, name)

    return browser() ? message && [message] : errors?.[key]
  }
  const firstErroredField = () =>
    Object.keys(schemaShape).find(key => fieldErrors(key)?.length)

  const makeField = (key: string) => {
    const shape = schemaShape[key]
    const { typeName, optional, nullable, enumValues } = shapeInfo(shape)

    const required = !(optional || nullable)

    const fieldOptions =
      options?.[key] ||
      enumValues?.map((value: string) => ({
        name: inferLabel(value),
        value,
      }))

    const fieldOptionsPlusEmpty = () =>
      fieldOptions && [{ name: "", value: "" }, ...(fieldOptions ?? [])]

    return {
      shape,
      fieldType: typeName ? fieldTypes[typeName] : "string",
      name: key,
      required,
      dirty: key in formState.dirtyFields,
      label: (labels?.[key]) ?? inferLabel(String(key)),
      options: required ? fieldOptions : fieldOptionsPlusEmpty(),
      errors: key.includes(".") ? fieldArrayErrors(key) : fieldErrors(key),
      autoFocus: key === firstErroredField() || key === autoFocusProp,
      value: defaultValues[key],
      hidden: hiddenFields && Boolean(hiddenFields.find(item => item === key)),
      multiline: multiline && Boolean(multiline.find(item => item === key)),
      radio: radio && Boolean(radio.find(item => item === key)),
      placeholder: placeholders?.[key],
    } as Field<SchemaType>
  }

  const hiddenFieldsErrorsToGlobal = (globalErrors: string[] = []) => {
    const deepHiddenFieldsErrors = hiddenFields?.map(hiddenField => {
      const hiddenFieldErrors = fieldErrors(hiddenField)

      if (hiddenFieldErrors instanceof Array) {
        const hiddenFieldLabel =
          (labels?.[hiddenField]) || inferLabel(String(hiddenField))
        return hiddenFieldErrors.map(error => `${hiddenFieldLabel}: ${error}`)
      } else return []
    })
    const hiddenFieldsErrors: string[] = deepHiddenFieldsErrors?.flat() ?? []

    const allGlobalErrors = ([] as string[])
      .concat(globalErrors, hiddenFieldsErrors)
      .filter(error => typeof error === "string")

    return allGlobalErrors.length > 0 ? allGlobalErrors : undefined
  }

  const globalErrors = React.useMemo(
    () => hiddenFieldsErrorsToGlobal(errors?._global),
    [errors?._global, hiddenFieldsErrorsToGlobal],
  )

  const buttonLabel = formState.isSubmitting
    ? pendingButtonLabel
    : rawButtonLabel

  const [disabled, setDisabled] = React.useState(false)

  const [globalErrorsState, setGlobalErrorsState] = React.useState<
      string[] | undefined
    >(globalErrors)

  const customChildren = mapChildren(
    childrenFn?.({
      Field,
      Errors,
      Error,
      Button,
      ...form,
    }),
    child => {
      if (child.type === Field) {
        const { name } = child.props
        const field = makeField(name)

        const autoFocus = firstErroredField()
          ? field?.autoFocus
          : child.props.autoFocus ?? field?.autoFocus

        if (!child.props.children && field) {
          return renderField({
            Field,
            ...field,
            ...child.props,
            autoFocus,
          })
        }

        return React.cloneElement(child, {
          shape: field?.shape,
          fieldType: field?.fieldType,
          label: field?.label,
          placeholder: field?.placeholder,
          required: field?.required,
          options: field?.options,
          value: field?.value,
          errors: field?.errors,
          hidden: field?.hidden,
          multiline: field?.multiline,
          ...child.props,
          autoFocus,
        })
      } else if (child.type === Errors) {
        if (!child.props.children && !globalErrorsState?.length) return null

        if (child.props.children || !globalErrorsState?.length) {
          return React.cloneElement(child, {
            role: "alert",
            ...child.props,
          })
        }

        return React.cloneElement(child, {
          role: "alert",
          children: globalErrorsState.map(error => (
            <Error key={error}>{error}</Error>
          )),
          ...child.props,
        })
      } else if (child.type === Button) {
        return React.cloneElement(child, {
          disabled,
          children: buttonLabel,
          ...child.props,
        })
      } else {
        return child
      }
    },
  )

  const defaultChildren = () => (
    <>
      {Object.keys(schemaShape)
        .map(makeField)
        .map(field => renderField({ Field, ...field }))}
      {globalErrorsState?.length && (
        <Errors role="alert">
          {globalErrorsState.map(error => (
            <Error key={error}>{error}</Error>
          ))}
        </Errors>
      )}
      <Button disabled={disabled}>{buttonLabel}</Button>
    </>
  )

  React.useEffect(() => {
    const shouldDisable =
      mode === "onChange" || mode === "all"
        ? formState.isSubmitting || !isValid
        : formState.isSubmitting

    setDisabled(shouldDisable)
  }, [formState, mode, isValid])

  React.useEffect(() => {
    const newDefaults = Object.fromEntries(
      reduceElements(customChildren, [] as string[][], (prev, child) => {
        if (child.type === Field) {
          const { name, value } = child.props
          prev.push([name, value])
        }
        return prev
      }),
    )
    reset({ ...defaultValues, ...newDefaults })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    Object.keys(errors).forEach(key => {
      form.setError(key as Path<TypeOf<Schema>>, {
        type: "custom",
        message: (errors[key]!).join(", "),
      })
    })
    if (firstErroredField()) {
      try {
        form.setFocus(firstErroredField() as Path<SchemaType>)
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorsProp])

  React.useEffect(() => {
    onTransition && onTransition(form)

    if (formState.isSubmitted) {
      setGlobalErrorsState(undefined)
    }
  }, [formState])

  // const flattenErrors = (obj, name) => {
  //   const result = {}

  //   if (!(name in obj)) {
  //     return result
  //   }

  //   const handleArray = (arr, path) => {
  //     arr.forEach((nestedObj, i) => {
  //       if (nestedObj) {
  //         Object.keys(nestedObj).forEach(nestedKey => {
  //           result[`${path}.${i}.${nestedKey}`] = nestedObj[nestedKey].message
  //         })
  //       }
  //     })
  //   }

  //   const handleObject = (obj, path) => {
  //     Object.keys(obj).forEach(key => {
  //       if (Array.isArray(obj[key])) {
  //         handleArray(obj[key], `${path}.${key}`)
  //       }
  //     })
  //   }

  //   const traverse = (obj, path) => {
  //     for (const key in obj) {
  //       const newPath = path ? `${path}.${key}` : key

  //       if (key === name) {
  //         if (Array.isArray(obj[key])) {
  //           handleArray(obj[key], newPath)
  //         } else {
  //           handleObject(obj[key], newPath)
  //         }
  //       }

  //       if (typeof obj[key] === "object" && obj[key] !== null) {
  //         traverse(obj[key], newPath)
  //       }
  //     }
  //   }

  //   traverse(obj, "")
  //   return result
  // }

  // @ts-ignore
  const extractErrors = (obj, path, errors) => {
    for (const key in obj) {
      const newPath = path ? `${path}.${key}` : key

      if (typeof obj[key] === "object" && obj[key] !== null) {
        if ("message" in obj[key]) {
          errors[newPath] = obj[key].message
        } else {
          extractErrors(obj[key], newPath, errors)
        }
      }
    }
  }

  // @ts-ignore
  const flattenErrors = (obj, name) => {
    const errors = {}
    extractErrors(obj[name], name, errors)
    return errors
  }

  // @ts-ignore
  form.flattenErrors = flattenErrors

  // otherwise react will complain about defaultValues not being recognised
  newProps.hasOwnProperty("defaultValues") && delete (newProps as any).defaultValues;

  return (
    <FormProvider {...form}>
      <form
        ref={ref}
        method={method}
        onSubmit={
          !isNested
            ? form.handleSubmit(onSubmitAction)
            : handleSubmitWithoutPropagation
        }
        {...newProps}
      >
        {beforeChildren}
        {customChildren ?? defaultChildren()}
        {/* {customChildren ? (
          <>
            {customChildren} */}
            {/* {Object.keys(formState.errors)?.length > 0 && (
              <Errors role="alert">
                {Object.keys(formState.errors).map(error => (
                  <Error key={error}>
                    {error}:
                    {Array.isArray(formState.errors[error])
                      ? ""
                      : formState.errors[error]?.message}
                  </Error>
                ))}
              </Errors>
            )} */}
          {/* </>
        ) : (
          defaultChildren() as any
        )} */}
      </form>
    </FormProvider>
  )
}

export type {
  Field,
  RenderFieldProps,
  RenderField,
  FormProps,
  FormSchema,
}

export default React.forwardRef(Form)
