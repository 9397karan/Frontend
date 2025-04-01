import React from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSearchParams } from "react-router-dom"; 

export const Room = () => {
  const [searchParams] = useSearchParams();
  const roomID = searchParams.get("roomID") || "default-room"; // Use roomID from URL or fallback to a default one

  const myMeeting = (element) => {
    const appID = 748818450;
    const serverSecret = "c201ea82acf2af6340e4d1abb9463714";
    
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      "user-" + Math.floor(Math.random() * 1000), // Random user ID
      "Guest"
    );

    const zc = ZegoUIKitPrebuilt.create(kitToken);
    zc.joinRoom({
      container: element,
      
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showScreenSharingButton: true,
    });
  };

  return (
    <div >
      <div ref={myMeeting} className="h-screen w-full overflow-x-hidden"></div>;
    </div>
  );
};
