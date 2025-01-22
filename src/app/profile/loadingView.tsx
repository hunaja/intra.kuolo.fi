"use client";

import MemberBoxSkeleton from "../_components/memberBoxSkeleton";
import PhoneVisibilitySwitch from "../_components/memberPhoneVisibilitySwitch";
import VisibilitySwitch from "../_components/memberVisibilitySwitch";

export default function ProfileLoadingView() {
  return (
    <>
      <MemberBoxSkeleton />

      <PhoneVisibilitySwitch hidden={true} isDisabled={true} />
      <br />
      <VisibilitySwitch hidden={true} isDisabled={true} />
    </>
  );
}
