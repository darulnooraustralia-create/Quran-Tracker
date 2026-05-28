import React, { useState } from "react";

export default function HifzTracker() {
  const currentParent = "parent1";

  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      teacher: "Ustad Ahmad",
      title: "Surah Revision",
      message:
        "Please revise Surah Al-Mulk with your child before Thursday.",
      date: "28 May 2026",
      readBy: [],
    },
    {
      id: 2,
      teacher: "Ustadah Maryam",
      title: "School Holiday",
      message:
        "Madrasah will remain closed on Monday after Zuhr for maintenance.",
      date: "27 May 2026",
      readBy: ["parent2"],
    },
  ]);

  const unreadCount = announcements.filter(
    (item) => !item.readBy.includes(currentParent)
  ).length;

  const markAsRead = (id) => {
    setAnnouncements((prev) =>
      prev.map((announcement) => {
        if (
          announcement.id === id &&
          !announcement.readBy.includes(currentParent)
        ) {
          return {
            ...announcement,
            readBy: [...announcement.readBy, currentParent],
          };
        }

        return announcement;
      })
    );
  };

  const TeacherAvatar = () => (
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full bg-gray-300 shadow-inner"></div>

      <div className="absolute top-0 left-0 right-0 h-8 bg-gray-700 rounded-b-3xl"></div>

      <div className="absolute bottom-1 left-2 right-2 h-7 bg-gray-500 rounded-t-full"></div>
    </div>
  );

  const BoyAvatar = () => (
    <div className="relative w-14 h-14">
      <div className="absolute inset-0 rounded-full bg-gray-300 shadow-md"></div>

      <div className="absolute top-0 left-0 right-0 h-5 bg-gray-700 rounded-b-2xl"></div>

      <div className="absolute bottom-1 left-3 right-3 h-5 bg-gray-500 rounded-t-full"></div>
    </div>
  );

  const GirlAvatar = () => (
    <div className="relative w-14 h-14">
      <div className="absolute inset-0 rounded-full bg-gray-300 shadow-md"></div>

      <div className="absolute top-0 left-0 right-0 h-7 bg-gray-500 rounded-b-full"></div>

      <div className="absolute bottom-1 left-2 right-2 h-5 bg-gray-600 rounded-t-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Darul Noor Hifz Tracker
              </h1>

              <p className="text-gray-500 mt-2">
                Islamic Friendly School Management Portal
              </p>
            </div>

            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-white text-2xl shadow-lg">
                🔔
              </div>

              {unreadCount > 0 && (
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                  {unreadCount}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DASHBOARD */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-5">
            <div className="flex items-center gap-4">
              <TeacherAvatar />

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Teacher
                </h2>

                <p className="text-gray-500 text-sm">
                  Ustad Ahmad
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-5">
            <div className="flex items-center gap-4">
              <BoyAvatar />

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Ahmed
                </h2>

                <p className="text-gray-500 text-sm">
                  Boy Student
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-5">
            <div className="flex items-center gap-4">
              <GirlAvatar />

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Fatimah
                </h2>

                <p className="text-gray-500 text-sm">
                  Girl Student
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ANNOUNCEMENTS */}

        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Teacher Announcements
            </h2>

            <div className="bg-gray-100 px-4 py-2 rounded-2xl text-gray-700 font-semibold">
              {unreadCount} Unread
            </div>
          </div>

          <div className="space-y-5">

            {announcements.map((announcement) => {
              const isRead = announcement.readBy.includes(currentParent);

              return (
                <div
                  key={announcement.id}
                  className="border border-gray-200 rounded-3xl p-5 bg-gray-50 shadow-sm"
                >
                  <div className="flex gap-4">

                    <TeacherAvatar />

                    <div className="flex-1">

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            {announcement.title}
                          </h3>

                          <p className="text-gray-500 text-sm mt-1">
                            By {announcement.teacher} • {announcement.date}
                          </p>
                        </div>

                        <div>
                          {isRead ? (
                            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                              Read
                            </div>
                          ) : (
                            <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold">
                              Unread
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-700 mt-4 leading-relaxed">
                        {announcement.message}
                      </p>

                      {!isRead && (
                        <button
                          onClick={() => markAsRead(announcement.id)}
                          className="mt-5 bg-gray-700 hover:bg-gray-800 text-white px-5 py-3 rounded-2xl shadow-md transition-all"
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* HIFZ PROGRESS */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-5">
              Hifz Progress
            </h2>

            <div className="space-y-4">

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 font-medium">
                    Juz 1
                  </span>

                  <span className="text-gray-500">
                    85%
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div className="bg-gray-700 h-4 rounded-full w-[85%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 font-medium">
                    Revision
                  </span>

                  <span className="text-gray-500">
                    60%
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div className="bg-gray-500 h-4 rounded-full w-[60%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-5">
              Attendance
            </h2>

            <div className="space-y-4">

              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                <span className="font-medium text-gray-700">
                  Present Days
                </span>

                <span className="text-gray-800 font-bold">
                  24
                </span>
              </div>

              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                <span className="font-medium text-gray-700">
                  Absent Days
                </span>

                <span className="text-gray-800 font-bold">
                  2
                </span>
              </div>

              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                <span className="font-medium text-gray-700">
                  Late Arrivals
                </span>

                <span className="text-gray-800 font-bold">
                  1
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}

        <div className="mt-10 text-center text-gray-400 text-sm">
          Darul Noor Education Hub • Islamic Friendly UI
        </div>
      </div>
    </div>
  );
}
