"use client";

import MemberBoxSkeleton from "./app/_components/memberBoxSkeleton";
import PhoneVisibilitySwitch from "./app/_components/memberPhoneVisibilitySwitch";
import VisibilitySwitch from "./app/_components/memberVisibilitySwitch";

export default function MemberLoadingView() {
  return (
    <>
      <MemberBoxSkeleton />

      <PhoneVisibilitySwitch hidden={true} isDisabled={true} />
      <br />
      <VisibilitySwitch hidden={true} isDisabled={true} />
    </>
  );
}
