import * as React from "react";
import { ReactNode } from "react";
import { Modal } from "@raikou/client";
import { Box, Button, Group, Stack, Text, Title } from "@raikou/server";
import { Icon, RegularIcons } from "@golfcart/fontawesomeicon";

interface dialogProps {
  opened: boolean;
  icon: RegularIcons;
  subTitle?: string;
  title: string;
  actionButton?: ReactNode;
  children?: ReactNode;
  onClose: () => void;
}

function Dialog({
  opened,
  icon,
  subTitle,
  title,
  actionButton,
  children,
  onClose,
}: dialogProps) {
  return (
    <Modal
      opened={opened}
      withCloseButton={false}
      closeOnEscape={false}
      closeOnClickOutside={false}
      onClose={onClose}
      centered
      styles={{
        content: {
          borderRadius: 0,
          boxShadow: "0_20px_60px_-2px_rgba(27,33,58,0.4)",
        },
        body: {
          padding: 0,
        },
      }}
    >
      <Stack gap={0}>
        <Box className="border border-l-0 border-r-0 border-t-0 border-[#eee] pb-[4px]">
          <Title
            order={5}
            className="px-[10px] py-[5px] font-bold text-[#6b7c93] dark:text-white"
          >
            <Group gap={8}>
              <Icon icon={icon} />
              {title}
            </Group>
          </Title>
        </Box>
        {subTitle && (
          <Text className="px-[10px] py-[10px] text-center text-[#6b7c93] dark:text-white">
            {subTitle}
          </Text>
        )}
        {children ? (
          children
        ) : (
          <>
            <Group gap={0} grow>
              <Button
                onClick={onClose}
                color="gray"
                leftSection={<Icon icon="undo" />}
                className="!rounded-none !bg-gray-400 hover:!bg-gray-700 active:!transform-none"
              >
                Cancel
              </Button>
              {actionButton}
            </Group>
          </>
        )}
      </Stack>
    </Modal>
  );
}

export default Dialog;
