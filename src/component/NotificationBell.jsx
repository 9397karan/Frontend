import React, { useState, useEffect } from "react";
import axios from "axios";

const NotificationBell = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [meetingInfo, setMeetingInfo] = useState("");
  //const [meetingLink, setMeetingLink] = useState("");
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Fetch notifications from the database
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`https://backend-dup.onrender.com/api/notifications/${userId}`);
      
        setNotifications(res.data);


        // Count unread messages
        const unread = res.data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, [userId]);

  // Toggle notification dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle reply button click
  const handleReply = (notification) => {
    setSelectedNotification(notification);
    console.log(notification)
    setMeetingInfo("");
 
    setShowPopup(true);
  };

  // Handle sending a reply
  const handleSendReply = async () => {
    if (!meetingInfo|| !userId) {
      alert("Please enter a meeting title, link, and ensure you're logged in.");
      return;
    }
  

  
    try {
      await axios.put(`https://backend-dup.onrender.com/api/notifications/reply/${selectedNotification}`, {
        senderId: userId,  // Ensure this is correctly sent
        meetingInfo
      });
  
      setShowPopup(false);
  
      // Refresh notifications after reply
      const res = await axios.get(`https://backend-dup.onrender.com/api/notifications/${userId}`);
      setNotifications(res.data);
    } catch (err) {
      console.error("Error sending reply:", err.response?.data || err.message);
      alert("Failed to send reply. Try again.");
    }
  };
  

  return (
    <div className="relative">
      <button className="relative" onClick={toggleDropdown}>
        <span className="text-2xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
            {unreadCount}
          </span>
        )}
      </button>
  
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-md">
          <div className="p-4">
            <h3 className="text-lg font-bold">Notifications</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4">No new notifications</p>
            ) : (
              notifications.map((n) => (
                <div key={n._id} className="p-3 border-b">
                  <p>{n.message}</p>
  
                  {/* Show Replies */}
                  {n.replies && n.replies.length > 0 && (
                   
                    <div className="mt-2 p-2 bg-gray-100 rounded">
                      <h4 className="text-sm font-bold">Replies:</h4>
                      {n.replies.map((reply, index) => (
                        <p key={index} className="text-sm">
                          <span className="font-bold">
                            {reply.senderId === userId ? "You" : "Instructor"}:
                          </span>{" "}
                          {reply.meetingInfo} -{" "}
                          
                        </p>
                      ))}
                    </div>
                  )}
  
                  {/* Reply Button (for instructors) */}
                  <button className="text-blue-500 mt-2" onClick={() => handleReply(n._id)}>
                    Reply
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
  
      {/* Reply Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold">Reply</h2>
            <textarea
              type="text"
              rows={20}
              className="w-full p-2 border rounded my-2"
              placeholder="Description"
              value={meetingInfo}
              onChange={(e) => setMeetingInfo(e.target.value)}
            ></textarea>
            
            <div className="flex justify-end space-x-2">
              <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setShowPopup(false)}>
                Cancel
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSendReply}>
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
