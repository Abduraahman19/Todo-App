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
import Home from '../../components/Home';
import UpComing from '../../components/UpComing';
import Today from '../../components/Today';
import Calender from '../../components/Calender';
import StickyWall from '../../components/StickyWall';
import Personal from '../../components/Personal';
import Work from '../../components/Work';

const HomeComponent = () => <Home />;
const UpComingComponent = () => <UpComing />;
const TodayComponent = () => <Today />;
const CalenderComponent = () => <Calender />;
const StickyWallComponent = () => <StickyWall />;
const PersonalComponent = () => <Personal />;
const WorkComponent = () => <Work />;

const NAVIGATION = [
  {
    kind: 'header',
    title: <span className="text-base font-bold">Menu</span>,
  },  
  {
    segment: 'Home',
    title: 'Home',
    icon: <HomeIcon />,
    component: HomeComponent,
  },
  {
    segment: 'UpComing',
    title: 'UpComing',
    icon: <AccessTimeIcon />,
    component: UpComingComponent,
  },
  {
    segment: 'Today',
    title: 'Today',
    icon: <PlaylistAddCheckCircleIcon />,
    component: TodayComponent,
  },
  {
    segment: 'Calender',
    title: 'Calender',
    icon: <CalendarMonthIcon />,
    component: CalenderComponent,
  },
  {
    segment: 'StickyWall',
    title: 'Sticky Wall',
    icon: <StickyNote2Icon />,
    component: StickyWallComponent,
  },
  {
    segment: 'Personal',
    title: 'Personal',
    icon: <PersonIcon />,
    component: PersonalComponent,
  },
  {
    segment: 'Work',
    title: 'Work',
    icon: <WorkIcon />,
    component: WorkComponent,
  },
];

function DemoPageContent({ pathname }) {

  const activeItem = NAVIGATION.find(
    (item) => item.segment && pathname.includes(item.segment)
  );


  const ActiveComponent = activeItem?.component || HomeComponent;

  return (
    <div className="w-full h-full">
      <ActiveComponent />
    </div>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function DashboardLayoutAccountSidebar(props) {
  const { window } = props;

  const [pathname, setPathname] = React.useState('/Home');

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
        <div className="flex flex-col items-center justify-center w-full h-full">
          <DemoPageContent pathname={pathname} />
        </div>
      </DashboardLayout>
    </AppProvider>
  );
}

export default DashboardLayoutAccountSidebar;
