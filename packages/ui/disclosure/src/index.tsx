import React, { ReactNode } from "react";
import { Collapse } from "@raikou/client";
import {
  BoxProps,
  factory,
  Factory,
  StylesApiProps,
  useProps,
  useStyles,
} from "@raikou/core";
import { useToggle } from "@raikou/hooks";
import { Box, Group, Stack, Text, UnstyledButton } from "@raikou/server";
import { Icon } from "@golfcart/fontawesomeicon";

export type DisclosureStylesNames =
  | "root"
  | "chevronWrapper"
  | "chevron"
  | "label"
  | "collapse";

export interface DisclosureProps
  extends BoxProps,
    StylesApiProps<DisclosureFactory> {
  label: ReactNode;
  rightSide?: ReactNode;
  gap?: number;
  transitionDuration?: number;
  children?: ReactNode;
}

export type DisclosureFactory = Factory<{
  props: DisclosureProps;
  ref: HTMLDivElement;
  defaultRef: HTMLDivElement;
  defaultComponent: "div";
  stylesNames: DisclosureStylesNames;
}>;

// type ClassNames = Partial<Record<DisclosureStylesNames, string>>;

const defaultProps: Partial<DisclosureProps> = {
  gap: 0,
};

export const Disclosure = factory<DisclosureFactory>((_props, ref) => {
  const props = useProps("Disclosure", defaultProps, _props);
  const {
    classNames,
    className,
    style,
    styles,
    unstyled,
    vars,
    children,
    label,
    rightSide,
    gap,
    transitionDuration,
    ...others
  } = props;

  const getStyles = useStyles<DisclosureFactory>({
    name: "Disclosure",
    props,
    classes: {
      root: "disclosure-root",
      chevronWrapper: "disclosure-chevronWrapper",
      chevron: "disclosure-chevron",
      label: "disclosure-label",
      collapse: "disclosure-collapse",
    },
    className,
    style,
    classNames,
    styles,
    unstyled,
    vars,
    varsResolver: undefined,
  });

  const [toggle, setToggle] = useToggle([true, false]);

  return (
    <Stack gap={gap}>
      <UnstyledButton
        component="div"
        onClick={() => setToggle()}
        {...getStyles("root")}
        {...others}
      >
        <Group {...getStyles("chevronWrapper")}>
          <Text data-rotate={toggle} {...getStyles("chevron")}>
            {!toggle ? (
              <Icon icon="caret-right" type="fas" />
            ) : (
              <Icon icon="caret-down" type="fas" />
            )}
          </Text>
          <Box {...getStyles("label")}>{label}</Box>
          {rightSide && rightSide}
        </Group>
      </UnstyledButton>
      <Collapse
        in={toggle}
        {...getStyles("collapse")}
        transitionDuration={transitionDuration}
      >
        {children}
      </Collapse>
    </Stack>
  );
});

// Disclosure.displayName = "@raikou/Disclosure";
