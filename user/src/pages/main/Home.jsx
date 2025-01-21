import * as React from 'react';
import PropTypes from 'prop-types';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import HomeIcon from '@mui/icons-material/Home';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Dashboard Menu',
  },
  {
    segment: 'Home',
    title: 'Home',
    icon: <HomeIcon />,
  },
  {
    segment: 'UpComing',
    title: 'UpComing',
    icon: <AccessTimeIcon />,
  },
  {
    segment: 'Today',
    title: 'Today',
    icon: <PlaylistAddCheckCircleIcon />,
  },
  {
    segment: 'Calender',
    title: 'Calender',
    icon: <CalendarMonthIcon />,
  },
  {
    segment: 'StickyWall',
    title: 'Sticky Wall',
    icon: <StickyNote2Icon />,
  },
  {
    segment: 'Personal',
    title: 'Personal',
    icon: <PersonIcon />,
  },
  {
    segment: 'Work',
    title: 'Work',
    icon: <WorkIcon />,
  },
];

function DemoPageContent({ pathname }) {
  return (
    <div className="py-4 flex flex-col items-center text-center">
      <h4 className="text-2xl font-bold">Dashboard content for {pathname}</h4>
    </div>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function DashboardLayoutAccountSidebar(props) {
  const { window } = props;

  const [pathname, setPathname] = React.useState('/dashboard');

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      window={demoWindow}
    >
      <DashboardLayout
        title="Toolpad Dashboard"
        sidebar={null}
        footer={null}
      >
        <div className="flex flex-col items-center justify-center">
          <DemoPageContent pathname={pathname} />
        </div>
      </DashboardLayout>
    </AppProvider>
  );
}

export default DashboardLayoutAccountSidebar;
