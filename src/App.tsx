import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DeviceFrame } from './components/layout/DeviceFrame';
import { BottomNav } from './components/layout/BottomNav';

// Mentee Views
import { HomeView } from './components/mentee/HomeView';
import { MentorCatalogView } from './components/mentee/MentorCatalogView';
import { MentorDetailModal } from './components/mentee/MentorDetailModal';
import { ChatView } from './components/mentee/ChatView';
import { EventsView } from './components/mentee/EventsView';
import { MenteeProfileView } from './components/mentee/MenteeProfileView';

// Hard Mentorship & Lectures Views
import { LectureCatalogView } from './components/lectures/LectureCatalogView';
import { AttendanceTicketModal } from './components/lectures/AttendanceTicketModal';
import { HardMentorLecturesView } from './components/lectures/HardMentorLecturesView';

// Mentor Views (Soft Mentorship)
import { MentorCommunityView } from './components/mentor/MentorCommunityView';
import { MentorStoriesView } from './components/mentor/MentorStoriesView';
import { WeeklyReportView } from './components/mentor/WeeklyReportView';
import { MentorEventsView } from './components/mentor/MentorEventsView';
import { MentorProfileView } from './components/mentor/MentorProfileView';

// System States
import { SkeletonView } from './components/system/SkeletonView';
import { TasksEmptyView } from './components/system/TasksEmptyView';
import { OfflineErrorView } from './components/system/OfflineErrorView';

// Modals
import { StoryViewerModal } from './components/stories/StoryViewerModal';

const AppContent: React.FC = () => {
  const { role, menteeView, mentorView, hardMentorView, isSimulatingOffline } = useApp();

  const renderContent = () => {
    if (isSimulatingOffline) {
      return <OfflineErrorView />;
    }

    if (role === 'mentee') {
      switch (menteeView) {
        case 'home':
          return <HomeView />;
        case 'lectures':
          return <LectureCatalogView />;
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
        <BottomNav />
      </div>

      {/* Global Modals */}
      <StoryViewerModal />
      <MentorDetailModal />
      <AttendanceTicketModal />
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
