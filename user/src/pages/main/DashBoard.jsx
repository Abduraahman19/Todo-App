import * as React from 'react';
import PropTypes from 'prop-types';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import HomeIcon from '@mui/icons-material/Home';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import Home from '../../components/Home';
import UpComing from '../../components/UpComing';
import Today from '../../components/Today';
import Calender from '../../components/Calender';
import Personal from '../../components/Personal';
import Work from '../../components/Work';

// Components for each page
const HomeComponent = () => <Home />;
const UpComingComponent = () => <UpComing />;
const TodayComponent = () => <Today />;
const CalenderComponent = () => <Calender />;
const PersonalComponent = () => <Personal />;
const WorkComponent = () => <Work />;

// Signout button component with SweetAlert2 confirmation
const ButtonComponent = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, sign out!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // Remove token from localStorage
        localStorage.removeItem('token');
        // Navigate to the signin page
        navigate('/signin');
      }
    });
  };

  return (
    <Button
      variant="contained"
      sx={{ backgroundColor: 'red', '&:hover': { backgroundColor: 'darkred' }, color: 'white', borderRadius:'8px' }}
      onClick={handleSignOut}
    >
      Signout
    </Button>

  );
};

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

  // Check if user is logged in
  React.useEffect(() => {
    if (!localStorage.getItem('token')) {
      // Redirect to signin page if token doesn't exist
      window.location.href = '/signin';
    }
  }, []);

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
        {/* Navbar section with the signout button */}
        <div className="flex justify-between items-center mx-10 rounded-xl my-5 px-5 py-3 bg-[#90CAF9] bg-opacity-20">
          <div className="text-2xl font-bold">Dashboard</div>
          <h1 className='font-semibold underline underline-offset-8 uppercase'>| Created by Abdur Rahman |</h1>
          <ButtonComponent />
          {/* Add ButtonComponent to Navbar */}
        </div>

        {/* Content area */}
        <div className="flex flex-col items-center justify-center w-full h-full">
          <DemoPageContent pathname={pathname} />
        </div>
      </DashboardLayout>
    </AppProvider>
  );
}

export default DashboardLayoutAccountSidebar;
