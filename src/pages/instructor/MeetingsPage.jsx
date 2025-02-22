import React, { useState, useEffect } from "react";
import axios from "axios";

const MeetingsPage = () => {
  const instructorId = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))._id
    : null;

  const [meetings, setMeetings] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingTime, setMeetingTime] = useState("");

  useEffect(() => {
    if (instructorId) {
      fetchMeetings();
    }
  }, [instructorId]);

  const fetchMeetings = async () => {
    try {
      const res = await axios.get(`https://backend-dup.onrender.com/api/meetings/instructor/${instructorId}`);
      setMeetings(res.data);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  const handleCreateMeeting = async () => {
    if (!meetingTitle || !meetingTime) {
      alert("Please enter meeting title and time.");
      return;
    }

    try {
      await axios.post("https://backend-dup.onrender.com/api/meetings/create", {
        instructorId,
        meetingTitle,
        meetingTime,
      });

      setShowPopup(false);
      fetchMeetings();
    } catch (error) {
      console.error("Error creating meeting:", error);
    }
  };

  const markAsCompleted = async (id) => {
    try {
      await axios.put(`https://backend-dup.onrender.com/api/meetings/complete/${id}`);
      fetchMeetings();
    } catch (error) {
      console.error("Error marking meeting as completed:", error);
    }
  };

  const markAsUndone = async (id) => {
    try {
      await axios.put(`https://backend-dup.onrender.com/api/meetings/undo/${id}`);
      fetchMeetings();
    } catch (error) {
      console.error("Error marking meeting as undone:", error);
    }
  };

  const copyToClipboard = (meeting) => {
    const meetingDetails = `
      Meeting Title: ${meeting.meetingTitle}
      Time: ${new Date(meeting.meetingTime).toLocaleString()}
      Link: ${meeting.meetingLink}
    `;

    navigator.clipboard.writeText(meetingDetails)
      .then(() => alert("Meeting details copied to clipboard!"))
      .catch((err) => console.error("Failed to copy:", err));
  };

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white mt-4">
      <h2 className="text-2xl font-bold mb-4">Instructor Dashboard</h2>

      <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4" onClick={() => setShowPopup(true)}>
        Schedule Meeting
      </button>

      <div className="grid gap-4">
        {meetings.length > 0 ? (
          meetings.map((meeting) => (
            <div key={meeting._id} className="border p-4 rounded shadow-md bg-gray-800">
              <h3 className="text-lg font-bold">{meeting.meetingTitle}</h3>
              <p>Time: {new Date(meeting.meetingTime).toLocaleString()}</p>
              <p>
                Link:{" "}
                <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-400">
                  {meeting.meetingLink}
                </a>
              </p>

              <button
                className="bg-gray-600 text-white px-4 py-2 rounded ml-4"
                onClick={() => copyToClipboard(meeting)}
              >
                Copy to Clipboard
              </button>

              {!meeting.isCompleted ? (
                <button className="bg-green-500 text-white px-4 py-2 rounded ml-4" onClick={() => markAsCompleted(meeting._id)}>
                  Mark as Completed
                </button>
              ) : (
                <button className="bg-red-500 text-white px-4 py-2 rounded ml-4" onClick={() => markAsUndone(meeting._id)}>
                  Mark as Undone
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No meetings scheduled.</p>
        )}
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-4 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold text-white">Schedule a Meeting</h2>
            <input
              type="text"
              className="w-full p-2 border rounded my-2 bg-gray-700 text-white"
              placeholder="Meeting Title"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
            />
            <input
              type="datetime-local"
              className="w-full p-2 border rounded my-2 bg-gray-700 text-white"
              value={meetingTime}
              onChange={(e) => setMeetingTime(e.target.value)}
            />
            
            <div className="flex justify-end space-x-2">
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setShowPopup(false)}>
                Cancel
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleCreateMeeting}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingsPage;
