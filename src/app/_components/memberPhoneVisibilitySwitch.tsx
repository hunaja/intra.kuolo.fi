"use client";

import { Switch } from "@nextui-org/switch";
import React, { useState } from "react";

import { api } from "@/trpc/react";

export default function PhoneVisibilitySwitch({
  hidden,
  isDisabled = false,
}: {
  hidden: boolean;
  isDisabled?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const utils = api.useUtils();

  const togglePhoneHiddenFromList =
    api.member.togglePhoneHiddenFromList.useMutation();

  const handleVisibilityChange = async () => {
    setLoading(true);
    await togglePhoneHiddenFromList.mutateAsync();
    await utils.member.getSelf.invalidate();
    setLoading(false);
  };

  return (
    <Switch
      className="mb-5"
      isDisabled={loading || isDisabled}
      isSelected={hidden}
      onValueChange={handleVisibilityChange}
    >
      Piilota puhelinnumero
    </Switch>
  );
}
