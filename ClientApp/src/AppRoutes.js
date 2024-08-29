import { SignIn } from "./components/SignIn";
import { Home } from "./components/Home";
import { Profile} from "./components/Profile";
import { CallBack } from "./components/CallBack";
import { UserSongs} from "./components/UserSongs";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/signin',
    element: <SignIn />
  }
  ,
  {
    path: '/profile',
    element: <Profile />
  },
  {
    path: '/callback',
    element: <CallBack />
  },
  {
    path: '/profile/songs',
    element : <UserSongs />
  }

];

export default AppRoutes;
