"use client";

import PhoneVisibilitySwitch from "@/components/members/phoneSwitch";
import VisibilitySwitch from "@/components/members/visibilitySwitch";
import MemberBoxSkeleton from "@/components/students/boxSkeleton";

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
