import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DeviceFrame } from './components/layout/DeviceFrame';
import { BottomNav } from './components/layout/BottomNav';

// Mentee Views
import { HomeView } from './components/mentee/HomeView';
import { MentorCatalogView } from './components/mentee/MentorCatalogView';
import { MentorDetailModal } from './components/mentee/MentorDetailModal';
import { OneOnOneBookingModal } from './components/mentee/OneOnOneBookingModal';
import { ChatView } from './components/mentee/ChatView';
import { EventsView } from './components/mentee/EventsView';
import { MenteeProfileView } from './components/mentee/MenteeProfileView';
import { AituGuideView } from './components/guide/AituGuideView';

// Hard Mentorship & Lectures Views
import { LectureCatalogView } from './components/lectures/LectureCatalogView';
import { AttendanceTicketModal } from './components/lectures/AttendanceTicketModal';
import { AuditoriumSeatPickerModal } from './components/lectures/AuditoriumSeatPickerModal';
import { HardMentorLecturesView } from './components/lectures/HardMentorLecturesView';

// Mentor Views (Soft Mentorship)
import { MentorCommunityView } from './components/mentor/MentorCommunityView';
import { MentorStoriesView } from './components/mentor/MentorStoriesView';
import { WeeklyReportView } from './components/mentor/WeeklyReportView';
import { MentorEventsView } from './components/mentor/MentorEventsView';
import { MentorProfileView } from './components/mentor/MentorProfileView';

// System States & Notifications
import { SkeletonView } from './components/system/SkeletonView';
import { TasksEmptyView } from './components/system/TasksEmptyView';
import { OfflineErrorView } from './components/system/OfflineErrorView';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { AuthScreen } from './components/auth/AuthScreen';

// Modals
import { StoryViewerModal } from './components/stories/StoryViewerModal';

const AppContent: React.FC = () => {
  const {
    isAuthenticated,
    role,
    menteeView,
    mentorView,
    hardMentorView,
    isSimulatingOffline,
    selectedMentorForBooking,
    closeOneOnOneModal,
    auditoriumLectureModal,
    closeAuditoriumModal,
    bookLecture,
    isNotificationOpen,
    closeNotifications
  } = useApp();

  const renderContent = () => {
    if (!isAuthenticated) {
      return <AuthScreen />;
    }

    if (isSimulatingOffline) {
      return <OfflineErrorView />;
    }

    if (role === 'mentee') {
      switch (menteeView) {
        case 'home':
          return <HomeView />;
        case 'lectures':
          return <LectureCatalogView />;
        case 'guide':
          return <AituGuideView />;
        case 'mentors':
          return <MentorCatalogView />;
        case 'chat':
          return <ChatView />;
        case 'events':
          return <EventsView />;
        case 'profile':
          return <MenteeProfileView />;
        case 'skeleton':
          return <SkeletonView />;
        case 'empty_tasks':
          return <TasksEmptyView />;
        case 'offline_error':
          return <OfflineErrorView />;
        default:
          return <HomeView />;
      }
    }

    if (role === 'hard_mentor') {
      switch (hardMentorView) {
        case 'my_lectures':
        case 'scanner':
        default:
          return <HardMentorLecturesView />;
      }
    }

    // Soft Mentor Views
    switch (mentorView) {
      case 'community':
        return <MentorCommunityView />;
      case 'stories':
        return <MentorStoriesView />;
      case 'weekly_report':
        return <WeeklyReportView />;
      case 'events':
        return <MentorEventsView />;
      case 'profile':
        return <MentorProfileView />;
      default:
        return <MentorCommunityView />;
    }
  };

  return (
    <DeviceFrame>
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex-1">{renderContent()}</div>
        {isAuthenticated && <BottomNav />}
      </div>

      {/* Global Modals */}
      <StoryViewerModal />
      <MentorDetailModal />
      <AttendanceTicketModal />

      {/* 1-on-1 Mentorship Booking Modal */}
      {selectedMentorForBooking && (
        <OneOnOneBookingModal
          mentor={selectedMentorForBooking}
          onClose={closeOneOnOneModal}
        />
      )}

      {/* Auditorium Seat Visualizer Modal */}
      {auditoriumLectureModal && (
        <AuditoriumSeatPickerModal
          lecture={auditoriumLectureModal}
          onClose={closeAuditoriumModal}
          onConfirmTier={tier => {
            bookLecture(auditoriumLectureModal.id, tier);
            closeAuditoriumModal();
          }}
        />
      )}

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={closeNotifications}
      />
    </DeviceFrame>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
